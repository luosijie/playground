
export default function debounce (fn: () => void, delay: number) {
    let timer: any = null

    return function () {

        if (timer) return
        fn()
        timer = setTimeout(() => {
            clearTimeout(timer)
            timer = null
        }, delay)
    }
}