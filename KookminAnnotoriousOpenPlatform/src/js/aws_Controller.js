//MVC = C
var imageLocation;
var nameList = [];
var isDone = [];
var WorkerId;

function clientLogin(){
	var isSelection = document.getElementById("setClient");
	var opt = isSelection.value;
	if(opt != "") {
		WorkerId = opt.split('_')[1]
	}
	
	setTimeout(dynamoConfigure(WorkerId),300);
}

function clickDone(){
	console.log("current workerID ? ", WorkerId);
	const src = $("#preview")[0].src;
	let str = String(src).split("\/");
	var img = String(str[str.length - 1])
	console.log(WorkerId, "get Imgae : ", img.split('.')[0]);

	var dynamodb = new AWS.DynamoDB();
	const parm = anno_done_update(img, WorkerId); // Model.js

	console.log(parm);

	dynamodb.updateItem(parm, function(err, data){
		if(err) console.log("DynamoUpdate Error \n", err);
		else console.log("Done!");
	});

	// * PHP Call *//
	startCropImages(img.split('.')[0], "crop")
}

function startCropImages(item, command) {
	if (item != '') {
		$.ajax(crop_parm(item,command));
	}
}

function getItemFromDDB(id){
	
	var dynamodb = new AWS.DynamoDB();
	const parm = worker_all_imageQuery(id) // Model.js
	
	dynamodb.getItem(parm, function (err, data) {
		if (err) {
			console.log("dynamoget Err", err);
			croppedPageSelectList();
		}
		else {
			//console.log("getItems: \n", data);
			$(itemArray(data)).promise().done(setTimeout(function(){
				try {
					thumbnamePut();
				} catch(e) {
					// 예외처리를 이용--> case 구문으로 바꾸길 권장
					//croppedPageSelectList();
				};
			},500));
		}
	});
}

function itemArray(data){
	//Json parser
	$.each(data.Item, function(key, value){
		if(key != "WorkerId") {
			//console.log(value.M.path.S);
			nameList.push([value.M.path.S, value.M.done.BOOL]);

		}
	});
	
}
