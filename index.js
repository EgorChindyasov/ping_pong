const canvas = document.getElementById('game')
const context = canvas.getContext('2d')

const grid = 15     // игровая клетка
const platformHeight = 5 * grid     // размер платформы
const maxPlatformY = canvas.height - platformHeight - grid      // высота, на которую может подняться платформа
const platformSpeed = 5     // скорость платформы
const ballSpeed = 4     // скорость мяча

// объект паузы
const pause = {
    stop: false
}

// описываем левую и правую платформу, мяча
// левая платформа
const leftPlatform = {
    x: grid,        // положение по оси x
    y: canvas.height / 2 - platformHeight / 2,      // положение по оси y
    width: grid,        // толщина
    height: platformHeight,     // высота
    count: 0,
    dy: 0       // скорость по очи y
}

// правая платформа
const rightPlatform = {
    x: canvas.width - grid * 2,
    y: canvas.height / 2 - platformHeight / 2,
    width: grid,
    height: platformHeight,
    count: 0,
    dy: 0
}

// мяч
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: grid,
    height: grid,
    dx: ballSpeed,
    dy: ballSpeed,
    restart: false      // признак переигровки
}

// проверка на пересечение объектами с известными координатами
const collision = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y
}

const loop = () => {
    requestAnimationFrame(loop)
    context.clearRect(0, 0, canvas.width, canvas.height)

    // рисуем границы и сетку
    context.fillStyle = 'grey'
    context.fillRect(0, 0, canvas.width, grid)
    context.fillRect(0, canvas.height - grid, canvas.width, grid)
    for (let i = grid; i <= canvas.height - grid; i += grid * 2) {
        context.fillRect(canvas.width / 2, i, grid, grid)
    }

    // рисуем платформы и мяч 
    context.fillStyle = 'white'
    context.fillRect(leftPlatform.x, leftPlatform.y, leftPlatform.width, leftPlatform.height)
    context.fillRect(rightPlatform.x, rightPlatform.y, rightPlatform.width, rightPlatform.height)
    context.fillRect(ball.x, ball.y, ball.width, ball.height)

    // если движется - пусть продолжает
    leftPlatform.y += leftPlatform.dy
    rightPlatform.y += rightPlatform.dy

    //  если левая платформа вплотную у верхней границы
    if (leftPlatform.y < grid) {
        leftPlatform.y = grid
    }

    //  если левая платформа вплотную у нижней границы
    else if (leftPlatform.y > maxPlatformY) {
        leftPlatform.y = maxPlatformY
    }

    //  если првавая платформа вплотную у верхней границы
    if (rightPlatform.y < grid) {
        rightPlatform.y = grid
    }

    //  если првавая платформа вплотную у нижней границы
    else if (rightPlatform.y > maxPlatformY) {
        rightPlatform.y = maxPlatformY
    }

    // если движется - пусть продолжает
    ball.x += ball.dx
    ball.y += ball.dy

    //  если мяч вплотную у верхней границы
    if (ball.y < grid) {
        ball.y = grid
        ball.dy *= -1
    }

    //  если мяч вплотную у нижней границы
    else if (ball.y > canvas.height - grid) {
        ball.y = canvas.height - grid * 2
        ball.dy *= -1
    }

    //  если мяч покинул поле
    if ((ball.x < grid || ball.x > canvas.width) && !ball.restart) {
        ball.restart = true

        ball.x < grid ? rightPlatform.count++ : leftPlatform.count++
        
        document.getElementById('left').innerHTML = leftPlatform.count
        document.getElementById('right').innerHTML = rightPlatform.count

        setTimeout(() => {
            ball.restart = false
            ball.x = canvas.width / 2
            ball.y = canvas.height / 2
        }, 1000)
    }

    // столкновение с левой платформой
    if (collision (ball, leftPlatform)) {
        ball.dx *= -1
    }

    // столкновение с правой платформой
    else if (collision (ball, rightPlatform)) {
        ball.dx *= -1
    }

    // обработка нажатых клавиш
    document.addEventListener('keydown', e => {
        if (e.which === 38) 
            rightPlatform.dy = -platformSpeed       // стрелка вверх
        else if (e.which === 40)
            rightPlatform.dy = platformSpeed        // стрелка вниз

        if (e.which === 87) 
            leftPlatform.dy = -platformSpeed        // "w"
        else if (e.which === 83)
            leftPlatform.dy = platformSpeed         // "s"     
    })

    // если кнопка отпущена - движение прекращается
    document.addEventListener('keyup', e => {
        if (e.which === 38 || e.which === 40)
            rightPlatform.dy = 0
        if (e.which === 83 || e.which === 87)
            leftPlatform.dy = 0
    })
}

requestAnimationFrame(loop)