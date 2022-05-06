function setUpGrid() {
    //canvas element
    var c = document.getElementById("graphArea")
    //set grid to be full screen width/height
    var dimension = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight
    c.width = 0.95 * dimension
    c.height = 0.95 * dimension
    //get width and height of canvas element
    var width = c.width
    var height = c.height
    //2D context for canvas element
    var ctx = c.getContext("2d")
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath()
    ctx.setLineDash([5, 1]);
    //draw y-axis
    ctx.moveTo(width/2, 0)
    ctx.lineTo(width/2, height)
    ctx.stroke()
    //draw x-axis
    ctx.moveTo(0, height/2)
    ctx.lineTo(width, height/2)
    ctx.strokeStyle = 'black';
    ctx.stroke()
    ctx.closePath()
    //draw vertical minor grid lines
    var verticalTickInterval = width/20
    ctx.beginPath()
    ctx.setLineDash([1,3])
    for(i = verticalTickInterval; i < width; i += verticalTickInterval) {
        if(i === width/2) {
            continue;
        }
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.strokeStyle = 'gray';
        ctx.stroke()
    }
    //draw horizontal minor grid lines
    var horizontalTickInterval = height/20
    for(i = horizontalTickInterval; i < height; i += horizontalTickInterval) {
        if(i === height/2) {
            continue;
        }
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.strokeStyle = 'gray';
        ctx.stroke()
    }
    ctx.closePath()
}

function parseFunction(functionString) {
    var valid = true
    var coefficients = functionString.split(',')
    coefficientsArr = coefficients.map(c => {
        var trimmed = c.trim()
        return eval(trimmed)
    })
    return valid ? coefficientsArr : false
}

function transformCoordinates(x,y) {
    var c = document.getElementById("graphArea")
    var width = c.width
    var height = c.height
    return [width/2 + x*(width/20), height/2 + -1*y*(height/20)]
}

function hornersMethod(coefficients, x) {
    var ans = coefficients[coefficients.length - 1]
    for(var i = coefficients.length - 2; i >= 0; --i) {
        ans *= x
        ans += coefficients[i]
    }
    return ans
}

function drawGraph(coefficients) {
    //initial settings for canvas
    var c = document.getElementById("graphArea")
    var ctx = c.getContext("2d")
    ctx.beginPath()
    ctx.strokeStyle ='red'
    ctx.setLineDash([])
    //get initial point at x = 0
    var points = transformCoordinates(0, hornersMethod(coefficients, 0))
    ctx.moveTo(points[0], points[1])
    var x = 0
    //increment up to x = 10 and draw curve as we go
    while(x <= 10) {
        x += 0.01
        points = transformCoordinates(x, hornersMethod(coefficients, x))
        ctx.lineTo(points[0], points[1])
        ctx.stroke()
    }
    ctx.closePath()
    //reset variables
    ctx.beginPath()
    points = transformCoordinates(0, hornersMethod(coefficients, 0))
    ctx.moveTo(points[0], points[1])
    x = 0
    //increment down to x = -10 and draw curve as we go
    while(x >= -10) {
        x -= 0.01
        points = transformCoordinates(x, hornersMethod(coefficients, x))
        ctx.lineTo(points[0], points[1])
        ctx.stroke()
    }
    ctx.closePath();
}

function getUserInput(ev) {
    try {
        ev.preventDefault()
        var el = document.getElementById("functionInput")
        var coefficients = parseFunction(el.value)
        setUpGrid()
        drawGraph(coefficients)
    } catch(e) {
        var error = document.getElementById("error")
        var form = document.getElementById("functionForm")
        error.style.display = "block"
        form.style.marginBottom = "10px"
    }
}

function clearError() {
    var error = document.getElementById("error")
    var form = document.getElementById("functionForm")
    error.style.display = "none"
    form.style.marginBottom = "37px"
}

function resizeHandler() {
    var el = document.getElementById("functionInput")
    setUpGrid()
    if(el.value && el.value.length > 0) {
        try {
            var coefficients = parseFunction(el.value)
            drawGraph(coefficients)
        } catch(e) {
            var error = document.getElementById("error")
            var form = document.getElementById("functionForm")
            error.style.display = "block"
            form.style.marginBottom = "10px"
        }
    }
}

setUpGrid()
document.getElementById("submitButton").addEventListener('click', getUserInput)
document.getElementById("functionInput").addEventListener('change', clearError)
window.onresize = resizeHandler



