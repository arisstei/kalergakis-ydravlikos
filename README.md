# Ydrokalergakis.gr — how to add media

## New photo
1. Resize to ~1600px wide, under ~250 KB, and copy it to `images/` (e.g. `gallery-apofraxi.jpg`).
2. In `index.html`, inside `id="photo-grid"`, copy any existing tile and change `src` and `alt`.
   Alt text = what is in the photo + Ηράκλειο (e.g. "Απόφραξη αποχέτευσης στο Ηράκλειο").
3. Open the page, click the photo to check the lightbox, then commit and push.

## New video
- Put the `.mp4` in `videos/` plus a poster `.jpg` in `images/`.
- In `id="video-grid"`, copy a tile, set `data-video-src="videos/name.mp4"` and the poster as `<img src>`.
- Google Drive links (`.../preview`) also work, but local files are more reliable.

## Rebuilding styles.css
After adding new Tailwind classes to `index.html`, run:
`npx tailwindcss@3 -c tailwind.config.js -i input.css -o styles.css --minify`
where `input.css` contains the three lines `@tailwind base; @tailwind components; @tailwind utilities;`.
