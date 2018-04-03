//elements from html&css
var slider = document.getElementById('slider');
var bumper = document.getElementById('bumper');
var passThrough = document.getElementById('passThrough');
var text = document.getElementById('textArea');
var score = document.getElementById('score');
var highScore = document.getElementById('highScore');

//global variables
var gameStart;
var gameStopped;
var bumperPos;
var passThroughMargin;
var passThroughWidth;
var mousePosX;
var newScore;
var tempHighScore;
var scoreBool;


/* Reset the game */
window.onload = function () {
    //placeholder for highscore = 0
    tempHighScore = 0;
    restart();
};

function restart() {
    text.innerHTML = 'Click to start';
    highScore.innerHTML = 'Highscore: ' + tempHighScore;
    resetGame();
}

function newHighScore(a, b) {
    if (a > b) {
        tempHighScore = a;
    }
}

function resetPosition() {
    bumperPos = 1000;
}

function resetBool() {
    gameStart = false;
    scoreBool = false;
    gameStopped = false;
}

function setPassThrough() {
    passThroughMargin = 500;
    passThroughWidth = 300;
}

function resetGame() {
    newHighScore(newScore, tempHighScore);
    newScore = 0;
    resetBool();
    resetPosition();
    setPassThrough();
    score.innerHTML = newScore.toString();
    bumper.style.setProperty('--bumper-marginTop', bumperPos + 'px');
    passThrough.style.setProperty('--passThrough-marginLeft', passThroughMargin + 'px');
}


/* New Random passThrough & bumper position */
function newPassThrough() {
    passThroughMargin = randomPassThrough(1200, 50);
    passThroughWidth = randomPassThrough(400, 120);
    passThrough.style.setProperty('--passThrough-marginLeft', passThroughMargin + 'px');
    passThrough.style.setProperty('--passThrough-width', passThroughWidth + 'px');
}

function randomPassThrough(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function newBumperPos(value) {
    if (value > 0) {
        bumper.style.setProperty('--bumper-marginTop', value + 'px');
    } else if (value <= 0) {
        resetPosition();
        newPassThrough();
        bumper.style.setProperty('--bumper-marginTop', bumperPos + 'px');

    }
}


/* Event listener */
document.addEventListener('click', function () {
    if (!gameStart) {
        text.innerHTML = '';
        highScore.innerHTML = '';
        gameStart = true;
        gameLoop();
    }
});

document.onkeydown = function (e) {
    if (gameStopped && e.keyCode === 82)
        restart();
};

document.addEventListener('mousemove', function () {
    if (!gameStopped) {
        var e = window.event;
        mousePosX = e.clientX - 35;
        slider.style.setProperty('--slider-marginLeft', mousePosX + 'px');
    }
});


/* collision handler & game loop */
function checkColliosion(speedValue) {
    if (speedValue <= 220 && speedValue >= 140) {
        if (!scoreBool) {
            scoreBool = true;
        }
        if (mousePosX < passThroughMargin || (mousePosX + 70) > (passThroughMargin + passThroughWidth)) {
            return true;
        }
    } else if (speedValue < 140 && scoreBool) {
        newScore++;
        scoreBool = false;
        score.innerHTML = newScore.toString();
        return false;
    }
    return false;
}

function gameLoop() {
    var timer = setInterval(function () {
        bumperPos--;
        if (checkColliosion(bumperPos)) {
            text.innerHTML = 'Press R to restart';
            gameStopped = true;
            clearInterval(timer);
        }
        newBumperPos(bumperPos);
    }, 1);
}
