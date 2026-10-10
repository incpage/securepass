import { useEffect, useRef } from 'react';
import { ADS_CLIENT_ID, adsConfig } from '../../config/adsConfig.js';

const PLACEHOLDER = /X{4}|^0+$/;
let scriptAdded = false; // inject the AdSense script only once
function loadScript() {
  if (scriptAdded || document.querySelector('script[data-adsense]')) { scriptAdded = true; return; }
  const s = document.createElement('script');
  s.async = true; s.crossOrigin = 'anonymous'; s.dataset.adsense = '1';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT_ID}`;
  document.head.appendChild(s);
  scriptAdded = true;
}
export default function GoogleAd({ placement }) {
  const cfg = adsConfig[placement];
  const usable = cfg?.enabled && !PLACEHOLDER.test(ADS_CLIENT_ID) && !PLACEHOLDER.test(cfg.slotId);
  const pushed = useRef(false);
  useEffect(() => {
    if (!usable || pushed.current) return;
    pushed.current = true;
    loadScript();
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* ad blocked */ }
  }, [usable]);
  if (!usable) return null; // disabled or unconfigured: render nothing
  return (
    <aside className="ad noprint" aria-label="Advertisement" style={{ minHeight: 100 }}>
      <small>Advertisement</small>
      <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client={ADS_CLIENT_ID} data-ad-slot={cfg.slotId}
        data-ad-format={cfg.format} data-full-width-responsive={cfg.responsive ? 'true' : 'false'} />
    </aside>
  );
}
