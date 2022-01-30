const tbar = document.getElementById("time");
const tlabel = document.getElementById("time-label");

const q = document.getElementById("q");
const ansp = document.getElementsByClassName("ansp");
const answers = document.getElementsByClassName("ans");

const container1 = document.getElementById("container");
const container2 = document.getElementById("container-2");
const container3 = document.getElementById("container-3");
const container4 = document.getElementById("container-4");
const barScore = document.getElementById("bar-score");
const barTime = document.getElementById("bar-time");

const scoreGradient = document.getElementById("score");
const correctLabel = document.getElementById("correct-label");
const wrongLabel = document.getElementById("wrong-label");
const cbar = document.getElementById("correct-bar");
const ibar = document.getElementById("incorrect-bar");

const scoreInfo = document.getElementById("score-info");
const percentInfo = document.getElementById("percent");
const word1 = document.getElementById("word1");
const word2 = document.getElementById("word2");

let correctCount = 0;
let incorrectCount = 0;
let index = 0;

function init() {
	index = 0; correctCount = 0; incorrectCount = 0;
	
	container1.style.display = "none";
	container2.style.display = "flex";
	container3.style.display = "none";
	container4.style.display = "none";
	barScore.style.display = "none";
	barTime.style.display = "none";
}

init();

function displayAuthors() {
	container1.style.display = "none";
	container2.style.display = "none";
	container3.style.display = "flex";
	container4.style.display = "none";
}

function startKwiz() {
	index = 0;
	container1.style.display = "grid";
	container2.style.display = "none";
	container3.style.display = "none";
	container4.style.display = "none";
	barScore.style.display = "flex";
	barTime.style.display = "flex";
	updateScore();
	nextQuestion();
}

let timerPause = false;

async function ans(x) {
	if(timerPause){return;}
	if (x == questions[index]["c"]) {
		correct();
	}
	else {
		incorrect();
	}
	timerPause = true;
	
	if (x >= 0 && x <= 3) {
		highlightQuestion(x, x == questions[index]["c"]);
		highlightQuestion(questions[index]["c"], true);
	} else {
		highlightQuestion(questions[index]["c"], false);
	}
	
	//Pause script for 3 seconds
	await new Promise(r => setTimeout(r, 3000));
	
	++index;
	if (index >= questions.length) {
		endTheSuffering();
		return;
	}

	nextQuestion();
}

async function endTheSuffering() {
	container1.style.display = "none";
	container2.style.display = "none";
	container3.style.display = "none";
	container4.style.display = "flex";
	barScore.style.display = "flex";
	barTime.style.display = "none";
	
	scoreInfo.innerHTML = "Zdobyłeś <span class=\"green\">" + correctCount + "</span> na <span class=\"red\">" + questions.length + "</span> punktów!";
	percentInfo.innerHTML = "Daje to " + "<span class=\"blue\">" + (correctCount/questions.length)*100 + "%</span>!"
	
	let wordsSpan = document.getElementsByClassName("words-span");
	for (let i = 0; i < 4; i++) {
		wordsSpan[i].style.animation = "words 10s infinite";
	}
	
	word1.innerHTML = "w trąbkę";
	word2.innerHTML = words[Math.floor(Math.random() * words.length)];
	
	let interval = setInterval(() => {
		word1.innerHTML = words[Math.floor(Math.random() * words.length)];
		word2.innerHTML = words[Math.floor(Math.random() * words.length)];
	}, 10000)
}

function highlightQuestion(ansNumber, correct) {
	if (correct) {
		answers[ansNumber].style.border = "10px solid #9ece6a";
		return;
	}
	answers[ansNumber].style.border = "10px solid #f7768e";
}
function uncolorQuestions(){
	for(let i = 0; i < answers.length; i++){answers[i].style.border="none";}
}

function nextQuestion() {
	q.innerHTML = questions[index]["q"];
	for (let i = 0; i < 4; i++) {
		ansp[i].innerHTML = questions[index][i];
	}
	uncolorQuestions();
	
	timerPause = false;
	tbar.classList.remove("timer-animation");
	void tbar.offsetWidth;
	tbar.classList.add("timer-animation");
	tbar.style.animationPlayState = "running";
	
	timer();
}

let width = 0;
function timer() {
	width = 90;
	var id = setInterval(() => {
		if (timerPause) { 
			clearInterval(id);
			tbar.style.animationPlayState = "paused";
			return;
		}
			
		if (width <= 0) {
			clearInterval(id);
			ans(-1);
		} else {
			width--;
			if (width / 10 >= 1) {
				tlabel.innerHTML = Math.round(width / (9 / 10) / 10) + " s";
			}
			else {
				tlabel.innerHTML = Math.round((width / (9 / 10))) / 10 + " s";
			}
		}
	}, 100);
	tbar.classList.remove("timer-animation");
	void tbar.offsetWidth;
	tbar.classList.add("timer-animation");
}

function incorrect() {
	incorrectCount++;
	updateScore();
}
function correct() {
	correctCount++;
	updateScore();
}

function updateScore() {
	correctLabel.innerHTML = correctCount;
	wrongLabel.innerHTML = incorrectCount;
	cbar.style.width = ((100/questions.length) * correctCount)+"%";
	ibar.style.width = ((100/questions.length) * incorrectCount)+"%";
}