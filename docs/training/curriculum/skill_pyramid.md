# React/TypeScript スキルピラミッド

このドキュメントでは、React/TypeScriptエンジニアとして成長するためのロードマップを、ピラミッド型の階層構造で示します。
下層のスキルが上層のスキルの土台となります。

## スキルピラミッド図

```mermaid
flowchart TD
    subgraph Expert["Lv.4 エキスパート (アーキテクチャ・技術選定)"]
        E1[アーキテクチャ設計]
        E2[技術スタック選定]
        E3[スケーラビリティ考慮]
        E4[開発プロセス改善]
    end

    subgraph Advanced["Lv.3 発展 (品質・保守性・パフォーマンス)"]
        A1[保守性の高いコード設計]
        A2[パフォーマンスチューニング]
        A3[堅牢なテスト戦略]
        A4[アクセシビリティ]
    end

    subgraph Application["Lv.2 応用 (アプリ開発・動作保証)"]
        P1[エラーのない実装]
        P2[要件通りの機能開発]
        P3[デバッグ能力]
        P4[ライブラリの適切な利用]
    end

    subgraph Foundation["Lv.1 基礎 (ドキュメントの理解・仕組み)"]
        F1[Web標準の仕組み (DOM/HTTP)]
        F2[言語仕様の理解 (JS/TS)]
        F3[Reactのメンタルモデル]
        F4[公式ドキュメント読解力]
    end

    Foundation --> Application
    Application --> Advanced
    Advanced --> Expert

    style Foundation fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Application fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style Advanced fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style Expert fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
```

## レベル別詳細解説

### Lv.1 基礎 (Foundation): ドキュメントの理解
**目標**: 公式ドキュメントを読み解き、技術の仕組み（Why/What）を正しく理解できる。
*   コードを書く前に、それが「なぜ動くのか」「どういう仕組みなのか」を説明できる状態を目指します。

### Lv.2 応用 (Application): アプリ開発・動作保証
**目標**: エラーなくアプリを開発し、動作することを確認できる。
*   要件定義通りに機能を実装し、バグが発生しても自力で解決できる能力を養います。

### Lv.3 発展 (Advanced): 品質・保守性・パフォーマンス
**目標**: 保守性の高いコードやパフォーマンスを意識した設計ができる。
*   「動けばいい」から一歩進んで、将来の変更に強く、ユーザー体験の良いコードを書くことを目指します。

### Lv.4 エキスパート (Expert): アーキテクチャ・技術選定
**目標**: アーキテクチャの設計や技術選定ができる。
*   プロジェクト全体の構造を俯瞰し、最適な技術やツールを選び取る判断力を養います。
