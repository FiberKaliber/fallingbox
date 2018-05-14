var username = document.getElementById("username");
var playButton = document.getElementById("playButton");
var highscoreButton = document.getElementById("highscoreButton");
var usernameBorder = false;


playButton.addEventListener('click', function() {
    
    if(!username.value) {
        console.log("No username value");
        username.placeholder = "Username...";
        username.style.setProperty('--border-style-username', 'crimson');
    } else if(username.value) {
        window.location.href = "game.html";
    }
});

highscoreButton.addEventListener('click', function() {
        console.log("highscore");
        var div = document.createElement("DIV");   
        div.style.width = "100px";
        div.style.height = "100px";
        div.style.background = "red";
        div.style.color = "white";  // Create a <button> element
        var text = document.createTextNode("TEST DIV");       // Create a text node
        div.appendChild(text);         
        document.getElementById("loginBox").appendChild(div);             
});

function changeBorder(Event) {
    var target = Event.target.id;
    console.log("change border on username input");
    if(target === username.id) {
        username.placeholder = "";
        username.style.setProperty('--border-style-username', 'white');
    } 
}

document.addEventListener('click', function (event) {
    if(event.srcElement.className != "button") {
        if (event.srcElement.id != username.id) {
            username.placeholder = "Username...";
            }
        username.style.setProperty('--border-style-username', 'white');
    } 

});


/* background effect with stars */
var element = document.getElementById('canvas');
var canvas = element.getContext("2d");
var starsArray = [];
var starsX = 0;
var mousePosX;

function star(width, height, yPos, xPos, ySpeed, xSpeed) {
    this.width = width;
    this.height = height;
    this.yPos = yPos;
    this.xPos = xPos;
    this.ySpeed = ySpeed;
    this.xSpeed = xSpeed;
}

window.addEventListener('resize', function(){
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
    canvas.translate(1, 1);
    element.width = window.innerWidth;
    element.height = window.innerHeight;
  });

window.onload = function() {
    username.style.setProperty('--transition-username', '0.5s');
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
    gameLoop();
};

document.addEventListener('mousemove', function () {
        var event = window.event;
        mousePosX = event.clientX;

        /* stars moving with the mouse */
        starsX = (mousePosX - (windowWidth/2) ) / 5000;
        starsX = starsX.toFixed(2);
});

function randomPassThrough(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadingStars(size, starArray, amount, ySpeed, xSpeed) {
    for(var i = 0; i < amount; i++) {
        starArray[i] = new star(size, size, randomPassThrough(0, element.height), randomPassThrough(0, element.width), ySpeed, xSpeed);
    }
}

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

function gameLoop() {
    var timer = setInterval(function () {
        starHandler();
    }, 1);
}


