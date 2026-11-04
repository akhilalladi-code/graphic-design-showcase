import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESETS, getPreset, getDrawRect, safeRect, formatDimensions, safeExportName } from '../src/core.js';

test('preset catalogue has unique ids and valid dimensions', () => {
  const ids = PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const preset of PRESETS) {
    assert.ok(preset.width > 0 && preset.height > 0);
    assert.ok(preset.safe.left + preset.safe.right < 100);
    assert.ok(preset.safe.top + preset.safe.bottom < 100);
  }
});
test('getPreset falls back to the first supported format', () => {
  assert.equal(getPreset('ig-story').width, 1080);
  assert.equal(getPreset('not-real').id, PRESETS[0].id);
});
test('cover fit fills the canvas without distorting the image', () => {
  const rect = getDrawRect(1600, 900, 1080, 1350, 'cover');
  assert.equal(rect.height, 1350);
  assert.ok(rect.width >= 1080);
  assert.equal(rect.width / rect.height, 1600 / 900);
});
test('contain fit keeps the entire image inside the canvas', () => {
  const rect = getDrawRect(1600, 900, 1080, 1350, 'contain');
  assert.equal(rect.width, 1080);
  assert.ok(rect.height <= 1350);
});
test('position offsets move the crop while preserving dimensions', () => {
  const centered = getDrawRect(1200, 1200, 1080, 1350, 'cover');
  const shifted = getDrawRect(1200, 1200, 1080, 1350, 'cover', 1, 10, -5);
  assert.equal(shifted.width, centered.width);
  assert.equal(shifted.height, centered.height);
  assert.equal(shifted.x - centered.x, 108);
  assert.equal(shifted.y - centered.y, -67.5);
});
test('safe rectangle uses percentage insets', () => {
  assert.deepEqual(safeRect(1000, 500, { top: 10, right: 20, bottom: 10, left: 20 }), { x: 200, y: 50, width: 600, height: 400 });
});
test('dimension and export labels are predictable', () => {
  assert.equal(formatDimensions(1080, 1920), '1,080 × 1,920 px');
  assert.equal(safeExportName('YouTube', 'Video thumbnail'), 'youtube-video-thumbnail');
});
test('invalid draw dimensions and fit modes are rejected', () => {
  assert.throws(() => getDrawRect(0, 100, 100, 100), RangeError);
  assert.throws(() => getDrawRect(100, 100, 100, 100, 'stretch'), TypeError);
});
