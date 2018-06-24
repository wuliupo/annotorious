

// Script to open and close sidebar
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    //document.getElementById("myOverlay").style.display = "block";
}
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    //document.getElementById("myOverlay").style.display = "none";
}

function croppedPageSelectList() {

    const patternName = tag_names;
    patternName.forEach(pattern => {

        var tag = '<option>' + pattern + '</option>'
        $("#imgSelect").append(tag);

    });
}

function loadCroppedImages() {
    
    var isSelection = document.getElementById("imgSelect");
    var opt = isSelection.value;

    removeToLeftBracket = opt.split('[')[1];
    removeToRightBracket = removeToLeftBracket.split(']')[0];
    const tagName = removeBlank(removeToRightBracket); // renaming
    //console.log(tagName)

    if (opt != '') {
        var d = load_crop_image_parm(tagName);
        console.log(d)
        $.ajax(load_crop_image_parm(tagName));
      }
}


