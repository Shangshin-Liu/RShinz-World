<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const isMenuOpen = ref(false)
const isScrolled = ref(false)
const route = useRoute()
const router = useRouter()

function toggleMenu() { isMenuOpen.value = !isMenuOpen.value }
function closeMenu() { isMenuOpen.value = false }
function onScroll() { isScrolled.value = window.scrollY > 20 }

function scrollToSection(id: string) {
  closeMenu()
  const doScroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  if (route.path !== '/') {
    router.push('/').then(() => setTimeout(doScroll, 150))
  } else {
    doScroll()
  }
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

      <ul class="nav-links">
        <li><RouterLink to="/" :class="{ active: route.path === '/' }">首頁</RouterLink></li>
        <li><button class="nav-btn" @click="scrollToSection('about')">關於我</button></li>
        <li><button class="nav-btn" @click="scrollToSection('skills')">技能</button></li>
        <li><RouterLink to="/blog" :class="{ active: route.path.startsWith('/blog') }">文章</RouterLink></li>
        <li><button class="btn btn-primary nav-cta" @click="scrollToSection('contact')">聯絡我</button></li>
      </ul>

      <button class="hamburger" :class="{ open: isMenuOpen }" @click="toggleMenu" aria-label="開啟選單">
        <span /><span /><span />
      </button>
    </nav>

    <div class="mobile-menu" :class="{ open: isMenuOpen }">
      <ul>
        <li><RouterLink to="/" @click="closeMenu">首頁</RouterLink></li>
        <li><button class="nav-btn" @click="scrollToSection('about')">關於我</button></li>
        <li><button class="nav-btn" @click="scrollToSection('skills')">技能</button></li>
        <li><RouterLink to="/blog" @click="closeMenu">文章</RouterLink></li>
        <li><button class="nav-btn" @click="scrollToSection('contact')">聯絡我</button></li>
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
  transition: all var(--transition);
  border-bottom: 1px solid transparent;
}

.app-header.scrolled {
  background: rgba(8, 11, 18, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-color: var(--border);
  box-shadow: 0 1px 24px rgba(0,0,0,0.5);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.logo-bracket {
  background: var(--grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
}

.nav-links a,
.nav-btn {
  color: var(--text-secondary);
  font-size: 0.88rem;
  font-weight: 500;
  transition: color var(--transition);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: var(--font-body);
}

.nav-links a:hover,
.nav-links a.active,
.nav-btn:hover {
  color: var(--text-primary);
}

.nav-cta {
  padding: 0.42rem 1.1rem !important;
  font-size: 0.82rem !important;
  font-weight: 600 !important;
  color: #fff !important;
}

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

.mobile-menu {
  display: none;
  background: rgba(8,11,18,0.9);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
  max-height: 0;
  transition: max-height var(--transition-slow);
}

.mobile-menu.open { max-height: 300px; }

.mobile-menu ul {
  list-style: none;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-menu a,
.mobile-menu .nav-btn {
  color: var(--text-secondary);
  font-size: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .hamburger { display: flex; }
  .mobile-menu { display: block; }
}
</style>
