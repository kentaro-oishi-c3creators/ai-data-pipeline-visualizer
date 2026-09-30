import { useEffect, useState } from 'react';
import { reviewArtifacts, scenarios, stages, type Scenario } from './pipeline';
import BranchSimulator from './BranchSimulator';

const detailItems = [
  { key: 'input', label: '入力', icon: '↧', tone: 'slate' },
  { key: 'ai', label: 'AI判断', icon: '✧', tone: 'violet' },
  { key: 'deterministic', label: '決定論的処理', icon: '⌘', tone: 'blue' },
  { key: 'validation', label: '検証', icon: '✓', tone: 'teal' },
  { key: 'human', label: 'Human review', icon: '◎', tone: 'amber' },
  { key: 'provenance', label: 'provenance', icon: '↗', tone: 'slate' }
] as const;

const speeds = [
  { label: 'ゆっくり', ms: 2600 },
  { label: '標準', ms: 1750 },
  { label: '速い', ms: 1000 }
] as const;

function App() {
  const [scenario, setScenario] = useState<Scenario>('standard');
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);
  const active = stages[activeIndex];
  const currentScenario = scenarios[scenario];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => {
        if (index === stages.length - 1) {
          setPlaying(false);
          return index;
        }
        return index + 1;
      });
    }, speeds[speedIndex].ms);
    return () => window.clearInterval(timer);
  }, [playing, speedIndex]);

  function chooseScenario(next: Scenario) {
    setScenario(next);
    setActiveIndex(0);
    setPlaying(false);
  }

  function togglePlay() {
    if (activeIndex === stages.length - 1) setActiveIndex(0);
    setPlaying((value) => !value);
  }

  function selectStage(index: number) {
    setActiveIndex(index);
    setPlaying(false);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>FLOW<span className="brand-light">/LAB</span></span></div>
        <div className="topbar-right"><span className="topbar-divider" /><span>AI × DATA TRANSFORMATION</span><span className="version">PROTOTYPE 01</span></div>
      </header>

      <main>
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> INTERACTIVE PIPELINE EXPLORER</div>
            <h1 id="page-title">SQLから、<br /><span>信頼できる変換</span>まで。</h1>
            <p className="hero-description">{currentScenario.heading}<br />{currentScenario.description}</p>
            <div className="hero-tags"><span>6つの処理段階</span><span>判断の根拠を追跡</span><span>Human reviewを可視化</span></div>
          </div>
          <div className="hero-visual" aria-label="SQLが処理ブロックを通って検証結果になる概念図">
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
            <div className="visual-card visual-source"><span className="visual-kicker">SOURCE</span><b>SQL</b><small>{scenario === 'review' ? 'monthly_sales.sql' : 'orders.sql'}</small></div>
            <div className="visual-flow"><span /><span /><span /></div>
            <div className="visual-core"><span className="core-ring"><span>✧</span></span><small>AI + RULES</small></div>
            <div className="visual-flow visual-flow-last"><span /><span /><span /></div>
            <div className="visual-card visual-output"><span className="visual-kicker">OUTPUT</span><b>Qlik</b><small>validated</small></div>
          </div>
        </section>

        <section className="workspace" aria-labelledby="flow-title">
          <div className="workspace-heading">
            <div><div className="section-kicker">01 / EXPLORE THE FLOW</div><h2 id="flow-title">変換の流れをたどる</h2><p>工程をクリックすると、その段階で何を判断し、何を確認するかが見えます。</p></div>
            <div className="case-switch" role="group" aria-label="デモケース">
              {(Object.keys(scenarios) as Scenario[]).map((key) => <button key={key} type="button" className={scenario === key ? 'selected' : ''} onClick={() => chooseScenario(key)} aria-pressed={scenario === key}>{scenarios[key].label}</button>)}
            </div>
          </div>

          <div className="pipeline-panel">
            <div className="panel-topline"><div className="live-label"><span className={playing ? 'live-dot playing' : 'live-dot'} /> PIPELINE VIEW <span className="panel-sub">/ {currentScenario.label}</span></div><span className="stage-count">{String(activeIndex + 1).padStart(2, '0')} <span>/ 06</span></span></div>
            <div className="flow-scroll"><div className="stage-flow" aria-label="変換パイプラインの六工程">
              {stages.map((stage, index) => <div className="stage-slot" key={stage.id}>
                <button type="button" className={`stage-card ${index === activeIndex ? 'active' : ''} ${index < activeIndex ? 'completed' : ''}`} onClick={() => selectStage(index)} aria-current={index === activeIndex ? 'step' : undefined} aria-label={`${stage.number} ${stage.title}の詳細を表示`}>
                  <span className="stage-number">{stage.number} <span>{index < activeIndex ? '✓' : index === activeIndex ? '●' : '○'}</span></span>
                  <span className="stage-icon" aria-hidden="true">{stage.icon}</span>
                  <strong>{stage.shortTitle}</strong><small>{stage.subtitle}</small>
                  <span className="stage-output">{stage.output}</span>
                </button>
                {index < stages.length - 1 && <div className={`connector ${index < activeIndex ? 'passed' : ''} ${index === activeIndex ? 'moving' : ''}`} aria-hidden="true"><span className="connector-line" /><span className="connector-arrow">›</span><span className="flow-pulse" /></div>}
              </div>)}
            </div></div>
            <div className="playback-bar">
              <div className="playback-controls"><button type="button" className="play-button" onClick={togglePlay} aria-label={playing ? 'アニメーションを一時停止' : 'アニメーションを再生'}><span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span></button><button type="button" className="reset-button" onClick={() => { setActiveIndex(0); setPlaying(false); }}>↺ <span>最初から</span></button><span className="playback-hint">{playing ? '流れを再生中' : 'クリックして工程を探索'}</span></div>
              <label className="speed-control">再生速度 <select value={speedIndex} onChange={(event) => setSpeedIndex(Number(event.target.value))}>{speeds.map((speed, index) => <option value={index} key={speed.label}>{speed.label}</option>)}</select></label>
            </div>
          </div>

          <BranchSimulator />

          <div className="detail-grid">
            <section className="detail-panel" aria-labelledby="detail-title">
              <div className="detail-header"><div><div className="section-kicker">03 / INSIDE THE STEP</div><h2 id="detail-title"><span>{active.number}</span> {active.title}</h2><p>{active.subtitle}。各役割と確認点を分けて表示します。</p></div><span className="detail-badge">CURRENT STEP</span></div>
              <div className="detail-items">{detailItems.map(({ key, label, icon, tone }) => <article className="detail-item" key={key}><span className={`detail-icon ${tone}`} aria-hidden="true">{icon}</span><div><h3>{label}</h3><p>{active[key]}</p></div></article>)}</div>
            </section>
            <aside className="context-column">
              <div className="context-card sample-card"><div className="context-header"><span>INPUT SAMPLE</span><span className="tiny-square">⌁</span></div><h3>今回のサンプル</h3><pre><code>{currentScenario.sql}</code></pre><div className="sample-footer"><span className="mini-dot" /> 架空の業務データ</div></div>
              <div className={`context-card decision-card ${scenario === 'review' ? 'needs-review' : ''}`}><div className="context-header"><span>DECISION POINT</span><span className="tiny-square">◇</span></div><h3>{scenario === 'review' ? '判断を保留' : '対応を確認'}</h3><p>{currentScenario.issue}</p><div className="decision-result"><span>{scenario === 'review' ? '!' : '✓'}</span>{currentScenario.result}</div></div>
              <div className="context-card artifact-card"><div className="context-header"><span>STAGE ARTIFACT</span><span className="tiny-square">↗</span></div><p>{scenario === 'review' ? reviewArtifacts[activeIndex] : active.artifact}</p><small>表示は説明用のサンプルです</small></div>
            </aside>
          </div>
        </section>
        <footer><span>FLOW/LAB · INTERACTIVE CONCEPT</span><span>AIの提案 → ルール適用 → 検証 → 人の判断</span></footer>
      </main>
    </div>
  );
}

export default App;
