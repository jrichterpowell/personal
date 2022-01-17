function clamp(number, lower, upper){
		if(number > upper){ return upper; }
		else if (number < lower){ return lower; }
		return number
	}
function truncatePT(point){
	return new Point( parseInt(point.x), parseInt(point.y) );
}

//is this index adjacent to the start planet?
function touchOrigin(index){
	let touches = (index.equals(new Point()) || index.equals(new Point(-1,-1)) || index.equals(new Point(-1,0)) || index.equals(new Point(0,-1)));
	return touches;
}

function flattenGroup(object){
	if(!object.children){
		return [];
	}
	var subItems = object.children.filter(obj => obj.className !== 'Group');
	var subGroups = object.children.filter(obj => obj.className === 'Group');
	return [...subItems, ...subGroups.map(flattenGroup).flat() ];
}