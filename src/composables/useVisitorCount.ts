import { ref, readonly } from 'vue'

const SESSION_KEY = 'visitor_counted'

const GAS_URL = import.meta.env.VITE_GAS_URL

/** 模擬 API 延遲 + 亂數訪客數（GAS URL 未設定時使用） */
async function fetchMock(): Promise<number> {
    await new Promise((r) => setTimeout(r, 800))
    // 固定種子讓同一個 session 看到同一數字，但每天不同
    const seed = Math.floor(Date.now() / 86_400_000)
    return 800 + (seed % 400)
}

export function useVisitorCount() {
    const count = ref<number | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchCount() {
        loading.value = true
        error.value = null

        try {
            if (!GAS_URL) {
                // Mock 模式：GAS 尚未設定時模擬效果
                count.value = await fetchMock()
                return
            }

            const alreadyCounted = sessionStorage.getItem(SESSION_KEY)
            // hit=0 只讀取；hit=1 讀取並 +1
            const url = alreadyCounted ? `${GAS_URL}?hit=0` : `${GAS_URL}?hit=1`
            const res = await fetch(url)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            count.value = data.count
            if (!alreadyCounted) sessionStorage.setItem(SESSION_KEY, '1')
        } catch (e) {
            error.value = e instanceof Error ? e.message : String(e)
        } finally {
            loading.value = false
        }
    }

    return {
        count: readonly(count),
        loading: readonly(loading),
        error: readonly(error),
        fetchCount,
    }
}
