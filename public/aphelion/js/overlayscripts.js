window.onload = () =>{
var mouse = new Point();
mouse['down'] = false;
var canvas = document.getElementById('ControlCanvas');
canvas.onwheel = (event) => handleScroll(event, mouse);;
var scope1 = new PaperScope();

scope1.activate();
paper.setup(canvas);
var shipControl = new Ship(view.center, new Point());
shipControl.fuel = 1000;
var controlUniv = new Universe();
project.importSVG("assets/rocket.svg", {onLoad:sprite=>{
		sprite.fillColor = 'black';
		shipControl.loadSprite(sprite);
		view.draw();
		view.zoom = 0.1;
		defViewMethods(view,controlUniv);
}});

function defViewMethods(view, univ){
	view.onMouseMove = function(event){
		mouse.x = event.point.x;
		mouse.y = event.point.y;
	}

	view.onMouseDown = function(event){
		mouse.down = true;
	}
	view.onMouseUp = function(event){
		mouse.down = false;
		shipControl.hideExhaust();
	}

	view.onFrame = function(event){
		//check if ship is loaded
		if(shipControl.sprite == 'placeholder'){
			return
		}

		univ.updatePosition()

		if (event.count % 5 === 0){
			univ.updatePhysObjs(shipControl);
			shipControl.updateTrail();
		}

		shipControl.updateRotation(mouse);
		shipControl.applyThrottle(mouse);
		
	}
}
}