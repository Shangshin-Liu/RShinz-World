<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import avatarSrc from '@/assets/images/avatar.png'

const router = useRouter()
function scrollToAbout() {
  const el = document.getElementById('about')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  else router.push('/').then(() => setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 150))
}

// ── 互動 Code Card ────────────────────────────────────────────
type TabId = 'csharp' | 'javascript' | 'sql'
type Token = { cls?: string; text: string }
type CodeLine = { tokens: Token[]; indent?: 0 | 1 | 2 | 3 }

const activeTab = ref<TabId>('csharp')

interface ChipDef { id: TabId; icon: string; label: string; cls: string }
const chips: ChipDef[] = [
  { id: 'csharp',     icon: '🦾', label: 'C# .NET',    cls: 'chip-1' },
  { id: 'javascript', icon: '⚡', label: 'JavaScript', cls: 'chip-2' },
  { id: 'sql',        icon: '🗄️', label: 'SQL',        cls: 'chip-3' },
]

const codeExamples: Record<TabId, { filename: string; lines: CodeLine[] }> = {
  csharp: {
    filename: 'DeveloperService.cs',
    lines: [
      { tokens: [{ cls: 'kw', text: 'public class' }, { text: ' ' }, { cls: 'fn', text: 'DeveloperService' }] },
      { tokens: [{ text: '{' }] },
      { indent: 1, tokens: [{ cls: 'kw', text: 'private readonly string' }, { text: ' ' }, { cls: 'str', text: '_name' }, { text: ' = ' }, { cls: 'val', text: '"RShinz"' }, { text: ';' }] },
      { indent: 1, tokens: [{ cls: 'kw', text: 'private readonly int' }, { text: '    ' }, { cls: 'str', text: '_exp' }, { text: '  = ' }, { cls: 'val', text: '10' }, { text: ';' }] },
      { tokens: [{ text: '' }] },
      { indent: 1, tokens: [{ cls: 'kw', text: 'public' }, { text: ' ' }, { cls: 'fn', text: 'IEnumerable' }, { text: '<' }, { cls: 'kw', text: 'string' }, { text: '>' }] },
      { indent: 2, tokens: [{ cls: 'fn', text: 'GetSkills' }, { text: '() => [' }] },
      { indent: 3, tokens: [{ cls: 'val', text: '"C# / .NET"' }, { text: ',' }] },
      { indent: 3, tokens: [{ cls: 'val', text: '"SQL Server"' }, { text: ',' }] },
      { indent: 3, tokens: [{ cls: 'val', text: '"Vue.js"' }, { text: ',' }] },
      { indent: 2, tokens: [{ text: '];' }] },
      { tokens: [{ text: '}' }] },
    ],
  },
  javascript: {
    filename: 'developer.js',
    lines: [
      { tokens: [{ cls: 'kw', text: 'const' }, { text: ' ' }, { cls: 'fn', text: 'developer' }, { text: ' = {' }] },
      { indent: 1, tokens: [{ cls: 'str', text: 'name' }, { text: ': ' }, { cls: 'val', text: "'RShinz'" }, { text: ',' }] },
      { indent: 1, tokens: [{ cls: 'str', text: 'lang' }, { text: ': ' }, { cls: 'val', text: "'JavaScript'" }, { text: ',' }] },
      { indent: 1, tokens: [{ cls: 'str', text: 'runtime' }, { text: ': ' }, { cls: 'val', text: "'Node.js'" }, { text: ',' }] },
      { indent: 1, tokens: [{ cls: 'fn', text: 'async' }, { text: ' ' }, { cls: 'fn', text: 'fetchSkills' }, { text: '() {' }] },
      { indent: 2, tokens: [{ cls: 'kw', text: 'const' }, { text: ' res = ' }, { cls: 'kw', text: 'await' }] },
      { indent: 3, tokens: [{ cls: 'fn', text: 'api' }, { text: '.' }, { cls: 'fn', text: 'get' }, { text: '(' }, { cls: 'val', text: "'/skills'" }, { text: ')' }] },
      { indent: 2, tokens: [{ cls: 'kw', text: 'return' }, { text: ' res.' }, { cls: 'str', text: 'data' }] },
      { indent: 1, tokens: [{ text: '},' }] },
      { tokens: [{ text: '}' }] },
    ],
  },
  sql: {
    filename: 'skills_query.sql',
    lines: [
      { tokens: [{ cls: 'kw', text: 'SELECT' }] },
      { indent: 1, tokens: [{ cls: 'str', text: 'e.name' }, { text: ',' }] },
      { indent: 1, tokens: [{ cls: 'fn', text: 'COUNT' }, { text: '(' }, { cls: 'str', text: 'p.id' }, { text: ')  ' }, { cls: 'kw', text: 'AS' }, { text: ' ' }, { cls: 'fn', text: 'projects' }, { text: ',' }] },
      { indent: 1, tokens: [{ cls: 'fn', text: 'AVG' }, { text: '(' }, { cls: 'str', text: 'r.score' }, { text: ') ' }, { cls: 'kw', text: 'AS' }, { text: ' ' }, { cls: 'fn', text: 'avg_rating' }] },
      { tokens: [{ cls: 'kw', text: 'FROM' }, { text: '  ' }, { cls: 'str', text: 'engineers' }, { text: ' ' }, { cls: 'fn', text: 'e' }] },
      { tokens: [{ cls: 'kw', text: 'JOIN' }, { text: '  ' }, { cls: 'str', text: 'projects' }, { text: '  ' }, { cls: 'fn', text: 'p' }, { text: ' ' }, { cls: 'kw', text: 'ON' }, { text: ' p.owner = e.id' }] },
      { tokens: [{ cls: 'kw', text: 'JOIN' }, { text: '  ' }, { cls: 'str', text: 'reviews' }, { text: '   ' }, { cls: 'fn', text: 'r' }, { text: ' ' }, { cls: 'kw', text: 'ON' }, { text: ' r.project = p.id' }] },
      { tokens: [{ cls: 'kw', text: 'WHERE' }, { text: ' ' }, { cls: 'str', text: 'e.name' }, { text: ' = ' }, { cls: 'val', text: "'RShinz'" }] },
      { tokens: [{ cls: 'kw', text: 'GROUP BY' }, { text: ' ' }, { cls: 'str', text: 'e.name' }] },
    ],
  },
}
</script>

<template>
  <section id="home" class="hero-section">
    <!-- Aurora background orbs -->
    <div class="orb orb-1" aria-hidden="true" />
    <div class="orb orb-2" aria-hidden="true" />
    <div class="orb orb-3" aria-hidden="true" />

    <div class="container hero-inner">
      <!-- ── Left ──────────────────────────────────── -->
      <div class="hero-content fade-in-up">

        <!-- Avatar + eyebrow in one row -->
        <div class="hero-intro">
          <div class="avatar-ring">
            <img :src="avatarSrc" alt="阿星的個人照片" class="avatar-img" />
          </div>
          <div class="hero-eyebrow">
            <span class="eyebrow-dot" />
            <span>後端工程師 · 技術分享者</span>
          </div>
        </div>

        <h1 class="hero-name">
          Hi，我是<br />
          <span class="grad-text">阿星</span>
        </h1>
        <p class="hero-desc">
          10 年以上 C#/.NET 開發經歷，協助過各產業客戶打造企業系統，
          同時熱衷 Vue.js 開發與技術知識的傳遞。
        </p>
        <div class="hero-cta">
          <RouterLink to="/blog" class="btn btn-primary">閱讀文章</RouterLink>
          <button class="btn btn-ghost" @click="scrollToAbout">關於我</button>
        </div>

        <!-- Stat pills -->
        <div class="hero-stats">
          <div class="stat-pill glass">
            <span class="stat-num grad-text">10+</span>
            <span class="stat-label">年經驗</span>
          </div>
          <div class="stat-pill glass">
            <span class="stat-num grad-text">多</span>
            <span class="stat-label">產業專案</span>
          </div>
          <div class="stat-pill glass">
            <span class="stat-num grad-text">全</span>
            <span class="stat-label">端開發</span>
          </div>
        </div>
      </div>

      <!-- ── Right: code card + floating chip buttons ── -->
      <div class="hero-visual" aria-hidden="false">
        <div class="code-card glass">
          <div class="code-card-header">
            <span class="dot red" /><span class="dot yellow" /><span class="dot green" />
            <span class="code-filename">{{ codeExamples[activeTab].filename }}</span>
          </div>
          <div class="code-body">
            <Transition name="code-fade" mode="out-in">
              <div :key="activeTab" class="code-lines">
                <div
                  v-for="(line, i) in codeExamples[activeTab].lines"
                  :key="i"
                  :class="['code-line', line.indent ? `indent${line.indent}` : '']"
                >
                  <span
                    v-for="(tok, j) in line.tokens"
                    :key="j"
                    :class="tok.cls"
                  >{{ tok.text }}</span>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Floating chip buttons -->
        <button
          v-for="chip in chips"
          :key="chip.id"
          class="chip glass"
          :class="[chip.cls, { active: activeTab === chip.id }]"
          @click="activeTab = chip.id"
        >
          <span>{{ chip.icon }}</span>
          <span>{{ chip.label }}</span>
        </button>
      </div>
    </div>

    <div class="scroll-hint" aria-hidden="true">
      <span>向下捲動</span>
      <div class="scroll-line" />
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding-top: 64px;
}

/* Aurora orbs */
.orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
.orb-1 { width: 600px; height: 600px; background: rgba(96,165,250,0.1);  top:-100px; right:-100px; animation: float 10s ease-in-out infinite; }
.orb-2 { width: 400px; height: 400px; background: rgba(168,85,247,0.12); bottom:0;   left:-80px;  animation: float 14s ease-in-out infinite reverse; }
.orb-3 { width: 250px; height: 250px; background: rgba(96,165,250,0.07); bottom:30%; right:35%;   animation: float 8s ease-in-out infinite 2s; }

/* Grid */
.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 3rem;
  padding-top: 2rem;
  padding-bottom: 6rem;
  position: relative;
  z-index: 1;
}

/* ── Left ─────────────────────────────────────── */

/* Avatar + eyebrow on same row */
.hero-intro {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.avatar-ring {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  border-radius: 50%;
  padding: 2px;
  background: var(--grad);
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
}
.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 2px solid var(--bg-base);
}
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--grad-glow);
  border: 1px solid var(--border-glow);
  border-radius: var(--radius-full);
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  color: var(--accent);
  font-weight: 500;
  backdrop-filter: blur(8px);
}
.eyebrow-dot {
  width: 7px; height: 7px;
  background: var(--accent);
  border-radius: 50%;
  animation: pulse-glow 2.5s ease-in-out infinite;
}

.hero-name {
  font-size: clamp(2.8rem, 5.5vw, 4.5rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 1rem;
}
.hero-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.85;
  max-width: 480px;
  margin-bottom: 1.75rem;
}
.hero-cta {
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}
.hero-stats {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.stat-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.55rem 1rem;
  border-radius: var(--radius-lg);
  gap: 0.1rem;
  min-width: 68px;
}
.stat-num   { font-size: 1.2rem; font-weight: 800; line-height: 1; }
.stat-label { font-size: 0.68rem; color: var(--text-muted); white-space: nowrap; }

/* ── Right ─────────────────────────────────────── */
.hero-visual { position: relative; }

.code-card {
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(96,165,250,0.08),
    0 24px 64px rgba(0,0,0,0.5);
}
.code-card-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  background: rgba(0,0,0,0.2);
}
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.red    { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green  { background: #27c93f; }
.code-filename {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}
.code-body {
  padding: 1.25rem 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.83rem;
  line-height: 2;
  min-height: 220px;
}
.code-line  { color: var(--text-secondary); white-space: pre; }
.indent1 { padding-left: 1.5rem; }
.indent2 { padding-left: 3rem; }
.indent3 { padding-left: 4.5rem; }
.kw  { color: #c792ea; }
.fn  { color: #82aaff; }
.str { color: #89ddff; }
.val { color: #c3e88d; }

/* Code fade transition */
.code-fade-enter-active,
.code-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.code-fade-enter-from   { opacity: 0; transform: translateY(6px); }
.code-fade-leave-to     { opacity: 0; transform: translateY(-6px); }

/* Floating chip buttons */
.chip {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid var(--border);
  transition: border-color 0.2s, box-shadow 0.2s, color 0.2s;
  user-select: none;
}
.chip:hover {
  border-color: var(--border-glow);
  color: var(--accent);
}
.chip.active {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-glow);
  box-shadow: 0 0 16px rgba(96, 165, 250, 0.25);
}

/* Positions (floating around the card) */
.chip-1 {
  top: -1rem;
  right: -1.5rem;
  animation: float 6s ease-in-out infinite;
}
.chip-2 {
  bottom: 3rem;
  left: -2rem;
  animation: float 8s ease-in-out infinite 1s;
}
.chip-3 {
  bottom: -1rem;
  right: 1rem;
  animation: float 7s ease-in-out infinite 2s;
}

/* Scroll hint */
.scroll-hint {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.72rem;
  z-index: 1;
}
.scroll-line {
  width: 1px; height: 40px;
  background: var(--grad);
  animation: scroll-line 2s ease-in-out infinite;
}
@keyframes scroll-line {
  0%   { transform: scaleY(0); transform-origin: top; }
  50%  { transform: scaleY(1); transform-origin: top; }
  51%  { transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr; padding-bottom: 4rem; }
  .hero-visual { display: none; }
  .scroll-hint { display: none; }
  .hero-name { font-size: clamp(2.5rem, 9vw, 3.5rem); }
}
</style>
