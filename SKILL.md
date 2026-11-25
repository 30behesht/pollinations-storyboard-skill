---
name: pollinations-storyboard
description: Generate a cohesive multi-scene visual storyboard, character sheet, narration script, and voiceover audio using Pollinations AI models via the polli CLI or REST API. Use when the user asks to create a comic, short film storyboard, illustrated story, or narrated visual sequence.
---

# Pollinations Storyboard Director

Turn any story idea, product pitch, or educational concept into a **consistent, illustrated, and narrated multi-scene storyboard** using Pollinations models (`text`, `image`, and `audio`) through `@pollinations/cli` (`polli`) or the Pollinations API.

## Prerequisites

Authenticate once with `polli` (uses Pollinations Pay so users spend from their own balance without copying raw keys into files):

```bash
npx @pollinations/cli login
```

Or set `POLLINATIONS_API_KEY` in the environment.

## Workflow

### 1. Plan the Storyboard & Character Anchor
1. Ask or infer the target **aspect ratio** (`16:9` for video/slides, `1:1` for social, `9:16` for shorts), **art style** (e.g., `cinematic watercolor`, `cel-shaded anime`, `clean editorial vector`), and **scene count** (default: 4–6 scenes).
2. Write a **Character & Style Anchor** — a concise, reusable visual description (subject clothing, palette, lighting, lens) that is prepended verbatim to every scene's image prompt so characters stay consistent across panels.
3. Save the plan to `storyboard/plan.json` with each scene's `id`, `title`, `visual_prompt`, `narration`, and `duration_sec`.

### 2. Generate Scene Images
Generate each panel with a fixed `seed` per project (or incremented `seed + index`) and consistent dimensions:

```bash
npx @pollinations/cli image "<STYLE_ANCHOR>. <SCENE_PROMPT>" \
  --model flux \
  --width 1280 --height 720 \
  --seed 4242 \
  --output storyboard/scene-01.png
```

### 3. Generate Voiceover Narration
Generate matching narration audio for each scene using a Pollinations audio model:

```bash
npx @pollinations/cli audio "<NARRATION_TEXT>" \
  --voice alloy \
  --output storyboard/scene-01.mp3
```

### 4. Assemble Deliverable HTML Viewer
Write a self-contained `storyboard/index.html` that presents all scenes in order with:
- Panel artwork (`scene-01.png`, ...)
- Scene title and caption
- Synchronized `<audio controls>` narration player and a "Play Full Storyboard" auto-advance mode.

## Output Checklist
- `storyboard/plan.json` — structured scene breakdown and prompts
- `storyboard/scene-XX.png` — generated illustrations
- `storyboard/scene-XX.mp3` — generated voiceover clips
- `storyboard/index.html` — playable interactive storyboard viewer
