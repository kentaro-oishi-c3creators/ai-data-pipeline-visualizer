# Progress

## Status
ローカル試作品完成。公開リポジトリを作成し、GitHub Pages 公開を準備中（2026-09-30）。

## Completed
- 六工程のフロー、アニメーション再生・停止・速度変更・工程選択。
- 各工程の六つの説明視点。
- 標準ケースと要確認ケース、サンプル SQL とケース別の成果物表示。
- レスポンシブな画面と起動 README。
- `sales_amt` / `net_amt` / 判断保留の三分岐、流れる粒、変換案・検証の変化、元 SQL 列への逆追跡。
- GitHub Actions の Pages ワークフローと、リポジトリ名に合わせる Vite の `base` 設定。

## Validation
- `npm run build`: 型検査と Vite ビルド成功。
- ローカル起動: `http://127.0.0.1:5173/` が表示された。
- ブラウザ操作: 工程クリックで詳細が切り替わること、ケース切替で SQL・判断・成果物が変わること、再生が最終工程まで進むことを確認した。
- ブラウザ操作: 三分岐で差分 +200 / 一致 / Human review の結果が出ること、逆追跡で元 SQL がハイライトされることを確認した。
- Pages 想定の `GITHUB_REPOSITORY=kentaro-oishi-c3creators/ai-data-pipeline-visualizer` でビルドし、生成 HTML のアセット URL が `/ai-data-pipeline-visualizer/` 配下になることを確認した。
- 公開候補ファイルの典型的な認証情報パターンを検索し、該当なし。

## Known issues
実案件の SQL、定義書、ログとは未接続。画面の値は説明用の架空サンプル。

## Remaining
新規公開リポジトリ `kentaro-oishi-c3creators/ai-data-pipeline-visualizer` は作成済み。push、Pages 有効化、公開 URL 検証は未実施。実データ連携と Qlik コード生成・検証は今回の範囲外。

## Next step
ソースを commit・push し、Pages の公開結果を確認する。
