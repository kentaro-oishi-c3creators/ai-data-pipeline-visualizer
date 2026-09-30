# Implementation plan

## Goal
Source SQL から Qlik 用変換ステップの検証までを、業務説明に使えるクリック可能なアニメーションとして示す。

## 2026-09-30 追加範囲: 判断分岐シミュレーター
`sales_amt`、`net_amt`、判断保留を選び、選択に応じて変換案・検証・Human review が変化する操作を追加する。架空の期待値「値引き後 1,800」を明記し、差分の出所を元 SQL 列へ逆追跡できるようにする。実際のデータ変換は行わない。

## Input specification
固定の架空サンプル SQL と、標準ケース・要確認ケースの説明データ。実ファイルや外部 API は入力しない。

## Must build
- 六工程の左から右へのフロー、再生・停止・速度変更・工程選択
- 各工程の入力、AI判断、決定論的処理、検証、Human review、provenance
- 判断が曖昧な場合に人へ渡す例
- レスポンシブでキーボード操作できる画面と起動 README

## Must not build
実際の SQL 解析、LLM 呼び出し、Qlik コード生成、外部保存、認証。

## Must preserve
`sources/` 以下は読み取り専用で、変更しない。

## Project context and existing assets
この作業先には `AGENTS.md` と `sources/` だけがあり、既存アプリ、UI 規約、テスト設定はない。同梱の `learning-app` は学習用 DB と Vinext を含むため、この静的デモには大きすぎる。今回は新規の React/TypeScript/Vite アプリを作る。

## Reuse / Extend / Build
Reuse: React と Vite の標準構成。Extend: 該当なし。Build: フローデータ、画面、アニメーション、説明パネル。

## Implementation steps
1. 説明データと UI を実装する。
2. 型検査とビルドを実行する。
3. ローカル起動で主要操作を確認し、結果を記録する。

## Acceptance criteria
- 六工程が正しい順に表示され、流れがアニメーションする。
- 工程を選ぶと六種類の情報が読める。
- 再生、停止、速度、ケース切替が動く。
- 要確認ケースでは自動確定せず Human review が明確になる。
- README の手順でローカル起動できる。
- 三つの判断を切り替えると、データの流れ、変換案、検証状態がそれぞれ変わる。
- 差分から元 SQL の列をハイライトして追跡できる。
