# AWS / Infrastructure: クラウドネイティブな基盤構築

このカリキュラムでは、アプリケーションが稼働する「基盤」を学びます。
コードが動くだけでは不十分です。**「安全に (Security)」「高速に (Delivery)」「止まらずに (Reliability)」「見えるように (Observability)」** 動かすための知識を習得します。

## 1. Compute: 実行環境の選択

アプリケーションをどこで動かすか。モダンな開発では「サーバー管理の手間」を減らす方向（サーバーレス・コンテナ）が主流です。

### 学習項目
*   **Serverless (AWS Lambda)**:
    *   イベント駆動（API Gateway, S3トリガー）の仕組み。
    *   ステートレスな設計とコールドスタート。
*   **Containers (ECS / Fargate)**:
    *   Dockerコンテナの基礎と `Dockerfile`。
    *   オーケストレーション（タスク定義、サービス、オートスケーリング）。
*   **EC2 (Virtual Machines)**:
    *   従来の仮想サーバー。いつ使うべきか（レガシー移行、特殊なOS要件）。

### チェックリスト
- [ ] Dockerfileを書いて、ローカルでアプリケーションを起動できる。
- [ ] LambdaとECS Fargateの使い分け（実行時間、コスト、常駐プロセス）を説明できる。

---

## 2. Delivery: コンテンツ配信とキャッシュ

ユーザーに「最速」でコンテンツを届けるための技術です。特にフロントエンドエンジニアにとって重要です。

### 学習項目
*   **CDN (Amazon CloudFront)**:
    *   エッジロケーションの仕組み。
    *   キャッシュ戦略（TTL, Cache-Controlヘッダー）。
    *   キャッシュ無効化 (Invalidation) のタイミング。
*   **S3 (Simple Storage Service)**:
    *   静的ウェブサイトホスティング。
    *   署名付きURL (Presigned URL) によるセキュアなアップロード/ダウンロード。

### チェックリスト
- [ ] CloudFrontを使ってS3の画像を配信できる。
- [ ] ブラウザのキャッシュとCDNのキャッシュの違いを説明できる。

---

## 3. Security: 権限管理とネットワーク

「動く」ことよりも「守る」ことが優先されます。AIが苦手とする領域です。

### 学習項目
*   **IAM (Identity and Access Management)**:
    *   **最小権限の原則 (Least Privilege)**。
    *   Role（役割）とPolicy（許可証）の概念。
    *   `AccessKey / SecretAccessKey` のリスクと、IAM Roleの推奨。
*   **Network (VPC)**:
    *   パブリックサブネットとプライベートサブネット。
    *   セキュリティグループ（ファイアウォール）の設定。
    *   WAF (Web Application Firewall) による攻撃遮断。

### チェックリスト
- [ ] `AdministratorAccess` を使わずに、必要な権限だけを持ったIAMロールを作成できる。
- [ ] DBをプライベートサブネットに配置し、インターネットから直接アクセスできないように構成できる。

---

## 4. Observability: 運用監視

「何かおかしい」と思った時に、すぐに原因を特定できる状態を作ります。

### 学習項目
*   **Logging (CloudWatch Logs)**:
    *   構造化ログ（JSON形式）の重要性。
    *   ログの検索とフィルタリング (Logs Insights)。
*   **Tracing (AWS X-Ray / OpenTelemetry)**:
    *   分散トレーシング（リクエストがどのサービスを通ってどこで遅延したか）。
*   **Metrics & Alarms**:
    *   CPU使用率やエラー率の監視。
    *   Slackなどへのアラート通知。

### チェックリスト
- [ ] エラー発生時に、CloudWatch Logsから該当のスタックトレースを検索できる。
- [ ] アプリケーションのパフォーマンスボトルネックを特定できる。

---

## 5. IaC: Infrastructure as Code

インフラを手動（マネジメントコンソール）で作るのではなく、コードで管理します。

### 学習項目
*   **Terraform / AWS CDK**:
    *   宣言的設定（「こうあるべき」を記述する）。
    *   状態管理 (`tfstate`) の仕組み。
    *   インフラのバージョン管理とレビュー。

### チェックリスト
- [ ] S3バケットをTerraform (またはCDK) で作成できる。
- [ ] インフラの変更をPull Requestでレビューするフローを理解している。

---

## 推奨学習リソース
*   **[AWS Hands-on for Beginners](https://aws.amazon.com/jp/aws-jp-introduction/aws-jp-webinar-hands-on/)**: 公式ハンズオン動画。
*   **[Terraform入門](https://developer.hashicorp.com/terraform/tutorials/aws-get-started)**: 公式チュートリアル。
