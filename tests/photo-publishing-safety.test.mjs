import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const photoDirectory = join(process.cwd(), 'public/images/explore-v03');
const approved = [
  'hero-seoul-bowl', 'from-fire', 'wine-table', 'set-table',
  'work-service', 'ingredients', 'fire-wings', 'outside-cheese',
];

test('public photo folder contains only the exact eight optimized approved derivatives', () => {
  assert.deepEqual(readdirSync(photoDirectory).sort(), approved.map(x => x + '.webp').sort());
});

for (const name of approved) {
  test(name + ' is a bounded, valid WebP without EXIF/GPS, XMP, or ICCP metadata', () => {
    const buf = readFileSync(join(photoDirectory, name + '.webp'));
    assert.ok(buf.length > 20_000 && buf.length < 500_000, 'unexpected image size');
    assert.equal(buf.toString('ascii', 0, 4), 'RIFF');
    assert.equal(buf.toString('ascii', 8, 12), 'WEBP');
    assert.equal(buf.readUInt32LE(4) + 8, buf.length, 'RIFF declared size must match');
    let offset = 12;
    const chunks = [];
    while (offset < buf.length) {
      assert.ok(offset + 8 <= buf.length, 'chunk header missing');
      const name = buf.toString('ascii', offset, offset + 4);
      const len = buf.readUInt32LE(offset + 4);
      chunks.push(name);
      assert.ok(!['EXIF', 'XMP ', 'ICCP'].includes(name), 'metadata chunk must not ship');
      offset += 8 + len + (len % 2);
    }
    assert.equal(offset, buf.length, 'unexpected trailing bytes');
    assert.ok(chunks.some(c => c.startsWith('VP8')), 'not a decodable WebP');
  });
}
