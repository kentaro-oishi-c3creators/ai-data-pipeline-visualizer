# Architecture

- Stack: React, TypeScript, Vite, CSS。外部 UI ライブラリなし。
- Structure: `src/pipeline.ts` が六工程の架空データ、`src/App.tsx` がメインの再生状態と表示、`src/BranchSimulator.tsx` が独立した判断分岐、二つの CSS ファイルがレイアウトと動き。
- Data flow: ケース選択 → 六工程の表示データ → 選択工程の詳細。分岐ミニ実験は候補選択 → 固定の変換案・検証結果 → 元 SQL の列への逆追跡。再生中はタイマーが工程番号を進める。
- State: 選択工程、再生状態、速度、ケース、分岐選択、逆追跡表示。ブラウザ内のみ。永続化なし。
- External services: なし。
- Constraints: デモは処理境界を説明するための可視化であり、実際の SQL 変換や検証の結果ではない。`sources/` は変更しない。
- Current phase: ローカル試作品と判断分岐ミニ実験。
- Not implemented yet: 実データ連携、変換ロジック、実行ログの読み込み。
