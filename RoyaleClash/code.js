const divs = {
	loading: document.getElementById("loadingWindow"),
	menu: document.getElementById("menuWindow"),
	game: document.getElementById("gameWindow")
}
const debug = {
	lists: {
		knight: document.getElementById("knightList"),
		megaknight: document.getElementById("megaknightList"),
		minipekka: document.getElementById("minipekkaList"),
		health: document.getElementById("healthList")
	},
	labels: {
		closest: document.getElementById("closestLabel"),
		name: document.getElementById("nameLabel")
	}
}
const cards = {
	castle: {
		king: {
			maxHP: 2400,
			damage: 50,
			speed: null,
			attackSpeed: 0,
			range: 0
		},
		princess: {
			maxHP: 1400,
			damage: 50,
			speed: null,
			attackSpeed: 0,
			range: 0
		}
	},
	minipekka: {
		maxHP: 817,
		damage: 0,
		speed: 10,
		attackSpeed: 0,
		range: 0,
		cost: 4,
		summonTime: 2
	},
	megaknight: {
		maxHP: 2400,
		damage: 0,
		speed: 10,
		attackSpeed: 0,
		range: 0,
		cost: 7,
		summonTime: 3
	},
	knight: {
		maxHP: 690,
		damage: 50,
		speed: 10,
		attackSpeed: 0,
		range: 0,
		cost: 3,
		summonTime: 1.5
	}
}
let blueOnField = {
	castles: {
		HP: [],
		ids: [],
		count:  3
	},
	minipekka: {
		HP: [],
		ids: [],
		count: 0
	},
	megaknight: {
		HP: [],
		ids: [],
		count: 0
	},
	knight: {
		HP: [],
		ids: [],
		count: 0
	}
}
let redOnField = {
	castles: {
		HP: [],
		ids: [],
		count:  3
	},
	minipekka: {
		HP: [],
		ids: [],
		count: 0
	},
	megaknight: {
		HP: [],
		ids: [],
		count: 0
	},
	knight: {
		HP: [],
		ids: [],
		count: 0
	}
}
const global = {
	bridges: {
		//All from blue's perspective
		blueRight: [875,345],
		blueLeft: [650,345],
		redRight: [875,305],
		redLeft: [650,305]
	}
}

let elixir = 0, elixirGain = 1, timer = 180, overtime = 0, time = 50;
let redCrowns = 0, blueCrowns = 0, totalCrowns = 0;
let inGame = false;
const counters = {
	elixir: document.getElementById("elixirCount"),
	timer: document.getElementById("timer")
}

function beginGame(){
	divs.menu.style.display = "none";
	divs.game.style.display = "block";
	inGame = true;
}

setInterval(() => {	
	if(inGame){
		gameTick();
		updateScreen();
		moveCards();
		checkAttacks();
	}
	debugTick();
}, time);

function gameTick(){
	if(elixir < 10){elixir += elixirGain / (1000 / time);}
	timer -= (time/1000);
	if(timer <= 0){
		if(redCrowns == blueCrowns && overtime == 0 && totalCrowns > 0){
			timer = 60;
			overtime = 1;
			elixirGain = 2;
		} 
		else if (redCrowns > blueCrowns){alert("youlose");} 
		else if (redCrowns < blueCrowns){alert("youwin");}
		else if (redCrowns == blueCrowns && overtime == 1){
			timer = 60;
			overtime = 2;
			elixirGain = 3;
		} else if (redCrowns == blueCrowns && overtime == 2){alert("tie")}
	}
	if(overtime == 3 && redCrowns != blueCrowns){
		if(redCrowns > blueCrowns){alert("youlose")}
		if(blueCrowns > redCrowns){alert("youwin")}
	}
}

function updateScreen(){
	counters.elixir.textContent = elixir.toFixed(1);
	counters.timer.textContent = timer.toFixed();
	
}

function placeCard(x, y, team, card){
	if(team == 'blue' && card=='knight' && canPlace(x, y, cards.knight.cost, team)){styleElement(x, y, 'knight.jpeg', card, team);}
	if(team == 'blue' && card=='megaknight' && canPlace(x, y, cards.megaknight.cost, team)){styleElement(x, y, 'megaknight.jpeg', card, team);}
	if(team == 'blue' && card=='minipekka' && canPlace(x, y, cards.minipekka.cost, team)){styleElement(x, y, 'minipekka.jpeg', card, team);}
	if(team == 'blue' && card=='PLACEHOLDER' && canPlace(x, y, cards.PLACEHOLDER.cost, team)){styleElement(x, y, 'PLACEHOLDER.jpeg', card, team);}
	if(team == 'blue' && card=='PLACEHOLDER' && canPlace(x, y, cards.PLACEHOLDER.cost, team)){styleElement(x, y, 'PLACEHOLDER.jpeg', card, team);}
	if(team == 'blue' && card=='PLACEHOLDER' && canPlace(x, y, cards.PLACEHOLDER.cost, team)){styleElement(x, y, 'PLACEHOLDER.jpeg', card, team);}
	if(team == 'blue' && card=='PLACEHOLDER' && canPlace(x, y, cards.PLACEHOLDER.cost, team)){styleElement(x, y, 'PLACEHOLDER.jpeg', card, team);}
	if(team == 'blue' && card=='PLACEHOLDER' && canPlace(x, y, cards.PLACEHOLDER.cost, team)){styleElement(x, y, 'PLACEHOLDER.jpeg', card, team);}
}


dragElement(document.getElementById("minipekka"));
dragElement(document.getElementById("megaknight"));
dragElement(document.getElementById("knight"));
dragElement(document.getElementById("PLACEHOLDER"));
dragElement(document.getElementById("PLACEHOLDER"));
dragElement(document.getElementById("PLACEHOLDER"));
dragElement(document.getElementById("PLACEHOLDER"));
dragElement(document.getElementById("PLACEHOLDER"));


function dragElement(elmnt) {
	let pos1 = 100;
	let pos2 = 0, pos3 = 0, pos4 = 0;
	let ogx = elmnt.style.left + 100;
	let ogy = elmnt.style.top;
	if (document.getElementById(elmnt.id + "header")) {
	    // if present, the header is where you move the DIV from:
		document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
	} else {
		// otherwise, move the DIV from anywhere inside the DIV:
	    elmnt.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
	    e = e || window.event;
	    e.preventDefault();
	    // get the mouse cursor position at startup:
	    pos3 = e.clientX;
	    pos4 = e.clientY;
	    document.onmouseup = closeDragElement;
	    // call a function whenever the cursor moves:
	    document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
	    e.preventDefault();
	    // calculate the new cursor position:
	    pos1 = pos3 - e.clientX;
	    pos2 = pos4 - e.clientY;
	    pos3 = e.clientX;
	    pos4 = e.clientY;
	    // set the element's new position:
	    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		// stop moving when mouse button is released:
		placeCard(elmnt.style.left,elmnt.style.top,'blue',elmnt.id);
		elmnt.style.top = ogy;
	    elmnt.style.left = ogx;
	    document.onmouseup = null;
		document.onmousemove = null;
		
	}
}

function canPlace(x,y,cost,team){
	if(team == 'blue' && outBlueBounds(x,y)){return false;}
	if(cost <= elixir){
		elixir -= cost;
		return true;
	}
	return false;
}

function styleElement(x, y, image, name, team){
	const element = document.createElement('img');
	element.src = image;
	element.style.top = y;
	element.style.left = x;
	element.style.width = '2%';
	element.draggable = false;
	element.style.position = 'absolute';
	divs.game.appendChild(element);
	element.id = name + (blueOnField.knight.ids.length + 1);
	if(team=='blue' && name == 'knight'){blueOnField.knight.ids.push(element);}
	if(team=='blue' && name == 'megaknight'){blueOnField.megaknight.ids.push(element);}
	if(team=='blue' && name == 'minipekka'){blueOnField.minipekka.ids.push(element);}
	if(team=='blue' && name == 'PLACEHOLDER'){blueOnField.PLACEHOLDER.ids.push(element);}
	if(team=='blue' && name == 'PLACEHOLDER'){blueOnField.PLACEHOLDER.ids.push(element);}
	if(team=='blue' && name == 'PLACEHOLDER'){blueOnField.PLACEHOLDER.ids.push(element);}
	if(team=='blue' && name == 'PLACEHOLDER'){blueOnField.PLACEHOLDER.ids.push(element);}
	if(team=='blue' && name == 'PLACEHOLDER'){blueOnField.PLACEHOLDER.ids.push(element);}
	if(team=='blue' && name == 'castleKing'){blueOnField.castles.ids.push(element);}
	if(team=='blue' && name == 'castlePrincess'){blueOnField.castles.ids.push(element);}
	
	if(team=='red' && name == 'knight'){redOnField.knight.ids.push(element);}
	if(team=='red' && name == 'megaknight'){redOnField.megaknight.ids.push(element);}
	if(team=='red' && name == 'minipekka'){redOnField.minipekka.ids.push(element);}
	if(team=='red' && name == 'PLACEHOLDER'){redOnField.PLACEHOLDER.ids.push(element);}
	if(team=='red' && name == 'PLACEHOLDER'){redOnField.PLACEHOLDER.ids.push(element);}
	if(team=='red' && name == 'PLACEHOLDER'){redOnField.PLACEHOLDER.ids.push(element);}
	if(team=='red' && name == 'PLACEHOLDER'){redOnField.PLACEHOLDER.ids.push(element);}
	if(team=='red' && name == 'PLACEHOLDER'){redOnField.PLACEHOLDER.ids.push(element);}
	if(team=='red' && name == 'castleKing'){redOnField.castles.ids.push(element);}
	if(team=='red' && name == 'castlePrincess'){redOnField.castles.ids.push(element);}

	debug.labels.name.textContent = name;
	addStats(name,team);
}

//The return false allows card placement wherever, just comment it out to make it work normally
function outBlueBounds(x,y){
	return false;
	return (parseInt(y,10) < 340 || parseInt(y,10) > 570 || parseInt(x,10) < 580 || parseInt(x,10) > 920);
}

function checkIfSameSide(element,team){
	if(element == null){return;}
	let closestId = redOnField.castles.ids[0];
	if(team=='blue'){
		let closest = findDistance(element,redOnField.castles.ids[0]);
		for(i=0;i<redOnField.castles.ids.length;i++){
			if(closest > findDistance(element,redOnField.castles.ids[i])){closest = findDistance(element,redOnField.castles.ids[i]); closestId = redOnField.castles.ids[i];}
		}
		for(i=0;i<redOnField.knight.ids.length;i++){
			if(closest > findDistance(element,redOnField.knight.ids[i])){closest = findDistance(element,redOnField.knight.ids[i]); closestId = redOnField.knight.ids[i];}
		}
		for(i=0;i<redOnField.megaknight.ids.length;i++){
			if(closest > findDistance(element,redOnField.megaknight.ids[i])){closest = findDistance(element,redOnField.megaknight.ids[i]); closestId = redOnField.megaknight.ids[i];}
		}
		for(i=0;i<redOnField.minipekka.ids.length;i++){
			if(closest > findDistance(element,redOnField.minipekka.ids[i])){closest = findDistance(element,redOnField.minipekka.ids[i]); closestId = redOnField.minipekka.ids[i];}
		}
	}

	let side1 = parseInt(element.style.top) > 340 ? 'blue' : 'red';
	let side2 = parseInt(closestId.style.top) > 340 ? 'blue' : 'red';

	debug.labels.closest.textContent = closestId.id;
	return (side1 == side2) ? true : false;
}

function findDistance(element1,element2){
	if(element1 == null || element2 == null){return;}
	let x1 = element1.style.left, y1 = element1.style.top, x2 = element2.style.left, y2 = element2.style.top;
	x1 = parseInt(x1);
	y1 = parseInt(y1);
	x2 = parseInt(x2);
	y2 = parseInt(y2);
	
	return Math.sqrt(((x2-x1)**2)+((y2-y1)**2));
}

function moveToTarget(element,team){
	if(element == null){return;}
	if(!checkIfSameSide(element,team) && !checkIfAtBridge(element,team) && team=='blue'){
		moveToBridgeBlue(element);
	} else if (checkIfAtBridge(element,team) && team=='blue'){
		crossBridge(element,team);
	} else if (checkIfSameSide(element,team) && team=='blue') {
		blueMoveToTarget(element);
	}
}

function moveToBridgeBlue(element){
	if(element == null){return;}
	const ogy = parseInt(element.style.top,10), ogx = parseInt(element.style.left,10);
	let closestBridge = findClosestBridge(element);
	const name = element.id;
	let speed = getSpeed(element,'blue');
	
	speed = speed == 0 ? 1 : speed;

	let xChange = ogx - closestBridge[0];
	let yChange = ogy - closestBridge[1];

	xChange = xChange/speed;
	yChange = yChange/speed;

	element.style.left = (parseInt(element.style.left,10) - xChange) + 'px';
	element.style.top = (parseInt(element.style.top,10) - yChange) + 'px';
}

function findClosestBridge(element){
	if(element == null){return;}
	let x = element.style.left, y = element.style.top;
	let side = parseInt(y,10) > 355 ? 'blue' : 'red';
	let side2 = parseInt(x,10) < 760 ? 'left' : 'right';
	if (side == 'blue'){
		if (side2 == 'left') {return global.bridges.blueLeft;} else {return global.bridges.blueRight};
	}
	if (side == 'red'){
		if (side2 == 'left') {return global.bridges.redLeft;} else {return global.bridges.redRight};
	}
}

function debugTick(){
	debug.lists.knight.textContent = blueOnField.knight.ids;
	debug.lists.megaknight.textContent = blueOnField.megaknight.ids;
	debug.lists.minipekka.textContent = blueOnField.minipekka.ids;
	debug.lists.health.textContent = redOnField.knight.HP;
}

function moveCards(){
	for(let i = 0; i < blueOnField.knight.ids.length; i++){moveToTarget(blueOnField.knight.ids[i],'blue');}
	for(let i = 0; i < blueOnField.megaknight.ids.length; i++){moveToTarget(blueOnField.megaknight.ids[i],'blue');}
	for(let i = 0; i < blueOnField.minipekka.ids.length; i++){moveToTarget(blueOnField.minipekka.ids[i],'blue');}
	//for(let i = 0; i < blueOnField.PLACEHOLDER.ids.length; i++){moveToTarget(blueOnField.PLACEHOLDER.ids[i],'blue');}
	//for(let i = 0; i < blueOnField.PLACEHOLDER.ids.length; i++){moveToTarget(blueOnField.PLACEHOLDER.ids[i],'blue');}
	//for(let i = 0; i < blueOnField.PLACEHOLDER.ids.length; i++){moveToTarget(blueOnField.PLACEHOLDER.ids[i],'blue');}
	//for(let i = 0; i < blueOnField.PLACEHOLDER.ids.length; i++){moveToTarget(blueOnField.PLACEHOLDER.ids[i],'blue');}
	//for(let i = 0; i < blueOnField.PLACEHOLDER.ids.length; i++){moveToBridgeBlue(blueOnField.PLACEHOLDER.ids[i],'blue');}
}

function addStats(name,team){
	if(team == 'blue' && name == 'knight'){blueOnField.knight.HP.push(cards.knight.maxHP)} 
	if(team == 'blue' && name == 'megaknight'){blueOnField.megaknight.HP.push(cards.megaknight.maxHP)} 
	if(team == 'blue' && name == 'minipekka'){blueOnField.minipekka.HP.push(cards.minipekka.maxHP)} 

	if(team == 'red' && name == 'knight'){redOnField.knight.HP.push(cards.knight.maxHP)} 
	if(team == 'red' && name == 'megaknight'){redOnField.megaknight.HP.push(cards.megaknight.maxHP)} 
	if(team == 'red' && name == 'minipekka'){redOnField.minipekka.HP.push(cards.minipekka.maxHP)} 
}

function checkIfAtBridge(element,team){
	if(element == null){return;}
	let y = parseInt(element.style.top);
	if(y >= 275 && y <= 355){
		return true;
	}
	return false;
}

function crossBridge(element,team){
	if(element == null){return;}
	let speed = getSpeed(element,team);
	let side = 'blank';
	let y = parseInt(element.style.top);
	if(team == 'blue'){
		side = y >= 275 ? 'blue' : 'red';
	} else  if (team == 'red'){
		side = y >= 355 ? 'blue' : 'red';
	}
	if(side == 'blue'&&team=='blue'){
		y -= speed/10;
	} else if (side == 'red'&&team=='red'){
		y += speed/10;
	} else {
		alert("Error: could not determine 'side' when executing 'crossBridge': "+side);
	}
	element.style.top = y + "px"
}

function getName(element){
	if(element == null){return;}
	let name = 'blank';
	const id = element.id;

	name = id.replace(/\d/g,'');
	return name;
}

function getSpeed(element,team){
	if(element == null){return;}
	const name = element.id;
	let speed = 0;
	if(team=='blue'){
		if(name.includes('knight')){speed = cards.knight.speed}
		if(name.includes('megaknight')){speed = cards.megaknight.speed}
		if(name.includes('minipekka')){speed = cards.minipekka.speed}
		if(name.includes('PLACEHOLDER')){speed = cards.PLACEHOLDER.speed}
		if(name.includes('PLACEHOLDER')){speed = cards.PLACEHOLDER.speed}
		if(name.includes('PLACEHOLDER')){speed = cards.PLACEHOLDER.speed}
		if(name.includes('PLACEHOLDER')){speed = cards.PLACEHOLDER.speed}
		if(name.includes('PLACEHOLDER')){speed = cards.PLACEHOLDER.speed}
	}
	return speed;
}

function blueMoveToTarget(element){
	if(element == null){return;}
	let closestId = redOnField.castles.ids[0];
	let closest = findDistance(element,redOnField.castles.ids[0]);
	for(i=0;i<redOnField.castles.ids.length;i++){
		if(closest > findDistance(element,redOnField.castles.ids[i])){closest = findDistance(element,redOnField.castles.ids[i]); closestId = redOnField.castles.ids[i];}
	}
	for(i=0;i<redOnField.knight.ids.length;i++){
		if(closest > findDistance(element,redOnField.knight.ids[i])){closest = findDistance(element,redOnField.knight.ids[i]); closestId = redOnField.knight.ids[i];}
	}
	for(i=0;i<redOnField.megaknight.ids.length;i++){
		if(closest > findDistance(element,redOnField.megaknight.ids[i])){closest = findDistance(element,redOnField.megaknight.ids[i]); closestId = redOnField.megaknight.ids[i];}
	}
	for(i=0;i<redOnField.minipekka.ids.length;i++){
		if(closest > findDistance(element,redOnField.minipekka.ids[i])){closest = findDistance(element,redOnField.minipekka.ids[i]); closestId = redOnField.minipekka.ids[i];}
	}
	
	const ogy = parseInt(element.style.top,10), ogx = parseInt(element.style.left,10);
	let targetX = parseInt(closestId.style.left), targetY = parseInt(closestId.style.top);
	const name = element.id;
	let speed = getSpeed(element,'blue');
	
	speed = speed == 0 ? 1 : speed;

	let xChange = ogx - targetX;
	let yChange = ogy - targetY;

	xChange = xChange/speed;
	yChange = yChange/speed;

	element.style.left = (parseInt(element.style.left,10) - xChange) + 'px';
	element.style.top = (parseInt(element.style.top) - yChange) + 'px';
}

//team refers to the team attacking
function attack(element,target,team){
	if(element == null){return;}
	const attackerName = getName(element);
	const targetName = getName(target);
	const attackerNum = parseInt(element.id.replace(/[^0-9\s\/?]/g, ''));
	const targetNum = parseInt(target.id.replace(/[^0-9\s\/?]/g, ''));
	const attackerDamage = getDamage(attackerName);
	let health = 0;
	if(targetName == 'knight' && team == 'blue'){redOnField.knight.HP[targetNum-1] -= attackerDamage; health = redOnField.knight.HP[targetNum-1]}
	if(targetName == 'megaknight' && team == 'blue'){redOnField.megaknight.HP[targetNum-1] -= attackerDamage; health = redOnField.knight.HP[targetNum-1]}
	if(targetName == 'minipekka' && team == 'blue'){redOnField.minipekka.HP[targetNum-1] -= attackerDamage; health = redOnField.knight.HP[targetNum-1]}
	
	if(targetName == 'knight' && team == 'red'){blueOnField.knight.HP[targetNum-1] -= attackerDamage; health = blueOnField.knight.HP[targetNum-1]}
	if(targetName == 'megaknight' && team == 'red'){blueOnField.megaknight.HP[targetNum-1] -= attackerDamage; health = blueOnField.megaknight.HP[targetNum-1]}
	if(targetName == 'minipekka' && team == 'red'){blueOnField.minipekka.HP[targetNum-1] -= attackerDamage; health = blueOnField.minipekka.HP[targetNum-1]}
	const notTeam = team == 'blue' ? 'red' : 'blue'
	if(health <= 0){removeCard(targetName,targetNum-1,notTeam);}
}

function getDamage(name){
	if(name == 'knight'){return cards.knight.damage;}
	if(name == 'megaknight'){return cards.megaknight.damage;}
	if(name == 'minipekka'){return cards.minipekka.damage;}
}
/*
//DISCONTINUDED
function getHealth(name,index,team){
	//Adjusted because unit numbers start at zero and indexes begin at one
	index -= 1;
	if(name == 'knight' && team == 'blue'){return blueOnField.knight.HP[index];}
	if(name == 'megaknight' && team == 'blue'){return blueOnField.megaknight.HP[index];}
	if(name == 'minipekka' && team == 'blue'){return blueOnField.minipekka.HP[index];}
	
	if(name == 'knight' && team == 'red'){return redOnField.knight.HP[index];}
	if(name == 'megaknight' && team == 'red'){return redOnField.megaknight.HP[index];}
	if(name == 'minipekka' && team == 'red'){return redOnField.minipekka.HP[index];}
}
*/
function debugAttack(){
	attack(blueOnField.knight.ids[0],redOnField.knight.ids[0],'blue');
}

function checkAttacks(){
	
}

function removeCard(name,number,team){
	if(name == 'knight' && team == 'blue'){blueOnField.knight.ids[number] = null;}
	if(name == 'megaknight' && team == 'blue'){blueOnField.megaknight.ids[number] = null;}
	if(name == 'minipekka' && team == 'blue'){blueOnField.minipekka.ids[number] = null;}
	
	if(name == 'knight' && team == 'red'){redOnField.knight.ids[number] = null;}
	if(name == 'megaknight' && team == 'red'){redOnField.megaknight.ids[number] = null;}
	if(name == 'minipekka' && team == 'red'){redOnField.minipekka.ids[number] = null;}
	alert(redOnField.knight.ids[number])
}

//Adds castles
styleElement('747px','73px','placeholder.png','castleKing','red');
styleElement('863px','140px','placeholder.png','castlePrincess','red');
styleElement('633px','140px','placeholder.png','castlePrincess','red');

styleElement('700px','250px','knight.jpeg','knight','red');
//styleElement('900px','250px','knight.jpeg','knight','red');

divs.loading.style.display = "none";
divs.menu.style.display = "block";