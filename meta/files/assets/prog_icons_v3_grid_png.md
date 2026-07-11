---
SECTION_ID: files.assets.prog_icons_v3_grid_png
TYPE: file/image
---

# Program Day Icons v3 - Wedding Clipart Style Grid

FILE: assets/prog_icons_v3_grid.png
DESCRIPTION: |
  A 4x2 grid sheet of 7 hand-drawn wedding-clipart style icons (8th cell decorative bonus),
  each in its own cell, on a perfectly plain solid white background so cells can be
  cropped apart afterwards. Style: delicate black ink outline line-art filled with soft
  pastel watercolor-style washes (dusty blush pink, sage green, warm mustard gold, powder
  blue), tiny scribbled sparkle/star accents scattered near each icon, slightly imperfect
  hand-drawn wobbly linework (not vector-perfect), warm and romantic, like a page from a
  wedding stationery sticker sheet.
WIDTH: 2048
HEIGHT: 1024
UTILITY: nanobanana
IMAGE-INPUT: .temp/upload/chat_image_bbeadf3c-4de3-4b02-b950-4b923e31f6b7.png
FILES: .temp/upload/chat_image_bbeadf3c-4de3-4b02-b950-4b923e31f6b7.png
ASPECT_RATIO: 16:9
RESOLUTION: 2K
VERSION: pro
PROMPT: |
  Match the hand-drawn ink + pastel watercolor wedding-clipart illustration style of
  figure 1 as closely as possible: same thin wobbly black ink outlines, same soft
  pastel watercolor fills, same tiny sparkle accents. Do NOT copy figure 1's specific
  objects - draw entirely new icons listed below in that same style.

  A flat lay illustration sheet: a 4-column by 2-row grid of 8 separate small hand-drawn
  wedding clipart icons, one icon centered per cell, generous empty white space padding
  around each icon so they don't touch grid lines or each other. Plain solid pure white
  background, no shadows, no grid lines drawn, no cell borders, no text, no numbers.

  Delicate thin black ink outline sketch style, filled with soft pastel watercolor washes:
  dusty blush pink, sage/olive green, warm mustard gold, powder blue, cream. Slightly
  imperfect wobbly hand-drawn linework (not perfectly vector/geometric), tiny scattered
  sparkle/star/dot accents near each icon. Romantic wedding stationery sticker-sheet
  aesthetic, matching a soft boho wedding invitation.

  Row 1, left to right:
  1. A elegant hand holding up a champagne coupe glass with bubbles/foam and a little
     sparkle above it (welcome drink toast)
  2. A vintage standing microphone on a small stage stand with a music note beside it
     (opening speech / first program block)
  3. A spinning vinyl record with small music notes floating around it (music pause)
  4. A party popper/confetti cracker exploding with confetti pieces and streamers (second
     program block / celebration)

  Row 2, left to right:
  5. Two wedding rings interlocked with a small heart above them and tiny sparkles
     (ceremony)
  6. Two clinking cocktail glasses with fruit garnish, small bubbles rising (cocktail
     party)
  7. A round two-tier wedding cake decorated with a tiny flower on top and a slice being
     served (cake cutting)
  8. A bottle of champagne pouring into a coupe glass, bubbles in the air, a small
     ribbon bow tied around the bottle neck (bonus decorative element)

  Every icon must be a single simple isolated object composition, clean silhouette,
  easy to crop out individually later, consistent line weight and color palette across
  all 8 icons.
MAKE_TRANSPARENT: rembg

COMMENTS: ## Design Notes
- Reference style: soft blush-pink/sage wedding clipart sticker sheet (dresscode-adjacent
  palette already used across the site: olive, lime, pink, blue, yellow, lilac, beige).
- After generation: crop each of the 8 cells locally with ToolExecuteTrivialImageCommand
  into separate transparent PNGs (assets/prog_icons_v3/prog_0.png ... prog_7.png), then
  wire directly into CSS/JS as plain <img>/background-image with NO runtime canvas
  chroma-keying - avoids repeating the main-thread-blocking canvas decode issue that
  previously caused mobile scroll jank with the old green-screen sprite approach.
- Used for #program section icons (.prog__img), replacing old plain black line icons.
