import { useState, useMemo } from 'react';
import { Copy, Eye, EyeOff, RefreshCw, RotateCcw, Trash2, ShieldCheck, Moon, Sun } from 'lucide-react';
import { CONFIG } from './config/passwordConfig.js';
import { generateMany, validateOptions, poolSize } from './utils/passwordGenerator.js';
import { validateQuantity, ERROR_MESSAGES as MSG } from './utils/validators.js';
import { assessStrength } from './utils/passwordStrength.js';

const initial = { length: CONFIG.defaultLength, ...CONFIG.defaultOptions };

export default function App() {
  const [opts, setOpts] = useState(initial);
  const [qty, setQty] = useState(CONFIG.defaultQuantity);
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('theme') === 'dark'; } catch { return false; }
  });
  const set = (patch) => setOpts((o) => ({ ...o, ...patch }));

  const toggleTheme = () => {
    setDark((d) => {
      try { localStorage.setItem('theme', d ? 'light' : 'dark'); } catch { /* ignore */ }
      return !d;
    });
  };
  const generate = () => {
    setStatus('');
    const code = validateOptions(opts) || validateQuantity(qty);
    if (code) { setError(MSG[code]); return; }
    try { setList(generateMany(opts, qty)); setError(''); }
    catch (e) { setError(MSG[e.code] || 'Could not generate a password.'); }
  };
  const reset = () => { setOpts(initial); setQty(CONFIG.defaultQuantity); setList([]); setError(''); setStatus(''); };
  const copy = async (text, what) => {
    try { await navigator.clipboard.writeText(text); setStatus(`${what} copied.`); }
    catch { setStatus('Copy failed. Select the password and copy it manually.'); }
  };
  const pool = useMemo(() => (validateOptions(opts) ? 0 : poolSize(opts)), [opts]);
  const strength = list[0] ? assessStrength(list[0], pool) : null;

  const Check = ({ id, label }) => (
    <label className="check"><input type="checkbox" checked={opts[id]} onChange={(e) => set({ [id]: e.target.checked })} />{label}</label>
  );

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <header>
        <h1><ShieldCheck aria-hidden="true" /> SecurePass</h1>
        <button className="icon" onClick={toggleTheme} aria-label="Toggle dark mode">{dark ? <Sun /> : <Moon />}</button>
      </header>
      <main>
        <section className="card" aria-labelledby="settings">
          <h2 id="settings">Password settings</h2>
          <label htmlFor="len">Password Length: {Number.isNaN(opts.length) ? '–' : opts.length}</label>
          <div className="row">
            <input id="len" type="range" min={CONFIG.minLength} max={CONFIG.maxLength} value={opts.length || CONFIG.minLength} onChange={(e) => set({ length: Number(e.target.value) })} />
            <input aria-label="Password length (number)" type="number" min={CONFIG.minLength} max={CONFIG.maxLength} step="1" value={Number.isNaN(opts.length) ? '' : opts.length} onChange={(e) => set({ length: e.target.value === '' ? NaN : Number(e.target.value) })} />
          </div>
          <Check id="uppercase" label="Include Uppercase Letters (A–Z)" />
          <Check id="lowercase" label="Include Lowercase Letters (a–z)" />
          <Check id="numbers" label="Include Numbers (0–9)" />
          <Check id="special" label={`Include Special Characters (${CONFIG.specialChars})`} />
          <details>
            <summary>Advanced settings</summary>
            <Check id="excludeAmbiguous" label={`Exclude Ambiguous Characters (${CONFIG.ambiguousChars})`} />
            <Check id="requireEach" label="Require at least one of every selected type" />
            {!opts.requireEach && <p className="hint">Selected types may be missing from a password.</p>}
            <label htmlFor="excl">Exclude these characters</label>
            <input id="excl" type="text" value={opts.excludeCustom} onChange={(e) => set({ excludeCustom: e.target.value })} />
          </details>
          <label htmlFor="qty">Number of passwords (1–{CONFIG.maxQuantity})</label>
          <input id="qty" type="number" min="1" max={CONFIG.maxQuantity} step="1" value={Number.isNaN(qty) ? '' : qty} onChange={(e) => setQty(e.target.value === '' ? NaN : Number(e.target.value))} />
          <div className="row">
            <button className="primary" onClick={generate}><RefreshCw aria-hidden="true" /> Generate Password</button>
            <button onClick={reset}><RotateCcw aria-hidden="true" /> Reset Settings</button>
          </div>
          {error && <p role="alert" className="error">{error}</p>}
        </section>

        {list.length > 0 && (
          <section className="card" aria-labelledby="out">
            <h2 id="out">Your password{list.length > 1 ? 's' : ''}</h2>
            {list.map((pw, i) => (
              <div className="pw" key={i}>
                <code>{show ? pw : '•'.repeat(pw.length)}</code>
                <span className="count">{pw.length} characters</span>
                <button className="icon" onClick={() => copy(pw, 'Password')} aria-label={`Copy password ${i + 1}`}><Copy /></button>
              </div>
            ))}
            <div className="row">
              <button onClick={() => setShow((s) => !s)}>{show ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}{show ? 'Hide' : 'Show'}</button>
              {list.length > 1 && <button onClick={() => copy(list.join('\n'), 'All passwords')}>Copy all</button>}
              <button onClick={generate}><RefreshCw aria-hidden="true" /> Generate again</button>
              <button onClick={() => { setList([]); setStatus(''); }}><Trash2 aria-hidden="true" /> Clear</button>
            </div>
            <p role="status" className="hint">{status}</p>
            {strength && (
              <div>
                <div className="meter" role="meter" aria-valuemin="0" aria-valuemax="4" aria-valuenow={strength.level} aria-label={`Estimated strength: ${strength.label}`}>
                  <span style={{ width: `${(strength.level + 1) * 20}%` }} className={`lv${strength.level}`} />
                </div>
                <strong>{strength.label}</strong> (first password, ~{strength.bits} bits est.)
                <ul>{strength.factors.map((f) => <li key={f}>{f}</li>)}</ul>
                <p className="hint">Estimate assumes uniformly random selection from the character pool. It is a heuristic, not a guarantee.</p>
              </div>
            )}
          </section>
        )}
        <p className="hint">Privacy: passwords are generated in your browser using the Web Crypto API. This app does not send or store them. Save them in a password manager; clearing the screen does not erase the clipboard.</p>
      </main>
    </div>
  );
}
