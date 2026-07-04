import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url));

const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" fill="#d67209" />
  <g transform="translate(24 24) scale(0.62) translate(-24 -24)">
    ${readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8').replace(/<\/?svg[^>]*>/g, '')}
  </g>
</svg>
`;

const jobs = [
  { input: svg, size: 192, out: 'public/icons/icon-192.png' },
  { input: svg, size: 512, out: 'public/icons/icon-512.png' },
  { input: Buffer.from(maskableSvg), size: 512, out: 'public/icons/icon-maskable-512.png' },
  { input: svg, size: 180, out: 'public/icons/apple-touch-icon.png' },
];

for (const job of jobs) {
  await sharp(job.input, { density: 384 })
    .resize(job.size, job.size)
    .png()
    .toFile(fileURLToPath(new URL(`../${job.out}`, import.meta.url)));
  console.log('wrote', job.out);
}
