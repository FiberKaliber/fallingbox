var playButton = document.getElementById("playButton");
var highscoreButton = document.getElementById("highscoreButton");
var opacityDiv = document.getElementById("opacityDiv");
var loginBox = document.getElementById("loginBox");
var html = document.getElementsByTagName('html')[0];
var title = document.getElementById('title');
var usernameBorder = false;
var highscoreDiv;
var loginDiv;
var username;
var myData;

//SO SLOW!!!
var xhr = new XMLHttpRequest();
xhr.open('GET', 'data.json', true);
xhr.responseType = 'text';
xhr.onload = function() {
    if(xhr.status === 200) {
    myData = JSON.parse(xhr.responseText);
    console.log(myData);
    createLoginDiv();
    createHighScoreDiv();
    }
}
xhr.send();

function startGame() {
    if(!username.value) {
        console.log("No usersname value");
        username.placeholder = "Username...";
        username.style.setProperty('--border-style-username', 'crimson');
    } else if(username.value) {
        window.location.href = "game.html";
    }
}

function showHighscore(){
        if(loginBox.firstChild.id === "loginDiv") { 
            title.innerHTML = myData.title.highscorepage;
            html.style.setProperty('--box-height', '530px');
            loginBox.removeChild(loginDiv);   
            loginBox.appendChild(highscoreDiv);  
        } else if (loginBox.firstChild.id === "highscoreBox") {
            title.innerHTML = myData.title.loginpage;
            loginBox.removeChild(highscoreDiv);
            html.style.setProperty('--box-height', '250px');
            loginBox.appendChild(loginDiv); 
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

function changeBorder(Event) {
    var target = Event.target.id;
    if(target === username.id) {
        username.placeholder = "";
        username.style.setProperty('--border-style-username', 'white');
    } 
}

//Create Highscore div && LoginDiv with buttons
function createLoginDiv() {
    loginDiv = document.createElement('div');
    loginDiv.id = 'loginDiv';
    loginDiv.innerHTML = 
        '<input placeholder="Username..." spellcheck="false" type="text" id="username" onfocus="changeBorder(event)">\
        <button class="button" id="playButton" onclick="startGame()">Play</button>\
        <button class="button" id="highscoreButton" onclick="showHighscore()">Highscore</button>';
        loginBox.appendChild(loginDiv);
        username = document.getElementById("username");
}

function createHighScoreDiv() {
    highscoreDiv = document.createElement("DIV");   
    highscoreDiv.id = ('highscoreBox');

    var table = document.createElement('table'), tableRow, tableData, thead, headTable;
    headTable = document.createElement('table');
    tableRow = document.createElement('tr');
    /* Name and score */
    for(i = 0; i < 2; i++) {
        thead = document.createElement('th');
        thead.innerHTML = myData.highscoretitle[i];
        tableRow.appendChild(thead);
    }
    tableRow.id = ('firstTr');
    headTable.appendChild(tableRow);
    highscoreDiv.appendChild(headTable);
    
    /* Users score on each row */
    for (row = 0; row < 15; row++) {
        tableRow = document.createElement('tr');
        for(cell = 0; cell < 2; cell++) {
            tableData = document.createElement('td');
            tableData.innerHTML = myData.users[row][cell];
            tableRow.appendChild(tableData);
        }
        table.appendChild(tableRow);
    }
    table.id = ('scoreTable');
    highscoreDiv.appendChild(table);

    var divButton = document.createElement('div');
    divButton.id = ('backDiv');
    divButton.innerHTML = '<button class="button" id="highscoreButton" onclick="showHighscore()">Back</button>';
    highscoreDiv.appendChild(divButton);
}

