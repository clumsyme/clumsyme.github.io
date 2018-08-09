const fib = (n) => {
    if (n <= 2) {
        return 1
    } else {
        return fib(n-1) + fib(n-2)
    }
}

const inputOne = document.getElementById('input-one')
const inputTwo = document.getElementById('input-two')
const resultOne = document.getElementById('result-one')
const resultTwo = document.getElementById('result-two')
const buttonOne = document.getElementById('button-one')
const buttonTwo = document.getElementById('button-two')

buttonOne.onclick = (e) => {
    let number = Number(inputOne.value)
    resultOne.innerText = fib(number)
}

buttonTwo.onclick = (e) => {
    worker.postMessage(Number(inputTwo.value))
}


// the worker
let worker = new Worker('/worker.js')

worker.onmessage = (e) => {
    resultTwo.innerText = e.data
}
