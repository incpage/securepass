# SecurePass — Password Generator
React + Vite. Runs entirely in the browser.

## Run
    npm install
    npm run dev      # development
    npm test         # unit tests
    npm run build    # production build

## Configuration
Edit `src/config/passwordConfig.js`: default/min/max length, special characters,
ambiguous characters, default categories, max quantity, strength thresholds.

## Algorithm
`src/utils/secureRandom.js` uses `crypto.getRandomValues` with rejection sampling
(no modulo bias) and a Fisher–Yates shuffle. `Math.random()` is never used. If Web Crypto is
missing, generation fails with an error instead of falling back.
Mandatory categories get one character each, the rest is filled from the full pool, then shuffled.
Duplicate passwords in a batch are regenerated up to `maxDuplicateRetries` times.

## Privacy
Passwords are never stored, logged, or transmitted. Only the theme preference is saved in localStorage.
Clearing the display does not erase the system clipboard or guarantee removal from browser memory.
Generated passwords are not saved anywhere: use a password manager.

## Ads
- Google AdSense: edit `src/config/adsConfig.js`. Set `ADS_CLIENT_ID` (your `ca-pub-…`), then per placement (`header`, `belowGenerator`, `footer`) set `enabled: true` and your `slotId`. Placeholder values render nothing.
- Custom ads: edit `src/config/customAdsConfig.js`. Rebuild and redeploy after changes.
