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
var mousePosY;
var passThroughColor;
var newScore;
var tempHighScore;
var scoreBool;
var opacity;


/* Reset the game */
window.onload = function () {
    //placeholder for highscore = 0
    tempHighScore = 0;
    restart();
};

window.addEventListener('mousewheel', function (event) {
    if (event.ctrlKey == true) {
      event.preventDefault();
    }
  });

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
    opacity = 1.0;
    score.innerHTML = newScore.toString();
    resetBool();
    resetPosition();
    setPassThrough();
    newPassThrough();
    bumper.style.setProperty('--bumper-marginTop', bumperPos + 'px');
}


/* New Random passThrough & bumper position */
function newPassThrough() {
    passThroughMargin = randomPassThrough(1200, 50);
    passThroughWidth = randomPassThrough(400, 120);
    passThroughColor = randomPassThrough(255, 0);
    console.log('Pass: ' + passThroughColor);
    passThrough.style.setProperty('--passThrough-marginLeft', passThroughMargin + 'px');
    passThrough.style.setProperty('--passThrough-width', passThroughWidth + 'px');
    passThrough.style.setProperty('--pass-bg-color', 'rgb(255,' + passThroughColor + ', 70');

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

function newRgbColor(value) {

    value = (value * 0.34) - 50;
    value = Math.ceil(value)

    if (value < 1) {
        return 0;
    } else if (value > 254) {
        return 255;
    }
    return value;
}

function difference(x, y) {
  return Math.abs(x - y);
}


/* Event listener */
document.addEventListener('click', function () {
    if (!gameStart) {
        text.innerHTML = '';
        highScore.innerHTML = '';
        gameStart = true;
        gameLoop();
    } else if (gameStopped) {
        restart();
    }
});

document.addEventListener('mousemove', function () {
    if (!gameStopped) {
        var e = window.event;
        mousePosX = e.clientX - 35;
        mousePosY = e.clientY;
        mousePosY = newRgbColor(mousePosY);
        slider.style.setProperty('--slider-bg-color', 'rgb(255,' + mousePosY +', 70');
        slider.style.setProperty('--slider-marginLeft', mousePosX + 'px');
    }
});


/* collision handler & game loop */
function checkColliosion(speedValue) {
    if (speedValue <= 220 && speedValue >= 140) {
        /* mousePosY 'check' passThroughColor */
            if (!scoreBool) {
                scoreBool = true;
            }
            if (mousePosX < passThroughMargin || (mousePosX + 70) > (passThroughMargin + passThroughWidth) || difference(mousePosY, passThroughColor) > 40) {
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
            text.innerHTML = 'Click to restart!';
            console.log('MouseRGB: ' + mousePosY + ' PassColor: ' + passThroughColor + ' Difference: ' + difference(mousePosY, passThroughColor));
            gameStopped = true;
            clearInterval(timer);
        }
        newBumperPos(bumperPos);
    }, 1);
}
