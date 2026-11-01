// Requirements parsing, snapshots, slots, the licence guard and redaction.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { liveRequirements, parseRequirements, SNAPSHOTS } from '../content/kit-facts.ts';
import { repoAvailable, REPO, FIXTURES } from '../content/paths.ts';
import { glob, resolveSlots } from '../content/slots.ts';
import { checkProvenance } from '../content/licence.ts';
import { redact, scan } from '../content/redact.ts';

test('parseRequirements reads the section 1 table only', () => {
  const md = '# T\n\n## 1. Check\n\n| Need | Minimum | Notes |\n|---|---|---|\n| GPU | NVIDIA, 12 GB | tuned |\n| Disk | 40 GB | |\n\n## 2. Next\n\n| Need | Minimum |\n|---|---|\n| no | no |\n';
  assert.deepEqual(parseRequirements(md), [
    { order: 0, need: 'GPU', minimum: 'NVIDIA, 12 GB', notes: 'tuned' },
    { order: 1, need: 'Disk', minimum: '40 GB', notes: '' },
  ]);
  assert.throws(() => parseRequirements('# no section'), /no "## 1\."/);
});

test('requirements snapshot matches BOOTSTRAP.md (run sync-kit-facts.ts if this fails)', { skip: !repoAvailable() }, () => {
  assert.deepEqual(JSON.parse(readFileSync(SNAPSHOTS.requirements, 'utf8')), liveRequirements());
  assert.ok(liveRequirements().some((r) => r.need === 'GPU' && /NVIDIA/.test(r.minimum)));
});

test('glob: segments, wildcards and braces', () => {
  const hits = glob(FIXTURES, 'images/g3-*-{390,1920}.png').map((p) => p.slice(FIXTURES.length + 1).replace(/\\/g, '/'));
  assert.deepEqual(hits, ['images/g3-dry-run-home-1920.png', 'images/g3-dry-run-home-390.png']);
});

test('slots: pending, filled and strict modes', () => {
  const pending = resolveSlots('pending', false);
  assert.ok(Object.values(pending).every((s) => s.status === 'pending' && s.items.length === 0));
  const filled = resolveSlots('filled', false);
  assert.ok(Object.values(filled).every((s) => s.status === 'filled' && s.items.every((i) => i.alt.length > 0)));
  assert.deepEqual(filled['g2-key-art'].items[0].provenance?.workflows.map((w) => w.slice(0, 4)), ['WEB1']);
  assert.throws(() => resolveSlots('pending', true), /STRICT_SLOTS=1/);
  assert.throws(() => resolveSlots('filled', true), /fixture images/, 'stand-ins never pass a release build');
  delete process.env.CONTENT_SLOTS;
  assert.ok(Object.values(resolveSlots(undefined, false)).every((s) => s.items.every((i) => !i.src.includes('fixtures'))), 'default mode never uses fixtures');
});

test('licence guard walks nested provenance', () => {
  const allowed = { klein: 'allowed' as const };
  const boards = { klein: 'boards-only' as const };
  const kleinUpscale = { workflow: 'WEB6b Upscale', upscale_model: 'RealESRGAN_x4plus.pth', licence: 'BSD-3-Clause',
    source_provenance: { workflow: 'WEB1 Klein - Key Art', model: 'flux3_image_klein_int8_convrot.safetensors', licence: 'FLUX Kommunity License v1.0' } };
  assert.equal(checkProvenance(kleinUpscale, allowed).ok, true);
  assert.match(checkProvenance(kleinUpscale, boards).problems.join(), /boards-only/);

  const deepUltra = { workflow: 'WEB6b Upscale', source_provenance: JSON.stringify({ workflow: 'WEB3 Z-Image', source_provenance: { workflow: 'WEB6 Upscale (boards)', upscale_model: '4x-UltraSharp.safetensors' } }) };
  const v = checkProvenance(deepUltra, allowed);
  assert.equal(v.ok, false);
  assert.match(v.problems.join('\n'), /WEB6 Upscale/);
  assert.match(v.problems.join('\n'), /source_provenance\.source_provenance\.upscale_model/);

  assert.equal(checkProvenance({ model: 'z_image_turbo' }, allowed).ok, false, 'no workflow recorded');
});

test('redaction: real strings go, safe strings stay', () => {
  const root = 'F:\\ArtGen\\Website Test';
  const cases: Array<[string, string]> = [
    ['see F:\\ArtGen\\Website Test\\BOOTSTRAP.md now', 'see BOOTSTRAP.md now'],
    ['F:/ArtGen/Website Test/projects/how-it-works/BRIEF.md', 'projects/how-it-works/BRIEF.md'],
    ['worktrees in F:/ArtGen/Website Test.worktrees', 'worktrees in <repo>.worktrees'],
    ['/f/ArtGen/Website Test/tools/lib.mjs', 'tools/lib.mjs'],
    ['python at C:\\Users\\sam\\AppData\\Local\\Python\\python.exe', 'python at <local path>'],
    ['git bash /c/Users/sam/AppData/Local/Temp ok', 'git bash <local path> ok'],
    ['linux /home/alex/comfy/main.py', 'linux <local path>'],
    ['thread thread:mcp:406317ba-0bfb-4435-b210-2935ffdb7cad:team-setup-2026-11-01:2 sent', 'thread <thread> sent'],
    ['env 07d2d828-3e5c-4e09-b5de-5d1a274a8d72', 'env <id>'],
    ['mail someone@example.com', 'mail <email>'],
  ];
  for (const [input, want] of cases) assert.equal(redact(input, root), want, input);
  for (const keep of ['commit 2bfed09 and 062f2ca1e4b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5', 'https://docs.github.com/en/pages', 'ratio 4.5:1 and 16:9', 'node tools/variants.mjs dev all', 'and/or a/b']) {
    assert.equal(redact(keep, root), keep, keep);
    assert.deepEqual(scan(keep), [], keep);
  }
  assert.ok(scan('F:/ArtGen/x and someone@example.com').length === 2);
});

test('this repo root redacts too (when checked out)', { skip: !repoAvailable() }, () => {
  assert.equal(redact(`${REPO}${REPO.includes('\\') ? '\\' : '/'}BOOTSTRAP.md`, REPO), 'BOOTSTRAP.md');
});

test('fixture sidecars carry no machine paths or ids', () => {
  for (const f of ['g2-key-art-klein.json', 'g2-key-art-zimage.json']) {
    const text = readFileSync(join(FIXTURES, 'images', f), 'utf8');
    assert.deepEqual(scan(text), [], f);
  }
});

test('inlineMd: escapes first, then code, bold, italic and https links only', async () => {
  const { inlineMd } = await import('../content/inline-md.ts');
  assert.equal(inlineMd('use `--skip-comfyui` **untested** *now*'), 'use <code>--skip-comfyui</code> <strong>untested</strong> <em>now</em>');
  assert.equal(inlineMd('<script>x</script> `<b>`'), '&lt;script&gt;x&lt;/script&gt; <code>&lt;b&gt;</code>');
  assert.equal(inlineMd('[docs](https://x.dev/a) [bad](javascript:alert(1))'), '<a href="https://x.dev/a">docs</a> [bad](javascript:alert(1))');
});
