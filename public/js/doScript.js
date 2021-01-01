// ---------- UNIX TIMER FUNCTIONS ---------- //

document.body.style.backgroundColor = "#99cfff";
var states = ['AK', 'AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
var time = 60000;
var DisplayBox = document.getElementById('textField_1');
var displayState = document.getElementById('prompt');
var state = '';
var seenStates = [];
var clickedStates = [];
var score = 0;
var high_score = 0;

for (var s = 0; s < 50; s++){
    currState = document.getElementById(states[s]);
    currState.onclick = doClick;
}

function startUnixTimer() {
    score = 0;
    userScore = document.getElementById('score');
    userScore.innerHTML = 'Score: ' + score;
    console.log('Start clicked');
    state = states[Math.floor(Math.random() * 50)];
	displayState.innerHTML = 'Find ' + state;
	DisplayBox.innerHTML = time/1000 +' seconds left';
	time = time - 1000;
	timer = setInterval(displayUnixTimer, 1000);
	document.getElementById('startTimer').disabled= true;
    document.getElementById('stopTimer').disabled= false;
}

function stopUnixTimer() {
	clearInterval(timer);
	document.getElementById('startTimer').disabled= false;
    document.getElementById('stopTimer').disabled= true;
	state = states[Math.floor(Math.random() * 50)];
    displayState.innerHTML = '';
    DisplayBox.innerHTML = '';
    time = 60000;
    if (high_score < score) {
        userHighScore = document.getElementById('high');
        userHighScore.innerHTML = 'High Score: ' + score;
        high_score = score;
    }
    states.forEach(function(stt){
    	var s = document.getElementById(stt);
    	s.style.fill = '#AAA';
        s.style.transition = 'fill .4s ease-out';
        // s.style.hover.fill = '#FFF';
        // s.style.hover.stroke = 'black';
    }
    );
}

function doClick() {
    if (this.id == state) {
        this.style.fill = 'tomato';
        score += 1;
        clickedStates.push(state);
        seenStates.push(state);
        state = states[Math.floor(Math.random() * 50)];
        while(seenStates.indexOf(state) >= 0)
            state = states[Math.floor(Math.random() * 50)];
        displayState.innerHTML = 'Find ' + state;
    }
    else {
        console.log('User clicked wrong state');
        clickedStates.push(this.id);
    }
}

function click_history() {
    $.ajax({
        url: "clickpage",
        type: "get",                
        data: {'clicked': clickedStates},
        success: function(response) {
            console.log(clickedStates);
            console.log(response);
            r = document.getElementById("show_prevclicks");
            r.innerHTML = response;
        },
        error: function (stat, err) {
            r = document.getElementById("show_prevclicks");
            r.innerHTML = 'something went wrong in the kitchen!';
        }       
    });
}

function displayUnixTimer() {
    if (time === 0){
        stopUnixTimer();
    }
    else {
        userScore = document.getElementById('score');
        userScore.innerHTML = 'Score: ' + score;
        DisplayBox.innerHTML = time/1000 +' seconds left';
        time = time - 1000;
    }
}

function keyDown() {
    var key = event.keyCode;
    if (key == 13) {
        event.preventDefault();
        var el = document.getElementById("in").value;
        var el2 = document.getElementById("out");
        el2.innerHTML = 'Hi ' + el + '!';
        $.ajax({
            url: "namepage",
            type: "get",                
            data: $('#userInput').serialize(),
            success: function(response) {
                console.log(response);
                r = document.getElementById("names");
                r.innerHTML = response;
            },
            error: function (stat, err) {
                r = document.getElementById("names");
                r.innerHTML = 'something went wrong in the kitchen!';
            }       
        });
    }
}