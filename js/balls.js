// JavaScript By (c) LiYan

// 参数设置
// 平均速度
const SPEED = 10
// 最小透明度
const OPACITY = 0.5
// 初始数量
const COUNT = 20
// 最小半径
const MINR = 8
// 最大半径
const MAXR = 100

var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight
window.onresize = function () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

// 定义点
class Ball {
    constructor(x, y, vx, vy, r, color) {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
        this.r = r
        this.color = color
        this.mass = Math.PI * this.r * this.r
        this.touched = 0
    }
    // 绘制
    draw() {
        context.beginPath()
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true)
        context.closePath()
        context.fillStyle = this.color
        context.fill()
        context.fillStyle = 'black'
        context.textAlign = 'center'
        context.textBaseLine = 'middle'
        context.fillText(this.touched, this.x, this.y)
    }
    // 移动
    move() {
        this.x += this.vx
        this.y += this.vy

        // 防止点在边缘循环
        if (this.x < this.r) {
            this.x = this.r
            this.vx = -this.vx
        }
        if (this.x + this.r > canvas.width) {
            this.x = canvas.width - this.r
            this.vx = -this.vx
        }
        if (this.y - this.r < 0) {
            this.y = this.r
            this.vy = -this.vy
        }
        if (this.y + this.r > canvas.height) {
            this.y = canvas.height - this.r
            this.vy = -this.vy
        }
    }
    // 判断下一步会否碰撞
    // 此处提前判断下一帧是否碰撞，若下一帧碰撞则本帧按碰撞处理，防止两Ball出现粘连
    // 现实世界中由于分子力的作用碰撞的两点也是不可能完全接触的
    willTouch(another) {
        let dx = this.x + this.vx - another.x - another.vx,
            dy = this.y + this.vy - another.y - another.vy
        return Math.sqrt(dx * dx + dy * dy) <= (this.r + another.r)
        // return Math.sqrt((this.x - another.x) ** 2 + (this.y - another.y) ** 2) <= (this.r + another.r)
    }
    // 处理碰撞
    touch(another) {
        let angle = Math.atan((this.y - another.y) / (this.x - another.x))
        this.speedx = this.vx * Math.cos(angle) + this.vy * Math.sin(angle)
        this.speedy = -this.vx * Math.sin(angle) + this.vy * Math.cos(angle)
        another.speedx = another.vx * Math.cos(angle) + another.vy * Math.sin(angle)
        another.speedy = -another.vx * Math.sin(angle) + another.vy * Math.cos(angle)
        this.speedx2 = ((this.mass - another.mass) * this.speedx + 2 * another.mass * another.speedx) / (this.mass + another.mass)
        another.speedx2 = ((another.mass - this.mass) * another.speedx + 2 * this.mass * this.speedx) / (this.mass + another.mass)
        this.vx = this.speedx2 * Math.cos(angle) - this.speedy * Math.sin(angle)
        this.vy = this.speedx2 * Math.sin(angle) + this.speedy * Math.cos(angle)
        another.vx = another.speedx2 * Math.cos(angle) - another.speedy * Math.sin(angle)
        another.vy = another.speedx2 * Math.sin(angle) + another.speedy * Math.cos(angle)
        this.touched += 1
        another.touched += 1
    }
}

function addPoint(thisx = null, thisy = null) {
    if (!thisx) {
        thisx = Math.random() * canvas.width
    }
    if (!thisy) {
        thisy = Math.random() * canvas.height
    }
    var pointok = true,
        thisr = Math.random() * (MAXR - MINR) + MINR,
        thiscolor = 'rgba(' + Math.floor(255 * Math.random()) + ',' + Math.floor(255 * Math.random())
        + ',' + Math.floor(255 * Math.random()) + ',' + (OPACITY + Math.random()) + ')',
        thisvx = (0.5 - Math.random()) * SPEED,
        thisvy = (0.5 - Math.random()) * SPEED
    if (thisx < thisr) {
        thisx = thisr
    }
    if (thisy < thisr) {
        thisy = thisr
    }
    if (thisx > canvas.width - thisr) {
        thisx = canvas.width - thisr
    }
    if (thisy > canvas.height - thisr) {
        thisy = canvas.height - thisr
    }
    var thispoint = new Ball(thisx, thisy, thisvx, thisvy, thisr, thiscolor)
    for (let thatpoint of points) {
        if (thispoint.willTouch(thatpoint)) {
            pointok = false
        }
    }
    if (pointok) {
        points.push(thispoint)
    }
}

var points = []
while (points.length < COUNT) {
    addPoint()
}

function linkPoints() {
    context.fillStyle = 'rgba(233, 233, 233, 0.5)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    for (let ball of points) {
        ball.draw()
    }
    context.beginPath()
    for (let i = 0; i < points.length; i++) {
        context.moveTo(points[i].x, points[i].y)
        for (let j = i + 1; j < points.length; j++) {
            if (points[i].willTouch(points[j])) {
                points[i].touch(points[j])
            }
        }
    }
    context.closePath()
    context.strokeStyle = 'rgba(0, 0, 0, 0.05)'
    context.stroke()
    for (let ball of points) {
        ball.move()
    }
    frame = window.requestAnimationFrame(linkPoints)
}
frame = window.requestAnimationFrame(linkPoints)

var running = true
function cmp(a, b) {
    return a.r - b.r
}
window.onclick = function () {
    if (running) {
        window.cancelAnimationFrame(frame)
        running = !running

        points.sort(cmp)

        var title = {
            text: '碰撞结果'
        }
        var xs = [], touchednum = []

        for (let ball of points) {
            xs.push(parseInt(ball.r))
            touchednum.push(ball.touched)
        }
        var series = [
            {
                name: 'Touched Times',
                data: touchednum
            }
        ]
        var xAxis = {
            title: {
                text: 'Ball R'
            },
            categories: xs
        }
        var yAxis = {
            title: {
                text: 'Touched'
            },
            plotLines: [
                {
                    value: 0,
                    width: 1,
                    color: '#333'
                }
            ]
        }
        var legend = {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        }
        var json = {}
        json.title = title
        json.xAxis = xAxis
        json.yAxis = yAxis
        json.legend = legend
        json.series = series
        $('#chart').highcharts(json)
        $('#chart').toggle()
        $('canvas').toggle()
    } else {
        $('#chart').toggle()
        $('canvas').toggle()
        frame = window.requestAnimationFrame(linkPoints)
        running = !running
    }
}
