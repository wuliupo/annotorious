//Thumbnail Controller
// MVC => C
function thumbnamePut() {
  //데이터 리드 구현.

  //console.log("Array:",nameList);  
  nameList.forEach(getItem => {
    console.log(getItem)
    /*
      {name : "", Done : "false or true"}
    */

    /* 어노테이션 작업완료 시 */
    let opacity = 1;
    if (getItem[1] == true) opacity = 0.3;
    const tag = getThumbImage(getItem, opacity);
    // create thumbnail.
    $("#thumbnail_area").append(tag);

  });

  thumbnail_start();
}

function thumbClick(imgPath) {
  //Image Changer.
  anno.destroy();
  $("#block").empty()
    .promise().done($("#block").append('<img id="preview" src="' + imgPath + '" width="100%" height="100%">'))
    .promise().done(init());
}


function thumbnail_start() {
  var jssor_1_slider = new $JssorSlider$("thumbnail_block", jssor_thumbStyle_1);// 2_argu => model
  /*#region responsive code begin*/
  var MAX_WIDTH = 980;

  //$(window).bind("load", ScaleSlider);
  //$(window).bind("resize", ScaleSlider);
  //$(window).bind("orientationchange", ScaleSlider);
  /*#endregion responsive code end*/
}