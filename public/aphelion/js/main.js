window.onload = () => {
    //setup control tutorial
    let controlCanvas = document.getElementById('ControlCanvas');
    let controlTutorial = new Aphelion(controlCanvas);
    controlTutorial.launchControlTutorial();
    

    //setup mechanics tutorial
    let mechCanvas = document.getElementById('MechanicsCanvas');
    let mechTutorial = new Aphelion(mechCanvas);
    mechTutorial.launchMechanicsTutorial();
    
    let mainCanvas = document.getElementById('mainCanvas');
    let game = new Aphelion(mainCanvas);
    
    document.getElementById('pauseButton').onclick = () => game.handlePause(game);
	document.getElementById('PauseOverlay').onclick = () => game.handleResume(game);
	document.getElementById('startGame').onclick = () => {
        mechTutorial = null;
        controlTutorial = null;
        game.handleStart(game);
    }
}


