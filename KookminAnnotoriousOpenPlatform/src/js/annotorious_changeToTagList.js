//custom hjkim
//select_box options for selection tag name. hjkim
//TODO:과제 종료 끝난 후, menu_UI로 합쳐서 관리해야함.

function changeLabelBoxUI() {
	$('.annotorious-editor-text.goog-textarea')
	.replaceWith("<select id='selectTagName'>" + $(this).text() + "</select>");


	const tagNames = tag_names;
	tagNames.forEach(tag => {
		var typeOption = document.createElement('option');
		var tagOption = document.createTextNode(tag);
		typeOption.appendChild(tagOption);
		document.getElementById("selectTagName").appendChild(typeOption);
	});
}

