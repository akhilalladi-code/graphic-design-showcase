# Framecheck

**A local-first social creative size, crop, and safe-area previewer.** Framecheck helps designers and creators check artwork against common social placements before exporting a correctly sized PNG.

## Features

- 10 starter formats across Instagram, LinkedIn, YouTube, TikTok, and X.
- Exact export dimensions for each selected canvas.
- Cover / contain fitting with scale and horizontal / vertical positioning controls.
- Safe-area overlays for edge margins, story UI, profile-header overlaps, and the centered YouTube banner device-safe region.
- Full-size PNG export. Preview guides are never included in the exported artwork.
- Local-only processing: images are loaded into the browser; no account, API key, or upload server.
- Responsive interface with no framework or runtime dependencies.

## Quick start

Requirements: Node.js 18 or newer.

```bash
git clone https://github.com/akhilalladi-code/graphic-design-showcase.git
cd graphic-design-showcase/tools/framecheck
npm run dev
```

Open http://localhost:4174. A local server is recommended for JavaScript module support.

## How to use

1. Choose a platform format.
2. Drop an image onto the canvas or choose a file.
3. Select Cover to fill the frame or Contain to show the complete artwork.
4. Adjust scale and horizontal / vertical position.
5. Toggle the safe-area guide to check key copy, logos, and faces.
6. Export PNG. The file uses the selected full dimensions and excludes preview guides.

## Included formats

| Platform | Format | Dimensions |
| --- | --- | ---: |
| Instagram | Feed portrait | 1080 × 1350 |
| Instagram | Feed square | 1080 × 1080 |
| Instagram | Story / Reel | 1080 × 1920 |
| LinkedIn | Landscape post | 1200 × 627 |
| LinkedIn | Square post | 1200 × 1200 |
| YouTube | Video thumbnail | 1280 × 720 |
| YouTube | Channel banner | 2560 × 1440 |
| TikTok | Video cover | 1080 × 1920 |
| X | Landscape post | 1600 × 900 |
| X | Profile header | 1500 × 500 |

## Safe-area guidance

Safe areas are visual aids, not platform guarantees. Interface elements, crop behavior, and specifications can change across apps, devices, and placements. Story and TikTok overlays use approximate UI-aware margins. The YouTube banner guide uses a centered 1546 × 423 px device-safe rectangle within the 2560 × 1440 px canvas. Verify current platform specifications before client-critical delivery.

## Development

```bash
npm test
npm run check
```

Tests use Node's built-in test runner; no dependencies are required.

## Privacy

Framecheck uses a browser object URL and canvas to process the selected image locally. It does not transmit, save, or upload artwork. Refreshing or closing the page discards the in-memory image.

## License

MIT. See [LICENSE](./LICENSE).
