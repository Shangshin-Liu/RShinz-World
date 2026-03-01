<script setup lang="ts">
import TsumegoGame from '@/components/home/TsumegoGame.vue'
// ── 專業深度 ──────────────────────────────────────────────────────────
const experiences = [
  {
    period: '2022 — 至今',
    role: '全端工程師 / 技術顧問 / 個人開發者',
    desc: '透過團隊接案、家教指導、個人開發等方式，持續精進程式設計能力，並在過程中學習到許多實務經驗',
  },
  {
    period: '2018 — 2022',
    role: '後端工程師',
    desc: '兵役結束後進入職場，從基層做起，學習不同類型的專案開發，並逐漸了解分散式系統應如何設計',
  },
  {
    period: '2016 — 2018',
    role: '研發替代役',
    desc: '結合兵役與所學專長，與政府合作的企業開發系統，並在過程中學習到許多實務經驗',
  },
  {
    period: '2015',
    role: '實習工程師',
    desc: '參與業界實習，學習企業專案程式碼撰寫方式',
  },
  {
    period: '2014',
    role: '資訊助理',
    desc: '參與系上實習活動、協助教授指導學弟妹，並在課餘時間持續學習程式設計',
  },
]

const education = [
  {
    period: '碩士(五年一貫)',
    role: '國立屏東大學 — 資訊科學研究所',
    desc: '僅用一年時間即完成碩士學程，在論文專題中展現理論與實作的結合',
  },
  {
    period: '學士(大二-大四)',
    role: '國立屏東大學 — 資訊科學系',
    desc: '奠定紮實的程式設計概念與相關學科，並於資訊競賽中創意組榮獲第一名',
  },
  {
    period: '學士(大一)',
    role: '國立屏東教育大學 — 機器人學程',
    desc: '探索人生方向，在軟體與韌體中考量前程',
  },
]

// ── 個人面向 ──────────────────────────────────────────────────────────
const lifeMotto = "既來之，則安之"
const devPhilosophy = "在嚴謹中找到最簡單的解決方法"
const advice = "與其後悔當時沒做，不如想做的時候全力以赴，不愧於自己的那份心動"

const hobbies = [
  { icon: '⚫', name: '下圍棋' },
  { icon: '🎹', name: '彈鋼琴' },
  { icon: '🎮', name: '競技遊戲' },
]

const favorites = ['棋靈王', 'CS2', '巔峰極速', '命運好好玩', '新三國']
</script>

<template>
  <section id="about" class="section about-section">
    <div class="container">
      <h2 class="section-title">關於我</h2>
      <p class="section-subtitle">工程師的嚴謹 ✕ 平凡人的浪漫</p>

      <div class="about-grid">
        
        <!-- ================= 左側：專業深度 (Timeline) ================= -->
        <div class="timeline-col">
          <div class="timeline-block">
            <h3 class="block-heading"><span class="block-icon">💼</span> 歷練與實績</h3>
            <div v-for="(exp, i) in experiences" :key="i" class="timeline-item">
              <div class="timeline-line" />
              <div class="timeline-dot" />
              <div class="timeline-content glass">
                <span class="timeline-period">{{ exp.period }}</span>
                <strong>{{ exp.role }}</strong>
                <p>{{ exp.desc }}</p>
              </div>
            </div>
          </div>

          <div class="timeline-block" style="margin-top: 2rem;">
            <h3 class="block-heading"><span class="block-icon">🎓</span> 學習與探索</h3>
            <div v-for="(edu, i) in education" :key="i" class="timeline-item">
              <div class="timeline-line" />
              <div class="timeline-dot" />
              <div class="timeline-content glass">
                <span class="timeline-period">{{ edu.period }}</span>
                <strong>{{ edu.role }}</strong>
                <p>{{ edu.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= 右側：雙面人生 (Cards) ================= -->
        <div class="life-col">
          
          <!-- 語錄卡：哲學 + 態度 + 給自己的話 -->
          <div class="philosophy-card glass">
            <div class="quote-group">
              <div class="quote-label">💡 開發哲學</div>
              <div class="quote-text">「{{ devPhilosophy }}」</div>
            </div>
            <div class="quote-divider" />
            <div class="quote-group">
              <div class="quote-label">🌱 生活態度</div>
              <div class="quote-text">「{{ lifeMotto }}」</div>
            </div>
            <div class="quote-divider" />
            <div class="quote-group">
              <div class="quote-label">💬 給踏上這條路的自己</div>
              <div class="quote-text">「{{ advice }}」</div>
            </div>
          </div>

          <!-- 興趣與娛樂卡片 -->
          <div class="hobbies-card glass">
            <h3 class="card-heading">工作之餘的熱血</h3>
            
            <div class="hobby-tags">
              <div v-for="hobby in hobbies" :key="hobby.name" class="hobby-tag">
                <span class="hobby-icon">{{ hobby.icon }}</span>
                <span>{{ hobby.name }}</span>
              </div>
            </div>

            <div class="favorites-section">
              <div class="fav-label">精神糧食 / 精神時光屋：</div>
              <div class="fav-list">
                <span v-for="(fav, i) in favorites" :key="i" class="fav-item">
                  #{{ fav }}
                </span>
              </div>
            </div>
          </div>

          <!-- 小遊戲：詳棋挑戰 -->
          <div class="game-card glass">
            <TsumegoGame />
          </div>

        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  position: relative;
  padding-top: 6rem;
  padding-bottom: 6rem;
}

/* 雙欄網格 */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-top: 3rem;
  align-items: stretch; /* 雙欄等高，讓右欄能對齊左欄終點 */
}

/* 共用標題 */
.block-heading, .card-heading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  background: var(--grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
}
.block-icon {
  -webkit-text-fill-color: initial;
  background: none;
}

/* ── 左側 Timeline ───────────────────────────── */
.timeline-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem; /* 稍微縮緊，讓 5 條不會太長 */
  position: relative;
}
.timeline-line {
  position: absolute;
  left: 7px;
  top: 20px;
  bottom: -1rem;
  width: 1px;
  background: linear-gradient(to bottom, var(--accent-dim), transparent);
}
.timeline-item:last-child .timeline-line { display: none; }
.timeline-item:last-child { margin-bottom: 0; }

.timeline-dot {
  width: 15px; height: 15px;
  border-radius: 50%;
  background: var(--bg-base);
  border: 2px solid var(--accent);
  flex-shrink: 0;
  margin-top: 6px;
  box-shadow: 0 0 10px rgba(96,165,250,0.4);
}
.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.9rem 1.2rem; /* 內距縮小，5 條更緊湊 */
  border-radius: var(--radius-lg);
  flex: 1;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.timeline-content:hover {
  border-color: var(--border-glow);
  box-shadow: 0 8px 24px rgba(96,165,250,0.1);
  transform: translateX(4px);
}
.timeline-period {
  font-size: 0.73rem;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 0.05em;
}
.timeline-content strong {
  font-size: 0.92rem;
  color: var(--text-primary);
}
.timeline-content p {
  font-size: 0.83rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* ── 右側 生活面向 Cards ─────────────────────── */
.timeline-col {
  display: flex;
  flex-direction: column;
}
.life-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 2.6rem;
  height: 100%; /* 充滿整個左欄高度 */
}

/* Base Card Style */
.life-col > div {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  transition: transform 0.2s, border-color 0.2s;
}
.life-col > div:hover {
  border-color: var(--border-glow);
  transform: translateY(-2px);
}

.game-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: 1.25rem;
  min-height: 0; /* 讓 flex 子元素能縮小，避免撐破左欄 */
  overflow: hidden;
}

/* 1. Philosophy Card */
.philosophy-card {
  justify-content: space-evenly;
  gap: 1rem;
  background: linear-gradient(145deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.6) 100%);
}
.quote-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.quote-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  letter-spacing: 0.05em;
}
.quote-text {
  font-size: 1.05rem;
  color: var(--text-primary);
  font-weight: 500;
  line-height: 1.5;
  font-style: italic;
}
.quote-text--sm {
  font-size: 0.9rem;  /* 給自己的話較長，字稍小 */
  font-style: normal;
  line-height: 1.65;
}
.quote-divider {
  height: 1px;
  background: linear-gradient(90deg, var(--border), transparent);
}

.hobbies-card {
  gap: 0.75rem;
  justify-content: center; /* 卡片拉高時讓內容垂直置中 */
}
.hobbies-card .card-heading {
  margin-bottom: 0.25rem;
}
.hobby-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.hobby-tag {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  color: var(--text-primary);
}
.favorites-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.fav-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.fav-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.8rem;
}
.fav-item {
  font-size: 0.82rem;
  color: var(--accent);
  background: var(--accent-glow);
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
}

/* Responsive */
@media (max-width: 900px) {
  .about-grid { grid-template-columns: 1fr; gap: 3rem; }
  .timeline-content:hover { transform: none; }
  .life-col > div:hover { transform: none; }
}
</style>
