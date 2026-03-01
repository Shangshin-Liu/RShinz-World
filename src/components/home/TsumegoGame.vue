<script setup lang="ts">
import { ref, computed } from 'vue'

// ── Board config ─────────────────────────────────────────────────────
const COLS = 13
const ROWS = 13
const STEP = 34
const PAD  = 22

type Stone = 'black' | 'white' | 'empty'
type Status = 'playing' | 'correct' | 'wrong'

interface Cell { row: number; col: number; stone: Stone }

// Problem: 直三 (Straight Three) — 黑先活
// Puzzle placed at rows 2-6, cols 1-7 on a 9x9 board
// Puzzle centered on 13x13 board: white rows 4-8, black at rows 5-7
// Internal empties at (6,5),(6,6),(6,7) — vital point = (6,6) = center!
const initialBoard: Cell[] = (() => {
  const cells: Cell[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      cells.push({ row: r, col: c, stone: stoneAt(r, c) })
    }
  }
  return cells
})()

function stoneAt(r: number, c: number): Stone {
  // White outer ring
  if (r === 4 && c >= 4 && c <= 8) return 'white'
  if ((r === 5 || r === 7) && (c === 3 || c === 9)) return 'white'
  if (r === 8 && c >= 4 && c <= 8) return 'white'
  // Black inner ring
  if (r === 5 && c >= 4 && c <= 8) return 'black'
  if (r === 6 && (c === 4 || c === 8)) return 'black'
  if (r === 7 && c >= 4 && c <= 8) return 'black'
  return 'empty'
}

const ANSWER    = { row: 6, col: 6 }
const CLICKABLE = [{ row: 6, col: 5 }, { row: 6, col: 6 }, { row: 6, col: 7 }]

const board = ref<Cell[]>(initialBoard.map(c => ({ ...c })))
const status = ref<Status>('playing')
const placed = ref<{ row: number; col: number } | null>(null)

function isClickable(r: number, c: number) {
  return status.value === 'playing' && CLICKABLE.some(p => p.row === r && p.col === c)
}

function clickCell(r: number, c: number) {
  if (!isClickable(r, c)) return
  placed.value = { row: r, col: c }
  board.value = board.value.map(cell =>
    cell.row === r && cell.col === c ? { ...cell, stone: 'black' } : cell
  )
  status.value = (r === ANSWER.row && c === ANSWER.col) ? 'correct' : 'wrong'
}

function reset() {
  board.value = initialBoard.map(c => ({ ...c }))
  status.value = 'playing'
  placed.value = null
}

// SVG helpers
function cx(col: number) { return PAD + col * STEP }
function cy(row: number) { return PAD + row * STEP }

const svgW = computed(() => PAD * 2 + (COLS - 1) * STEP)
const svgH = computed(() => PAD * 2 + (ROWS - 1) * STEP)
</script>

<template>
  <div class="tsumego-wrap">
    <div class="tsumego-header">
      <span class="tsumego-badge">⚫ 詰棋挑戰</span>
      <span class="tsumego-level">入門 Lv.1</span>
    </div>

    <p class="tsumego-desc">黑先活——找出讓黑棋存活的<strong>急所</strong></p>

    <!-- Board SVG -->
    <div class="board-wrap">
      <svg
        :viewBox="`0 0 ${svgW} ${svgH}`"
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        class="board-svg"
      >
        <!-- Grid lines -->
        <line
          v-for="r in ROWS" :key="`hr${r}`"
          :x1="cx(0)" :y1="cy(r-1)"
          :x2="cx(COLS-1)" :y2="cy(r-1)"
          stroke="#4a5568" stroke-width="1"
        />
        <line
          v-for="c in COLS" :key="`vc${c}`"
          :x1="cx(c-1)" :y1="cy(0)"
          :x2="cx(c-1)" :y2="cy(ROWS-1)"
          stroke="#4a5568" stroke-width="1"
        />

        <!-- Stones & clickable targets -->
        <g v-for="cell in board" :key="`${cell.row}-${cell.col}`">
          <!-- Clickable hint ring -->
          <circle
            v-if="isClickable(cell.row, cell.col)"
            :cx="cx(cell.col)" :cy="cy(cell.row)"
            r="12"
            fill="rgba(96,165,250,0.08)"
            stroke="rgba(96,165,250,0.4)"
            stroke-width="1.5"
            stroke-dasharray="4 2"
            class="hint-ring"
            @click="clickCell(cell.row, cell.col)"
          />
          <!-- Black stone -->
          <circle
            v-if="cell.stone === 'black'"
            :cx="cx(cell.col)" :cy="cy(cell.row)"
            r="13"
            class="stone-black"
            :class="{ 'stone-placed': placed?.row === cell.row && placed?.col === cell.col }"
          />
          <!-- White stone -->
          <circle
            v-if="cell.stone === 'white'"
            :cx="cx(cell.col)" :cy="cy(cell.row)"
            r="13"
            class="stone-white"
          />
        </g>
      </svg>
    </div>

    <!-- Feedback -->
    <transition name="fade">
      <div v-if="status !== 'playing'" class="feedback" :class="status">
        <template v-if="status === 'correct'">
          <span class="fb-icon">✅</span>
          <div>
            <strong>正確！</strong>
            <p>落在三空中央，兩側各形成一個獨立眼位，黑棋雙活！</p>
          </div>
        </template>
        <template v-else>
          <span class="fb-icon">❌</span>
          <div>
            <strong>再想想！</strong>
            <p>三個空點的<em>中央</em>才是急所，兩側才能形成各自獨立的眼位。</p>
          </div>
        </template>
        <button class="btn-retry" @click="reset">↩ 重試</button>
      </div>
    </transition>

    <p v-if="status === 'playing'" class="tsumego-hint">點擊棋盤上的<span class="accent">虛線圓</span>落子</p>
  </div>
</template>

<style scoped>
.tsumego-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tsumego-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.tsumego-badge {
  font-size: 0.8rem;
  font-weight: 700;
  background: var(--grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.tsumego-level {
  font-size: 0.72rem;
  color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 0.1rem 0.5rem;
  border-radius: 99px;
}

.tsumego-desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
}
.tsumego-desc strong {
  color: var(--accent);
}

/* Board */
.board-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;  /* 13×13 正方形，自動適配 container 寬度 */
  background: #1a1a2e;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
}
.board-svg {
  display: block;
  width: 100%;
  height: 100%;
}

.stone-black {
  fill: radial-gradient(circle at 35% 35%, #555, #111);
  fill: #1a1a1a;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));
  cursor: default;
}
.stone-white {
  fill: #e8e8e8;
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.5));
  cursor: default;
}
.stone-placed {
  filter: drop-shadow(0 0 8px rgba(96,165,250,0.9));
}
.hint-ring {
  cursor: pointer;
  transition: fill 0.15s;
}
.hint-ring:hover {
  fill: rgba(96,165,250,0.2);
}

/* Feedback */
.feedback {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: var(--radius-lg);
  font-size: 0.85rem;
  line-height: 1.5;
}
.feedback.correct {
  background: rgba(34,197,94,0.08);
  border: 1px solid rgba(34,197,94,0.3);
  color: var(--text-primary);
}
.feedback.wrong {
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.25);
  color: var(--text-primary);
}
.fb-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 0.1rem; }
.feedback strong { display: block; margin-bottom: 0.2rem; }
.feedback p { color: var(--text-secondary); margin: 0; }
.feedback em { color: var(--accent); font-style: normal; }

.btn-retry {
  margin-left: auto;
  flex-shrink: 0;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 0.3rem 0.75rem;
  border-radius: 99px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.btn-retry:hover { border-color: var(--accent); color: var(--accent); }

.tsumego-hint {
  font-size: 0.78rem;
  color: var(--text-muted);
  text-align: center;
}
.accent { color: var(--accent); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
