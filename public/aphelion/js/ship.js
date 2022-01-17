class Ship{
	constructor(pos=new Point(),vel=new Point(), view){
		//physics options
		this.physical = true;
		this.mass = 1e-5;
		this.effectedByGrav = true;

		//fuel settings
		this.fuel = 100; 	 //starting fuel
		this.fuelUse = 0.75; //sets rate of fuel use
		this.fuelFlow = 1; //sets rate of refueling
		this.vel = vel;      //set starting velocity
		this.throttleCoefficient = 5e-5;

		//score and trail
		this.trail = new Path();
		this.trail.strokeColor = 'red';
		this.trail.strokeWidth = 300;
		this.deltaV = vel.length;
		this.score = 0;

		//misc
		this._position = pos;
		this.sprite = "placeholder";
		this.invulnerable = false;
	}
	//pass the methods through to the sprite object
	set position(pos){
		if(this.sprite == 'placeholder'){
			this._position = pos
		}
		else{
			this.sprite.position = pos;
			this._position = pos;
		}	
	}

	get position(){
		if(this.sprite == 'placeholder'){
			return this._position;
		}
		else{
			return this.sprite.position;
		}
	}
	get angle(){
		return this.sprite.position.angle;
	}

	set fillColor(color){
		this.sprite.fillColor = color;
	}
	get fillColor(){
		return this.sprite.fillColor;
	}
	get bounds(){
		return this.sprite.bounds;
	}
	get exhaustSprite(){
		return this.sprite.children[1].children[2];
	}
	//rotate the ship to face the mouse pointer
	updateRotation(mouse) {
		this.sprite.rotation = -Math.atan2(mouse.x -this.position.x, mouse.y-this.position.y)*180/Math.PI + 180;
	}

	//Technically also updates the score as wel
	updateTrail(selfUniv) {
		this.trail.add(this.position);
		if(selfUniv !== undefined){
			this.score = Math.max(this.score, Math.floor(this.position.getDistance(selfUniv.startPlanet.position)/100));
		}

		if(this.trail.segments.length > 50){
			this.trail.segments.shift();
		}
	}

	applyThrottle(mouse){
		if(mouse.down && this.fuel >= this.fuelUse){
			var direction = new Point(mouse.x-this.position.x, mouse.y-this.position.y);
			this.deltaV += this.vel.add(direction.multiply(this.throttleCoefficient)).length;
			this.vel = this.vel.add(direction.multiply(this.throttleCoefficient));
			this.fuel -= this.fuelUse;
			//color fueltext
			if(this.fuel < 10){
				document.getElementById('fuelText').style.color = 'red';
			}
			else{
				document.getElementById("fuelText").style.color = "white";
			}
			this.drawExhaust();
		}
	}
	detectCollision(univ, startPlanet){

		var planets = univ.physObjs.filter(x => x != this);

		if(this.invulnerable){
			return
		}

		planets.forEach(planet =>{	
			var hit = planet.sprite.hitTest(this.bounds.center);
			if (hit){
				//this.deathAnimation(400);
				view.pause();
				document.getElementById("DeathOverlay").style.display = "block";
				document.getElementById("DeathTextL").innerHTML = "Final Score: " + (this.score);
			}
		})
		planets.forEach(planet =>{
			if (planet.glow.intersects(this.sprite) || this.sprite.isInside(planet.glow.bounds)){
				document.getElementById("fuelText").style.color = "#4caf50";
				if(this.fuel <= 99.9){
					planet.fuelUp -= this.fuelFlow;
					this.fuel += this.fuelFlow;
					planet.glow.scaling = 0.2 + planet.fuelUp/125;
				}
			}
		})


	}
	//reset tutorial on contact with edge of the viewport
	//since we aren't moving the camera in the tutorial canvases
	resetOutOfView(aph){
		if(!this.sprite.isInside(aph.view.bounds)){
			aph.view.center = this.position.add(aph.view.center).divide(2);
		}
	}

	translate(vec){
		this.sprite.translate(vec);
	}
	loadSprite(sprite){
		sprite.position = this.position;
		this.sprite = sprite;
		this.sprite.rotate(-45);
		this.sprite.scale(2);
		//sprite.children[1].children[2].scale(5);
		//fix this at some point
		this.sprite.applyMatrix = false;
		
	}

	drawExhaust(){
		this.exhaustSprite.visible = true;
		this.exhaustSprite.fillColor = new Color(1,Math.random(),0);
	}
	hideExhaust(){
		this.exhaustSprite.visible = false;
	}
	deathAnimation(length){
		var pieces = flattenGroup(this.sprite);
		this.sprite.remove();
		pieces.forEach(p =>{
			project.activeLayer.addChild(p);
			console.log(view.bounds)
			var endPos = Point.random().subtract(0.5).multiply(view.bounds.height);
			p.tweenTo(
				{position: endPos },
				{
				duration: length,
				easing: 'easeInCubic'
				}

				)

		})
	}
}


//debug only
function showRectangle(rect, color){
	var rect = new Path.Rectangle(rect);
	rect.fillColor = color;
	return rect;
}