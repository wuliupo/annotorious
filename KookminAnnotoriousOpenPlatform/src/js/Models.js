//Models
//MVC = M
//TODO: Tag Name Block
var tag_names = [
	"블록 스트라이프 [block stripe]",
	"새틴 스트라이프 [satin stripe]",
	"싱글 스트라이프 [single stripe]",
	"초크 스트라이프 [chalk stripe]",
	"캔디 스트라이프 [candy stripe]",
	"더블 스트라이프 [double stripe]",
	"펜슬 스트라이프 [pencil stripe]",
	"얼터네이트 스트라이프 [alternate stripe]",
	"어닝 스트라이프 [awning stripe]",
	"헤링본 스트라이프 [herringbone stripe]",
	"클러스터 스트라이프[cluster stripe]",
	"크로스 스트라이프[cross stripe]",
	"섀도우 스트라이프 [shadow stripe]"
];

//TODO: Jssor Style Block
var jssor_thumbStyle_1 = {
	//$AutoPlay: 1,
	$Idle: 0,
	//$SlideDuration: 5000,
	//$SlideEasing: $Jease$.$Linear,
	//$PauseOnHover: 4,
	$SlideWidth: 140,
	$Align: 0
};


//TODO: Image 
function getThumbImage(getItem, opacity) {

	var thumbnail_item = '<div data-p="30.00" style="opacity:' + opacity + '"> <img data-u="image" src="' + getItem[0] +
						'" style="width:250px" hspace=10 onclick=thumbClick("' +
						getItem[0] + '");> </div>'

	return thumbnail_item;
}

//TODO: DynamoDB API
function anno_done_update(img, WorkerId) {
	//TODO: There's will update to "Dynamodb['done']" if you try to click 'done'.
	const parm = {
		Key: {
			"WorkerId": {
				S: WorkerId
			}
		},
		ExpressionAttributeNames: {
			"#img": img.split(".")[0],
		},
		ExpressionAttributeValues: {
			":img": {
				M: {
					"done": {
						BOOL: true
					},
					"path": {
						S: "Images/example_folder/" + img
					}
				}
			}
		},
		UpdateExpression: "SET #img = :img",
		TableName: "simpleImgInfoTable_kookmin",
		ReturnValues: "UPDATED_OLD"
	};

	return parm;
}

function anno_add_item(img) {
	const parm = {
		Key: {
			"WorkerId": {
				S: "3"
			}
		},
		ExpressionAttributeNames: {
			"#img": img,
		},
		ExpressionAttributeValues: {
			":img": {
				M: {
					"done": {
						S: "false"
					},
					"path": {
						S: "Images/example_folder/" + img
					}
				}
			}
		},
		UpdateExpression: "SET #img = :img",
		TableName: "simpleImgInfoTable_kookmin",
		ReturnValues: "UPDATED_NEW"
	};

	return parm;
}

function worker_all_imageQuery(argv){
	
	const parm = {
		Key:{
			'WorkerId':{
				S:argv
			}
		},
		TableName: 'simpleImgInfoTable_kookmin',
		//AttributesToGet:['image']
	};

	return parm
}

//Back-end Communication APIs
//TODO: Parameter & URL APIs
const addjsonPath = "/php/formToJson.php";
const deljsonPath = window.location.href + "jsondata/"
const cropPath = "/php/execution.php";
const loadcropPath = "/php/readCroppedFile.php";

function delete_json_parm(url) {
	var parm = {
		method: "POST",
		url: url,
		contentType: "text/plain ; charset=utf-8",
		dataType: 'text',
		success: function (jsonData) {
			// cuuren not json data
			// please change to json.
			console.log(jsonData);
		},
		error: function (jsonData, error, status) {
			console.log(error + "  " + status);
			//console.log(jsonData.responseText);
		}
	}
	return parm;
};

function add_json_parm(toJson, name) {
	var parm = {
		data: 'data=' + toJson + "&name=" + name,
		url: addjsonPath,
		method: 'POST',
		success: function (msg) {
			console.log("test 2 : " + msg);
		}

	}
	return parm;
};

function crop_parm(item, command) {
	var parm = {
		data: 'item=' + item + '&command=' + command,
		url: cropPath,
		method: 'POST',
		success: function (msg) {
			console.log("success done\n", msg)
		}
	}
	return parm;
};

function load_crop_image_parm(tagName) {
	console.log(tagName);
	var parm = {
		data: 'data=' + tagName,
		url: loadcropPath,
		method: 'GET',
		success: function (msg) {
			$(gridView(msg));
		}

	}
	return parm;
};

//TODO: remove the blank of file name
function removeBlank(string){
	split = string.split(' ');
	const modifiedTagName = split[0] + split[1];
	
	return modifiedTagName;
}

//TODO: thumbnail string model
function thumbnail_area_text(){
	var tag = '<div id="thumbnail_area" data-u="slides" style="cursor:default;width:450px;height:100px;overflow:hidden; border: 2px solid gold">';
	return tag;
}

function thumbnil_box_text(){
	var tag = '<div id="thumbnail_block">';
	return tag;
}
