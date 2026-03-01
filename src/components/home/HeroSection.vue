<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section id="home" class="hero-section">
    <div class="container hero-inner">
      <div class="hero-content fade-in-up">
        <p class="hero-greeting">Hi 👋，我是</p>
        <h1 class="hero-name">阿星</h1>
        <p class="hero-title">
          <span class="typed-text">後端工程師</span>
          <span class="cursor">|</span>
        </p>
        <p class="hero-desc">
          超過 10 年 C#/.NET 開發經歷，專注於企業系統架構設計與實作，
          同時熱衷於分享技術心得與指導學習者。
        </p>
        <div class="hero-cta">
          <a href="#about" class="btn btn-primary">了解更多</a>
          <RouterLink to="/blog" class="btn btn-ghost">閱讀文章</RouterLink>
        </div>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <div class="glow-ring" />
        <div class="code-block">
          <div class="code-line"><span class="kw">const</span> developer = {</div>
          <div class="code-line indent"><span class="str">name</span>: <span class="val">'RShinz'</span>,</div>
          <div class="code-line indent"><span class="str">lang</span>: <span class="val">'C# / Vue.js'</span>,</div>
          <div class="code-line indent"><span class="str">exp</span>: <span class="val">'10+ years'</span>,</div>
          <div class="code-line indent"><span class="str">passions</span>: [</div>
          <div class="code-line indent2"><span class="val">'clean code'</span>,</div>
          <div class="code-line indent2"><span class="val">'mentoring'</span>,</div>
          <div class="code-line indent">],</div>
          <div class="code-line">}</div>
        </div>
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
  background:
    radial-gradient(ellipse 60% 50% at 70% 50%, rgba(88, 166, 255, 0.06) 0%, transparent 70%),
    var(--bg-base);
}

.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 3rem;
  padding-top: 2rem;
  padding-bottom: 4rem;
}

.hero-greeting {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.hero-name {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 800;
  background: linear-gradient(135deg, var(--text-primary) 40%, var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  margin-bottom: 0.5rem;
}

.hero-title {
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  color: var(--accent);
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.cursor {
  animation: blink 1s step-end infinite;
  margin-left: 2px;
}

@keyframes blink {
  50% { opacity: 0; }
}

.hero-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.8;
  max-width: 500px;
  margin-bottom: 2rem;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Visual */
.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.glow-ring {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  border: 1px solid rgba(88, 166, 255, 0.15);
  background: radial-gradient(circle, rgba(88, 166, 255, 0.04) 0%, transparent 70%);
  animation: pulse-glow 4s ease-in-out infinite;
}

.code-block {
  position: relative;
  z-index: 1;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 2;
  min-width: 280px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.code-line { color: var(--text-secondary); }
.indent { padding-left: 1.5rem; }
.indent2 { padding-left: 3rem; }
.kw { color: #ff7b72; }
.str { color: var(--accent-secondary); }
.val { color: #a5d6ff; }

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
  font-size: 0.75rem;
  animation: fadeInUp 1s 0.5s both;
}

.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--accent-dim), transparent);
  animation: scroll-line 2s ease-in-out infinite;
}

@keyframes scroll-line {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  51% { transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

@media (max-width: 768px) {
  .hero-inner {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-desc { margin: 0 auto 2rem; }
  .hero-cta { justify-content: center; }
  .hero-visual { display: none; }
  .scroll-hint { display: none; }
}
</style>
