const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const glob = require('glob');

const VECTORS_FILE = 'vectors.json';

// Simple Cosine Similarity
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY is not set.');
    process.exit(1);
  }

  // User input from command line args or environment variable
  const userRequest = process.env.USER_REQUEST || process.argv[2];
  if (!userRequest) {
    console.error('Error: User request details are required.');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
  const generationModel = genAI.getGenerativeModel({ model: "gemini-pro" });

  // 1. Load Vectors
  if (!fs.existsSync(VECTORS_FILE)) {
    console.error(`Error: ${VECTORS_FILE} not found. Run update-vectors.js first.`);
    process.exit(1);
  }
  const vectors = JSON.parse(fs.readFileSync(VECTORS_FILE, 'utf-8'));

  // 2. Embed Query
  const queryEmbeddingResult = await embeddingModel.embedContent(userRequest);
  const queryVector = queryEmbeddingResult.embedding.values;

  // 3. Vector Search
  const scoredVectors = vectors.map(vec => ({
    ...vec,
    score: cosineSimilarity(queryVector, vec.embedding)
  }));

  // Sort by score descending and take top K
  scoredVectors.sort((a, b) => b.score - a.score);
  const topK = scoredVectors.slice(0, 3); // Top 3 relevant reports

  console.error("--- Relevant Reports Found ---");
  topK.forEach(v => console.error(`[${v.score.toFixed(3)}] ${v.id}`));

  // 4. Generate Roadmap
  const context = topK.map(v => `File: ${v.id}\nContent:\n${v.content}`).join('\n---\n');

  // Read Learning Policy Guide
  const guidePath = 'docs/training/personalization/guide.md';
  let guideContent = '';
  if (fs.existsSync(guidePath)) {
    guideContent = fs.readFileSync(guidePath, 'utf-8');
  } else {
    console.warn(`Warning: Learning policy guide not found at ${guidePath}`);
  }

  // List available documentation for linking
  const docFiles = glob.sync('docs/**/*.md');
  const docList = docFiles.map(f => `- ${f}`).join('\n');

  const prompt = `
あなたはエンジニアリングマネージャーです。
以下の「組織の学習方針」、「チームメンバーによる読書感想文（ナレッジベース）」、「ユーザーのバックグラウンド」、「利用可能なドキュメント」を元に、このユーザーに最適な学習ロードマップを作成してください。

## ユーザー情報
${userRequest}

## 組織の学習方針 (Learning Policy)
${guideContent}

## ナレッジベース (チームメンバーの声)
${context}

## 利用可能なドキュメント (Available Documentation)
以下のファイルへのリンクを推奨する際は、必ずこのリストにあるパスを使用してください。
リンク形式は **https://github.com/Saitekiinc-com/saiteki-study-doc/blob/main/{パス}** としてください。
${docList}

## 指示
1. **日本語**で出力してください。
2. **組織の学習方針に基づき、ユーザーのキャリアパス（例: InfraならPlatform Architectへの進化、PMならProduct Architectへの進化）を意識したアドバイス**を行ってください。
3. **「達成したい目標」** を実現するために必要な知識を分解し、その中でユーザーの **「わかっていないこと」** を埋めるための書籍やドキュメントを推奨してください。
4. 書籍を推奨する際、ナレッジベースに **関連する感想文がある場合のみ**、「得られた知識・気づき」や「チームメンバーの感想」を引用してください。**関連する感想文がない場合は、無理に引用せず、一般的な書籍の紹介として記述してください。**
5. 社内ドキュメント（Available Documentation）に関連するものがあれば、積極的にリンクを貼って紹介してください。リンクは必ず **絶対パス (https://github.com/...)** で記述し、**404エラーにならないようにリストにあるファイルのみ** を使用してください。
6. 出力形式は **GitHub Issue** の本文としてそのまま使えるMarkdown形式にしてください。
7. **「タスク」セクションや「読書感想文テンプレート」は不要です。** 純粋なロードマップとアドバイスのみを出力してください。

## 出力フォーマット例
# 学習ロードマップ: {ユーザーの役割}編

## はじめに
{ユーザーの目標に対するフィードバックと、全体的な方針}

## 推奨ロードマップ

### 1. {ステップ名 / 書籍名 / ドキュメント名}
*   **推奨理由**: {理由}
*   **参考リンク**: [タイトル](https://github.com/Saitekiinc-com/saiteki-study-doc/blob/main/docs/...)
*   **チームメンバーの声**:
    > {引用}
    (※関連する感想文がある場合のみ記述)

### 2. {ステップ名}
...
`;

  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest", "gemini-1.5-flash"];
  let generatedText = null;

  for (const modelName of modelsToTry) {
    try {
      console.error(`Trying model: ${modelName}...`);
      const generationModel = genAI.getGenerativeModel({ model: modelName });
      const result = await generationModel.generateContent(prompt);
      const response = await result.response;
      generatedText = response.text();
      console.error(`Success with model: ${modelName}`);
      break;
    } catch (error) {
      console.error(`Failed with model: ${modelName}. Error: ${error.message}`);
      // Continue to next model
    }
  }

  if (!generatedText) {
    console.error("All models failed.");

    // Debug: List available models
    try {
      console.error("--- Debug: Listing Available Models ---");
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const data = await response.json();
      if (data.models) {
        data.models.forEach(m => console.error(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`));
      } else {
        console.error("No models found in list response:", JSON.stringify(data));
      }
    } catch (e) {
      console.error("Failed to list models:", e);
    }

    process.exit(1);
  }

  console.error("\n--- Generated Roadmap ---\n");
  console.log(generatedText);

  // Output to a file for GitHub Actions to pick up reliably
  fs.writeFileSync('roadmap_body.md', generatedText);
}

main();
