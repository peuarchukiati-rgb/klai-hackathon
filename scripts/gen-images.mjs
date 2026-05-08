// klai · OpenAI image generation script
// Usage: OPENAI_API_KEY=sk-... node scripts/gen-images.mjs
//        node scripts/gen-images.mjs --only hero
//        node scripts/gen-images.mjs --model gpt-image-1

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'images');

// --- args ---
const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const modelArg = args.includes('--model') ? args[args.indexOf('--model') + 1] : null;

// --- env ---
async function loadEnv() {
  try {
    const envPath = path.join(ROOT, '.env.local');
    const raw = await fs.readFile(envPath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
      }
    }
  } catch (e) { /* no .env.local — fine */ }
}

await loadEnv();

const KEY = process.env.OPENAI_API_KEY;
if (!KEY || KEY.startsWith('sk-REPLACE')) {
  console.error('\n❌ OPENAI_API_KEY ไม่พบ');
  console.error('   ใส่ใน .env.local: OPENAI_API_KEY=sk-...');
  console.error('   หรือ export OPENAI_API_KEY=sk-... ก่อนรัน\n');
  process.exit(1);
}

// gpt-image-1 = newest, dall-e-3 = previous, dall-e-2 = older
const MODEL = modelArg || process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';

// --- Image prompts ---
const PROMPTS = [
  {
    name: 'hero',
    size: '1024x1536',
    prompt: `A serene editorial photo of a person in their early 30s sitting calmly by a large window at golden hour, holding a phone displaying soft glowing health data (sleep score, HRV, steps) overlaid in clean minimal typography. Warm cream and forest green tones, soft natural light, slightly desaturated, premium wellness magazine aesthetic, shallow depth of field, no logos, no text artifacts. Mood: calm, intentional, modern.`
  },
  {
    name: 'devices',
    size: '1024x1024',
    prompt: `Editorial flat lay on a warm cream linen surface: an Apple Watch, an iPhone showing a minimal health dashboard, a Garmin watch, a Withings smart scale, a small potted eucalyptus plant. Top-down view, soft natural daylight, muted forest green and coral accent, no logos visible, premium minimal styling, intentional negative space. Mood: organized, calm, considered.`
  },
  {
    name: 'how-it-works',
    size: '1024x1024',
    prompt: `Abstract minimal illustration showing three soft organic shapes connected by a thin flowing line — first shape contains a watch silhouette, second shape contains a chat bubble, third shape contains a document icon. Cream background, forest green and coral palette, hand-drawn quality, calm wellness aesthetic, lots of whitespace, no text.`
  },
  {
    name: 'cta-bg',
    size: '1536x1024',
    prompt: `Abstract atmospheric background: soft out-of-focus eucalyptus leaves and gentle morning light rays, deep forest green tones with warm coral highlights at the edges. Premium editorial photography, cinematic, peaceful, no people, no text, suitable as a banner background.`
  },
  {
    name: 'samples-cover',
    size: '1024x1024',
    prompt: `An open laptop and a notebook with handwritten markdown-style notes, on a warm cream desk surface beside a cup of green tea. Soft warm light from the side, top-down close-up, premium minimal aesthetic, forest green plant in corner, no logos, no text artifacts. Mood: focused, calm productivity.`
  }
];

const work = only ? PROMPTS.filter(p => p.name === only) : PROMPTS;
if (work.length === 0) {
  console.error(`No prompt named "${only}"`);
  process.exit(1);
}

// --- ensure output dir ---
await fs.mkdir(OUT_DIR, { recursive: true });

// --- generate ---
console.log(`\n🎨 klai image generation`);
console.log(`   model: ${MODEL}`);
console.log(`   output: ${OUT_DIR}`);
console.log(`   prompts: ${work.map(p => p.name).join(', ')}\n`);

for (const p of work) {
  process.stdout.write(`  · ${p.name}.png ... `);
  const t0 = Date.now();
  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: p.prompt,
        size: p.size,
        n: 1,
        ...(MODEL === 'gpt-image-1' ? {} : { response_format: 'b64_json' })
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.log(`❌ ${res.status}`);
      console.log(`     ${err.slice(0, 200)}`);
      continue;
    }

    const json = await res.json();
    const item = json.data?.[0];
    let buffer;

    if (item?.b64_json) {
      buffer = Buffer.from(item.b64_json, 'base64');
    } else if (item?.url) {
      const imgRes = await fetch(item.url);
      buffer = Buffer.from(await imgRes.arrayBuffer());
    } else {
      console.log(`❌ no image in response`);
      continue;
    }

    const outPath = path.join(OUT_DIR, `${p.name}.png`);
    await fs.writeFile(outPath, buffer);
    const ms = Date.now() - t0;
    console.log(`✓ ${(buffer.length / 1024).toFixed(0)} KB · ${(ms / 1000).toFixed(1)}s`);
  } catch (e) {
    console.log(`❌ ${e.message}`);
  }
}

console.log(`\n✅ Done. ภาพอยู่ใน ${path.relative(ROOT, OUT_DIR)}/`);
console.log(`   เปิด public/index.html แล้วภาพจะโหลดอัตโนมัติ\n`);
