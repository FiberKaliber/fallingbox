/* elements from html&css */
var slider = document.getElementById('slider');
var bumper = document.getElementById('bumper');
var passThrough = document.getElementById('passThrough');
var text = document.getElementById('textArea');
var score = document.getElementById('score');
var highScore = document.getElementById('highScore');

/* global variables */
var starsX = 0;
var gameStart;
var gameStopped;
var bumperPos;
var passThroughMargin;
var passThroughWidth;
var passThroughColor;
var mousePosX;
var mousePosY;
var newScore = 0;
var tempHighScore;
var scoreBool;
var opacity;
var windowHeight;
var windowWidth;
var starsArray = [];

/* background effect with stars */
var element = document.getElementById('canvas');
var canvas = element.getContext("2d");

function star(width, height, yPos, xPos, ySpeed, xSpeed) {
    this.width = width;
    this.height = height;
    this.yPos = yPos;
    this.xPos = xPos;
    this.ySpeed = ySpeed;
    this.xSpeed = xSpeed;
}


/* Reset the game */
window.onload = function () {

    //placeholder for highscore = "0"
    tempHighScore = 0;

    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;

    //canvas size
    canvas.translate(1, 1);
    element.width = window.innerWidth;
    element.height = window.innerHeight;

    //loading stars, choosing size of stars etc.
    var smallStars = [];
    var mediumStars = [];
    var bigStars = [];
    loadingStars(2, smallStars, 100, 0.2, 1);
    loadingStars(3, mediumStars, 10, 0.4, 1.3);
    loadingStars(5, bigStars, 3, 0.6, 1.6);

    starsArray = starsArray.concat(smallStars, mediumStars, bigStars);
    restart();
};

window.addEventListener('mousewheel', function (event) {
    if (event.ctrlKey == true) {
      event.preventDefault();
    }
  });

function loadingStars(size, starArray, amount, ySpeed, xSpeed) {
    for(var i = 0; i < amount; i++) {
        starArray[i] = new star(size, size, randomPassThrough(0, element.height), randomPassThrough(0, element.width), ySpeed, xSpeed);
    }
}

function restart() {
    newHighScore(newScore, tempHighScore);
    newScore = 0;
    opacity = 0;
    score.innerHTML = newScore.toString();
    resetBool();
    resetPosition();
    setPassThrough();
    newPassThrough();
    bumper.style.setProperty('--bumper-marginTop', bumperPos + 'px');
    text.innerHTML = 'Click to start';
    highScore.innerHTML = 'Highscore: ' + tempHighScore;
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

/* Star functions */
function newPosition(star, i, ySpeed, starsX) {
    /* Stars speed bottom-to-top && speed moving left-to-right */
    star[i].yPos -= ySpeed;
    star[i].xPos -= starsX;
    star[i].yPos = star[i].yPos.toFixed(2);
    star[i].xPos = star[i].xPos.toFixed(2);

    /* Stars change xPos when hitting window wall */
    if(star[i].xPos >= element.width) {
        star[i].xPos = 0;
    } else if (star[i].xPos <= 0) {
        star[i].xPos = element.width;
    }

    /* Star gets back to starPosition on Y-angle */
    if(star[i].yPos <= 0) {
        star[i].xPos = randomPassThrough(0, element.width);
        star[i].yPos = element.height;
    }
}

function starHandler() {
canvas.clearRect(0, 0, element.width, element.height);
canvas.fillStyle = "#cbe5f8";

    for (var i = 0; i < starsArray.length; i++) {
        newPosition(starsArray, i, starsArray[i].ySpeed, (starsX * starsArray[i].xSpeed));
        canvas.fillRect(starsArray[i].xPos, starsArray[i].yPos, starsArray[i].height, starsArray[i].width);
    }
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
        var event = window.event;
        mousePosX = event.clientX;
        mousePosY = event.clientY;

        /* stars moving with the mouse */
        starsX = (mousePosX - (windowWidth/2) ) / 5000;
        starsX = starsX.toFixed(2);

        /* Order up mousePosY with window.iinerHeight to match the change from mouse to new Rgb to Slider */
        mousePosY = newRgbColor(mousePosY);
        slider.style.setProperty('--slider-bg-color', 'rgb(255,' + mousePosY +', 70');
        slider.style.setProperty('--slider-marginLeft', mousePosX - 35 + 'px');
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
        starHandler();
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
