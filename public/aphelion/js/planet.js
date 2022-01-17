class Planet{

	constructor(position,color,radius){
		this.sprite = new Path.Circle(position, radius);
		this.sprite.strokeColor = 'white';
		this.sprite.fillColor = color;
		this.vel = new Point();
		this.mass = 3e5;
		this.physical = true;
		this.effectedByGrav = false;

		//spacing options
		this.origin = new Point();
		this.minDist = 3000;
		this.maxDist = 10000;

		//glow options
		this.fuelUp = 100;
		this.glow = new Path.Circle(this.position, radius*5);
		this.glow.applyMatrix = false;
		//set up coloring
		color = new Color(color);
		var clearColor = color.clone()
		clearColor.alpha = 0;
		this.glow.fillColor = {
			gradient:{
			stops: [[color, 0], [clearColor,1]],
			radial: true
			},
			origin: this.position,
			destination: this.glow.bounds.rightCenter
		};
		this.glowSeed = Math.random();	
	}

	get position(){
		return this.sprite.position;
	}
	get bounds(){
		return this.sprite.bounds;
	}

	rasterize(dpi, insert){
		return this.sprite.rasterize(dpi, insert);
	}
	remove(){
		return this.sprite.remove();
	}

	getDistance(point){
		this.position.getDistance(point);
	}

	animateGlow(time){
		this.glow.fillColor.gradient.stops[1].offset = Math.sin(time * 2 + this.glowSeed * 2 * Math.PI) * 0.1 + 0.9;
	}

	//move the planet sprite which we use as the source for the position data
	translate(pos){
		this.sprite.translate(pos);
	}
}