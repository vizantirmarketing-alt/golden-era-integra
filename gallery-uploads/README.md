# Gallery uploads

Place image files here that you reference from `scripts/gallery-photos.json` using the `filename` field (or `file`; filename only, e.g. `DSC0001.jpg`).

Supported extensions for local drops are documented in the repo root `.gitignore` (jpg, jpeg, png, heic are ignored so they are not committed).

## `gallery-photos.json` entry shape

Each object in the array can include:

| Field | Required | Notes |
|-------|----------|--------|
| `filename` / `file` | yes | Filename inside this folder |
| `alt` | yes | Alt text (stored on the image field in Sanity) |
| `caption` | no | |
| `location` | no | |
| `shotOn` | no | One of: `Film 35mm`, `Digital`, `Medium Format` |
| `capturedAt` | no | `YYYY-MM-DD` |
| `order` | no | Number; defaults to array index |
| `gridSpan` | no | `g1` … `g9` (see Studio schema labels) |

Run the import after setting `SANITY_AUTH_TOKEN` (see project docs / root `package.json` script `import-gallery`).
