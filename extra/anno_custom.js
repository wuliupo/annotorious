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
		$( '#editor-select' ).val("").change()
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
//	$( '#editor-select' ).val("asdasdasdasda").change();
	$textarea.val("(ناآشنا)");
	_currentAnnotation = annotation;
});
anno.addHandler('onMouseOutOfAnnotation', function(annotation) {
	anno.setProperties({
		hi_stroke: 'white'
	});
});
anno.addHandler('onAnnotationIsCorrect', function(annotation) {
//	console.log('correct');
});
anno.addHandler('onAnnotationIsWrong', function(annotation) {

	$("#editor-select").val("asdasdasdsd").change();

});
anno.addHandler('onAnnotationUpdated', function(annotation) {
//	console.log(annotation.text);
});
function customizeEditBox(){
	$textarea = $('.annotorious-editor form textarea')
	if (!edited && $textarea.length){
		edited = true;
		// $(".annotorious-editor form").before('<select id="editor-select" class="annotorious-editor-text"> <option value="" disabled selected></option> <option>salam</option> <option>khoobi</option> <option>khoshi</option> <option>salamati</option> <option>che khabar</option> <option> khodafez </option> </select>');
	//	$(".annotorious-editor form").before('<select id="editor-select" class="annotorious-editor-text"> <option value="" disabled selected></option> </select>');
	//	fillSelectBox(names);
		$('.annotorious-editor form').each(function(){
			$newSelect = $('<select> <option value="" disabled selected></option> </select>');
			fillSelectBox(names,$newSelect);
			$(this).before($newSelect);

			$select2_box = $newSelect;
			$select2_box.select2();
			$select2_box.select2({
				placeholder: "(ناآشنا)",
				allowClear: true,
				dir: 'rtl',
				language: { noResults: function(){ return '...'; }},
			});
			$select2_box.change(function() {
				$textarea.val($(this).val());
				_currentAnnotation.changed = true;
			});
			$textarea.hide();
		});
	}
}
function customizePopUp(){
//	$checkMark = $('.annotorious-popup-button-delete')
//	$checkMark.css("background",'url(/static/css/check.png) no-repeat center center',"important");
}


function fillSelectBox(names,$select){
	for(var i in names){
		$select.append('<option>'+names[i]+'</option>')
	}
}
