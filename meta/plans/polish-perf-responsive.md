---
SECTION_ID: plans.polish-perf-responsive
TYPE: plan
---

# Plan: Polish site — smooth loading, performance, responsive layout

## Findings (audit done)
- Image payload is the #1 perf problem (~25MB+ referenced images, see pin `perf-image-audit`).
- No dedicated tablet breakpoint (only max-width:640 and max-width:420) — need to check 768-1024 range live.
- Splash-critical images (envelope, wax_seal, sprays) are heavy and block first paint of the invite.
- Program icons (7 x ~500KB) and icons2_raw (3.3MB) fetched via JS for tiny UI icons — way oversized.

## Steps
1. [x] Audit asset sizes (console `ls -la`).
2. [x] Live-test responsive layout: desktop (1440), tablet (834), mobile (390) — screenshots + console errors.
   - FOUND & FIXED: `.hero__title` ("МЫ ЖЕНИМСЯ") overflowed past hero padding on mobile (text clipped flush to viewport edge, zero side margin) and slightly on tablet. Root cause: flex-column child default `min-width:auto` + too-aggressive `vw` in font clamp. Fixed clamp values + added `min-width:0`/`overflow-wrap` safety net in css/style.css. Verified via getBoundingClientRect on both.
   - Rest of page (venue gallery, palette, dresscode, RSVP, program zigzag) checked on tablet/mobile — no other overflow bugs found (decorative bleed elements like cherubs/flowers are intentional, excluded from scan).
3. [x] Fix layout bugs found (see above). css bumped to v=33.
4. [x] Code-level perf fixes done:
   - preload envelope.png + wax_seal.png (splash bg-images, fetchpriority=high)
   - fetchpriority=high on first hero photo, decoding=async on all photos (hero/venue/dresscode)
   - confirmed CLS-safe (aspect-ratio already set everywhere), confirmed JS decor already idle-deferred + IO-paused offscreen
5. [x] DONE by Sonic. Approach:
   - Photos (venue x4, dresscode x2, hero couple x3) → PNG to JPEG q85 (photographic content, no alpha needed)
   - Envelope/wax_seal/sprays → resized + WebP (envelope/sprays lossy q88-95 since photographic-ish; wax_seal/sprays alpha edges needed lossless=true to avoid blocky 8x8 artifacts in alpha channel — verified visually via side-by-side compare)
   - prog_icons_v3 (7 files, already-transparent, not chroma-keyed) → resized + WebP lossless=true (lossy alpha caused visible blockiness at their tiny size, lossless still tiny)
   - Chroma-key RAW sources (icons2_raw, bigflower_raw, sideflowers_raw, cherubs_raw, flowers_raw) → ONLY downscaled in-place, kept as lossless PNG same filename (lossy compression would break JS chromaKey() edge detection) — resized to realistic max display resolution with retina headroom
   - Updated all refs in index.html/css/style.css/js/main.js, bumped cache-bust versions (css v34, js v23, raw png query params)
   - Deleted old PNGs + other confirmed-unused leftovers (~4.6MB extra found: couple_*.png non-v2 versions)
   - Verified: 0 console errors, visual side-by-side compare of every conversion, live screenshots desktop/mobile after swap — all match original pixel-for-pixel at display size.
   RESULT: measured real network payload 16.6MB+ (partial page) → 2.27MB (full page, direct requests) + 2.37MB (5 raw decor, chroma-keyed client-side, lossless) = ~4.6MB total. **~80% reduction.**
6. [x] Removed unused leftover files (old PNGs post-conversion + cherubs.png, flowers.png, icons.png, icons_raw.png, program_raw.png, prog_icons_v3_grid*.png, prog_7.png, + previously-undiscovered couple_date/hands/heart/kiss/rock/save.png ~4.6MB).
7. [x] Re-tested: console clean, screenshots match, performance API confirms payload drop.

## Status: DONE. Summary for user delivered.
