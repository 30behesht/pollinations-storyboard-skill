#!/usr/bin/env node
/**
 * Generate a multi-scene storyboard (JSON plan + PNG panels + MP3 narration + HTML viewer)
 * using the Pollinations API. Requires POLLINATIONS_API_KEY (from `npx @pollinations/cli login`).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const apiKey = process.env.POLLINATIONS_API_KEY;
if (!apiKey) {
    console.error("Set POLLINATIONS_API_KEY (or run `npx @pollinations/cli login`).");
    process.exit(1);
}

const topic = process.argv.slice(2).join(" ") || "A tiny robot discovering a bioluminescent garden at night";
const outDir = join(process.cwd(), "storyboard");
mkdirSync(outDir, { recursive: true });

const planRes = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
        model: "openai",
        response_format: { type: "json_object" },
        messages: [
            {
                role: "system",
                content:
                    'Return JSON: { "style_anchor": string, "scenes": [{ "title": string, "visual_prompt": string, "narration": string }] } with 4 scenes.',
            },
            { role: "user", content: `Create a 4-scene storyboard for: ${topic}` },
        ],
    }),
});
if (!planRes.ok) throw new Error(`Plan request failed (${planRes.status})`);
const planData = await planRes.json();
const plan = JSON.parse(planData.choices[0].message.content);
writeFileSync(join(outDir, "plan.json"), JSON.stringify(plan, null, 2));

const panels = [];
for (let i = 0; i < plan.scenes.length; i++) {
    const scene = plan.scenes[i];
    const num = String(i + 1).padStart(2, "0");
    const imgPrompt = `${plan.style_anchor}. ${scene.visual_prompt}`;
    const imgRes = await fetch(
        `https://gen.pollinations.ai/image/${encodeURIComponent(imgPrompt)}?width=1280&height=720&seed=${4242 + i}&nologo=true`,
        { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    if (!imgRes.ok) throw new Error(`Image ${num} failed (${imgRes.status})`);
    const imgName = `scene-${num}.png`;
    writeFileSync(join(outDir, imgName), Buffer.from(await imgRes.arrayBuffer()));

    const audioRes = await fetch(
        `https://gen.pollinations.ai/audio/${encodeURIComponent(scene.narration)}?voice=alloy`,
        { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    if (!audioRes.ok) throw new Error(`Audio ${num} failed (${audioRes.status})`);
    const audioName = `scene-${num}.mp3`;
    writeFileSync(join(outDir, audioName), Buffer.from(await audioRes.arrayBuffer()));

    panels.push({ ...scene, imgName, audioName });
}

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Storyboard</title>
<style>body{font-family:system-ui,sans-serif;background:#0b0f19;color:#f1f5f9;max-width:960px;margin:2rem auto;padding:0 1rem}
.panel{background:#131a2a;border:1px solid #26324d;border-radius:12px;padding:1rem;margin-bottom:1.5rem}
img{width:100%;border-radius:8px}audio{width:100%;margin-top:.5rem}</style></head>
<body><h1>${topic}</h1>
${panels.map((p, idx) => `<section class="panel"><h2>Scene ${idx + 1}: ${p.title}</h2><img src="${p.imgName}" alt="${p.title}"><p>${p.narration}</p><audio controls src="${p.audioName}"></audio></section>`).join("")}
</body></html>`;
writeFileSync(join(outDir, "index.html"), html);
console.log(`Generated ${panels.length} scenes in ${outDir}`);
