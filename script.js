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
var passThroughColor;
var mousePosX;
var mousePosY;
var newScore;
var tempHighScore;
var scoreBool;
var opacity;
var windowHeight;
var windowWidth;

/* Reset the game */
window.onload = function () {
    //placeholder for highscore = 0
    tempHighScore = 0;
    windowHeight = window.innerHeight;
    console.log(windowHeight);
    windowWidth = window.innerWidth;
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
    bumperPos = windowHeight;
    changeBumperOpacity(true);
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
    opacity = 0;
    score.innerHTML = newScore.toString();
    resetBool();
    resetPosition();
    setPassThrough();
    newPassThrough();
    bumper.style.setProperty('--bumper-marginTop', bumperPos + 'px');
}


/* New Random passThrough & bumper position */
function newPassThrough() {
    passThroughMargin = randomPassThrough(windowWidth - 400, 10);
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

function changeBumperOpacity(bool) {
    if (!bool && opacity > 0) {
        opacity -= 0.009;
    } else if (!bool) {
        opacity = 0;
    }

    if (bool && opacity < 1) {
        opacity += 0.009;
    } else if (bool) {
        opacity = 1;
    }
    opacity = parseFloat(opacity);
    // console.log('Opacity: ' + opacity);
    bumper.style.setProperty('--bumper-opacity' , opacity);
}

function checkOpacity(value) {
    if (value < 140) {
        changeBumperOpacity(false);
    } else if (value > windowHeight - 140) {
        changeBumperOpacity(true);
    }
}

function newRgbColor(value) {

    value = (value * (350/windowHeight) - 50);
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
        /* Order up mousePosY with window.iinerHeight to match the change from mouse to new Rgb to Slider */
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
        checkOpacity(bumperPos);
        newBumperPos(bumperPos);
    }, 1);
}
