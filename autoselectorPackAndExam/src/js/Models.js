function anno_done_update(img) {
	//TODO: There's will update to "Dynamodb['done']" if you try to click 'done'.
	const parm = {
		Key: {
			"WorkerId": {
				S: "1"
			}
		},
		ExpressionAttributeNames: {
			"#img": img.split(".")[0],
		},
		ExpressionAttributeValues: {
			":img": {
				M: {
					"done": {
						S: "true"
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
