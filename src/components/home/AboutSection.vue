<script setup lang="ts">
const experiences = [
  {
    period: '2014 — 至今',
    role: '後端工程師 / 技術顧問',
    desc: '使用 C#/.NET 協助各產業客戶開發企業系統，涵蓋倉庫管理、點餐系統、會員系統、網路爬蟲及感測器數據收集等多元專案。',
  },
]

const education = [
  {
    period: '碩士',
    role: '國立屏東大學 — 資訊科學研究所',
    desc: '深入研究資訊科學理論與應用。',
  },
  {
    period: '學士',
    role: '國立屏東大學 — 資訊科學系',
    desc: '奠定紮實的程式設計與資料結構基礎。',
  },
]
</script>

<template>
  <section id="about" class="section about-section">
    <div class="container">
      <h2 class="section-title">關於我</h2>
      <p class="section-subtitle">10 年以上的系統開發經歷</p>

      <div class="about-grid">
        <div class="timeline-block">
          <h3 class="block-heading">工作經歷</h3>
          <div v-for="(exp, i) in experiences" :key="i" class="timeline-item">
            <div class="timeline-dot" />
            <div class="timeline-content">
              <span class="timeline-period">{{ exp.period }}</span>
              <strong>{{ exp.role }}</strong>
              <p>{{ exp.desc }}</p>
            </div>
          </div>
        </div>

        <div class="timeline-block">
          <h3 class="block-heading">學歷</h3>
          <div v-for="(edu, i) in education" :key="i" class="timeline-item">
            <div class="timeline-dot" />
            <div class="timeline-content">
              <span class="timeline-period">{{ edu.period }}</span>
              <strong>{{ edu.role }}</strong>
              <p>{{ edu.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.block-heading {
  font-size: 1rem;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 20px;
  bottom: -2rem;
  width: 1px;
  background: var(--border);
}

.timeline-dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: var(--bg-base);
  border: 2px solid var(--accent-dim);
  flex-shrink: 0;
  margin-top: 4px;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.timeline-period {
  font-size: 0.78rem;
  color: var(--accent);
  font-weight: 500;
}

.timeline-content strong {
  font-size: 0.95rem;
  color: var(--text-primary);
}

.timeline-content p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

@media (max-width: 768px) {
  .about-grid { grid-template-columns: 1fr; gap: 2rem; }
}
</style>
