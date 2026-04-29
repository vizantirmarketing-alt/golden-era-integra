# Gallery uploads

Place image files here that you reference from `scripts/gallery-photos.json` using the `filename` field (or `file`; basename only, e.g. `DSC0001.jpg`).

## Folder layout (build phases)

Convention: one subfolder per build phase, matching Sanity `galleryImage.phase` values:

- `before`
- `disassembly`
- `paint`
- `engine`
- `assembly`
- `finished`

Paths look like:

`gallery-uploads/{phase}/{filename}.jpg`

Example on disk:

```text
gallery-uploads/
  before/
    driver-side-profile.jpg
  paint/
    booth-shot.jpg
```

### How the import script resolves files

For each manifest entry, the source file is resolved in this order:

1. If `folder` is set → read `gallery-uploads/{folder}/{filename}` (explicit override).
2. Else if `phase` is a valid phase → read `gallery-uploads/{phase}/{filename}` (convenience when folder matches phase).
3. Else → read `gallery-uploads/{filename}` (legacy root layout).

You can omit `folder` whenever it would be the same as `phase`. Use `folder` when the directory name should differ from `phase` (e.g. staging shots under a custom subfolder).

If the resolved path does not exist, the script logs the paths it tried and **skips that entry** (other entries still run).

Supported extensions for local drops are documented in the repo root `.gitignore` (jpg, jpeg, png, heic are ignored so they are not committed).

## `gallery-photos.json` entry shape

Each object in the array can include:

| Field | Required | Notes |
|-------|----------|--------|
| `filename` / `file` | yes | Basename only; combined with `folder` / `phase` / root per rules above |
| `folder` | no | Subfolder under `gallery-uploads/`; overrides phase-based path |
| `phase` | no | Sanity build phase; defaults to `before` on create. When `folder` is omitted, also selects `gallery-uploads/{phase}/` |
| `alt` | yes | Alt text (stored on the image field in Sanity) |
| `caption` | no | |
| `location` | no | |
| `shotOn` | no | One of: `Film 35mm`, `Digital`, `Medium Format` |
| `capturedAt` | no | `YYYY-MM-DD` |
| `order` | no | Number; defaults to array index |
| `gridSpan` | no | `g1` … `g9` (see Studio schema labels) |

### Sample entry (phase subfolder, no `folder`)

```json
{
  "filename": "driver-side-profile.jpg",
  "phase": "before",
  "alt": "Integra in driveway, three-quarter rear view.",
  "caption": "Starting point.",
  "order": 10,
  "gridSpan": "g1"
}
```

Resolves to: `gallery-uploads/before/driver-side-profile.jpg`.

### Sample entry (explicit `folder`)

```json
{
  "filename": "misc-wide.jpg",
  "folder": "paint",
  "phase": "paint",
  "alt": "Car in the booth.",
  "order": 5,
  "gridSpan": "g2"
}
```

Here `folder` must match the directory you use; it can differ from `phase` only if you intentionally organize files that way.

Run the import after setting `SANITY_AUTH_TOKEN` (see project docs / root `package.json` script `import-gallery`).
