//file type checke.
// 이 스크립트 파일은 가장 하단에 적용해주세요.
$("#uploadFile").change(function(){
    var typeChecker = true;

    var fullPath = $("#uploadFile").val().split("\\");
    let rows = fullPath.length;
    
    const img = fullPath[rows - 1];

    if (fullPath[rows - 1].search(".jpg") < 0 || fullPath[rows - 1].search(".png")){
        alert("Is not jpg|png file..\nPlease, Check for file extension..");
        typeChecker = false;
    }

    if (!typeChecker){
        $("#uploadFile")[0].value = '';
    } else {

        var dynamodb = new AWS.DynamoDB();
        const parm = anno_add_item(img); // Model.js
    
        console.log(parm);
    
        dynamodb.updateItem(parm, function(err, data){
            if(err) console.log("DynamoUpdate Error \n", err);
            else console.log("Done!");
        })
    }
})