---
SECTION_ID: facts.wedding-site
TYPE: note
---

# Wedding site — Александра & Филипп

One-page responsive wedding invitation. Files:
- `index.html` — all sections (hero, about, timeline, venue, dresscode, gifts, RSVP, FAQ, outro)
- `css/style.css` — palette, layout, animations, responsive
- `js/main.js` — countdown, FAQ accordion, RSVP (localStorage), decorative chroma-key

## IMPORTANT: image transparency
The `ToolGenerateResourceFileFromMetaSection` transparency pipeline
(`MAKE_TRANSPARENT: rembg` and `make_transparent_by_color`) BAKES the
checkerboard preview into opaque RGB (alpha stays 255) — produces broken PNGs.
Workaround used: decorative art generated on a solid **green (#00FF00)** background
(`assets/cherubs_raw.png`, `assets/flowers_raw.png`) and **chroma-keyed in the
browser via canvas** (`chromaKey()` in main.js). Icons (`assets/icons_raw.png`,
black line-art on white, 4 cols × 2 rows) are **white-keyed** in JS (`whiteKey()`)
and sliced per cell. The baked `assets/*.png` (non-raw) are unused leftovers.

## Assets generated with Nanobanana
- flowers_raw.png: pink + orange daisies, green bg
- cherubs_raw.png: two cupids (line art + lilac wings), green bg
- icons_raw.png: 8 icons grid — [wine,disco,rings,envelope]/[stars,cheers,calendar,cake]

## Key data
- Countdown target: 2026-09-08T16:00:00+03:00
- RSVP deadline: 2026-08-08
- Telegram: @Chillyteen, @CommercialPunk

## v2 update
- Removed А+Ф monogram.
- Countdown = circular ring gauges (conic-gradient, --p set by JS setCell()).
- Big half-page daisy: assets/bigflower_raw.png (green) → chroma-key JS → .bigflower--tl/--br.
- Program section (guest-only): 16:30 Велком/17:15 Первый блок/17:55 Муз пауза/18:15 Второй блок/19:00 Церемония/19:20 Вечеринка/21:30 Торт.
  Each item illustration from assets/program2_raw.png (4x2 green grid, halftone black-outline sticker style) sliced via PROG_CELL map in main.js. (old program_raw.png = watercolor style, replaced.)
  Names order across whole site: Филипп FIRST, Александра second.
  Palette colors updated to reference swatches; captions always visible under chips.
  Dresscode has him(left)/her(right) photos in polaroid frames above each column.
  Venue photos are now COLOR (grayscale filter removed) + spread wider (sec--wide, max 1080px).
  Scallop separators fixed: outro bg made solid pink (was gradient which broke mask). Separator = .sec--scallop::before radial mask, added via JS scallops() when bg differs from prev section.
  Side flowers enlarged to hero scale (29-34vw), 7 spots down the page.
- Photos in assets/photos/ (couple_* b/w photobooth, venue_1..4). Hero = 3 pbframe; #moments = clipped pbframe w/ paper-clip ::before.
- Venue buttons: .ybtn--nav (dark+yellow arrow) & .ybtn--go (yellow+black Go) — Yandex styled.
- Reveal-on-scroll via IntersectionObserver adding .in to .reveal/.reveal-stagger.
- Removed old timeline section + icons ico--cheers/disco usage there.


## v3 update
- Icons redrawn unified: assets/icons2_raw.png (green chroma-key, 4x2). Order [0,0]calendar [1,0]rings [2,0]wine [3,0]envelope / [0,1]stars [1,1]cheers [2,1]disco [3,1]cake. Loaded via chromaKey() in main.js ICON_MAP.
- Old assets/icons_raw.png (white-bg) no longer used.
- Big side star-flowers: assets/sideflowers_raw.png (green, left=lime right=orange). JS splits + scatters into #sideflowers container down the page (SPOTS array in main.js), sway animation via --r var.
- Venue gallery = taped scrapbook: .venue__hero big photo (venue_1) + .venue__row 3 photos, all .taped (washi tape ::before/::after). Handwritten "нам сюда!" note (.handnote) + SVG arrow.
- Moments = randomly scattered .scat--1/2/3 absolute positioned, .taped, no clips, no subtitle.
- Palette redesigned: .palette__chips grid of rounded tiles, hover shows title; 7 cols desktop, 4 cols <420px.
- RSVP mock prefill: "Александра Иванова / @alexandra / yes" when no localStorage.
- Tape classes: .taped--c (1 center strip), .taped--l/.taped--r (2 corner strips).

## v6 changes (polish pass)
- Scallop separator fixed: `.sec--scallop::before` uses down-facing semicircles (radial-gradient circle 11px, 30px repeat) with `translateY(-100%)` hugging the section top edge. margin-top:22px.
- Program circles shrunk to `--dot:clamp(62px,11vw,86px)`, one illustration per item (program2_raw.png halftone), tighter padding 7px.
- Venue name changed to just "Original" (was "White Studios · площадка Original"). Also updated FAQ #1 + .ics LOCATION to "Original". Wrapped venue info in `.venue__card` (white card + "ПЛОЩАДКА" kicker + big name + address).
- Lightbox added: markup `#lightbox` at end of body, JS IIFE at end of main.js, CSS `.lightbox*`. All openable photos have `data-lb` attr (hero 3, venue 4, dresscode 2 = 9 total). Keyboard nav (Esc/←/→), click backdrop to close.
- Cache-busting: css/style.css?v=5 and js/main.js?v=5 in index.html. BUMP THIS when editing css/js or browser serves stale files.
- RSVP mock prefill removed; placeholders only, autocomplete=off.
- Names order: Филипп first everywhere (title, hero, outro, ics).
