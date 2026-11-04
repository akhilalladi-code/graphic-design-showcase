import { PRESETS, getPreset, getDrawRect, safeRect, formatDimensions, safeExportName } from './core.js';

const $ = (selector) => document.querySelector(selector);
const canvas = $('#artwork');
const ctx = canvas.getContext('2d', { alpha: false });
const imageInput = $('#image-input');
const presetSelect = $('#preset-select');
const fitSelect = $('#fit-select');
const zoomInput = $('#zoom');
const xInput = $('#offset-x');
const yInput = $('#offset-y');
const bgInput = $('#background');
const image = new Image();
let imageLoaded = false;
let preset = PRESETS[0];
let objectUrl = null;

function populatePresets() {
  const groups = new Map();
  for (const item of PRESETS) {
    if (!groups.has(item.platform)) groups.set(item.platform, []);
    groups.get(item.platform).push(item);
  }
  presetSelect.replaceChildren();
  for (const [platform, items] of groups) {
    const group = document.createElement('optgroup');
    group.label = platform;
    for (const item of items) {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.label;
      group.append(option);
    }
    presetSelect.append(group);
  }
}
function setStatus(message) { $('#status').textContent = message; }

function draw() {
  canvas.width = preset.width;
  canvas.height = preset.height;
  ctx.fillStyle = bgInput.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (imageLoaded) {
    const rect = getDrawRect(image.naturalWidth, image.naturalHeight, canvas.width, canvas.height, fitSelect.value, Number(zoomInput.value), Number(xInput.value), Number(yInput.value));
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.clip();
    ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height);
    ctx.restore();
  } else {
    ctx.fillStyle = '#8a8d85';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `600 ${Math.max(24, canvas.width * .035)}px system-ui`;
    ctx.fillText('Drop your artwork here', canvas.width / 2, canvas.height / 2 - canvas.height * .025);
    ctx.font = `${Math.max(14, canvas.width * .014)}px system-ui`;
    ctx.fillText('or choose an image to begin', canvas.width / 2, canvas.height / 2 + canvas.height * .035);
  }
  updateOverlay();
  updateMeta();
}
function updateOverlay() {
  const overlay = $('#safe-overlay');
  const rect = safeRect(preset.width, preset.height, preset.safe);
  overlay.style.left = `${rect.x / preset.width * 100}%`;
  overlay.style.top = `${rect.y / preset.height * 100}%`;
  overlay.style.width = `${rect.width / preset.width * 100}%`;
  overlay.style.height = `${rect.height / preset.height * 100}%`;
  overlay.hidden = !$('#show-safe').checked;
  $('#safe-label').textContent = preset.id === 'youtube-banner' ? 'DEVICE SAFE AREA' : 'KEEP KEY CONTENT INSIDE';
}
function updateMeta() {
  $('#dimension-label').textContent = formatDimensions(preset.width, preset.height);
  $('#ratio-label').textContent = `${(preset.width / preset.height).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}:1 ratio`;
  $('#preset-note').textContent = preset.note;
  $('#platform-label').textContent = `${preset.platform} / ${preset.label}`;
  $('#download').disabled = !imageLoaded;
}
function setPreset(id) {
  preset = getPreset(id);
  $('#canvas-frame').style.aspectRatio = `${preset.width} / ${preset.height}`;
  $('#canvas-frame').style.maxWidth = preset.width / preset.height > 1.4 ? '100%' : 'min(100%, 440px)';
  draw();
}
function loadFile(file) {
  if (!file) return;
  if (!file.type.startsWith('image/')) { setStatus('Please choose an image file.'); return; }
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(file);
  image.onload = () => {
    imageLoaded = true;
    $('#image-name').textContent = file.name;
    $('#image-size').textContent = `${image.naturalWidth} × ${image.naturalHeight} px`;
    $('#image-details').hidden = false;
    $('#empty-state').hidden = true;
    $('#controls').hidden = false;
    $('#controls-empty').hidden = true;
    setStatus('Artwork loaded locally');
    draw();
  };
  image.onerror = () => { imageLoaded = false; setStatus('This image could not be opened. Try PNG, JPG, or WebP.'); };
  image.src = objectUrl;
}
function exportPng() {
  if (!imageLoaded) return;
  const link = document.createElement('a');
  link.download = `${safeExportName(preset.platform, preset.label)}-${preset.width}x${preset.height}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  setStatus('Exported PNG without preview guides');
}

populatePresets();
presetSelect.value = preset.id;
setPreset(preset.id);
presetSelect.addEventListener('change', () => setPreset(presetSelect.value));
for (const control of [fitSelect, zoomInput, xInput, yInput, bgInput]) control.addEventListener('input', draw);
$('#show-safe').addEventListener('change', updateOverlay);
imageInput.addEventListener('change', (event) => loadFile(event.target.files?.[0]));
$('#download').addEventListener('click', exportPng);
$('#reset').addEventListener('click', () => {
  zoomInput.value = '1'; xInput.value = '0'; yInput.value = '0'; fitSelect.value = 'cover'; bgInput.value = '#20231f'; draw();
});
$('#remove-image').addEventListener('click', () => {
  imageLoaded = false;
  imageInput.value = '';
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = null;
  $('#image-details').hidden = true;
  $('#empty-state').hidden = false;
  $('#controls').hidden = true;
  $('#controls-empty').hidden = false;
  setStatus('Ready for artwork');
  draw();
});
const dropZone = $('#drop-zone');
for (const eventName of ['dragenter', 'dragover']) dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.add('dragging'); });
for (const eventName of ['dragleave', 'drop']) dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.remove('dragging'); });
dropZone.addEventListener('drop', (event) => loadFile(event.dataTransfer.files?.[0]));
window.addEventListener('beforeunload', () => { if (objectUrl) URL.revokeObjectURL(objectUrl); });
