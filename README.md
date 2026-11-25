# Pollinations Storyboard Director (Agent Skill)

[![Made with pollinations.ai](https://raw.githubusercontent.com/pollinations/pollinations/main/packages/ui/src/brand/badge-made-with.svg)](https://pollinations.ai/?ref=badge)

An [Agent Skills](https://agentskills.io)-compatible skill (`SKILL.md`) that turns any prompt into a cohesive, illustrated, and narrated multi-scene storyboard using Pollinations image, text, and audio models via `@pollinations/cli`.

## Install

Copy `SKILL.md` into your agent's skills directory (e.g., `.agents/skills/pollinations-storyboard/SKILL.md` or `~/.claude/skills/pollinations-storyboard/SKILL.md`) and authenticate with:

```bash
npx @pollinations/cli login
```

## What It Produces
1. `storyboard/plan.json` — character/style anchor + scene-by-scene breakdown
2. `storyboard/scene-XX.png` — style-consistent illustrations
3. `storyboard/scene-XX.mp3` — voiceover narration per scene
4. `storyboard/index.html` — interactive storyboard player with auto-advance
