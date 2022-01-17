//Universe class applies global physics to the planets, stars, quasars, etc.
class Universe {
	constructor(){
		this.gravitationConstant = 5e-2;
		this.gravityRange = 20000;
		this.physObjs = [];
		this.planetColors = ["#A93226",
		"#CB4335", "#884EA0","#7D3C98", 
		"#2471A3", "#2E86C1", "#17A589",
		"#138D75", "#229954","#28B463",
		"#D4AC0D", "#D68910", "#CA6F1E", 
		"#BA4A00", "#D0D3D4", "#A6ACAF", 
		"#839192"];
		this.numPlanets = 5;//set the number of planets per chunk
		this.minDist = 50000;
		this.chunks = new Map();
		this.chunks.set((new Point()).toString(), []);
		this.chunkSize= 135000;
	}

	//Update list of objects close enough to the ship to exert gravitational influence
	updatePhysObjs(ship){
		var objs= Array.from(this.chunks.values()).flat()
		this.physObjs = objs.filter(x => x.position.getDistance(ship.position) < this.gravityRange && x.physical);
		//this.physObjs.forEach(obj => obj.sprite.selected = true)
		this.physObjs.push(ship);
	}

	updateGravity(){
		this.physObjs.forEach(obj1 =>{
			this.physObjs.filter(x=> (x != obj1) && (x.effectedByGrav)).forEach(obj2 =>{
				var distance = obj1.position.getDistance(obj2.position,false);

				//compute the effect of obj1 ON obj2
				var scalar = -1* obj1.mass / (distance * 2) * this.gravitationConstant;
				var gravVec = obj2.position.subtract(obj1.position);
				//scale the gravity direction vector by the constant
				gravVec = gravVec.divide(gravVec.length);
				gravVec = gravVec.multiply(scalar);

				obj2.vel = obj2.vel.add(gravVec);
			})
		});
	}
	updatePosition(ship,canvas){
		//apply each objects velocity to it
		this.physObjs.forEach(x =>{
			x.translate(x.vel);
		})
		//move the background TODO: Find a solution for performance issues caused by this
		//canvasBack.style.transform = "translate(" + (ship.position.x / -100).toString() + "px,"  + (ship.position.y / -100).toString() + "px)"
		//canvas.style.backgroundPosition = (ship.position.x / -100).toFixed(0).toString() + "px "  + (ship.position.y / -100).toFixed(0).toString() + "px";
	}

	initUniverse(){
		//generate the nine initial chunks
		for(var i = 0; i < 9; i++){
			this.generateChunk(new Point(parseInt(i/3) - 2, i%3 - 2));
		}
	}

	//check if the universe is generated in a 5x5 grid centered on the ship, generate it if not
	//we don't need to check the center nine squares since we generated those intially as a base case 
	//and cover the rest progressively
	generateUniverse(ship){
		//the chunk the ship is currently in
		var shipChunk = truncatePT(ship.position.divide(this.chunkSize));
		var topCorner = shipChunk.add([-2,-2]);
		var botCorner = shipChunk.add([-2,2]);
		var colOne = shipChunk.add([-2,-1]);
		var colTwo = shipChunk.add([2,-1]);
		//if 'o'represents the ship, this generates a list of chunks as 
		// XXXXX
		// X   X
		// X o X
		// X   X
		// XXXXX
		var adjChunks = [
			...[...Array(5).keys()].map(num => topCorner.add(num,0)),
			...[...Array(5).keys()].map(num => botCorner.add(num,0)),
			...[...Array(3).keys()].map(num => colOne.add(0,num)),
			...[...Array(3).keys()].map(num => colTwo.add(0,num)),
		]
		
		//generate those that do not exist
		adjChunks.forEach(chunk =>{
			if( !this.chunks.has(chunk.toString()) ){
				this.generateChunk(chunk);
			}
		})
	}

	generateChunk(index){
		var proposedPlanets = [];

		if(index.className !== 'Point'){
			console.log("Index was invalid");
			return
		}

		//generate the n proposed new planets for the chunk
		//In the future we should add blackholes and quasars as well
		var chunkStart = index.multiply(this.chunkSize);
		for(var i = 0; i < this.numPlanets; i++){
			var attempts = -1;
			do{
				attempts += 1;
				var propLoc = Point.random().multiply(this.chunkSize).add(chunkStart);
				var minDist = Math.min(...proposedPlanets.map(p => p.position.getDistance(propLoc)));
			}
			while( ( (proposedPlanets.length > 0 && minDist < this.minDist)  
						|| (touchOrigin(index) && propLoc.length < this.gravityRange*1.25) 
					) && attempts < 10);

			if(attempts === 9){
				console.log("Failed to generate planet at ", index.x, index.y);
				continue;
			}
			else{
				var pColor = this.planetColors[Math.floor(Math.random()* this.planetColors.length)];
				var newPlanet = new Planet(propLoc, pColor, 2200);
				newPlanet.mass *= Math.sqrt(propLoc.length) / 100;
				proposedPlanets.push(newPlanet);
			}

		}
		this.chunks.set(index.toString(), proposedPlanets);
	}
	
	animatePlanets(time){
		Array.from(this.chunks.values()).flat().forEach(p => p.animateGlow(time));
	}
}

