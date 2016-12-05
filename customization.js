var edited = false;
var $select2_box;
var $textarea;
var a = true;
var i = 0;
var _currentAnnotation;
var names = personNames;
var $newSelect;
$(window).load(function(){customizeEditBox();});
$(window).load(function(){customizePopUp();});
// anno.addHandler('onEditorShown', function(annotation) {
// 	$('select').select2();
// });
anno.addHandler('onSelectionCompleted', function(annotation) {
	if ($select2_box) {
		$( "#editor-select" ).val("").change()
	}
});

anno.addHandler('onMouseOverAnnotation', function(annotation) {
	if (!_currentAnnotation.hasOwnProperty('correct')){
		anno.setProperties({
			hi_stroke: 'white',
			hi_fill: 'rgba(255, 255, 255, 0.3)'
		});
	}
	else if (_currentAnnotation.correct){
		anno.setProperties({
			hi_stroke: 'green',
                        hi_fill: 'rgba(0, 255, 0, 0.3)'
		});
	}
	else 
		anno.setProperties({
			hi_stroke: 'red',
                        hi_fill: 'rgba(255, 0, 0, 0.3)'
		});
});

anno.addHandler('onPopupShown', function(annotation) {
	$( "#editor-select" ).val(annotation.text).change();
	_currentAnnotation = annotation;
});
anno.addHandler('onMouseOutOfAnnotation', function(annotation) {
	anno.setProperties({
		hi_stroke: 'white'
	});
});

function customizeEditBox(){
	$textarea = $('.annotorious-editor form textarea')
	if (!edited && $textarea.length){
		edited = true;
		// $(".annotorious-editor form").before('<select id="editor-select" class="annotorious-editor-text"> <option value="" disabled selected></option> <option>salam</option> <option>khoobi</option> <option>khoshi</option> <option>salamati</option> <option>che khabar</option> <option> khodafez </option> </select>');
	//	$(".annotorious-editor form").before('<select id="editor-select" class="annotorious-editor-text"> <option value="" disabled selected></option> </select>');
	//	fillSelectBox(names);
		$(".annotorious-editor form").each(function(){
			$newSelect = $('<select> <option value="" disabled selected></option> </select>');
			fillSelectBox(names,$newSelect);
			$(this).before($newSelect);
	                $select2_box = $newSelect;
        	        $select2_box.select2();
                	$select2_box.select2({
	                placeholder: "Select a Name",
	                  allowClear: true,
         		  dir: 'rtl',
	                  theme: 'dark'
        	        });
                	$select2_box.change(function() {
		                $textarea.val($(this).val());
        		});
	                $textarea.hide();
		});
	}	
}
function customizePopUp(){
//	$checkMark = $('.annotorious-popup-button-delete')
//	$checkMark.css("background",'url(css/check.png)',"important");
}


function fillSelectBox(names,$select){
	for(var i in names){
		$select.append("<option>"+names[i]+"</option>")
	}
}
