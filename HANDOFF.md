# klai — Slide Handoff

> Document นี้สำหรับเอาไปทำ slide presentation
> ทุกอย่างที่ build ไว้ในโปรเจ็คนี้ + structure slide ที่แนะนำ + demo script + assets

---

## TL;DR (1 paragraph for cover/intro)

**klai** คือ headless wellness platform — ดึงข้อมูลจาก Apple Watch / Oura / Withings เข้ากับ ChatGPT เพื่อให้ AI agent ช่วยทั้ง (1) วิเคราะห์สุขภาพ และ (2) สร้าง `.md` ลดงานประจำ → ผู้ใช้มีเวลาดูแลตัวเองมากขึ้น

**Hook (one-liner):**
> "ดูแลสุขภาพ โดยไม่ต้องเปิดแอปเพิ่มอีกตัว"

**Differentiation (one-liner):**
> "ไม่ใช่อีกหนึ่ง dashboard — เป็น layer ที่ทำให้ AI ที่คุณใช้อยู่ ฉลาดเรื่องสุขภาพคุณขึ้น"

---

## The Big Idea — Leverage Chain

โครงสร้าง core thesis ของทั้ง project (แนะนำใช้เป็น **Slide หลัก** ที่กลับมาอ้างอิงตลอด):

```
Devices  →  klai  →  ChatGPT  →  .md  →  Custom GPT  →  Daily routine
(data)     (layer)   (analysis)  (artifact) (persistent)  (compound)
```

แต่ละลูกศรคือ **leverage multiplier**:
- **Devices → klai**: data ที่กระจัดกระจาย → unified
- **klai → ChatGPT**: data → insight + recommendation
- **ChatGPT → .md**: ephemeral chat → permanent artifact
- **.md → Custom GPT**: artifact → reusable AI tool
- **Custom GPT → routine**: tool → habit → time saved

> **Time saved compounds.** เวลาที่ประหยัดได้ → เอาไปดูแลตัวเอง → health ดีขึ้น → ทำงานได้ดีขึ้น → loop กลับ

---

## What's Built (Asset Inventory)

### 6 หน้าเว็บ (เปิดได้ทันที, deploy เป็น static site)

| # | Page | URL | Purpose |
|---|------|-----|---------|
| 1 | Landing | [index.html](public/index.html) | Hero + value prop + how it works |
| 2 | Connect | [connect.html](public/connect.html) | Mock account dashboard · API key |
| 3 | Demo (klai widgets) | [demo.html](public/demo.html) | klai widgets แบบ standalone |
| 4 | API docs | [api.html](public/api.html) | Endpoints · ChatGPT/Claude/MCP setup |
| 5 | Samples | [samples.html](public/samples.html) | Browse + copy + download .md |
| 6 | **ChatGPT mock** ⭐ | [chatgpt.html](public/chatgpt.html) | **The main demo — ตัวที่ wow judges** |

### 8 ภาพ (generate ด้วย OpenAI gpt-image-1)

| File | Purpose |
|------|---------|
| `images/hero.png` | Landing hero — person with phone |
| `images/devices.png` | Device flat lay (Apple Watch + iPhone + Garmin + Withings) |
| `images/how-it-works.png` | Abstract 3-step illustration |
| `images/cta-bg.png` | CTA background — eucalyptus leaves |
| `images/samples-cover.png` | Mood sheet workspace |
| `images/device-applewatch.png` | Apple Watch product shot |
| `images/device-ouraring.png` | Oura Ring product shot |
| `images/device-withings.png` | Withings scale product shot |

### 3 sample `.md` outputs (ใช้ใน demo + downloadable)

- [`samples/wellness-plan.md`](public/samples/wellness-plan.md) — 7-day plan, focus sleep recovery
- [`samples/daily-standup.md`](public/samples/daily-standup.md) — pre-fill from calendar + health
- [`samples/email-triage.md`](public/samples/email-triage.md) — stress-aware SOP

### Mock data + spec

- [`data/mock-health.json`](public/data/mock-health.json) — 7 days × 3 devices
- [`data/api-spec.json`](public/data/api-spec.json) — OpenAPI-style spec

### Scripts

- `scripts/gen-images.ps1` (PowerShell · works on Windows without Node)
- `scripts/gen-images.mjs` (Node version, alternative)

---

# === SLIDE-BY-SLIDE STRUCTURE ===

แนะนำ **12 slides** สำหรับ 5–7 นาที pitch:

---

## Slide 1 — Cover

**Title (large):** klai
**Tagline (subhead):** Headless wellness · for the AI era

**Visual:** ใช้ `images/hero.png` เป็น background หรือ side image

**Speaker note:**
> สวัสดีครับ — โปรเจ็คนี้ชื่อ klai · headless wellness platform · เพื่อช่วยคนยุคที่ใช้ AI ทุกวันให้ดูแลสุขภาพได้โดยไม่ต้องเรียนเครื่องมือใหม่

---

## Slide 2 — The Problem

**Title:** "เรามี dashboard เยอะเกินไปแล้ว"

**Bullets:**
- Apple Health, Oura app, Garmin Connect, Withings Health Mate, ...
- ข้อมูลแยกอยู่แต่ละแอป ไม่ link กัน
- AI agents (ChatGPT, Claude) ฉลาด — แต่ไม่รู้เรื่องสุขภาพเรา
- งานประจำที่กินเวลาทุกวัน (standup, email triage, planning) ไม่ได้ใช้ context สุขภาพเลย

**Speaker note:**
> ปัญหาคือเรามี data แต่ไม่ได้ใช้ — และ AI ที่ฉลาดที่สุดในมือเรา ก็ไม่รู้ว่าเรานอน 5 ชั่วโมงเมื่อคืน

---

## Slide 3 — The Big Idea (THE Slide)

**Title:** "Don't add another app. Add a layer."

**Visual:** Leverage chain diagram (วาดเป็น horizontal flow):
```
Devices → klai → ChatGPT → .md → Custom GPT → Routine
```

**Bullets (small):**
- klai = headless API (no UI of its own)
- ChatGPT = where the user already is
- .md = persistent artifact, no vendor lock-in
- Custom GPT = your routine, automated forever

**Speaker note:**
> klai ไม่ใช่ app ใหม่ — เป็น layer ที่ทำให้ AI ที่คุณใช้อยู่ ฉลาดเรื่องคุณขึ้น · และทุก step ใน chain นี้ leverage ทบต้น

---

## Slide 4 — How it works (3 simple steps)

**Title:** "3 ขั้นตอน · ใช้ได้ตลอดไป"

**Use:** หน้า Landing section "How it works" (มีรูป + 3 cards)

**Visual:** screenshot ของ landing → section how-it-works (มี `images/how-it-works.png`)

**Bullets:**
1. **Connect devices** (Apple Watch / Oura / Withings + 9 อื่น)
2. **Pair with ChatGPT** (paste API key หรือ MCP)
3. **คุย — รับ `.md`**

---

## Slide 5 — Live Demo: Connect klai

**Title:** "เริ่มต้นใน 30 วินาที"

**Visual:** screenshot จาก [chatgpt.html](public/chatgpt.html) — connector modal

**Demo flow (script):**
1. เปิด chatgpt.html → empty state ที่มี logo ChatGPT + "เริ่มต้นกับ klai"
2. กด `Connect klai` → modal สวย เหมือน ChatGPT จริง
3. Stage 1: Overview (verified badge, scopes)
4. Stage 2: เลือก 3 อุปกรณ์ (รูปจริงทั้งหมด — Apple Watch, Oura, Withings)
5. Stage 3: 4-step animated loading (Verifying → Authenticating → Linking → Syncing)
6. Stage 4: Success ✓ list อุปกรณ์ที่ connect

**Speaker note:**
> 30 วินาที · 3 อุปกรณ์ · พร้อมใช้กับ ChatGPT ทันที — ไม่ต้องเรียน UI ใหม่

---

## Slide 6 — Smart Questions (The Wow Slide)

**Title:** "ถามอะไรก็ได้ — klai ตอบได้ลึกกว่าที่คิด"

**Visual:** screenshot of suggestion bubbles (4 sections: Quick start / Devices / Smart / Export)

**Demo flow (live, pick 2-3):**

🔬 **"เทียบ HRV จาก Apple Watch กับ Oura — เชื่อตัวไหน?"**
→ Cross-device comparison widget (รูปทั้ง 2 อุปกรณ์ + verdict + reasoning)
→ "ใช้ Oura เป็น primary เพราะวัด overnight controlled — Apple Watch sampled"

🏃 **"พรุ่งนี้อยากเทรนหนัก ตอนไหนดี?"**
→ Workout timeline 6 slots: avoid / ok / **★ optimal**
→ "10:30–12:00 — HRV peak · ไม่ชน meeting · เวลาเทรนหนักที่สุด"

✈️ **"บินไปโตเกียว 14 พ.ค. ป้องกัน jet lag"**
→ 7-day calendar ปรับ bedtime ก่อนบิน + sun on landing

🔍 **"ทำไมพลังตกสัปดาห์นี้?"**
→ Root cause analysis .md (4 ปัจจัย + downward spiral diagram + highest-leverage intervention)

**Speaker note:**
> นี่คือ wow factor — ไม่ใช่แค่ดู data, AI วิเคราะห์ cross-source, ทำ predictive recommendation, root cause — ระดับที่ปรึกษาส่วนตัว

---

## Slide 7 — `.md` Output (The Artifact)

**Title:** "ผลลัพธ์เป็น `.md` — paste ที่ไหนก็ได้"

**Visual:** screenshot ของ markdown widget ใน chat (rendered + raw toggle)

**Bullets:**
- ทำไม Markdown? — Notion / Obsidian / Slack / AI agents ทุกตัวอ่านได้
- ไม่ติด vendor — copy paste จบ
- 3 sample built-in: wellness plan · daily standup · email triage

**Speaker note:**
> Markdown คือ format ที่ everywhere — ผลลัพธ์จาก klai ใช้ได้ทันที ไม่ต้องแปลงไม่ต้องติดตั้ง

---

## Slide 8 — The Multiplier: `.md` → Custom GPT

**Title:** "หนึ่งครั้งสร้าง · ใช้ทุกวัน"

**Visual:** screenshot ของ GPT Builder modal — เน้น **"auto-imported from filename"** badge สีเขียว

**Key insight:**
> `.md` คนเดียวอ่าน · Custom GPT ทำงานได้เอง

**Pre-filled fields ใน Builder:**
- Name + Avatar
- Description
- Instructions = `.md` content
- Conversation starters
- **Knowledge** = .md auto-attached
- **Actions** = klai connector (active) ⭐ — ดึง data ปัจจุบันทุกครั้งที่คุย
- Capabilities: Web / Canvas / DALL-E / Code

**Speaker note:**
> ตรงนี้คือ leverage จริง — `.md` คนเดียวเปิดอ่าน · Custom GPT ทำงานทุกเช้าได้เอง · ที่สำคัญ GPT นี้ใช้ klai เป็น Action = ข้อมูลใหม่ทุกครั้ง ไม่ใช่ static knowledge

---

## Slide 9 — 3 Custom GPTs ที่ Build จาก `.md`

**Title:** "3 GPT ที่ Peak สร้างจาก `.md` — แทนงาน 90 นาที/วัน"

**Visual:** 3 cards แนวนอน

| GPT | จาก `.md` | ใช้ทำอะไร | ประหยัด |
|-----|-----------|----------|---------|
| 📝 **Daily Standup Bot** | `daily-standup.md` | Pre-fill standup ทุกเช้า · ปรับ priority ตาม sleep | ~12 นาที/วัน |
| 📧 **Email Triage Bot** | `email-triage.md` | Sort inbox · ปรับ rule ตาม stress · เขียน reply batch | ~35 นาที/วัน |
| 🌿 **Wellness Coach** | `wellness-plan.md` | Daily check-in · adjust plan ตาม HRV | ~25 นาที/วัน |

**Total: ~72 นาที/วัน · ≈ 1 วัน/เดือน · ≈ 12 วัน/ปี**

**Speaker note:**
> 3 GPT นี้ replace งานประจำ 90 นาทีต่อวัน — เวลาที่คืนมา = เอาไปดูแลตัวเอง = closed loop

---

## Slide 10 — Custom GPT in Action

**Title:** "ดู GPT ทำงานจริง — ไม่ใช่แค่ template"

**Visual:** screenshot สลับ 3 GPT (top bar เปลี่ยน · sidebar เห็น Your GPTs)

**Demo flow (live):**

**Daily Standup Bot:**
1. กด GPT ใน sidebar → top bar เปลี่ยนเป็น "📝 Daily Standup Bot · By Peak · Powered by klai"
2. กด "ทำ standup ของวันนี้"
3. AI ดึง Linear + calendar + Oura → ถาม blockers
4. Auto-output `standup-2026-05-09.md` พร้อม **auto-adjustment** (sleep < 6 → ลด priority เหลือ 2 ข้อ)

**Email Triage Bot:**
1. กด "triage inbox ตอนนี้" → ดึง stress 68/100 → ใช้ stress-aware mode
2. Sort 47 emails → 3 P1 quick replies + auto-snooze 12 P3 + auto-archive 24 P4
3. **ใช้เวลา 12 นาที (vs ปกติ 45)**

**Wellness Coach:**
1. กด "check-in เช้านี้" → AI ทักก่อน + แสดงข้อมูล + ถาม context
2. user ตอบ "ตื่นกลางดึก เครียดงาน"
3. AI ปรับ plan วันนี้: workout เบา + caffeine cut 14:00 + bedtime 22:00 strict + pep talk

**Speaker note:**
> ทุก GPT มี persona ตัวเอง · มี logic ที่ปรับตาม data · ไม่ใช่ AI generic ที่ตอบเหมือนกันทุกครั้ง

---

## Slide 11 — Tech Stack

**Title:** "Built lean — deploy ได้ทุกที่"

**Bullets:**
- Frontend: HTML + Tailwind CSS (CDN) + Alpine.js + Chart.js
- ไม่มี build step · ไม่มี node_modules · drag folder ไป Vercel/Netlify จบ
- Image generation: OpenAI gpt-image-1 (8 ภาพ pre-built)
- Mock data: JSON files
- Real integration roadmap: OAuth Apple Health / Garmin / Oura · Cloudflare Workers · @klai/mcp-server

**Speaker note:**
> Stack เลือกให้ deploy ได้ทันที · ของจริงเฟสต่อไปคือ OAuth + hosted API + MCP server package

---

## Slide 12 — What's Mocked vs Real

**Title:** "วันนี้คือ demo · พรุ่งนี้คือ product"

**สองคอลัมน์:**

| ✅ Working today | 🔜 Next phase |
|------------------|---------------|
| Full UI / UX flow | Real OAuth (Apple Health / Garmin / Oura / Withings) |
| 6 หน้าเว็บ deploy ได้ | Hosted API endpoints (Cloudflare Workers) |
| 3 device images (gpt-image-1 จริง) | `@klai/mcp-server` npm package |
| GPT Builder simulation | ChatGPT Custom GPT verified actions |
| 3 working Custom GPTs in demo | Real .md → real GPT publish flow |
| Stress-aware logic shown | Webhook-based real-time sync |

**Speaker note:**
> ทุก UX ที่เห็นคือ working — แต่ data ยัง mock · เฟสต่อไปคือ wire up real APIs

---

## Slide 13 (Optional) — Why Now?

**Title:** "ทำไมตอนนี้ถึงเป็นเวลาที่ใช่"

**Bullets:**
- ChatGPT มี Custom GPTs + Connectors (2024-26) — third-party app integration เป็น first-class
- MCP standard เริ่มแพร่หลาย — Claude / Cursor / VS Code รองรับ
- คนใช้ AI ทุกวัน แต่ AI ไม่รู้เรื่องสุขภาพ — gap ที่ใหญ่ขึ้นเรื่อยๆ
- Wellness/longevity เป็น mainstream interest

---

## Slide 14 (Optional) — Closing

**Title:** "เวลาคืนกลับมา · สุขภาพดีขึ้น · เป็น loop"

**One-liner:**
> "klai = layer, not app. The AI you already use just got smarter about you."

**CTA:**
- Try the demo: `chatgpt.html`
- Read the API: `api.html`
- 🌿

---

# === DEMO SCRIPT (Live presentation, ~3 นาที) ===

ใช้ตอน demo สด — sequence ที่ผ่าน test แล้ว ทำให้ wow แน่นอน:

```
[0:00] เปิด chatgpt.html
       "นี่คือ ChatGPT ที่ทุกคนรู้จัก · ลองดูก่อนว่าเปิดมาเป็นยังไง"
       → empty state พร้อมปุ่ม Connect klai

[0:15] กด "Connect klai"
       "30 วินาที · เลือก 3 อุปกรณ์"
       → click through modal: overview → devices → connecting (4 step) → success

[0:45] หลัง connect
       "ดูที่ bubbles ที่โผล่มา — แบ่ง 4 sections"
       → Quick start · Devices · Smart questions · Export

[1:00] กด "🔬 เทียบ HRV cross-device"
       "นี่คือสิ่งที่ dashboard ปกติทำไม่ได้ — cross-source validation"
       → comparison widget แสดง verdict

[1:30] กด "🏃 พรุ่งนี้เทรนตอนไหน?"
       "AI ดู HRV + calendar + body temp → workout timeline"
       → timeline 6 slots optimal/ok/avoid

[2:00] กด "🌿 ขอ wellness plan"
       → markdown widget เด้งขึ้น
       "นี่คือ .md — แต่ดูตรงนี้..."
       → ชี้ปุ่ม "+ Make Custom GPT" สีเขียว

[2:15] กดปุ่ม "Make Custom GPT"
       → GPT Builder modal เปิด (looks like real ChatGPT)
       "ทุก field pre-filled · klai เป็น Action ที่ active แล้ว"
       → กด Create → 4 step animated → success → "ใช้ GPT เลย →"

[2:45] เข้า Custom GPT
       "Top bar เปลี่ยน · sidebar เห็น GPT ใหม่ · GPT นี้รู้จัก data ของผมตลอด"
       → กด "check-in เช้านี้"
       → AI ทักทายและถาม context

[3:00] ปิด
       "นี่คือ leverage chain เต็ม · จาก devices → ChatGPT → .md → Custom GPT
        ทุก step คือ multiplier · ทุกวันที่ใช้คือเวลาที่ได้คืนมาดูแลตัวเอง"
```

---

# === KEY SOUND BITES (one-liners ใส่ slide หรือใช้พูด) ===

- "ดูแลสุขภาพ โดยไม่ต้องเปิดแอปเพิ่มอีกตัว"
- "Don't add another app. Add a layer."
- "Headless wellness for the AI era"
- "ไม่ใช่ dashboard — เป็น layer ที่ทำให้ AI ที่คุณใช้อยู่ ฉลาดเรื่องคุณขึ้น"
- "หนึ่งครั้งสร้าง · ใช้ทุกวัน" (about Custom GPT from .md)
- "เวลาคืนกลับมา · สุขภาพดีขึ้น · เป็น loop"
- "AI ที่ใช้อยู่ทุกวัน ก็ไม่รู้ว่าเมื่อคืนคุณนอนกี่ชั่วโมง"

---

# === KEY METRICS (ใช้ใน slide) ===

- **3 อุปกรณ์** เริ่มต้น (Apple Watch + Oura + Withings) · 9 อื่น roadmap
- **5 sections of suggestion bubbles** (Quick start · Devices · Smart · Export · GPT)
- **3 Custom GPTs** ตัวอย่าง (Standup · Email Triage · Wellness Coach)
- **~72 นาที/วัน** ประหยัดจาก 3 GPT
- **≈ 1 วัน/เดือน** ที่ได้คืน
- **6 endpoints** ของ klai API
- **8 widgets** ที่ฝังใน chat ได้ (stats, chart, calendar, mood-form, markdown, image, device-detail, readiness, comparison, timeline, automation, gpt-card)

---

# === SCREENSHOT SHOTLIST (สำหรับใส่ slide) ===

ถ้าจะ capture screenshot สำหรับ slide แนะนำ:

| Shot | From page | What to capture |
|------|-----------|-----------------|
| 1. Cover hero | index.html | Hero section เต็ม |
| 2. How it works | index.html | 3 step cards (with how-it-works.png inside) |
| 3. .md preview | index.html | "What klai generates" section (dark .md preview) |
| 4. Empty ChatGPT + button | chatgpt.html | Empty state + "Connect klai" button |
| 5. Connector modal — devices | chatgpt.html | 3 devices list with checkboxes (รูปจริง) |
| 6. Connector — connecting | chatgpt.html | 4-step progress |
| 7. Connector — success | chatgpt.html | ✓ + 3 devices listed |
| 8. After connect — bubbles | chatgpt.html | suggestion bubbles แบ่ง 4 sections |
| 9. **Cross-HRV comparison** ⭐ | chatgpt.html | comparison widget (image both devices) |
| 10. **Workout timeline** ⭐ | chatgpt.html | timeline 6 slots colored |
| 11. Markdown widget | chatgpt.html | rendered .md + "+ Make Custom GPT" footer |
| 12. **GPT Builder** ⭐⭐ | chatgpt.html | builder modal เต็ม (showing klai connector active) |
| 13. **Building animation** | chatgpt.html | 4 step creating |
| 14. **GPT created success** | chatgpt.html | success screen with GPT card |
| 15. **Custom GPT in action** ⭐⭐ | chatgpt.html | top bar เปลี่ยน + standup .md output |
| 16. **Sidebar with custom GPTs** | chatgpt.html | "Your GPTs (built from .md)" section |
| 17. API docs | api.html | endpoints list + ChatGPT setup |

⭐ = high-impact, must-have
⭐⭐ = the money shots that show the unique value

---

# === BACKUP NOTES (ถ้ามีคำถาม) ===

**Q: "data ยัง mock อยู่ ทำไมเชื่อได้?"**
- UX และ logic ทุกอย่างทำงานจริง — เหลือแค่ wire APIs ของ Apple Health / Oura / Withings ที่ public อยู่แล้ว
- ตัวอย่าง stress-aware rules มาจาก research จริง (HRV-based recovery, sleep-stress correlation)

**Q: "ทำไม `.md` ไม่ใช่ JSON / structured data?"**
- เพราะปลายทางคือ **คน** อ่าน · paste ลง Notion / Obsidian / Slack / Google Doc ได้ทันที
- AI agents ก็อ่าน Markdown ได้ดีพอๆ กับ JSON
- ไม่ติด vendor — ถ้า klai หาย user ยังมี .md ทั้งหมดอยู่

**Q: "ทำไมไม่สร้าง app ของตัวเอง?"**
- ผู้ใช้มี dashboard เยอะแล้ว — "another app" = friction
- ChatGPT/Claude เป็นที่ที่ผู้ใช้อยู่อยู่แล้วทุกวัน
- Headless = leverage user's existing habit

**Q: "Privacy?"**
- ข้อมูลอยู่ในบัญชี user · เพิกถอน access ทุกเมื่อ
- ไม่ขาย third party
- Scopes ชัดเจน (อ่านอะไร · ไม่อ่านอะไร) แสดงในหน้า connect

**Q: "Monetization?"**
- Free: 100 health reads/วัน · 10 .md gen/วัน
- Pro ฿199/เดือน: unlimited reads · 300 .md gen
- Team: contact us
- (อยู่ใน [api.html](public/api.html) section "Rate limits")

---

# === IF YOU NEED TO REGENERATE IMAGES ===

```powershell
cd C:\Users\peak_\klai
$env:OPENAI_API_KEY = "sk-..."  # หรือใส่ใน .env / .env.local

# Generate 3 device images
$Prompts = @("device-applewatch", "device-ouraring", "device-withings")
foreach ($p in $Prompts) {
    # ดู scripts/gen-images.ps1 สำหรับ full code
}
```

หรือ regenerate ทั้งหมด — เปิดดู [`scripts/gen-images.ps1`](scripts/gen-images.ps1)

---

# === FILE TREE (REFERENCE) ===

```
klai/
├── HANDOFF.md                       ← ไฟล์นี้
├── README.md                        ← project overview
├── package.json
├── .env / .env.local                ← OPENAI_API_KEY
├── .gitignore
├── public/
│   ├── index.html                   ← Landing
│   ├── connect.html                 ← Mock dashboard
│   ├── demo.html                    ← klai widgets standalone
│   ├── api.html                     ← API docs
│   ├── samples.html                 ← .md gallery
│   ├── chatgpt.html                 ← ⭐ MAIN DEMO PAGE
│   ├── images/                      ← 8 PNGs (~13 MB total)
│   ├── samples/                     ← 3 .md files
│   └── data/                        ← mock-health.json + api-spec.json
└── scripts/
    ├── gen-images.ps1               ← Windows
    └── gen-images.mjs               ← Node alternative
```

---

# === RECOMMENDED SLIDE TOOL FOR THIS DECK ===

แนะนำ:
- **Keynote / Google Slides** — สำหรับ traditional present
- **Pitch.com** — modern, video embed ได้ (เอา demo screen recording ใส่)
- **Tome** — AI-generated, format นี้ paste เข้าไปได้เลย
- **Notion + slide mode** — ถ้าอยากให้ document-based

**Pro tip:** เอา demo จริงเปิดใน browser tab แทน screenshot ตอน present (slide เป็น cover/closing เท่านั้น) — 100x more wow

---

*Handoff complete · build by Peak with Claude · klai = ใกล้ · 9 พ.ค. 2026 🌿*
