const fib = (n) => {
    if (n <= 2) {
        return 1
    } else {
        return fib(n-1) + fib(n-2)
    }
}

onmessage = (e) => {
    postMessage(fib(e.data))
}