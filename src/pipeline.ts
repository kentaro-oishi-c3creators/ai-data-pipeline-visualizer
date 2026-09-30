export type Scenario = 'standard' | 'review';

export type Stage = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: string;
  output: string;
  input: string;
  ai: string;
  deterministic: string;
  validation: string;
  human: string;
  provenance: string;
  artifact: string;
};

export const stages: Stage[] = [
  {
    id: 'source', number: '01', title: 'Source SQL', shortTitle: 'Source SQL',
    subtitle: '処理の出発点', icon: '⌁', output: 'SQL・参照表',
    input: '既存の SELECT 文、JOIN 条件、参照テーブル一覧。',
    ai: 'この段階では意味の解釈を確定しない。SQL の構造を次工程へ渡す。',
    deterministic: 'SQL テキストを読み込み、文・列・参照先を識別する。',
    validation: '構文、参照先、必要ファイルの有無を確認する。',
    human: '参照元が欠けている場合、正しい入力の指定を依頼する。',
    provenance: '元 SQL のファイル名、版、行番号、取得日時を保持する。',
    artifact: 'source_orders.sql  ·  42 lines'
  },
  {
    id: 'semantic', number: '02', title: 'Semantic理解', shortTitle: 'Semantic理解',
    subtitle: '業務の意味を読み解く', icon: '◈', output: '意味候補',
    input: 'SQL の列名、計算式、JOIN、定義書や用語集。',
    ai: '「売上額」「受注日」などの業務上の意味と対応候補を提案する。',
    deterministic: '列名・式・参照元を抽出し、候補と根拠を紐づける。',
    validation: '定義書と SQL の対応、候補の重複や欠落を確認する。',
    human: '複数の意味候補がある列は選択を保留し、担当者が判断する。',
    provenance: '各候補に元の列・式、定義書の該当箇所、判断理由を残す。',
    artifact: 'amount → 売上金額  ·  confidence 0.92'
  },
  {
    id: 'decompose', number: '03', title: '処理単位への分解', shortTitle: '処理単位に分解',
    subtitle: '工程を小さく整理する', icon: '▦', output: '処理ブロック',
    input: '意味づけされた SQL と依存関係。',
    ai: '抽出・結合・集計など、分かりやすい処理のまとまりを提案する。',
    deterministic: '依存順を計算し、入出力列と処理ブロックを整理する。',
    validation: '依存関係に循環や未接続の列がないか確認する。',
    human: '業務的に一体で扱うべき処理の分割位置をレビューする。',
    provenance: '各ブロックから元 SQL の行と意味候補へたどれるようにする。',
    artifact: '抽出 → JOIN → 集計  ·  3 blocks'
  },
  {
    id: 'generate', number: '04', title: 'Qlik / 変換ステップ生成', shortTitle: 'Qlik / 変換生成',
    subtitle: '実装可能な形へ', icon: '⟡', output: '変換案',
    input: '承認可能な処理ブロックと変換ルール。',
    ai: 'Qlik スクリプトや中間変換の構成案を作る。',
    deterministic: 'テンプレート、命名規則、型変換ルールを適用する。',
    validation: '生成結果の構文、列名、型、参照先を確認する。',
    human: '業務ルールが未確定の箇所は生成案として保持し、確定しない。',
    provenance: '生成行ごとに元ブロック、ルール版、AI 提案を記録する。',
    artifact: 'LOAD Orders  ·  JOIN Customers'
  },
  {
    id: 'integrate', number: '05', title: '統合', shortTitle: '統合',
    subtitle: '一つの流れにまとめる', icon: '⊕', output: '統合スクリプト',
    input: '各変換ステップとブロック間の入出力。',
    ai: '順序や共通化の改善候補を提示する。',
    deterministic: '依存順にステップを接続し、重複名や参照切れを検出する。',
    validation: '全列の受け渡し、実行順、名称衝突を確認する。',
    human: '共有ロジックの採否や既存運用との整合を確認する。',
    provenance: '統合後も各ステップの元 SQL と変換ルールを追跡できる。',
    artifact: 'pipeline.qvs  ·  6 steps'
  },
  {
    id: 'review', number: '06', title: '検証 / レビュー', shortTitle: '検証 / レビュー',
    subtitle: '信頼できる結果へ', icon: '✓', output: '検証結果',
    input: '統合スクリプト、期待値、実行ログ、生成根拠。',
    ai: '差分の原因候補と、確認すべき箇所を説明する。',
    deterministic: '件数・値・型・参照の差分をルールに沿って照合する。',
    validation: '結果データ、実行サマリー、ログを合わせて確認する。',
    human: '曖昧な対応や未一致の結果を判断し、承認または差し戻しする。',
    provenance: '入力から最終結果までの判断・版・承認者を記録する。',
    artifact: '36 checks passed  ·  ready for review'
  }
];

export const scenarios: Record<Scenario, { label: string; heading: string; description: string; sql: string; issue: string; result: string }> = {
  standard: {
    label: '標準ケース',
    heading: '受注データを、説明できる変換フローへ。',
    description: 'SQL の意味を読み解き、処理を分け、Qlik 用の変換案までつなぐ。工程を選ぶと判断と根拠が見えます。',
    sql: 'SELECT order_id, amount, order_date\nFROM orders\nWHERE status = \'confirmed\';',
    issue: '業務定義と列の対応が一意に確認できた例',
    result: '定義との対応を確認 → 検証へ進む'
  },
  review: {
    label: '要確認ケース',
    heading: '曖昧な意味は、人の判断へ。',
    description: '候補が複数ある場合、AI の提案を自動確定せず、元データと根拠を添えて担当者へ渡します。',
    sql: 'SELECT sales_amt, net_amt, order_date\nFROM monthly_sales\nWHERE period = \'2026-09\';',
    issue: '「売上金額」の候補が sales_amt / net_amt の 2 件',
    result: '自動選択を保留 → Human review に引き渡す'
  }
};

export const reviewArtifacts = [
  'monthly_sales.sql  ·  28 lines',
  '売上金額 → sales_amt / net_amt  ·  2 candidates',
  '抽出 → 集計  ·  判断待ち 1 block',
  'LOAD案  ·  売上金額の対応は未確定',
  'pipeline draft  ·  未確定箇所を保持',
  '35 checks passed  ·  1 needs review'
];
