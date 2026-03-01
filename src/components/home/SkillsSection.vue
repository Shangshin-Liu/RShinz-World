<script setup lang="ts">
const skillGroups = [
  {
    category: '後端開發',
    items: ['C# / .NET', 'SQL Server', '分散式架構', 'RESTful API', '網路爬蟲'],
  },
  {
    category: '前端開發',
    items: ['Vue.js 3', 'TypeScript', 'Vite', 'HTML / CSS'],
  },
  {
    category: '工具 & 其他',
    items: ['Git', 'Vibe Coding', '程式指導', 'GitHub Actions'],
  },
]
</script>

<template>
  <section id="skills" class="section skills-section">
    <div class="container">
      <h2 class="section-title">技能專長</h2>
      <p class="section-subtitle">持續學習，不斷精進</p>

      <div class="skills-grid">
        <div v-for="group in skillGroups" :key="group.category" class="skill-group">
          <h3 class="group-title">{{ group.category }}</h3>
          <div class="skill-tags">
            <span v-for="skill in group.items" :key="skill" class="skill-tag">
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills-section {
  background: var(--bg-surface);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.skill-group {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  transition: border-color var(--transition), transform var(--transition);
}

.skill-group:hover {
  border-color: var(--accent-dim);
  transform: translateY(-2px);
}

.group-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 1rem;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  font-size: 0.82rem;
  padding: 0.3rem 0.75rem;
  background: var(--bg-overlay);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  transition: all var(--transition);
}

.skill-group:hover .skill-tag {
  border-color: var(--border);
  color: var(--text-primary);
}

@media (max-width: 900px) {
  .skills-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 600px) {
  .skills-grid { grid-template-columns: 1fr; }
}
</style>
