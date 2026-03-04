import { ref, readonly } from 'vue'
import fallbackPuzzles from '@/data/tsumegoPuzzles.json'

const GAS_URL = import.meta.env.VITE_TSUMEGO_GAS_URL

// ── Types ────────────────────────────────────────────────────────────────
export type Color = 'black' | 'white'

export interface Stone {
    r: number
    c: number
    color: Color
}

export interface MoveChoice {
    r: number
    c: number
    isCorrect: boolean
    successMsg?: string
    wrongMsg?: string
    whiteReply?: { r: number; c: number }
    nextChoices?: MoveChoice[]
}

export interface TsumegoData {
    id: number
    title: string
    goal: string
    levelLabel: string
    levelSteps: number
    boardSize: number
    initialStones: Stone[]
    firstChoices: MoveChoice[]
}

// ── Composable ───────────────────────────────────────────────────────────
export function useTsumegoData() {
    const puzzles = ref<TsumegoData[]>(fallbackPuzzles as TsumegoData[])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchPuzzles() {
        if (!GAS_URL) return // 未設定 → 用 fallback，不做任何事

        loading.value = true
        error.value = null
        try {
            const res = await fetch(GAS_URL)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data: TsumegoData[] = await res.json()
            if (!Array.isArray(data) || !data.length) throw new Error('Empty or invalid response')
            puzzles.value = data
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e)
            console.warn(`[useTsumegoData] GAS fetch failed (${msg}), using local fallback`)
            error.value = msg
            // fallback 資料已在初始值，不需額外處理
        } finally {
            loading.value = false
        }
    }

    return {
        puzzles: readonly(puzzles),
        loading: readonly(loading),
        error: readonly(error),
        fetchPuzzles,
    }
}
