// VARIABLES
// SELECT CANVAS
const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

// USER PADDLE
const user = {
    x: 0,
    y: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
};

// COMP PADDLE
const comp = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
};

// BALL
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: "WHITE"
};

// NET
const net = {
    x: canvas.width / 2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: "WHITE"
};

// FUNCTIONS
// DRAW RECTANGLE
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
};

// DRAW CIRCLE
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
};

// DRAW TEXT
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "45px fantasy";
    context.fillText(text, x, y);
};

// DRAW NET
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
};

// RENDER THE GAME
function render() {
    // CLEAR CANVAS
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");
    // DRAW NET
    drawNet();
    // DRAW SCORE
    drawText(user.score, canvas.width / 4, canvas.height / 5, "WHITE");
    drawText(comp.score, 3 * canvas.width / 4, canvas.height / 5, "WHITE");

    // DRAW PADDLES
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(comp.x, comp.y, comp.width, comp.height, comp.color);

    // DRAW BALL
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
};

// CONTROL USER PADDLE
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(event) {
    let rect = canvas.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height / 2;
};

// COLLISION DETECTION
function collisionDetection(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
};

// RESET BALL
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;
    ball.velocityX = -ball.velocityX;
}

// UPDATES
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // AI FOR COMOP PADDLE
    let computerLevel = 0.1;
    comp.y += (ball.y - (comp.y + comp.height / 2)) * computerLevel;


    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    };

    let player = (ball.x < canvas.width / 2) ? user : comp;

    if (collisionDetection(ball, player)) {
        // WHERE BALL HITS PLAYER PADDLE
        let collidePoint = ball.y - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);
        // CALCULATE ANGLE
        let angleRad = collidePoint * Math.PI / 4;
        // CHANGE DIRECTION OF BALL WHEN HIT
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        // CHANGE VELOCITY X/Y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        // INCREASE BALL SPEED ON PADDLE CONTACT
        ball.speed += 0.1;
    };

    // UPDATE THE SCORE
    if (ball.x - ball.radius < 0) {
        comp.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }
};

// GAME INIT
function game() {
    update();
    render();
};

// LOOP
const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);