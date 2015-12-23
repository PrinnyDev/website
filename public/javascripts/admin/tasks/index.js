//////////////////////
// globals
//////////////////////
var $tagsSelect2 = $('#tags');

//////////////////////
// on document load
//////////////////////
document.addEventListener('DOMContentLoaded', function() {

	initialize();

});
//////////////////////
// methods
//////////////////////

function initialize() {
	// add click event listeners for table cells
	addTableRowOnClickEventListeners();
	
	// initialize select2
	$tagsSelect2.select2({
		tags: true
	});
}


/*	Description:
*	When a table row(tbody tr), which represents a task, is 
*	clicked, the description div(#taskDescription) will be 
*	updated with a tasks description, which is located in a 
*	hidden td(.description).
*/
function addTableRowOnClickEventListeners() {
	tableRows = document.querySelectorAll('tbody tr');
	for (var i = 0; i < tableRows.length; i++) {
		var currentRow = tableRows[i];
		var clickHandler = function(row) {
			return function() {
				console.log(row);
				var title = row.querySelector('.title').innerHTML,
					descrition = row.querySelector('.description').innerHTML,
					tags = row.querySelectorAll('.tag'),
					priority = row.getAttribute('data-in-progress'),
					inProgress = false;
				console.log(priority);

				document.getElementById('title').value = title ? title : 'N/A';
				document.getElementById('description').innerHTML = descrition ? descrition : 'N/A';
				document.querySelector('input[name=inProgress][value=true]').checked
				//tags have to be added programmatically to the select2
				addTagDataToSelect2(tags);
			}
		}

		currentRow.querySelector('td.title').onclick = clickHandler(currentRow);
	}
}

/*	Description:
*	Add 
*/
function addTagDataToSelect2(tags) {
	var data = [];
	var tagIds = [];
	for (var i = 0; i < tags.length; i++) {
		var tag = {};
		var tagId = tags[i].innerHTML;

		tag.id = tagId;
		tag.text = tagId;
		data.push(tag);
		tagIds.push(tagId);
	}
	$tagsSelect2.select2({
		data: data,
		tags: true,
		minimumInputLength: 2
	});
	$tagsSelect2.val(tagIds).trigger('change');
}
