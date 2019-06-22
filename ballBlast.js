var started = false, gameOver = false, ended = false, canStart = false, name, asterisk = false;
var scoreText, score;
var playerRank = 2, scoreHistory = [[1, 'GOD', Infinity]];
var blue = 'rgba(100, 100, 255, 1)', pink = 'rgba(255, 100, 100, 1)', red = 'rgba(250, 50, 50, 0.9)', green = 'rgba(50, 250, 50, 0.9)', lightBlue = 'rgba(207, 228, 249, 0.95)', lightGreen = 'rgba(214, 239, 220, 0.95)', lightOrange = 'rgba(238, 190, 147, 0.9)';
var gray = 'rgba(240, 245, 250, 0.9)', grayTransparent = 'rgba(220, 220, 220, 0.7)', white = 'rgba(250, 250, 250, 1)', black = 'rgba(10, 10, 10, 0.8)', magenta = 'rgba(127, 0, 127, 0.9)', lighterBlack = 'rgba(10, 10, 10, 0.6)';
var backgroundColor = lightBlue;
var Start, Restart, PlayAgain, Play, GameOver, Name, BallBlast;
var stones, cannon, bullets, flags, g = 0.2, maxBullets, landmarkScoreBullets, bulletsRate;
var bulletFlags, canAttack, bulletsAlive;
var stoneRate, canGenerateStone, stonesAlive, maxStones, stoneGone;
var skyGradient, cannonGradient, wheelGradients = [cannonGradient, cannonGradient, cannonGradient];
var cannonX, cannonY, cannonWidth, cannonOpeningWidth, cannonHeight;
var prevName;
var alpha, hitStone, stoneAlpha, audio;

function load(){
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	scoreText = document.getElementById("score-text");
	
	scoreHistory = JSON.parse(localStorage.getItem('scoreHistory'));

	// localStorage.removeItem('firstTime');
	// localStorage.removeItem('secondTime');
	// localStorage.removeItem('thirdTime');

	if(localStorage.getItem('firstTime') == null){
		// scoreHistory = [[1, "GOD", Infinity], [2, "wr", 56],[3,"rq",55],[4,"sw",23],[5,"gg",22],[6,"as",21],[8,"es",13],[10,"eswar",8]]
		// console.log("Saved scoreHistory was : " + JSON.stringify(scoreHistory));
		let newScoreHistory = [], seenFlags = [], size = scoreHistory.length, counter = 1;
		while(size--)
			seenFlags.push(false);
		for (let i = 0; i < scoreHistory.length; ++i){		
			if(!seenFlags[i]){
				let highScore = scoreHistory[i][3], index = i;
				for (let j = i+1; j < scoreHistory.length; ++j){
					if(scoreHistory[j][2] === scoreHistory[i][2]){
						seenFlags[j] = true;
						if(scoreHistory[j][3] > highScore[0]){
							highScore[0] = scoreHistory[j][3];
							index = j;
						}
					}
				}
				newScoreHistory.push([counter, scoreHistory[index][2], scoreHistory[index][3]]);
				++counter;
			}
		}
		scoreHistory = newScoreHistory;

		localStorage.setItem('firstTime', "Not firstTime time");
		// console.log("Changed Score History is: " + JSON.stringify(scoreHistory));
	}
	else{
		// console.log("Saved scoreHistory was : " + JSON.stringify(scoreHistory));
		changeScoreHistory();
		// console.log("Changed Score History is: " + JSON.stringify(scoreHistory));
	}
	

	changeScoreboard();

	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();

	skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
	skyGradient.addColorStop(0, 'rgb(135, 206, 250)');
	skyGradient.addColorStop(0.72, 'rgb(204, 230, 230)');
	skyGradient.addColorStop(0.73, 'rgb(204, 230, 230)');
	skyGradient.addColorStop(0.81, 'rgb(124, 218,124)');
	skyGradient.addColorStop(0.97, 	'rgb(124, 218,124)');
	// skyGradient.addColorStop(0.97, 'rgb(144,238,144)');
	skyGradient.addColorStop(1, 'rgb(154, 219, 184)');

	Start = new Button('Start!', 'start');
	Start.draw(green);
}
function start(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	console.log("In start");
	init();
	raf = window.requestAnimationFrame(draw);
}
function restart(){
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	init();
	raf = window.requestAnimationFrame(draw);
}
function init(){
	started = true;
	gameOver = false;
	score = 0;
	stoneRate = 50;
	cannon = new Cannon(canvas.width/2, canvas.height - 20);
	bullets = [];
	stones = [];
	bulletFlags = [];
	canAttack = true;
	canGenerateStone = true;
	flags = [true, true, true];
	stoneGone = false;	
	maxBullets = 1;
	maxStones = 3;
	bulletsRate = 8;
	bulletsAlive = 0;
	stonesAlive = 0;
	landmarkScoreBullets = 2;

	alpha = 1;
	stoneAlpha = 0.1;

	audio = new Audio("res/intro_screen.mp3");

	audio.volume = 0.5;
	audio.play();

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBackground();

	createNewRow();

	document.addEventListener("keydown", arrowControl);
}

function changeScoreHistory(){
	let newScoreHistory = [], seenFlags = [], size = scoreHistory.length, counter = 1;
	while(size--)
		seenFlags.push(false);
	for (let i = 0; i < scoreHistory.length; ++i){		
		if(!seenFlags[i]){
			let highScore = scoreHistory[i][2], index = i;
			for (let j = i+1; j < scoreHistory.length; ++j){
				if(scoreHistory[j][1] === scoreHistory[i][1]){
					seenFlags[j] = true;
					if(scoreHistory[j][2] > highScore[0]){
						highScore[0] = scoreHistory[j][2];
						index = j;
					}
				}
			}
			newScoreHistory.push([counter, scoreHistory[index][1], scoreHistory[index][2]]);
			++counter;
		}
	}
	scoreHistory = newScoreHistory;
}

function changeScoreboard(){
	scoreboard.innerHTML = "<tr><th>Rank</th><th>Name</th><th>Score</th></tr><tr><td>1</td><td>GOD</td><td>Infinity</td></tr>";

	for (let i = 1; i < scoreHistory.length; ++i){
		let newRow = document.createElement("tr");

		let newRank = document.createElement("td");
		let newName = document.createElement("td");
		let newScore = document.createElement("td");

		newRank.innerHTML = scoreHistory[i][0];	
		newName.innerHTML =  scoreHistory[i][1];
		newScore.innerHTML = scoreHistory[i][2];

		newRow.appendChild(newRank);
		newRow.appendChild(newName);
		newRow.appendChild(newScore);	

		scoreboard.appendChild(newRow);
	}
}

function createNewRow(){
	playerRank = scoreHistory.length + 1;

	var newRow = document.createElement("tr");

	var newRank = document.createElement("td");
	var newName = document.createElement("td");
	var newScore = document.createElement("td");

	newRank.innerHTML = playerRank;	
	newScore.innerHTML = score;

	newName.innerHTML =  name + '*';
	scoreHistory.push([playerRank, name, score]);

	newRow.appendChild(newRank);
	newRow.appendChild(newName);
	newRow.appendChild(newScore);	

	scoreboard.appendChild(newRow);
}

function draw(){
	drawBackground();
	if(alpha >= 0.1){
		cannon.draw();
		alpha -= 0.01;
		if(alpha < 0.1){
			audio.restartNew("res/off_limits.mp3");
		}
		ctx.save();
		ctx.globalAlpha = alpha;
		writeText("Move with", canvas.width/2, canvas.height/2, magenta, 1, 2);
		writeText("Arrow Keys", canvas.width/2, canvas.height/2, magenta, 2, 2);
		ctx.restore();
	}
	else{
		var deletedBulletIndices = [], changed = false;
		score += 0.01;
		scoreText.innerHTML = "Score : " + Math.floor(score);

		scoreHistory[playerRank - 1][2] = Math.floor(score);

		if(score >= scoreHistory[playerRank - 2][2]){
			console.log("Current score was greater than previous score");
			swapScoreHistory(playerRank - 1, playerRank - 2);	
			swapTableTexts(playerRank, playerRank - 1);
			--playerRank;
		}
		scoreboard.rows[playerRank].cells[2].innerHTML = Math.floor(score);

		if(score >= landmarkScoreBullets && maxBullets <= 5){
			++maxBullets;
			landmarkScoreBullets += 4;
			if(maxBullets == 3){
				landmarkScoreBullets += 2;
			}
			else if(maxBullets == 4){
				landmarkScoreBullets += 4;
			}
			else if((maxBullets == 2) || (maxBullets == 4) || (maxBullets == 6)){
				++maxStones;
			}

		}

		cannon.draw();

		if(canAttack){
			for(let i = 0; i < maxBullets; ++i){
				bullets.push(new Bullet(cannon.x, cannon.y, cannon.width, cannon.openingWidth, i+1, maxBullets));
				++bulletsAlive;	
				// console.log("New Bullet Pushed");
			}
			canAttack = false;
			flags[0] = true;
		}

		if(bulletsAlive > 0){
			if(flags[0]){
				// console.log("bulletsAlive = " + bulletsAlive);
				flags[0] = false;
			}
		}

		if(canGenerateStone){
			stones.push([new Stone(), true]);
			++stonesAlive;
			// console.log("New Stone Pushed");
			canGenerateStone = false;
		}

		bullets.forEach(function(bullet, bulletIndex){
			if(!bullet.isLoaded()){
				bullet.getImage().onload = function(){
					bullet.setLoaded();
				}
			}
			stones.forEach((stone, stoneIndex) => {
				if(circleCollidesRectangle(stone[0], bullet) && stone[0].isAlive() && bullet.isLoaded() && bullet.isAlive()){
					// console.log("Bullet hit a stone");
					score += 0.1;
					deletedBulletIndices.push(bulletIndex);
					stone[0].reduceStrength();
				}

			});

			if(!bullet.isAlive() && bullet.isLoaded()){
				// console.log("Bullet crossed the canvas");
				deletedBulletIndices.push(bulletIndex);
			}
			bullet.draw();
		});

		for (let i = 0; i < stonesAlive; ++i){		
			if(!stones[i][0].isAlive()){
				--stonesAlive;
				// console.log("One " + ((stones[i][1])? "original" : "duplicated") + " stone is not alive");
				if(stones[i][1]){
					stones.push([new Stone(stones[i][0].initialStrength/2, stones[i][0].x , stones[i][0].y, false), false]);
					stones.push([new Stone(stones[i][0].initialStrength/2, stones[i][0].x , stones[i][0].y, true), false]);
					stonesAlive += 2;
					// console.log("Two new stones pushed from Original stone");
					canGenerateStone = false;
				}			
				let deletedStone = stones.splice(i, 1);			
				// stoneGone = true;			
			}
			else{

				stones[i][0].draw();
			}

		}

		stones.forEach((stone, index)=>{
			if((circleCollidesRectangle(stone[0], cannon) || circleCollidesCircle(stone[0], cannon.leftWheel) || circleCollidesCircle(stone[0], cannon.rightWheel)) && stone[0].isAlive()){
					// console.log("Stone collided with cannon");
					gameOver = true;
					hitStone = stone[0];
					hitStone.setAlive(false);
					console.log("Game Over");
					audio.volume = 0.7;
					audio.restartNew("res/game_over.mp3");
					window.cancelAnimationFrame(raf);
					endingScene();
				}
		});

		bullets = bullets.filter((bullet, index) => {
			var flag = true;
			for (i of deletedBulletIndices){
				if(i === index){
					flag = false;
					break;
				}
			}

			if(!flag){
				bullet.setAlive(false);
				--bulletsAlive;		
				// console.log("Bullet deleted");
				// console.log("bulletsAlive = " + bulletsAlive);	
				changed = true;
			}

			else{
				return bullet;
			}
		});


		if(!canAttack){
			bulletsRate -= 1;
			if(bulletsRate <= 0){
				canAttack = true;
				bulletsRate = 8;
			}
		}

		if(!canGenerateStone){
			stoneRate -= 1;
			if(stoneRate <= 0 && stonesAlive < maxStones){
				canGenerateStone = true;
				stoneRate = 50;
			}
			else if(stoneRate <= 0){
				stoneRate = 50;
			}
		}
	}
	if(!gameOver){
		raf = window.requestAnimationFrame(draw);
	}
}

function endingScene(){
	
	alpha += 0.008;
	stoneAlpha += 0.06;
	if(stoneAlpha >= 1){
		stoneAlpha = 0.1;
	}
	if(alpha <= 1){
		let centerY = Math.floor(canvas.height/2 - 50 * 3 / 2);
		ctx.save();
		ctx.globalAlpha = alpha;
		writeText("Game Over!", canvas.width/2, centerY, red);
		ctx.restore();

		ctx.save();
		hitStone.animateBorder(stoneAlpha);
		ctx.restore();

		textAnim = window.requestAnimationFrame(endingScene);
	}
	else{
		window.cancelAnimationFrame(textAnim);
		ending();
	}
}

function ending(){
	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();

	started = false;
	ended =  true;

	audio.stop();

	prevName = scoreboard.rows[playerRank].cells[1].innerHTML;
	prevName = prevName.slice(0, -1);
	console.log("Previous name in scoreboard is : " + prevName);
	scoreboard.rows[playerRank].cells[1].innerHTML = prevName;
	// console.log("playerRank = " + playerRank);

	changeScoreHistory();
	changeScoreboard();

	GameOver = new Button('Game Over!');
	GameOver.draw(red, 2, 1);

	PlayAgain = new Button('Play Again', 'restart');	
	PlayAgain.draw(green, 2, 2);
}

Audio.prototype.stop = () => {
	audio.pause();
	audio.currentTime = 0;
}

Audio.prototype.restartNew = (uri) => {
	audio.stop();
	audio = new Audio(uri);
	audio.play();
}

function drawBackground(){
	ctx.save();
	ctx.fillStyle = skyGradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();
}

function submit(){
	canStart = false;
	asterisk = false;

	if(!started || ended){
		if(ended){
			if(PlayAgain)
				if(PlayAgain.drew)
					PlayAgain.clear();
			if(Play)
				if(Play.drew)
					Play.clear();
			if(GameOver)
				if(GameOver.drew)
					GameOver.clear();

			Restart = new Button("Start", 'restart');
			Restart.draw(green);
		}
		name = document.getElementById("name").value;
		if(name != "" && name != null){
			var lastLetter = name.slice(-1);
			// console.log("Last Letter is : " + lastLetter);
			if(lastLetter === '*'){
				asterisk = true;
				alert("Please do not use *(asterisk) at the end of your name!");
			}
			else{
				canStart = true;
				Name = new Button(name);
				Name.draw(black, 3, 1);

				BallBlast = new Button("Ball Blast");			
				BallBlast.draw(black, 3, 3);
			}
		}
		else{
			alert("Please enter your name before submitting!");
		}
	}
}

window.onbeforeunload = function (e) {
	e = e || window.event;

	if(started && !ended){
		var prevName = scoreHistory[playerRank - 1][1];
		console.log("Score History is " + scoreHistory);
		console.log("Previous name before exiting was: " + prevName);

		for(let i = playerRank; i < scoreHistory.length; ++i){
			if(scoreHistory[i][1] === scoreHistory[playerRank][1]){
				let removedScore = scoreHistory.splice(i, 1);
			}
		}

		scoreHistory.forEach((row, index) => {
			scoreHistory[index][0] = index;
		});
	  }
  
	localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
};
function getMousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: event.clientX - rect.left,
	  y: event.clientY - rect.top
	};
}
	
//Function to check whether a point is inside a rectangle
function isInside(pos, rect){
	return (pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y);
}

function arrowControl(e) {
	var code = e.keyCode ? e.keyCode : e.which;
	if (code === 37) { //left key
		cannon.x -= 20;
		if(cannon.x - cannon.leftWheel.radius*2 <= 0){
			cannon.x = cannon.leftWheel.radius*2;
		}
	}
	else if (code === 39) {
		cannon.x += 20;
		if(cannon.x + cannon.width + cannon.rightWheel.radius*2 >= canvas.width){
			cannon.x = canvas.width - cannon.width - cannon.rightWheel.radius*2;
		}
	}
};

class Button{
	constructor(text, action = 'none'){

		ctx.save();
		this.text = text;

		ctx.font = '400 40px Kremlin Pro Web';
		this.width = ctx.measureText(this.text).width;
		this.x = canvas.width/2 - this.width/2;
		this.height = 50;
		this.start = false;
		this.restart = false;

		switch(action){
			case 'start' : this.start = true; break;
			case 'restart' : this.restart = true; break;
		}
			
	}
	draw(color, noOfButtons = 1, number = 1){
	
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, this.y, canvas.width, this.height);
		if(noOfButtons == 1)
			this.y = canvas.height/2 - this.height/2;
		else
			this.y = canvas.height/2 - this.height/2 + (2*number - (noOfButtons + 1)) * this.height * 3 / 2;
		if(this.start || this.restart)
			ctx.fillStyle = white;
		else
			ctx.fillStyle = backgroundColor;
		ctx.clearRect(this.x, this.y, this.width, this.height);		
		ctx.fillRect(this.x, this.y, this.width, this.height);

		ctx.fillStyle = color;

		ctx.fillText(this.text, this.x, this.y + this.height - 10);
		ctx.restore();

		this.drew = true;

		if(this.restart || this.start){
			this.clickEventListenerBind = this.click.bind(this);
			document.addEventListener('click', this.clickEventListenerBind, true);
		}		
	}
	clear(){
		ctx.clearRect(this.x, this.y, this.width, this.height);
		ctx.save();
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
	click(e){
		
		if(isInside(getMousePos(canvas, e), this)){
			
			if(gameOver && this.restart){
				if(canStart){
					document.removeEventListener('click', this.clickEventListenerBind, true);
					restart();
				}
				else{
					alert("Please enter your name before starting game");
				}				
			}
			else if(this.start){
				if(canStart){
					document.removeEventListener('click', this.clickEventListenerBind, true);
					start();
				}
				else{
					alert("Please enter your name before starting game");
				}				
			}
		}
	}
}

class Stone{
	constructor(strength = -1, x, y, rightDirection = true){
		[this.primaryColor, this.secondaryColor] =  randomColors();
		// console.log("Primary Color: " + this.primaryColor + " Secondary Color: " + this.secondaryColor);
		this.vx = 2;
		if(strength == -1){
			this.original = true;
			this.strength = Math.floor(Math.random()*91) + 10;
			// console.log("Inital strength was : " + this.strength);
			this.radius = 30 + Math.floor((this.strength - 10)/90 * 10);
			this.side = randomBoolean(50);
			this.loaded = false;
			this.loadingTime = 10;
			this.direction = true;

			if(this.side){
				this.x = canvas.width - this.radius;
				this.vx = -2;
			}
			else{
				this.x = this.radius;
				this.vx = 2;
			}
			this.vy = 2;
			this.y = 100;
		}
		else{
			this.original = false;
			this.direction = rightDirection;
			// console.log("New stone in constructor with strength = " + strength + " x = " + x + " y = " + y.toFixed(2));
			if(this.direction){
				this.strength = Math.floor((strength + 1)/2);
				this.vx = 2;
				this.radius = 30 + Math.floor((this.strength - 10)/90 * 10);
				this.x = x + Math.floor(this.radius/2);
			}
			else{
				this.strength = Math.floor((strength - 1)/2);
				this.vx = -2;
				this.radius = 30 + Math.floor((this.strength - 10)/90 * 10);
				this.x = x - Math.floor(this.radius/2);
			}

			this.loaded = false;
			this.loadingTime = 0;

			this.vy = -g - 3;
			this.y = y;
		}

		this.initialStrength = this.strength;
		this.alive = true;
		
		this.numberOfSides = 10;
		this.hitFlag = true;
	}
	draw(){  

		if(this.strength <= 0){
			this.alive = false;
		} 

		if(this.alive){
			this.radius = 30 + Math.floor((this.strength - 10)/90 * 10);

			drawPolygon(this.numberOfSides, this.radius - 5, this.x, this.y, this.primaryColor, false, secondaryColor(this.primaryColor));
			drawPolygon(this.numberOfSides, this.radius, this.x, this.y, this.secondaryColor, false);

			writeText(this.strength, this.x, this.y);

			if(!this.loaded){
				--this.loadingTime;
				
				if (this.x + this.radius + this.vx >= canvas.width || this.x - this.radius + this.vx <= 0){
					this.vx = -1 * this.vx;
				}

				this.x += this.vx;

				if(this.loadingTime <= 0){
					this.loaded = true;
					this.loadingTime = 0;
				}
			}
			else{

				if((this.y + this.radius + this.vy)>= canvas.height){
					this.vy = -1 * this.vy - g;
				}
				else if((this.y - this.radius + this.vy) <= 0){
					this.vy = -1 * this.vy - g;
				}
				if (this.x + this.radius + this.vx >= canvas.width || this.x - this.radius + this.vx <= 0){
					this.vx = -1 * this.vx;
				}

				this.vy += g;
				this.y += this.vy ;
				this.x += this.vx;	
			} 
		}   
	}
	reduceStrength(){
		if((this.strength > 0) && this.alive){
			// console.log("Strength reduced to : " + this.strength);
			this.strength -= 5;
		}
		if(this.strength <= 0){
			this.alive = false;
			score += 1;
			this.hide();
		}
	}
	isAlive(){
		return this.alive;
	}
	setAlive(alive){
		this.alive = alive;
	}
	animateBorder(stoneAlpha, color = white){
		if(this.hitFlag){
			this.radius = 30 + Math.floor((this.strength - 10)/90 * 10);
			this.x -= this.vx;
			this.y -= this.vy;
			this.hitFlag = false;
		}
		drawPolygon(this.numberOfSides, this.radius - 5, this.x, this.y, this.primaryColor, false, secondaryColor(this.primaryColor));
		drawPolygon(this.numberOfSides, this.radius, this.x, this.y, this.secondaryColor, true, color, true, stoneAlpha);

		writeText(this.strength, this.x, this.y);
	}
	hide(){
		ctx.save();
		drawPolygon(this.numberOfSides, this.radius, this.x, this.y, skyGradient, false);
		ctx.restore();
	}
	displayXY(){
		console.log("x = " + this.x.toFixed(2) + ", y = " + this.y.toFixed(2));
	}
}

function drawPolygon(numberOfSides, size, Xcenter, Ycenter, color, stroke = true, strokeColor = 'rgb(0, 0, 0)', animate = false, stoneAlpha = 0.9){
	ctx.save();
	ctx.beginPath();
	ctx.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));  
	for (var i = 1; i <= numberOfSides;i += 1) {
		 ctx.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
	}
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
	
	if(stroke){
		if(animate){
			ctx.globalAlpha = stoneAlpha;
		}
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = 1;
		ctx.stroke();		
	}
	
	ctx.restore();
}

class Cannon{
	constructor(x, y){
		this.height = 46;
		this.width = 36;
		this.x = x - this.width/2;
		this.y = y - this.height;
		this.openingX = this.x + (this.width - this.openingWidth)/2;
		this.openingWidth = this.width * 0.6;
		this.leftWheel = new Wheel(this.x + (this.width - this.openingWidth)/4, this.y + this.height, this.width*0.4, true);
		this.rightWheel = new Wheel(this.x + this.width - (this.width - this.openingWidth)/4,  this.y + this.height, this.width*0.4, false);
		cannonGradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
		cannonGradient.addColorStop(0, '#CD853F');
		cannonGradient.addColorStop(0.05, '#CD853F');
		cannonGradient.addColorStop(0.8, '#772f1a');
		cannonGradient.addColorStop(1, '#772f1a');				
		this.color = cannonGradient;
	}
	draw(){
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(this.x + (this.width - this.openingWidth)/2, this.y);
		ctx.lineTo(this.x + (this.width + this.openingWidth)/2, this.y);
		ctx.lineTo(this.x + this.width, this.y + this.height);
		ctx.lineTo(this.x, this.y + this.height);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.restore();

		this.leftWheel.updateTo(this.x + (this.width - this.openingWidth)/4);
		this.rightWheel.updateTo(this.x + this.width - (this.width - this.openingWidth)/4 );

		this.leftWheel.draw();
		this.rightWheel.draw();
	}
	getCoordinates(){
		return [this.x , this.y, this.width, this.openingWidth, this.height];
	}
}

class Bullet{
	constructor(x, y, base, span, bulletNumber = 1, maxBullets = 1){
		this.height = 24;
		this.width = 24;

		this.base = base;
		this.span = span;
		this.bulletNumber = bulletNumber;
		this.maxBullets = maxBullets;

		this.x = x - this.width/2 + this.base/2;
		if(this.maxBullets > 1 && this.bulletNumber != (this.maxBullets + 1)/2){
			this.x = x - this.width/2 + (this.base - this.span)/2 + (this.bulletNumber - 1)/(this.maxBullets - 1) * this.span;
		}

		this.y = y - this.height;
		this.vy = 7;
		this.alive = true;
		this.loaded = false;
		this.flag = true;
		this.img = new Image();	
		this.img.src = "res/bullet.png";
	}
	draw(){
		if(this.flag){
			// console.log("Inside Bullet draw: loaded = " + this.loaded);
		}
		// this.x = x - this.width/2 + this.base/2;
		// if(this.maxBullets > 1 && this.bulletNumber != (this.maxBullets + 1)/2){
		// 	this.x = x - this.width/2 + (this.base - this.span)/2 + (this.bulletNumber - 1)/(this.maxBullets - 1) * this.span;
		// }

		if(this.alive && this.loaded){
			ctx.drawImage(this.img, this.x, this.y + 2, this.width, this.height);
			if(this.flag){
				// console.log("Original image dimensions: Width = " + this.img.width + " Height = " + this.img.height);
				// console.log("x = " + this.x + " y = " + this.y + " this.width = " + this.width + " this.height = " + this.height);
				// console.log("Image was drawn");
				this.flag = false;
			}

			this.y -= this.vy;
		}

		if(this.y <= 0){
				this.alive = false;
				// console.log("Bullet set to this.alive = " + this.alive);				
		}
		
	}
	getImage(){
		return this.img;
	}
	setLoaded(loaded = true){
		this.loaded = loaded;
		// console.log("Loaded set to " + this.loaded);
	}
	isLoaded(){
		return this.loaded;
	}
	isAlive(){
		return this.alive;
	}
	setAlive(alive){
		this.alive = alive;
	}
	hide(){
		// ctx.save();
		// ctx.fillStyle = skyGradient;
		// ctx.fillRect(this.x, this.y, this.width, this.height);
		// ctx.restore();
	}
}
class Wheel{
	constructor(x, y, radius, alignLeft = true){
		this.radius = radius;
		this.alignLeft = alignLeft;

		if(this.alignLeft){
			this.x = x - this.radius;
		}
		else{
			this.x = x + this.radius;
		}
		this.y = y;
		this.externalRadius = this.radius * 5/6;
		this.internalRadius = this.radius * 1/6;

		this.createGradients();
	}
	draw(){
		this.createGradients();
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.internalRadius, 0, Math.PI*2);
		ctx.closePath();
		ctx.stroke();
		ctx.fillStyle = this.wheelGradients[2];
		ctx.fill();

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.externalRadius, 0, Math.PI*2);
		ctx.moveTo(this.x + this.radius, this.y);
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.closePath();
		ctx.stroke();
		ctx.fillStyle = this.wheelGradients[0];
		ctx.fill();

		ctx.fillStyle = this.wheelGradients[1];
		for(let t = 0, dt = Math.PI/10; t < Math.PI*2; t += Math.PI*2/5){
			let x1 = this.x + this.internalRadius * Math.cos(t);
			let y1 = this.y - this.internalRadius * Math.sin(t);

			let x2 = this.x + this.externalRadius * Math.cos(t);
			let y2 = this.y - this.externalRadius * Math.sin(t);

			let x3 = this.x + this.internalRadius * Math.cos(t + dt);
			let y3 = this.y - this.internalRadius * Math.sin(t + dt);

			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.arc(this.x, this.y, this.externalRadius, -t, -(t + dt), true);
			ctx.lineTo(x3, y3);
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
		}
		ctx.restore();
	}
	updateTo(x){
		if(this.alignLeft){
			this.x = x - this.radius;
		}
		else{
			this.x = x + this.radius;
		}
	}
	createGradients(){
		this.wheelGradients = [];

		wheelGradients[0] = ctx.createRadialGradient(this.x, this.y, this.externalRadius, this.x, this.y, this.radius);
		wheelGradients[0].addColorStop(0, 'rgba(205,133,63, 0)');
		wheelGradients[0].addColorStop(0.05, '#CD853F');
		wheelGradients[0].addColorStop(0.8, '#772f1a');
		wheelGradients[0].addColorStop(1, 'rgba(119, 47, 26, 0)');

		wheelGradients[1] = ctx.createRadialGradient(this.x, this.y, this.internalRadius, this.x, this.y, this.externalRadius);
		wheelGradients[1].addColorStop(0, 'rgb(205,133,63)');
		wheelGradients[1].addColorStop(0.55, 'rgb(205,133,63)');
		wheelGradients[1].addColorStop(0.95, '#772f1a');
		wheelGradients[1].addColorStop(1, '#772f1a');

		wheelGradients[2] = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.internalRadius);
		wheelGradients[2].addColorStop(0, '#CD853F');
		wheelGradients[2].addColorStop(0.05, '#CD853F');
		wheelGradients[2].addColorStop(0.8, '#772f1a');
		wheelGradients[2].addColorStop(1, '#772f1a');

		this.wheelGradients.push(wheelGradients[0]);
		this.wheelGradients.push(wheelGradients[1]);
		this.wheelGradients.push(wheelGradients[2]);
	}
}

function circleCollidesRectangle(Circle, Rectangle){
	var cx = Circle.x;
	var cy = Circle.y;
	var cr = Circle.radius;
	var rx = Rectangle.x;
	var ry = Rectangle.y;
	var rw = Rectangle.width;
	var rh = Rectangle.height;

	var distX = Math.abs(cx - rx - rw / 2);
	var distY = Math.abs(cy - ry - rh / 2);

	if (distX > (rw / 2 + cr)) {
	   return false;
	}
	if (distY > (rh / 2 + cr)) {
	   return false;
	}

   if (distX <= (rw / 2)) {
	   return true;
	}
	if (distY <= (rh / 2)) {
	   return true;
	}

	var dx = distX - rw / 2;
	var dy = distY - rh / 2;
	return (dx * dx + dy * dy <= (cr * cr));
}

function circleCollidesCircle(c1, c2){
	var x1 = c1.x, y1 = c1.y, r1 = c1.radius;
	var x2 = c2.x, y2 = c2.y, r2 = c2.radius;

	if(distance([x1, y1], [x2, y2]) < (r1 + r2)){
		console.log("Stone collided with one of the wheels");
		return true;
	}
	else{
		return false;
	}
}

function distance(p1, p2){
	return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}

function randomBoolean(probability){
	let n = probability/100;
	let rand = Math.random();
	return (rand < n) ? true : false;
}

function swapScoreHistory(i, j){
	var arr = [1, 2];
	arr.forEach(function(value){
		[scoreHistory[i][value], scoreHistory [j][value]] = [scoreHistory[j][value], scoreHistory [i][value]];
	});
}
function swapTableTexts(i, j){
	var arr = [1, 2];
	arr.forEach(function(value){
		[scoreboard.rows[i].cells[value].innerHTML, scoreboard.rows[j].cells[value].innerHTML] = [scoreboard.rows[j].cells[value].innerHTML, scoreboard.rows[i].cells[value].innerHTML]	
	});
}

function max(a, b){
	return ((a > b) ? a : b);
}

function returnNonNegative(a, b, operation, type){
	if(type === 'width'){
		if(operation === '-'){
			return ((a - b) >= 0) ? a-b : a;
		}
		else if(operation === '+'){
			return  ((a + b) <= canvas.width) ? a + b : a;
		}
	}
	else if(type === 'color'){

		if(operation === '-'){
			return ((a - b) >= 0) ? a-b : a;
		}
		else if(operation === '+'){
			return  ((a + b) <= 255) ? a + b : a;
		}
	}
}

function writeText(text, Xcenter, Ycenter, color = white, number = 1, numberOfLines = 1, small = false){
	let x, y;
	ctx.save();
	if(!small){
		ctx.fillStyle = color;
		ctx.font = '48px serif';

		x = ctx.measureText(text).width;
		y = ctx.measureText('M').width;
	}
	else{
		ctx.fillStyle = color;
		ctx.font = '40px serif';

		x = ctx.measureText(text).width;
		y = ctx.measureText('M').width;
	}

	if(numberOfLines == 1){	
		ctx.fillText(text, Xcenter - x/2, Ycenter + y/2.5);
	}
	else{
		ctx.fillText(text, Xcenter - x/2, Ycenter + y/2.5 + (2*number - (numberOfLines+1))*2*y/2.5)
	}
	ctx.restore();
}

function randomColors(twoColors = true){
	// console.log("In randomColors:");
	var color1 = Math.floor(Math.random()*255);
	var color2 = Math.floor(Math.random()*255);
	var color3 = Math.floor(Math.random()*255);
	// console.log("color1: " + color1 + " color2: " + color2 + " color3: " + color3);

	var primaryColors = [color1, color2, color3];
	var primaryColor = 'rgba(' + primaryColors[0] + ',' + primaryColors[1] + ',' + primaryColors[2] + ',1' + ')';

	if(Math.abs(color1 - color2) < 20 && Math.abs(color2 - color3) < 20 && Math.abs(color3 - color1) < 20){
		primaryColors = [250, 10, 10];
	}

	if(twoColors){
		let secondaryColors = [];
		let maxColorIndex = primaryColors.indexOf(Math.max(...primaryColors));
		primaryColors.forEach(function(color, index){
			if(index == maxColorIndex){
				secondaryColors.push(230);
			}
			else{
				secondaryColors.push(180);
			}
		});
		let secondaryColor = 'rgb(' + secondaryColors[0] + ',' + secondaryColors[1] + ',' + secondaryColors[2] + ',0.9' + ')';
		// console.log("Primary Color: " + primaryColor + " Secondary Color: " + secondaryColor);
		return [primaryColor, secondaryColor];
	}
	return [primaryColor];
}

function secondaryColor(color){
		// console.log("In secondaryColor: ");
		// console.log("primaryColor was: " + color);

	let c1, c2, c3, a;
	res = color.split('rgba(')[1];
	[c1, c2, c3, a] = res.split(',');
	let primaryColors = [c1, c2, c3];

		// console.log("c1: " + c1 + " c2: " + c2 + " c3: " + c3);

	var secondaryColors = [];
	let maxColorIndex = primaryColors.indexOf(Math.max(...primaryColors));
	primaryColors.forEach(function(color, index){
		if(index == maxColorIndex){
			secondaryColors.push(returnNonNegative(parseInt(color), 45, '-', 'color'));
		}
		else{
			secondaryColors.push(returnNonNegative(parseInt(color), 45, '+', 'color'));
		}
	});
	var secondaryColor = 'rgba(' + secondaryColors[0] + ',' + secondaryColors[1] + ',' + secondaryColors[2] + ',1)';
	
	return secondaryColor;
}