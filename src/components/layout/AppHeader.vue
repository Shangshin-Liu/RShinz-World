<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const isMenuOpen = ref(false)
const isScrolled = ref(false)
const route = useRoute()

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

function onScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="app-header" :class="{ scrolled: isScrolled }">
    <nav class="container nav">
      <RouterLink to="/" class="logo" @click="closeMenu">
        <span class="logo-bracket">&lt;</span>阿星<span class="logo-bracket">/&gt;</span>
      </RouterLink>

      <!-- Desktop links -->
      <ul class="nav-links">
        <li>
          <RouterLink to="/" :class="{ active: route.path === '/' }">首頁</RouterLink>
        </li>
        <li>
          <a href="/#about">關於我</a>
        </li>
        <li>
          <a href="/#skills">技能</a>
        </li>
        <li>
          <RouterLink to="/blog" :class="{ active: route.path.startsWith('/blog') }">
            文章
          </RouterLink>
        </li>
        <li>
          <a href="/#contact" class="btn btn-primary nav-cta">聯絡我</a>
        </li>
      </ul>

      <!-- Mobile hamburger -->
      <button class="hamburger" :class="{ open: isMenuOpen }" @click="toggleMenu" aria-label="開啟選單">
        <span /><span /><span />
      </button>
    </nav>

    <!-- Mobile menu -->
    <div class="mobile-menu" :class="{ open: isMenuOpen }">
      <ul>
        <li><RouterLink to="/" @click="closeMenu">首頁</RouterLink></li>
        <li><a href="/#about" @click="closeMenu">關於我</a></li>
        <li><a href="/#skills" @click="closeMenu">技能</a></li>
        <li><RouterLink to="/blog" @click="closeMenu">文章</RouterLink></li>
        <li><a href="/#contact" @click="closeMenu">聯絡我</a></li>
      </ul>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background var(--transition), border-color var(--transition), box-shadow var(--transition);
  border-bottom: 1px solid transparent;
}

.app-header.scrolled {
  background: rgba(13, 17, 23, 0.85);
  backdrop-filter: blur(12px);
  border-color: var(--border);
  box-shadow: 0 1px 8px rgba(0,0,0,0.4);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.logo-bracket {
  color: var(--accent);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
}

.nav-links a {
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: color var(--transition);
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--text-primary);
}

.nav-cta {
  color: #fff !important;
  padding: 0.45rem 1.1rem !important;
  font-size: 0.85rem !important;
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-secondary);
  border-radius: 2px;
  transition: transform var(--transition), opacity var(--transition);
}

.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile menu */
.mobile-menu {
  display: none;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
  max-height: 0;
  transition: max-height var(--transition-slow);
}

.mobile-menu.open {
  max-height: 300px;
}

.mobile-menu ul {
  list-style: none;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-menu a {
  color: var(--text-secondary);
  font-size: 1rem;
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .hamburger { display: flex; }
  .mobile-menu { display: block; }
}
</style>
