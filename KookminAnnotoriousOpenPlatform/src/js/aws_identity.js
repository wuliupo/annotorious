//DynamoConfiguration
function dynamoConfigure(WorkerId){
    var poolId = 'ap-northeast-2:2c838b20-2942-4a44-b7a2-c3d50438db93'; //temporary identity
    var mycred = new AWS.CognitoIdentityCredentials({
		region: 'ap-northeast-2',
		IdentityPoolId:poolId,
		RoleArn: 'arn:aws:iam::741926482963:role/hjkim_dynamodbAccess', //dynamo iam role id
	});
	
	AWS.config.credentials = mycred;
	AWS.config.region = "ap-northeast-2";
	AWS.config.version = "latest";
	//getIdentity();
	//data-jssor-slider
	//style
	var isSetStyle = $("#thumbnail_block").attr("style");
	if(isSetStyle == undefined)
		thumbnailSet(WorkerId);
	else {
		refreshThumbnail(WorkerId);
	}

}

function thumbnailSet(id){
	$("#thumbnail_area").empty().promise()	
	.done(getItemFromDDB(id));
}

function refreshThumbnail(id){
	nameList = [];
	$("#thumbnail_block").remove()
	.promise().done(importTag(id))
}

function importTag(id){
	console.log("new import",id)
	$("#jssor_slider_box").append(thumbnil_box_text())
	.promise().done($("#thumbnail_block").append(thumbnail_area_text()))
	.promise().done(thumbnailSet(id));
}

/*
* 임시 자격증명 얻기(세션이 연결되어있을 때, 아닐 경우 키값이 중복되어 오류발생)
*/
/*
function getIdentity(){
	AWS.config.credentials.get(function () {
		AWS.config.credentials.data.SubjectFromWebIdentityToken;
	});
}
*/
