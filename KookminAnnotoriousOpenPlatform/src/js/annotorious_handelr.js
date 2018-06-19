// create by hjKim. KOOKMIN UNIV.
// Annotorious Coustom version.
// + auto_selector.js <-- applied prototype annotorious.
/* Annotorious Initialize */

//annotorious module extending
//add Module name = "changeLabelBoxUI" 
anno.addUIModule = function(moduleName, activate) { // no prototype.
	// you have to input string of function name
	const func = window[moduleName];
	if (typeof func == "function" && activate["activate"] == true)
		func();
	else
		console.log("Invaild module");
}


//annotation configure.
function init(){
	anno.makeAnnotatable(document.getElementById('preview'));
	anno.addPlugin('autoSelector', { activate: true });
	anno.addUIModule('changeLabelBoxUI',{ activate: true });

	anno.addHandler('onAnnotationCreated', function(annotation){
		//console.log(annotation.text);
		getData(annotation);
	});
	anno.addHandler('onAnnotationUpdated', function(annotation){
		deleteData(annotation);
		getData(annotation);
	});
	
};



/* delete annotation data */
function deleteData(annotation){

	text = annotation.text
	sourceImage = annotation.src;
	geometry = annotation.shapes[0].geometry;

	name = sourceImage.split("/");
	url = deljsonPath + name[name.length - 1].split(".")[0] + ".json";
	const delparm = delete_json_parm(url);

	$.getJSON(delparm);	
}

/* get annotation data */
function getData(annotation){

	text = $("#selectTagName option:checked").text();
	
	annotation.text = text;
	sourceImage = annotation.src;
	geometry = annotation.shapes[0].geometry; // annotation shanpes is array form. 
	// and you want to get the geometry, must be toget previous row.
	changeJson(text, sourceImage, geometry);
};

/* add gemotry to json or chnage */
function changeJson(text, sourceImage, geometry){
	// get TagName from removed blank string.
	removeToLeftBracket = text.split('[')[1];
	removeToRightBracket = removeToLeftBracket.split(']')[0];
	const tagName = removeBlank(removeToRightBracket); // renaming

	var annotationInfo = new Object();
	
	annotationInfo.tag = tagName;
	annotationInfo.timeStamp = new Date().getTime();
	annotationInfo.anno = geometry;
	annotationInfo.imageLocation = sourceImage;
	
	var name = sourceImage.split("/");
	console.log(name[name.length-1].split(".")[0]);

	var toJson = JSON.stringify(annotationInfo);
	var addJson  = addJsonData(toJson, name[name.length-1].split(".")[0]);
}

/* For create json file, this function post for php */
function addJsonData(toJson, name){
	var req = new XMLHttpRequest();
	// POST send
	const addjson = add_json_parm(toJson, name);
	$.ajax(addjson);
}

