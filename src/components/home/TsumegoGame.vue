<script setup lang="ts">
import { ref, computed } from 'vue'

// ── Types ────────────────────────────────────────────────────────────
type Color = 'black' | 'white'
interface Stone { r: number; c: number; color: Color }

// ── Go Capture Logic (BFS) ────────────────────────────────────────────
function getGroup(stones: Stone[], r: number, c: number, size: number): Stone[] {
  const target = stones.find(s => s.r === r && s.c === c)
  if (!target) return []
  const color = target.color
  const visited = new Set<string>()
  const queue = [target]
  const group: Stone[] = []
  while (queue.length) {
    const cur = queue.pop()!
    const key = `${cur.r},${cur.c}`
    if (visited.has(key)) continue
    visited.add(key); group.push(cur)
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]] as const) {
      const nr = cur.r + dr, nc = cur.c + dc
      if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue
      const nb = stones.find(s => s.r === nr && s.c === nc)
      if (nb?.color === color && !visited.has(`${nr},${nc}`)) queue.push(nb)
    }
  }
  return group
}

function hasLiberty(stones: Stone[], group: Stone[], size: number): boolean {
  for (const s of group) {
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]] as const) {
      const nr = s.r + dr, nc = s.c + dc
      if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue
      if (!stones.find(x => x.r === nr && x.c === nc)) return true
    }
  }
  return false
}

// Place a stone, capture dead opponent groups, return new board.
// Returns null if the move is suicide (own group has 0 liberties after placement and nothing captured).
function placeAndCapture(
  stones: Stone[], r: number, c: number, color: Color, size: number
): Stone[] | null {
  // Occupied
  if (stones.find(s => s.r === r && s.c === c)) return null

  let result = [...stones, { r, c, color }]
  const opponent: Color = color === 'black' ? 'white' : 'black'

  // Capture dead opponent groups adjacent to the placed stone
  const checked = new Set<string>()
  for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]] as const) {
    const nr = r + dr, nc = c + dc
    if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue
    const key = `${nr},${nc}`
    if (checked.has(key)) continue; checked.add(key)
    const nb = result.find(s => s.r === nr && s.c === nc && s.color === opponent)
    if (!nb) continue
    const grp = getGroup(result, nr, nc, size)
    if (!hasLiberty(result, grp, size)) {
      const keys = new Set(grp.map(s => `${s.r},${s.c}`))
      result = result.filter(s => !keys.has(`${s.r},${s.c}`))
    }
  }

  // Suicide check: if own group has no liberty after placement
  const ownGroup = getGroup(result, r, c, size)
  if (!hasLiberty(result, ownGroup, size)) return null  // suicide — illegal

  return result
}

// ── Board Config ──────────────────────────────────────────────────────
const SIZES = [9, 13] as const
type BoardSize = typeof SIZES[number]

const PAD  = 36
const STEP = 34

const colLabel = (c: number) => String(c)
const rowLabel = (r: number) => String(boardSize.value - 1 - r)

const boardSize = ref<BoardSize>(9)
const stones = ref<Stone[]>([])
const placing = ref<Color>('black')  // which color to place on LEFT click
const lastMsg = ref('')
const capturedB = ref(0)  // white stones captured by black
const capturedW = ref(0)  // black stones captured by white

const svgSize = computed(() => PAD * 2 + (boardSize.value - 1) * STEP)

function cx(c: number) { return PAD + c * STEP }
function cy(r: number) { return PAD + r * STEP }

function stoneAt(r: number, c: number) {
  return stones.value.find(s => s.r === r && s.c === c)
}

function countCaptures(before: Stone[], after: Stone[], color: Color) {
  const beforeCount = before.filter(s => s.color === color).length
  const afterCount  = after.filter(s => s.color === color).length
  return Math.max(0, beforeCount - afterCount)
}

function handleClick(e: MouseEvent, r: number, c: number) {
  e.preventDefault()
  const color: Color = e.button === 2 ? (placing.value === 'black' ? 'white' : 'black') : placing.value
  placeStone(r, c, color)
}

function placeStone(r: number, c: number, color: Color) {
  const before = stones.value
  const result = placeAndCapture(before, r, c, color, boardSize.value)
  if (result === null) {
    lastMsg.value = `❌ 禁手：在 (${c},${boardSize.value-1-r}) 落${color === 'black' ? '黑' : '白'}子為自殺手或已有棋子`
    return
  }
  const captured = countCaptures(before, result, color === 'black' ? 'white' : 'black')
  if (color === 'black') capturedB.value += captured
  else capturedW.value += captured

  stones.value = result
  lastMsg.value = captured > 0
    ? `✅ 落${color === 'black' ? '黑' : '白'}子於 (${c},${boardSize.value-1-r})，提掉 ${captured} 子`
    : `落${color === 'black' ? '黑' : '白'}子於 (${c},${boardSize.value-1-r})`
}

function removeStone(r: number, c: number) {
  stones.value = stones.value.filter(s => !(s.r === r && s.c === c))
  lastMsg.value = `移除 (${c},${boardSize.value-1-r})`
}

function clearBoard() {
  stones.value = []
  capturedB.value = 0
  capturedW.value = 0
  lastMsg.value = '棋盤已清空'
}

function changeSize(size: BoardSize) {
  boardSize.value = size
  clearBoard()
}

// Star points (hoshi) for standard board sizes
const HOSHI: Record<BoardSize, [number, number][]> = {
  9:  [[2,2],[2,6],[4,4],[6,2],[6,6]],
  13: [[3,3],[3,9],[6,6],[9,3],[9,9]],
}
</script>

<template>
  <div class="board-editor" @contextmenu.prevent>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="tool-group">
        <span class="tool-label">棋盤</span>
        <button
          v-for="s in SIZES" :key="s"
          class="tool-btn" :class="{ active: boardSize === s }"
          @click="changeSize(s)"
        >{{ s }}×{{ s }}</button>
      </div>

      <div class="tool-group">
        <span class="tool-label">左鍵落子</span>
        <button class="tool-btn stone-toggle"
          :class="placing"
          @click="placing = placing === 'black' ? 'white' : 'black'">
          <span class="stone-dot" :class="placing" />
          {{ placing === 'black' ? '黑' : '白' }}
        </button>
      </div>

      <button class="tool-btn danger" @click="clearBoard">清空</button>
    </div>

    <!-- Captured info -->
    <div class="capture-info">
      <span>⚫ 提掉白子：<strong>{{ capturedB }}</strong></span>
      <span>⚪ 提掉黑子：<strong>{{ capturedW }}</strong></span>
    </div>

    <!-- Board SVG -->
    <div class="board-wrap">
      <svg
        :viewBox="`0 0 ${svgSize} ${svgSize}`"
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        class="board-svg"
        @contextmenu.prevent
      >
        <!-- Grid lines -->
        <line v-for="r in boardSize" :key="`hr${r}`"
          :x1="cx(0)" :y1="cy(r-1)" :x2="cx(boardSize-1)" :y2="cy(r-1)"
          stroke="#3a4060" stroke-width="1" />
        <line v-for="c in boardSize" :key="`vc${c}`"
          :x1="cx(c-1)" :y1="cy(0)" :x2="cx(c-1)" :y2="cy(boardSize-1)"
          stroke="#3a4060" stroke-width="1" />

        <!-- Star points -->
        <circle v-for="([hr, hc], i) in HOSHI[boardSize]" :key="`h${i}`"
          :cx="cx(hc)" :cy="cy(hr)" r="3" fill="#4a5568" />

        <!-- Column labels — bottom only (X axis = col index) -->
        <text v-for="c in boardSize" :key="`clb${c}`"
          :x="cx(c-1)" :y="cy(boardSize-1) + 18"
          text-anchor="middle" dominant-baseline="middle"
          font-size="9" fill="#5a637a" font-family="monospace"
          style="pointer-events:none">{{ colLabel(c-1) }}</text>

        <!-- Row labels — left only (Y axis = row index) -->
        <text v-for="r in boardSize" :key="`rl${r}`"
          :x="cx(0) - 18" :y="cy(r-1)"
          text-anchor="middle" dominant-baseline="middle"
          font-size="9" fill="#5a637a" font-family="monospace"
          style="pointer-events:none">{{ rowLabel(r-1) }}</text>

        <!-- Clickable transparent circles across all intersections -->
        <g v-for="r in boardSize" :key="`row${r}`">
          <circle
            v-for="c in boardSize" :key="`cell${r},${c}`"
            :cx="cx(c-1)" :cy="cy(r-1)"
            :r="STEP / 2 - 2"
            fill="transparent"
            class="cell-target"
            @click="e => { if(!stoneAt(r-1,c-1)) handleClick(e, r-1, c-1) }"
            @contextmenu.prevent="e => handleClick(e, r-1, c-1)"
          />
        </g>

        <!-- Stones -->
        <g v-for="s in stones" :key="`${s.r},${s.c}`">
          <circle
            :cx="cx(s.c)" :cy="cy(s.r)"
            r="14"
            :class="s.color === 'black' ? 'stone-black' : 'stone-white'"
            @click.stop="removeStone(s.r, s.c)"
            style="cursor:pointer"
          />
          <!-- Coordinate label on hover via title -->
          <title>({{ s.r }}, {{ s.c }})</title>
        </g>
      </svg>
    </div>

    <!-- Status -->
    <p class="status-msg">{{ lastMsg || '左鍵落子，右鍵切換顏色，點擊已有棋子可移除' }}</p>

    <!-- Instructions -->
    <div class="instructions">
      <span>🖱 左鍵：落{{ placing === 'black' ? '黑' : '白' }}子</span>
      <span>🖱 右鍵：落{{ placing === 'black' ? '白' : '黑' }}子</span>
      <span>🖱 點擊棋子：移除</span>
    </div>
  </div>
</template>

<style scoped>
.board-editor {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  user-select: none;
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.tool-group {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.tool-label {
  font-size: 0.72rem;
  color: var(--text-muted);
}
.tool-btn {
  font-size: 0.76rem;
  padding: 0.2rem 0.55rem;
  border-radius: 99px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: border-color .15s, color .15s, background .15s;
}
.tool-btn:hover { border-color: var(--accent); color: var(--accent); }
.tool-btn.active { border-color: var(--accent); color: var(--accent); background: rgba(99,102,241,0.08); }
.tool-btn.danger:hover { border-color: #f87171; color: #f87171; }

.stone-toggle { display: flex; align-items: center; gap: 0.35rem; }
.stone-dot {
  width: 10px; height: 10px; border-radius: 50%;
  display: inline-block;
}
.stone-dot.black { background: #1c1c1c; border: 1px solid #555; }
.stone-dot.white { background: #e0e0e0; border: 1px solid #999; }

/* Capture info */
.capture-info {
  display: flex;
  gap: 1rem;
  font-size: 0.78rem;
  color: var(--text-muted);
}
.capture-info strong { color: var(--text-secondary); }

/* Board */
.board-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #12122e;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
}
.board-svg { display: block; width: 100%; height: 100%; }

/* Stones */
.stone-black {
  fill: #1c1c1c;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,.8));
  transition: filter .1s;
}
.stone-white {
  fill: #e8e8e8;
  filter: drop-shadow(0 2px 3px rgba(0,0,0,.5));
  transition: filter .1s;
}
.stone-black:hover { filter: drop-shadow(0 0 6px rgba(239,68,68,0.8)); }
.stone-white:hover { filter: drop-shadow(0 0 6px rgba(239,68,68,0.8)); }

.cell-target { cursor: pointer; }

/* Status */
.status-msg {
  font-size: 0.78rem;
  color: var(--text-muted);
  min-height: 1.2em;
  margin: 0;
}

.instructions {
  display: flex;
  gap: 0.75rem;
  font-size: 0.72rem;
  color: var(--text-muted);
  flex-wrap: wrap;
}
</style>
