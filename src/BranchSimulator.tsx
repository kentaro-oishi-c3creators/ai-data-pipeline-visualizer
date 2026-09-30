import { useState } from 'react';

type Choice = 'gross' | 'net' | 'defer';

const options: { id: Choice; field: string; label: string; hint: string }[] = [
  { id: 'gross', field: 'sales_amt', label: '値引き前の金額', hint: '2,000' },
  { id: 'net', field: 'net_amt', label: '値引き後の金額', hint: '1,800' },
  { id: 'defer', field: '判断を保留', label: '担当者に確認', hint: 'Human review' }
];

const outcomes = {
  gross: {
    state: '差分あり',
    summary: '期待値より 200 多い',
    detail: 'サンプル値 2,000 − 期待値 1,800 = +200',
    script: 'LOAD sales_amt AS 売上金額;',
    source: 'sales_amt',
    sourceDetail: '値引き前の金額を採用したため、期待値と一致しません。',
    trace: 'monthly_sales.sql:1 → sales_amt → Qlik LOAD → 検証差分 +200'
  },
  net: {
    state: '一致',
    summary: 'サンプルの期待値と一致',
    detail: 'サンプル値 1,800 = 期待値 1,800',
    script: 'LOAD net_amt AS 売上金額;',
    source: 'net_amt',
    sourceDetail: '値引き後の金額を採用し、サンプルの期待値と一致しました。',
    trace: 'monthly_sales.sql:1 → net_amt → Qlik LOAD → 検証一致'
  },
  defer: {
    state: '確認待ち',
    summary: '自動選択せず、人の判断へ',
    detail: '対応列が未確定のため、変換案の確定と検証を保留',
    script: 'LOAD案: 売上金額の対応を保留',
    source: 'sales_amt / net_amt',
    sourceDetail: '二つの候補と根拠を担当者へ渡します。',
    trace: 'monthly_sales.sql:1 → 2候補 → Human review'
  }
} as const;

export default function BranchSimulator() {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [trace, setTrace] = useState(false);
  const [run, setRun] = useState(0);
  const outcome = choice ? outcomes[choice] : null;

  function choose(next: Choice) {
    setChoice(next);
    setTrace(false);
    setRun((previous) => previous + 1);
  }

  return (
    <section className="simulator" aria-labelledby="simulator-title">
      <div className="sim-header">
        <div><div className="section-kicker">02 / MAKE A DECISION</div><h2 id="simulator-title">選んで、流れを変えてみる。</h2><p>ここからは月次売上の別サンプル。「売上金額」はどの列？ 選択が変換案と検証結果にどう伝わるか試せます。</p></div>
        <span className="sim-demo-badge">INTERACTIVE DEMO</span>
      </div>
      <div className="sim-body">
        <div className="sim-choice-panel">
          <div className="sim-mini-heading"><span>01</span> 意味の候補を選ぶ</div>
          <p className="sim-rule">このデモの業務定義：<strong>売上金額＝値引き後</strong><br />期待値は <strong>1,800</strong>。AI は対応候補を提示します。</p>
          <div className="sim-options" role="group" aria-label="売上金額の対応候補">
            {options.map((option) => <button type="button" key={option.id} className={`sim-option ${choice === option.id ? 'chosen' : ''} ${option.id === 'defer' ? 'defer-option' : ''}`} onClick={() => choose(option.id)} aria-pressed={choice === option.id}>
              <span className="sim-radio" aria-hidden="true">{choice === option.id ? '●' : ''}</span>
              <span><strong>{option.field}</strong><small>{option.label}</small></span>
              <em>{option.hint}</em>
            </button>)}
          </div>
          <div className={`sim-source ${trace ? 'tracing' : ''}`} id="sim-source">
            <div className="sim-source-heading"><span>↖ SOURCE SQL</span>{trace && <span className="trace-marker">追跡中</span>}</div>
            <code>SELECT <mark className={trace && choice !== 'defer' && outcome?.source === 'sales_amt' ? 'source-hit' : ''}>sales_amt</mark>, <mark className={trace && choice !== 'defer' && outcome?.source === 'net_amt' ? 'source-hit' : ''}>net_amt</mark><br />FROM monthly_sales;</code>
            {trace && <p>{outcome?.sourceDetail}</p>}
          </div>
        </div>

        <div className={`sim-result-panel ${choice ?? 'idle'}`}>
          <div className="sim-mini-heading"><span>02</span> 下流への影響を見る</div>
          <div className="sim-track" aria-label="候補から変換と検証へ流れるデータ">
            <div className="sim-track-line" />
            {choice && <span key={run} className={`sim-packet ${choice}`} aria-hidden="true" />}
            <div className="sim-node"><span className="sim-node-icon">⌁</span><strong>Source SQL</strong><small>列を読み取る</small></div>
            <div className={`sim-node ${choice ? 'node-chosen' : ''}`}><span className="sim-node-icon">◇</span><strong>意味づけ</strong><small>{choice ? (choice === 'defer' ? '判断を保留' : outcome?.source) : '候補を選択'}</small></div>
            <div className={`sim-node ${choice && choice !== 'defer' ? 'node-chosen' : ''}`}><span className="sim-node-icon">▤</span><strong>Qlik 変換案</strong><small>{choice === 'defer' ? '確定を保留' : choice ? 'LOAD を生成' : '待機中'}</small></div>
            <div className={`sim-node ${choice && choice !== 'defer' ? 'node-chosen' : ''} ${choice === 'gross' ? 'node-error' : ''}`}><span className="sim-node-icon">{choice === 'gross' ? '!' : '✓'}</span><strong>検証</strong><small>{choice === 'gross' ? '差分で停止' : choice === 'net' ? '一致' : choice === 'defer' ? '人の確認待ち' : '待機中'}</small></div>
          </div>
          <div className="sim-output" aria-live="polite">
            {outcome ? <>
              <div className="sim-output-top"><span className={`sim-status status-${choice}`}>{choice === 'gross' ? '!' : choice === 'net' ? '✓' : '◎'} {outcome.state}</span><button type="button" className="sim-replay" onClick={() => setRun((previous) => previous + 1)}>↻ もう一度流す</button></div>
              <h3>{outcome.summary}</h3>
              <p>{outcome.detail}</p>
              <code>{outcome.script}</code>
              <div className="sim-provenance"><span>PROVENANCE</span><p>{outcome.trace}</p></div>
              <button type="button" className="sim-trace-button" onClick={() => setTrace((previous) => !previous)} aria-pressed={trace}>{trace ? '✓ 元SQLの列を表示中' : choice === 'gross' ? '↖ 差分の出所をたどる' : choice === 'net' ? '↖ 結果の出所をたどる' : '↖ 候補の出所をたどる'}</button>
            </> : <div className="sim-empty"><span>✧</span><h3>どの列を選びますか？</h3><p>左の候補を押すと、データが右へ流れます。</p></div>}
          </div>
        </div>
      </div>
      <div className="sim-footnote">これは架空データを使った固定シナリオです。サンプルの一致は実案件での正しさを保証しません。</div>
    </section>
  );
}
