<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()
function scrollToAbout() {
  const el = document.getElementById('about')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  else router.push('/').then(() => setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 150))
}
</script>

<template>
  <section id="home" class="hero-section">
    <!-- Aurora background orbs -->
    <div class="orb orb-1" aria-hidden="true" />
    <div class="orb orb-2" aria-hidden="true" />
    <div class="orb orb-3" aria-hidden="true" />

    <div class="container hero-inner">
      <div class="hero-content fade-in-up">
        <div class="hero-eyebrow">
          <span class="eyebrow-dot" />
          <span>後端工程師 · 技術分享者</span>
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

      <div class="hero-visual" aria-hidden="true">
        <div class="code-card glass">
          <div class="code-card-header">
            <span class="dot red" /><span class="dot yellow" /><span class="dot green" />
            <span class="code-filename">DeveloperService.cs</span>
          </div>
          <div class="code-body">
            <div class="code-line"><span class="kw">public class</span> <span class="fn">DeveloperService</span></div>
            <div class="code-line">{</div>
            <div class="code-line indent"><span class="kw">private readonly string</span> <span class="str">_name</span> = <span class="val">&quot;RShinz&quot;</span>;</div>
            <div class="code-line indent"><span class="kw">private readonly int</span> <span class="str">_exp</span> = <span class="val">10</span>;</div>
            <div class="code-line">&nbsp;</div>
            <div class="code-line indent"><span class="kw">public</span> <span class="fn">IEnumerable</span>&lt;<span class="kw">string</span>&gt;</div>
            <div class="code-line indent2"><span class="fn">GetSkills</span>() =&gt; [</div>
            <div class="code-line indent3"><span class="val">&quot;C# / .NET&quot;</span>,</div>
            <div class="code-line indent3"><span class="val">&quot;SQL Server&quot;</span>,</div>
            <div class="code-line indent3"><span class="val">&quot;Vue.js&quot;</span>,</div>
            <div class="code-line indent2">];</div>
            <div class="code-line">}</div>
          </div>
        </div>

        <!-- floating chips -->
        <div class="chip chip-1 glass">⚡ Vue 3</div>
        <div class="chip chip-2 glass">🦾 C# .NET</div>
        <div class="chip chip-3 glass">🗄️ SQL Server</div>
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
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: rgba(96, 165, 250, 0.1);
  top: -100px;
  right: -100px;
  animation: float 10s ease-in-out infinite;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: rgba(168, 85, 247, 0.12);
  bottom: 0;
  left: -80px;
  animation: float 14s ease-in-out infinite reverse;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: rgba(96, 165, 250, 0.07);
  bottom: 30%;
  right: 35%;
  animation: float 8s ease-in-out infinite 2s;
}

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

/* Left */
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--grad-glow);
  border: 1px solid var(--border-glow);
  border-radius: var(--radius-full);
  padding: 0.35rem 0.9rem;
  font-size: 0.78rem;
  color: var(--accent);
  font-weight: 500;
  margin-bottom: 1.25rem;
  backdrop-filter: blur(8px);
}

.eyebrow-dot {
  width: 7px;
  height: 7px;
  background: var(--accent);
  border-radius: 50%;
  animation: pulse-glow 2.5s ease-in-out infinite;
}

.hero-name {
  font-size: clamp(2.8rem, 5.5vw, 4.5rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 1.25rem;
}

.hero-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.85;
  max-width: 480px;
  margin-bottom: 2rem;
}

.hero-cta {
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
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
  padding: 0.6rem 1.1rem;
  border-radius: var(--radius-lg);
  gap: 0.1rem;
  min-width: 72px;
}

.stat-num {
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1;
}

.stat-label {
  font-size: 0.68rem;
  color: var(--text-muted);
  white-space: nowrap;
}

/* Right - code card */
.hero-visual {
  position: relative;
}

.code-card {
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(96,165,250,0.08),
    0 24px 64px rgba(0, 0, 0, 0.5);
}

.code-card-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  background: rgba(0,0,0,0.2);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

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
}

.code-line { color: var(--text-secondary); }
.indent  { padding-left: 1.5rem; }
.indent2 { padding-left: 3rem; }
.indent3 { padding-left: 4.5rem; }
.kw { color: #c792ea; }
.fn { color: #82aaff; }
.str { color: #89ddff; }
.val { color: #c3e88d; }

/* Floating chips */
.chip {
  position: absolute;
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}

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
  width: 1px;
  height: 40px;
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
