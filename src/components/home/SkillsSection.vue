<script setup lang="ts">
const skillGroups = [
  {
    category: '後端開發',
    icon: '⚙️',
    items: ['C# / .NET', 'SQL Server', '分散式架構', 'RESTful API', '網路爬蟲'],
  },
  {
    category: '前端開發',
    icon: '🎨',
    items: ['Vue 3', 'TypeScript', 'Vite', 'HTML / CSS'],
  },
  {
    category: '工具 & 其他',
    icon: '🛠️',
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
        <div v-for="group in skillGroups" :key="group.category" class="skill-group glass">
          <div class="group-header">
            <span class="group-icon">{{ group.icon }}</span>
            <h3 class="group-title">{{ group.category }}</h3>
          </div>
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
  position: relative;
  overflow: hidden;
}

.skills-section::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: rgba(168, 85, 247, 0.06);
  filter: blur(80px);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  pointer-events: none;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  position: relative;
}

.skill-group {
  border-radius: var(--radius-xl);
  padding: 1.75rem;
  transition: transform var(--transition), border-color var(--transition), box-shadow var(--transition);
  position: relative;
  overflow: hidden;
}

.skill-group::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--grad-glow);
  opacity: 0;
  transition: opacity var(--transition);
}

.skill-group:hover {
  transform: translateY(-4px);
  border-color: var(--border-glow);
  box-shadow: 0 12px 40px rgba(96,165,250,0.1);
}

.skill-group:hover::before {
  opacity: 1;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
  position: relative;
}

.group-icon {
  font-size: 1.2rem;
}

.group-title {
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  background: var(--grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  position: relative;
}

.skill-tag {
  font-size: 0.8rem;
  padding: 0.3rem 0.75rem;
  background: rgba(30, 39, 64, 0.8);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  transition: all var(--transition);
}

.skill-group:hover .skill-tag {
  border-color: rgba(96,165,250,0.2);
  color: var(--text-primary);
}

@media (max-width: 900px) { .skills-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .skills-grid { grid-template-columns: 1fr; } }
</style>
