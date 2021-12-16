class Aphelion{

	constructor(canvas){
		this.canvas = canvas;
		this.univ;
		this.ship;
		this.view;
		this.startPlanet;
		this.targetPlanet;
		this.type;
		this.resetting = false;
		this.mouse = new Point();
		this.mouse['down'] = false;
		this.mouse['scrolled'] = false;
	}

	launchGame(init){
		//create wheel binding
		var selfUniv = this;
		this.canvas.onwheel = (event) => selfUniv.handleScroll(event, this.mouse);
		var scope = new PaperScope();
		scope.activate();
		paper.setup(this.canvas);
		this.univ = new Universe();
		this.startPlanet = new Planet(new Point(), 'red', 2000);
		this.startPlanet.fuelUp = 0;
		this.startPlanet.glow.visible = false;

		//var initialVelocity = new Point(0, Math.sqrt(univ.gravitationConstant*startPlanet.mass/1200));
		var initialVelocity = new Point(0, 100);
		this.ship = new Ship(this.startPlanet.bounds.rightCenter.add([4000,0]), initialVelocity, paper.view);
		view.center = this.startPlanet.position;
		view.zoom = 0.001;
		this.view = paper.view;
		this.type = 'control';

		project.importSVG("assets/rocket.svg", {onLoad:sprite=>{
			sprite.fillColor = 'white';
			this.ship.loadSprite(sprite);

			this.univ.initUniverse();
		
			this.univ.chunks.get((new Point()).toString()).push(this.startPlanet);
			view.draw();
			this.defViewMethods(this);
		}, insert:true});
	}

	launchControlTutorial(){
		//create wheel binding
		var selfUniv = this;
		this.canvas.onwheel = (event) => selfUniv.handleScroll(event, this.mouse);
		var scope = new PaperScope();
		scope.activate();
		paper.setup(this.canvas);
		this.univ = new Universe();

		view.zoom = 0.01;
		var initialVelocity = new Point(0, 0);
		this.ship = new Ship(new Point(), initialVelocity, paper.view);
		this.ship.fuel = 10000;
		this.view = paper.view;
		this.type = 'control';

		project.importSVG("assets/rocket.svg", {onLoad:sprite=>{
			sprite.fillColor = 'white';
			this.ship.loadSprite(sprite);
			this.defViewMethodsMin(this);
		}, insert:true});
	}
	launchMechanicsTutorial(){
		//create wheel binding
		var selfUniv = this;
		this.canvas.onwheel = (event) => selfUniv.handleScroll(event, this.mouse);
		var scope = new PaperScope();
		scope.activate();
		paper.setup(this.canvas);
		this.univ = new Universe();
		this.startPlanet = new Planet(new Point(), 'red', 2000);
		this.startPlanet.fuelUp = 0;
		this.startPlanet.glow.visible = false;

		this.targetPlanet = new Planet(new Point(35000, 0), "#2E86C1", 2000);

		//var initialVelocity = new Point(0, Math.sqrt(univ.gravitationConstant*startPlanet.mass/1200));
		var initialVelocity = new Point(0, 100);
		this.ship = new Ship(this.startPlanet.bounds.leftCenter.add([-4000,0]), initialVelocity, paper.view);
		view.center = this.startPlanet.position.add(this.targetPlanet.position).divide(2);
		view.zoom = 0.005;
		this.view = paper.view;
		this.view.pause();
		
		project.importSVG("assets/rocket.svg", {onLoad:sprite=>{
			sprite.fillColor = 'white';
			this.ship.loadSprite(sprite);
			this.univ.chunks.get((new Point()).toString()).push(this.startPlanet, this.targetPlanet);
			view.draw();
			this.defViewMethodsMin(this);
		}, insert:true});
	}

	defViewMethods(selfUniv){
		selfUniv.view.onMouseMove = (event) => {
			selfUniv.mouse.x = event.point.x;
			selfUniv.mouse.y = event.point.y;
		}

		selfUniv.view.onMouseDown = (event) => {
			selfUniv.mouse.down = true;
		}

		selfUniv.view.onMouseUp = (event) => {
			selfUniv.mouse.down = false;
			selfUniv.ship.hideExhaust();
		}



		selfUniv.view.onFrame = (event) => {
			//intro zoom animation
			if(selfUniv.view.zoom < 0.01  && event.count < 100){
				selfUniv.view.zoom += 1e-4;
			}

			//update
			selfUniv.univ.updateGravity();
			selfUniv.univ.updatePosition(selfUniv.ship, selfUniv.canvas);
			selfUniv.univ.animatePlanets(event.time);
			document.getElementById('fuelText').innerHTML = "Fuel: " + selfUniv.ship.fuel.toFixed(3);
			if (event.count % 5 === 0){
				selfUniv.univ.updatePhysObjs(selfUniv.ship);
				selfUniv.univ.generateUniverse(selfUniv.ship);
				selfUniv.ship.updateTrail(selfUniv);
			}
			if (event.count % 25 === 0){document.getElementById('fuelText').innerHTML = "Fuel: " + selfUniv.ship.fuel.toFixed(3);		
				document.getElementById('distanceText').innerHTML = "Distance: " + selfUniv.ship.position.getDistance(selfUniv.startPlanet.position).toFixed(3);			
				document.getElementById('fpsText').innerHTML = "Fps: " + (1/event.delta).toFixed(3);
				document.getElementById('scoreText').innerHTML ="Score: " + selfUniv.ship.score;
			}

			//fixes drift due to lack of mouse updates
			var delta = selfUniv.view.center.subtract(selfUniv.ship.position);
			selfUniv.view.center = selfUniv.ship.position;
			selfUniv.mouse.x -= delta.x;
			selfUniv.mouse.y -= delta.y;

			selfUniv.ship.updateRotation(selfUniv.mouse);
			selfUniv.ship.applyThrottle(selfUniv.mouse);
			selfUniv.ship.detectCollision(selfUniv.univ,selfUniv.startPlanet);
		}
	}
	defViewMethodsMin(selfUniv){
		selfUniv.view.onMouseMove = (event) => {
			selfUniv.mouse.x = event.point.x;
			selfUniv.mouse.y = event.point.y;
		}

		selfUniv.view.onMouseDown = (event) => {
			selfUniv.mouse.down = true;
		}
		selfUniv.view.onMouseUp = (event) => {
			selfUniv.mouse.down = false;
			selfUniv.ship.hideExhaust();
		}
		/* paper js has issues with these event handlers using multiple canvases unfortunately

		selfUniv.view.onMouseEnter = (event) => {
			selfUniv.view.play();
		}
		selfUniv.view.onMouseLeave = (event) => {
			selfUniv.view.pause();
		}*/

		selfUniv.view.onFrame = (event) => {

			//check if a reset has already been triggered
			//update
			selfUniv.univ.updateGravity()
			selfUniv.univ.updatePosition(selfUniv.ship, selfUniv.canvas)
			selfUniv.univ.animatePlanets(event.time);
			document.getElementById('fuelText').innerHTML = "Fuel: " + selfUniv.ship.fuel.toFixed(3);
			if (event.count % 5 === 0){
				selfUniv.univ.updatePhysObjs(selfUniv.ship);
				selfUniv.ship.updateTrail();
			}

			selfUniv.ship.updateRotation(selfUniv.mouse);
			selfUniv.ship.applyThrottle(selfUniv.mouse);
			selfUniv.resetting = selfUniv.resetting || selfUniv.ship.resetOutOfView(selfUniv);
		}
	}

	//needed to make reset work
	undefViewMethodsMin(selfUniv){
		selfUniv.view.onMouseMove = null;
		selfUniv.view.onMouseDown = null;
		selfUniv.view.onMouseUp = null;
		selfUniv.view.onFrame = null;
	}

	handlePause(aphelion){
		aphelion.view.pause();
		document.getElementById("PauseOverlay").style.display = "block";
	}

	handleResume(aphelion){
		aphelion.view.play();
		document.getElementById("PauseOverlay").style.display = "none";
	}

	handleStart(aphelion){
		aphelion.launchGame()
		aphelion.view.play();
		document.getElementById("IntroOverlay").style.display = "none";
	}
	//TODO: FIX THIS GARBAGE
	handleReset(aph){
		aph.undefViewMethodsMin(aph);

		switch (aph.type){
			case 'control':
				aph.launchControlTutorial();
				break;
			case 'mech':
				aph.launchMechanicsTutorial();
				break;
		}
	}

	handleScroll(event){
		event.preventDefault();
		this.mouse.scrolled = true;
		var scaleFac = 1 - event.deltaY/100;
		//don't zoom if we're already too close or too far
		if((this.view.zoom < 0.01 && scaleFac < 1) || (this.view.zoom > 2 && scaleFac > 1) || Math.abs(event.deltaY) > 75){
			return;
		}
		this.view.scale(scaleFac);
		this.ship.trail.strokeWidth = (1/this.view.zoom)*2;
	}
}

