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

function placeAndCapture(
  stones: Stone[], r: number, c: number, color: Color, size: number
): Stone[] | null {
  if (stones.find(s => s.r === r && s.c === c)) return null
  let result = [...stones, { r, c, color }]
  const opponent: Color = color === 'black' ? 'white' : 'black'
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
  const ownGroup = getGroup(result, r, c, size)
  if (!hasLiberty(result, ownGroup, size)) return null
  return result
}

// ── Free Play ─────────────────────────────────────────────────────────
const SIZES = [9, 13] as const
type BoardSize = typeof SIZES[number]
const PAD = 36
const STEP = 34

const colLabel = (c: number) => String(c)
const rowLabel = (r: number) => String(boardSize.value - 1 - r)

const HOSHI: Record<BoardSize, [number, number][]> = {
  9:  [[2,2],[2,6],[4,4],[6,2],[6,6]],
  13: [[3,3],[3,9],[6,6],[9,3],[9,9]],
}

const boardSize = ref<BoardSize>(9)
const freeStones = ref<Stone[]>([])
const placing = ref<Color>('black')
const capturedB = ref(0)
const capturedW = ref(0)
const freeMsg = ref('')

function countCaptures(before: Stone[], after: Stone[], color: Color) {
  return Math.max(0, before.filter(s => s.color === color).length - after.filter(s => s.color === color).length)
}

function freePlaceStone(r: number, c: number, color: Color) {
  const before = freeStones.value
  const result = placeAndCapture(before, r, c, color, boardSize.value)
  if (result === null) {
    freeMsg.value = `❌ 禁手：(${c},${boardSize.value-1-r}) 無法落子`
    return
  }
  const cap = countCaptures(before, result, color === 'black' ? 'white' : 'black')
  if (color === 'black') capturedB.value += cap
  else capturedW.value += cap
  freeStones.value = result
  freeMsg.value = cap > 0
    ? `✅ 落${color === 'black' ? '黑' : '白'}子於 (${c},${boardSize.value-1-r})，提掉 ${cap} 子`
    : `落${color === 'black' ? '黑' : '白'}子於 (${c},${boardSize.value-1-r})`
}

function freeHandleClick(e: MouseEvent, r: number, c: number) {
  e.preventDefault()
  const color: Color = e.button === 2 ? (placing.value === 'black' ? 'white' : 'black') : placing.value
  freePlaceStone(r, c, color)
}

function freeRemoveStone(r: number, c: number) {
  freeStones.value = freeStones.value.filter(s => !(s.r === r && s.c === c))
  freeMsg.value = `移除 (${c},${boardSize.value-1-r})`
}

function clearBoard() {
  freeStones.value = []
  capturedB.value = 0
  capturedW.value = 0
  freeMsg.value = '棋盤已清空'
}

function changeSize(size: BoardSize) {
  boardSize.value = size
  clearBoard()
}

// ── Tsumego Data ──────────────────────────────────────────────────────
// ★ 在此修改或新增題目 ★
// MoveChoice 結構：
//   r,c: 位置；isCorrect: 是否正確答案
//   wrongMsg: 答錯說明；whiteReply: 白棋回應位置；nextChoices: 下一步三選項
interface MoveChoice {
  r: number; c: number
  isCorrect: boolean
  wrongMsg?: string
  whiteReply?: { r: number; c: number }   // 答對後白棋的回應
  nextChoices?: MoveChoice[]               // 下一手的三個選項
  successMsg?: string                      // 最終正確時的訊息
}
interface TsumegoData {
  id: number
  title: string
  goal: string
  levelLabel: string
  levelSteps: number
  boardSize: BoardSize
  initialStones: Stone[]
  firstChoices: MoveChoice[]
}

const TSUMEGO_PUZZLES: TsumegoData[] = [
  // 座標系統：c = X（0=左→右遞增），r = Y（0=底部→上遞增）
  // 引擎內部自動轉換為 SVG row（tcy 函式處理）

  // P1 — 1手殺
  // 白棋 L 形3子：(c2,y5)(c3,y6)(c2,y6)，唯一氣口在 (c3,y5)
  {
    id: 1, title: '一手殺', goal: '黑先殺',
    levelLabel: '初級 1手', levelSteps: 1, boardSize: 9,
    initialStones: [
      { r:6, c:2, color:'white' }, { r:6, c:3, color:'white' }, { r:5, c:2, color:'white' },
      { r:7, c:2, color:'black' }, { r:7, c:3, color:'black' },
      { r:6, c:1, color:'black' }, { r:6, c:4, color:'black' },
      { r:5, c:1, color:'black' }, { r:4, c:2, color:'black' }, { r:4, c:3, color:'black' },
    ],
    firstChoices: [
      { r:5, c:3, isCorrect:true,
        successMsg:'正確！填入白棋唯一的氣，三子全部被提走！' },
      { r:7, c:5, isCorrect:false,
        wrongMsg:'此處不是白棋的氣口，白棋仍有一口氣。' },
      { r:3, c:4, isCorrect:false,
        wrongMsg:'距離太遠，對白棋毫無威脅。' },
    ],
  },

  // P2 — 2手殺
  // 白棋2×2方塊：(c4,y5)(c5,y5)(c4,y6)(c5,y6)，兩口氣在 (c4,y7) 和 (c5,y4)
  {
    id: 2, title: '二手殺', goal: '黑先殺',
    levelLabel: '中級 2手', levelSteps: 2, boardSize: 9,
    initialStones: [
      { r:6, c:4, color:'white' }, { r:6, c:5, color:'white' },
      { r:5, c:4, color:'white' }, { r:5, c:5, color:'white' },
      { r:7, c:5, color:'black' },
      { r:6, c:3, color:'black' }, { r:6, c:6, color:'black' },
      { r:5, c:3, color:'black' }, { r:5, c:6, color:'black' },
      { r:4, c:4, color:'black' },
    ],
    firstChoices: [
      { r:7, c:4, isCorrect:true,
        whiteReply: { r:1, c:7 },
        successMsg: '',
        nextChoices: [
          { r:4, c:5, isCorrect:true,
            successMsg:'完美！白棋最後一口氣被封，四子全部被提走！' },
          { r:7, c:3, isCorrect:false,
            wrongMsg:'白棋仍有 (c5,y4) 一口氣，急所在那裡。' },
          { r:4, c:6, isCorrect:false,
            wrongMsg:'這步不是白棋的氣口，白棋仍有 (c5,y4) 可呼吸。' },
        ],
      },
      { r:4, c:5, isCorrect:false,
        wrongMsg:'這手也行，但從上方 (c4,y7) 封住更有次序——白棋無法往上逃。' },
      { r:2, c:6, isCorrect:false,
        wrongMsg:'此處對白棋毫無威脅，白棋仍有兩口氣。' },
    ],
  },

  // P3 — 3手殺
  // 白棋橫排3子：(c3,y4)(c4,y4)(c5,y4)，三口氣在 (c3,y5)(c3,y3)(c5,y3)
  {
    id: 3, title: '三手殺', goal: '黑先殺',
    levelLabel: '高級 3手', levelSteps: 3, boardSize: 9,
    initialStones: [
      { r:4, c:3, color:'white' }, { r:4, c:4, color:'white' }, { r:4, c:5, color:'white' },
      { r:5, c:4, color:'black' }, { r:5, c:5, color:'black' },
      { r:3, c:4, color:'black' },
      { r:4, c:2, color:'black' }, { r:4, c:6, color:'black' },
    ],
    firstChoices: [
      { r:5, c:3, isCorrect:true,
        whiteReply: { r:1, c:7 },
        successMsg: '',
        nextChoices: [
          { r:3, c:3, isCorrect:true,
            whiteReply: { r:1, c:6 },
            successMsg: '',
            nextChoices: [
              { r:3, c:5, isCorrect:true,
                successMsg:'完美！三步收緊，白棋三子全部被提走！' },
              { r:2, c:5, isCorrect:false,
                wrongMsg:'距離白棋最後的氣很近但不是，填入 (c5,y3) 才能提子。' },
              { r:3, c:6, isCorrect:false,
                wrongMsg:'白棋仍有 (c5,y3) 一口氣，急所就在那裡！' },
            ],
          },
          { r:3, c:5, isCorrect:false,
            wrongMsg:'順序有誤！應先在 (c3,y3) 繼續收緊左側，再封右側。' },
          { r:2, c:4, isCorrect:false,
            wrongMsg:'此處不是白棋的氣口，下一步應繼續縮氣至 (c3,y3)。' },
        ],
      },
      { r:3, c:5, isCorrect:false,
        wrongMsg:'可以從這側開始，但從左上 (c3,y5) 依序縮氣更有系統。' },
      { r:6, c:4, isCorrect:false,
        wrongMsg:'此處對白棋毫無影響，白棋仍有三口氣，應先在 (c3,y5) 開始縮氣。' },
    ],
  },

  // P4 — 撲與反提（2手）
  // 白棋 U 形7子，內部兩口氣 (c2,y6) 虎口 / (c2,y5) 空點
  // Step1: 黑撲 (c2,y6)，白提走後 Step2: 黑反提全體白棋
  {
    id: 4, title: '撲與反提', goal: '黑先殺',
    levelLabel: '中級 2手', levelSteps: 2, boardSize: 9,
    initialStones: [
      { r:7, c:1, color:'white' }, { r:7, c:2, color:'white' }, { r:7, c:3, color:'white' },
      { r:6, c:1, color:'white' },                              { r:6, c:3, color:'white' },
      { r:5, c:1, color:'white' },                              { r:5, c:3, color:'white' },
      { r:8, c:1, color:'black' }, { r:8, c:2, color:'black' }, { r:8, c:3, color:'black' },
      { r:7, c:0, color:'black' }, { r:6, c:0, color:'black' }, { r:5, c:0, color:'black' }, { r:4, c:1, color:'black' },
      { r:7, c:4, color:'black' }, { r:6, c:4, color:'black' }, { r:5, c:4, color:'black' }, { r:4, c:3, color:'black' },
      { r:4, c:2, color:'black' },
    ],
    firstChoices: [
      {
        r:6, c:2, isCorrect:true,
        whiteReply: { r:5, c:2 },
        successMsg: '',
        nextChoices: [
          { r:6, c:2, isCorrect:true,
            successMsg: '成功！這就是「撲」，白棋提走黑子後，黑棋能一舉反提全部白棋！' },
          { r:3, c:5, isCorrect:false,
            wrongMsg: '白全體只剩 (c2,y6) 一口氣，錯過機會就反被吃！' },
          { r:8, c:4, isCorrect:false,
            wrongMsg: '距離要點太遠。' },
        ],
      },
      { r:5, c:2, isCorrect:false,
        wrongMsg:'下在此處不但無法叫吃白棋，反而讓白棋在 (c2,y6) 做出真眼。應利用 (c2,y6) 撲！' },
      { r:0, c:8, isCorrect:false,
        wrongMsg:'請在白棋陣容內部尋找急所。' },
    ],
  },
]

// ── Tsumego State ──────────────────────────────────────────────────────
const tPuzzleIdx = ref(0)
const tPuzzle = computed(() => TSUMEGO_PUZZLES[tPuzzleIdx.value])
const tBoardSize = computed(() => tPuzzle.value.boardSize)
const tStones = ref<Stone[]>([])
/** 引擎內部使用 SVG rowﾈ0=頂部） */
const tEngineStones = ref<Stone[]>([])
const tChoices = ref<MoveChoice[]>([])
type TPhase = 'playing' | 'wrong' | 'complete'
const tPhase = ref<TPhase>('playing')
const tMsg = ref('')
const tStep = ref(0)
const tLastB = ref<{r:number;c:number}|null>(null)
const tLastW = ref<{r:number;c:number}|null>(null)

function tInit() {
  const size = tPuzzle.value.boardSize
  // 儲存使用者座標，tcy() 直接使用
  tStones.value = tPuzzle.value.initialStones.map(s => ({ ...s }))
  tChoices.value = tPuzzle.value.firstChoices
  // 預先建立 SVG座標版本的初始石陣存入內部引擎 buffer
  tEngineStones.value = tPuzzle.value.initialStones.map(s => ({ ...s, r: toSvgR(s.r, size) }))
  tPhase.value = 'playing'
  tMsg.value = ''
  tStep.value = 0
  tLastB.value = null
  tLastW.value = null
}
tInit()

function tClick(userR: number, c: number) {
  if (tPhase.value !== 'playing') return
  const choice = tChoices.value.find(ch => ch.r === userR && ch.c === c)
  if (!choice) return
  const size = tBoardSize.value
  const svgR = toSvgR(userR, size)

  if (!choice.isCorrect) {
    const result = placeAndCapture(tEngineStones.value, svgR, c, 'black', size)
    if (result) {
      tEngineStones.value = result
      tStones.value = result.map(s => ({ ...s, r: toUserR(s.r, size) }))
    }
    tLastB.value = { r: userR, c }
    tMsg.value = choice.wrongMsg ?? '再想想！'
    tPhase.value = 'wrong'
    return
  }

  // Correct move
  let newEngine = placeAndCapture(tEngineStones.value, svgR, c, 'black', size)!
  tEngineStones.value = newEngine
  tStones.value = newEngine.map(s => ({ ...s, r: toUserR(s.r, size) }))
  tLastB.value = { r: userR, c }
  tStep.value++

  if (!choice.nextChoices?.length) {
    tMsg.value = choice.successMsg ?? '正確！'
    tPhase.value = 'complete'
    return
  }

  if (choice.whiteReply) {
    const wr = choice.whiteReply
    tChoices.value = []
    setTimeout(() => {
      const wrSvgR = toSvgR(wr.r, size)
      const afterWhite = placeAndCapture(newEngine, wrSvgR, wr.c, 'white', size)
      if (afterWhite) {
        newEngine = afterWhite
        tEngineStones.value = afterWhite
        tStones.value = afterWhite.map(s => ({ ...s, r: toUserR(s.r, size) }))
        tLastW.value = { r: wr.r, c: wr.c }
      }
      tChoices.value = choice.nextChoices || []
    }, 1000)
  } else {
    tChoices.value = choice.nextChoices || []
  }
}

function tRetry() { tInit() }
function tGoTo(idx: number) { tPuzzleIdx.value = idx; tInit() }

// ── Shared SVG helpers ────────────────────────────────────────────────
const svgSize = computed(() => PAD * 2 + (activeSize.value - 1) * STEP)
const activeSize = computed(() => mode.value === 'free' ? boardSize.value : tBoardSize.value)

function cx(c: number) { return PAD + c * STEP }
function cy(r: number) { return PAD + r * STEP }
/** 詰棋專用：將使用者座標（r=0→底部）轉為 SVG Y */
function tcy(r: number) { return cy(tBoardSize.value - 1 - r) }
/** 使用者 Y → SVG row（0=頂部） */
function toSvgR(userR: number, size: number) { return size - 1 - userR }
/** SVG row → 使用者 Y */
function toUserR(svgR: number, size: number) { return size - 1 - svgR }

// ── Mode ──────────────────────────────────────────────────────────────
const mode = ref<'free' | 'tsumego'>('free')
function switchMode(m: 'free' | 'tsumego') {
  mode.value = m
  if (m === 'tsumego') tInit()
}

const LEVEL_COLOR: Record<string, string> = {
  '初級 1手': '#4ade80',
  '中級 2手': '#facc15',
  '高級 3手': '#f87171',
}
</script>

<template>
  <div class="board-editor" @contextmenu.prevent>

    <!-- Mode toggle -->
    <div class="mode-toggle">
      <button class="mode-btn" :class="{ active: mode === 'free' }" @click="switchMode('free')">
        🖊 自由擺棋
      </button>
      <button class="mode-btn" :class="{ active: mode === 'tsumego' }" @click="switchMode('tsumego')">
        ⚫ 詰棋模式
      </button>
    </div>

    <!-- ── FREE PLAY ── -->
    <template v-if="mode === 'free'">
      <div class="toolbar">
        <div class="tool-group">
          <span class="tool-label">棋盤</span>
          <button v-for="s in SIZES" :key="s"
            class="tool-btn" :class="{ active: boardSize === s }"
            @click="changeSize(s)">{{ s }}×{{ s }}</button>
        </div>
        <div class="tool-group">
          <span class="tool-label">左鍵落子</span>
          <button class="tool-btn stone-toggle" :class="placing"
            @click="placing = placing === 'black' ? 'white' : 'black'">
            <span class="stone-dot" :class="placing" />
            {{ placing === 'black' ? '黑' : '白' }}
          </button>
        </div>
        <button class="tool-btn danger" @click="clearBoard">清空</button>
      </div>

      <div class="capture-info">
        <span>⚫ 提掉白子：<strong>{{ capturedB }}</strong></span>
        <span>⚪ 提掉黑子：<strong>{{ capturedW }}</strong></span>
      </div>

      <div class="board-wrap">
        <svg :viewBox="`0 0 ${svgSize} ${svgSize}`" width="100%"
          preserveAspectRatio="xMidYMid meet" class="board-svg" @contextmenu.prevent>
          <line v-for="r in boardSize" :key="`hr${r}`"
            :x1="cx(0)" :y1="cy(r-1)" :x2="cx(boardSize-1)" :y2="cy(r-1)"
            stroke="#3a4060" stroke-width="1" />
          <line v-for="c in boardSize" :key="`vc${c}`"
            :x1="cx(c-1)" :y1="cy(0)" :x2="cx(c-1)" :y2="cy(boardSize-1)"
            stroke="#3a4060" stroke-width="1" />
          <circle v-for="([hr,hc],i) in HOSHI[boardSize]" :key="`h${i}`"
            :cx="cx(hc)" :cy="cy(hr)" r="3" fill="#4a5568" />
          <!-- Column labels bottom -->
          <text v-for="c in boardSize" :key="`clb${c}`"
            :x="cx(c-1)" :y="cy(boardSize-1)+18"
            text-anchor="middle" dominant-baseline="middle"
            font-size="9" fill="#5a637a" font-family="monospace" style="pointer-events:none">
            {{ colLabel(c-1) }}</text>
          <!-- Row labels left -->
          <text v-for="r in boardSize" :key="`rl${r}`"
            :x="cx(0)-18" :y="cy(r-1)"
            text-anchor="middle" dominant-baseline="middle"
            font-size="9" fill="#5a637a" font-family="monospace" style="pointer-events:none">
            {{ rowLabel(r-1) }}</text>
          <!-- Clickable cells -->
          <g v-for="r in boardSize" :key="`row${r}`">
            <circle v-for="c in boardSize" :key="`cell${r},${c}`"
              :cx="cx(c-1)" :cy="cy(r-1)" :r="STEP/2-2"
              fill="transparent" class="cell-target"
              @click="e => { if(!freeStones.find(s=>s.r===r-1&&s.c===c-1)) freeHandleClick(e,r-1,c-1) }"
              @contextmenu.prevent="e => freeHandleClick(e,r-1,c-1)" />
          </g>
          <!-- Stones -->
          <circle v-for="s in freeStones" :key="`${s.r},${s.c}`"
            :cx="cx(s.c)" :cy="cy(s.r)" r="13"
            :class="s.color === 'black' ? 'stone-black' : 'stone-white'"
            @click.stop="freeRemoveStone(s.r, s.c)" style="cursor:pointer" />
        </svg>
      </div>

      <p class="status-msg">{{ freeMsg || '左鍵落子，右鍵切換顏色，點擊棋子可移除' }}</p>
      <div class="instructions">
        <span>🖱 左鍵：落{{ placing === 'black' ? '黑' : '白' }}子</span>
        <span>🖱 右鍵：落{{ placing === 'black' ? '白' : '黑' }}子</span>
        <span>🖱 點擊棋子：移除</span>
      </div>
    </template>

    <!-- ── TSUMEGO MODE ── -->
    <template v-else>
      <!-- Puzzle header -->
      <div class="tsumego-header">
        <span class="tsumego-badge">⚫ 詰棋挑戰</span>
        <span class="t-level"
          :style="{ borderColor: LEVEL_COLOR[tPuzzle.levelLabel], color: LEVEL_COLOR[tPuzzle.levelLabel] }">
          {{ tPuzzle.levelLabel }}
        </span>
        <span class="t-title">{{ tPuzzle.title }}</span>
      </div>

      <p class="tsumego-desc"><strong>{{ tPuzzle.goal }}</strong></p>

      <!-- Step dots -->
      <div class="step-dots" v-if="tPuzzle.levelSteps > 1">
        <span v-for="i in tPuzzle.levelSteps" :key="i" class="dot"
          :class="{ active: i-1 < tStep, current: i-1 === tStep && tPhase === 'playing' }" />
      </div>

      <!-- Board -->
      <div class="board-wrap">
        <svg :viewBox="`0 0 ${svgSize} ${svgSize}`" width="100%"
          preserveAspectRatio="xMidYMid meet" class="board-svg">
          <line v-for="r in tBoardSize" :key="`hr${r}`"
            :x1="cx(0)" :y1="cy(r-1)" :x2="cx(tBoardSize-1)" :y2="cy(r-1)"
            stroke="#3a4060" stroke-width="1" />
          <line v-for="c in tBoardSize" :key="`vc${c}`"
            :x1="cx(c-1)" :y1="cy(0)" :x2="cx(c-1)" :y2="cy(tBoardSize-1)"
            stroke="#3a4060" stroke-width="1" />
          <circle v-for="([hr,hc],i) in HOSHI[tBoardSize]" :key="`h${i}`"
            :cx="cx(hc)" :cy="cy(hr)" r="3" fill="#4a5568" />

          <!-- Column labels bottom -->
          <text v-for="c in tBoardSize" :key="`tclb${c}`"
            :x="cx(c-1)" :y="cy(tBoardSize-1)+18"
            text-anchor="middle" dominant-baseline="middle"
            font-size="9" fill="#5a637a" font-family="monospace" style="pointer-events:none">
            {{ colLabel(c-1) }}</text>
          <!-- Row labels left -->
          <text v-for="r in tBoardSize" :key="`trl${r}`"
            :x="cx(0)-18" :y="cy(r-1)"
            text-anchor="middle" dominant-baseline="middle"
            font-size="9" fill="#5a637a" font-family="monospace" style="pointer-events:none">
            {{ tBoardSize - r }}</text>

          <!-- Choice hint rings + labels -->
          <g v-for="(ch,idx) in (tPhase==='playing' ? tChoices : [])" :key="`h${ch.r}${ch.c}`"
            @click="tClick(ch.r, ch.c)" style="cursor:pointer">
            <circle :cx="cx(ch.c)" :cy="tcy(ch.r)" r="12"
              fill="rgba(96,165,250,0.07)" stroke="rgba(96,165,250,0.5)"
              stroke-width="1.5" stroke-dasharray="4 2" class="hint-ring" />
            <text :x="cx(ch.c)" :y="tcy(ch.r)+4" text-anchor="middle"
              font-size="10" font-weight="bold" fill="rgba(96,165,250,0.9)"
              style="pointer-events:none">{{ ['A','B','C'][idx] }}</text>
          </g>

          <!-- Stones -->
          <circle v-for="s in tStones" :key="`${s.r},${s.c},${s.color}`"
            :cx="cx(s.c)" :cy="tcy(s.r)" r="13"
            :class="s.color === 'black' ? 'stone-black' : 'stone-white'"
            :style="(s.color==='black' && tLastB?.r===s.r && tLastB?.c===s.c)
              ? 'filter:drop-shadow(0 0 8px rgba(96,165,250,0.9))'
              : (s.color==='white' && tLastW?.r===s.r && tLastW?.c===s.c)
              ? 'filter:drop-shadow(0 0 7px rgba(250,200,80,0.8))' : ''" />

          <!-- White response dot marker -->
          <circle v-if="tLastW && tPhase==='playing'"
            :cx="cx(tLastW.c)" :cy="tcy(tLastW.r)" r="4"
            fill="rgba(60,60,60,0.7)" style="pointer-events:none" />
        </svg>
      </div>

      <!-- Feedback -->
      <transition name="fade">
        <div v-if="tPhase !== 'playing'" class="feedback"
          :class="tPhase === 'complete' ? 'correct' : 'wrong'">
          <span class="fb-icon">{{ tPhase === 'complete' ? '✅' : '❌' }}</span>
          <div class="fb-body">
            <strong>{{ tPhase === 'complete' ? '正確！' : '再想想！' }}</strong>
            <p>{{ tMsg }}</p>
          </div>
          <button class="btn-retry" @click="tRetry">↩ 重試</button>
        </div>
      </transition>

      <p v-if="tPhase === 'playing'" class="tsumego-hint">
        點擊 <span class="accent">A / B / C</span> 落子
        <span v-if="tPuzzle.levelSteps > 1">（第 {{ tStep+1 }} / {{ tPuzzle.levelSteps }} 手）</span>
      </p>

      <!-- Puzzle nav -->
      <div class="puzzle-nav">
        <button v-for="(p,idx) in TSUMEGO_PUZZLES" :key="p.id"
          class="nav-dot" :class="{ active: idx === tPuzzleIdx }"
          :style="{ '--dot-color': LEVEL_COLOR[p.levelLabel] }"
          @click="tGoTo(idx)">{{ idx+1 }}</button>
      </div>
    </template>

  </div>
</template>

<style scoped>
.board-editor { display:flex; flex-direction:column; gap:0.6rem; user-select:none; }

/* Mode toggle */
.mode-toggle { display:flex; gap:0.4rem; }
.mode-btn {
  flex:1; font-size:0.78rem; padding:0.3rem 0.5rem;
  border-radius:99px; border:1px solid var(--border);
  background:transparent; color:var(--text-secondary);
  cursor:pointer; transition:all .15s;
}
.mode-btn.active { border-color:var(--accent); color:var(--accent); background:rgba(99,102,241,0.08); }
.mode-btn:hover:not(.active) { border-color:var(--border); color:var(--text-primary); }

/* Free play toolbar */
.toolbar { display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap; }
.tool-group { display:flex; align-items:center; gap:0.35rem; }
.tool-label { font-size:0.72rem; color:var(--text-muted); }
.tool-btn {
  font-size:0.76rem; padding:0.2rem 0.55rem; border-radius:99px;
  border:1px solid var(--border); background:transparent;
  color:var(--text-secondary); cursor:pointer; transition:all .15s;
}
.tool-btn:hover { border-color:var(--accent); color:var(--accent); }
.tool-btn.active { border-color:var(--accent); color:var(--accent); background:rgba(99,102,241,0.08); }
.tool-btn.danger:hover { border-color:#f87171; color:#f87171; }
.stone-toggle { display:flex; align-items:center; gap:0.35rem; }
.stone-dot { width:10px; height:10px; border-radius:50%; display:inline-block; }
.stone-dot.black { background:#1c1c1c; border:1px solid #555; }
.stone-dot.white { background:#e0e0e0; border:1px solid #999; }
.capture-info { display:flex; gap:1rem; font-size:0.78rem; color:var(--text-muted); }
.capture-info strong { color:var(--text-secondary); }

/* Board */
.board-wrap { width:100%; aspect-ratio:1/1; background:#12122e; border-radius:var(--radius-lg); border:1px solid var(--border); overflow:hidden; }
.board-svg { display:block; width:100%; height:100%; }
.stone-black { fill:#1c1c1c; filter:drop-shadow(0 2px 4px rgba(0,0,0,.8)); transition:filter .1s; cursor:pointer; }
.stone-white { fill:#e8e8e8; filter:drop-shadow(0 2px 3px rgba(0,0,0,.5)); transition:filter .1s; cursor:pointer; }
.stone-black:hover { filter:drop-shadow(0 0 6px rgba(239,68,68,0.8)); }
.stone-white:hover { filter:drop-shadow(0 0 6px rgba(239,68,68,0.8)); }
.cell-target { cursor:pointer; }
.hint-ring { transition:fill .15s; }
.hint-ring:hover { fill:rgba(96,165,250,0.2); }

/* Status */
.status-msg { font-size:0.78rem; color:var(--text-muted); min-height:1.2em; margin:0; }
.instructions { display:flex; gap:0.75rem; font-size:0.72rem; color:var(--text-muted); flex-wrap:wrap; }

/* Tsumego */
.tsumego-header { display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap; }
.tsumego-badge { font-size:0.78rem; font-weight:700; background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; text-transform:uppercase; letter-spacing:0.08em; }
.t-level { font-size:0.7rem; font-weight:600; border:1px solid; padding:0.1rem 0.5rem; border-radius:99px; }
.t-title { font-size:0.82rem; color:var(--text-secondary); }
.tsumego-desc { font-size:0.85rem; color:var(--text-secondary); margin:0; }
.tsumego-desc strong { color:var(--accent); }

.step-dots { display:flex; gap:6px; align-items:center; }
.dot { width:8px; height:8px; border-radius:50%; background:var(--border); transition:background .3s,transform .2s; }
.dot.active { background:var(--accent); }
.dot.current { background:var(--accent); transform:scale(1.4); }

.feedback { display:flex; align-items:flex-start; gap:0.65rem; padding:0.8rem 0.9rem; border-radius:var(--radius-lg); font-size:0.82rem; line-height:1.5; }
.feedback.correct { background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.3); }
.feedback.wrong { background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.25); }
.fb-icon { font-size:1.1rem; flex-shrink:0; margin-top:0.1rem; }
.fb-body { flex:1; }
.fb-body strong { display:block; margin-bottom:0.15rem; }
.fb-body p { color:var(--text-secondary); margin:0; }
.btn-retry { flex-shrink:0; background:transparent; border:1px solid var(--border); color:var(--text-secondary); padding:0.25rem 0.65rem; border-radius:99px; font-size:0.76rem; cursor:pointer; transition:all .2s; }
.btn-retry:hover { border-color:var(--accent); color:var(--accent); }

.tsumego-hint { font-size:0.76rem; color:var(--text-muted); text-align:center; margin:0; }
.accent { color:var(--accent); }

.puzzle-nav { display:flex; gap:0.4rem; justify-content:center; }
.nav-dot { width:26px; height:26px; border-radius:50%; border:1.5px solid var(--border); background:transparent; color:var(--text-muted); font-size:0.72rem; cursor:pointer; transition:all .2s; }
.nav-dot.active { border-color:var(--dot-color); color:var(--dot-color); background:color-mix(in srgb,var(--dot-color) 12%,transparent); }
.nav-dot:hover { border-color:var(--dot-color); color:var(--dot-color); }

.fade-enter-active,.fade-leave-active { transition:opacity .3s; }
.fade-enter-from,.fade-leave-to { opacity:0; }
</style>
