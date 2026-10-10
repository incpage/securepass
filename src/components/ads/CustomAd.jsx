import { customAds } from '../../config/customAdsConfig.js';

const today = () => new Date().toISOString().slice(0, 10);
function safeHref(url) {
  try { const u = new URL(url); return ['http:', 'https:'].includes(u.protocol) ? u.href : null; } catch { return null; }
}
export default function CustomAd({ placement }) {
  const t = today();
  const ads = customAds.filter((a) => a.enabled && a.placement === placement && (!a.startDate || t >= a.startDate) && (!a.endDate || t <= a.endDate));
  if (!ads.length) return null;
  return ads.map((a, i) => {
    const href = safeHref(a.destinationUrl);
    if (!href) return null;
    return (
      <aside className="ad custom noprint" key={i} aria-label="Advertisement">
        <small>Advertisement</small>
        {a.imageUrl && <img src={a.imageUrl} alt="" loading="lazy" />}
        <strong>{a.title}</strong>
        <span>{a.description}</span>
        <a href={href} target="_blank" rel="noopener noreferrer sponsored">{a.callToAction || 'Learn more'}</a>
        {a.contactEmail && <a className="hint" href={`mailto:${a.contactEmail}`}>Advertise with us</a>}
      </aside>
    );
  });
}
