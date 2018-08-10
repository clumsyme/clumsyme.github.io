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

const titleOne = document.querySelector('.demo.left .title')
const titleTwo = document.querySelector('.demo.right .title')

buttonOne.onclick = (e) => {
    titleOne.classList.add('calculating')
    setTimeout(() => {
        let number = Number(inputOne.value)
        resultOne.innerText = fib(number)
        titleOne.classList.remove('calculating')
    }, 1000)
}

buttonTwo.onclick = (e) => {
    titleTwo.classList.add('calculating')
    worker.postMessage(Number(inputTwo.value))
}


// the worker
let worker = new Worker('worker.js')

worker.onmessage = (e) => {
    resultTwo.innerText = e.data
    titleTwo.classList.remove('calculating')
}
