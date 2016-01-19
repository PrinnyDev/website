//////////////////////
// globals
//////////////////////
var $tagsSelect2 = $('#tags');
var taskAPIRoute = '/api/tasks/';

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
	// add click event listener for form submit
	addTaskFormSubmitEventListener();
	// initialize select2
	$tagsSelect2.select2({
		tags: true
	});
	// initialize date picker
	$('#complete').datetimepicker({
		showTodayButton: true,
		showClear: true,
		showClose: true
	});
}


/*	Description:
*	When a table row(tbody tr), which represents a task, is 
*	clicked, the form will auto-populate with the task information.
*/
function addTableRowOnClickEventListeners() {
	tableRows = document.querySelectorAll('tbody tr');
	for (var i = 0; i < tableRows.length; i++) {
		var currentRow = tableRows[i];
		var clickHandler = function(row) {
			return function() {
				var id = row.dataset._id,
					title = row.dataset.title,
					description = row.dataset.description,
					tags = row.dataset.tags.split(','),
					inProgress = row.dataset.in_progress,
					priority = row.dataset.priority;

				document.getElementById('id').value = id ? id : '';
				document.getElementById('title').value = title ? title : 'N/A';
				document.getElementById('description').innerHTML = description ? description : 'N/A';
				inProgress === 'true' ? document.querySelector('input[name=in_progress][value=true]').checked = true : document.querySelector('input[name=in_progress][value=false]').checked = true;
				priority === 'true' ? document.querySelector('input[name=priority][value=true]').checked = true : document.querySelector('input[name=priority][value=false]').checked = true;
				//tags have to be added programmatically to the select2
				addTagDataToSelect2(tags);
			}
		}

		currentRow.querySelector('td.title').onclick = clickHandler(currentRow);
	}
}

/*	Description: Takes in an array of strings and updates
*	the select2 widget in the task form with them.
*/
function addTagDataToSelect2(tags) {
	var data = [];
	var tagIds = [];
	for (var i = 0; i < tags.length; i++) {
		var tag = {};
		var tagId = tags[i];

		if (!tagId.length) {
			continue;
		}

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

/*	Description: Adds event listener for the task form submission.
*	Depending on the presence of the task ID in the form, change the
*	form method to either POST(id is missing) or PUT(id included).
*/
function addTaskFormSubmitEventListener() {
	var $taskForm = $('#taskForm');
	$taskForm.on('submit', function(e) {
		e.preventDefault();
		var	id = document.getElementById('id').value,
			isNew = id.length ? false : true,
			method = isNew ? 'POST' : 'PUT',
			url = isNew ? taskAPIRoute : taskAPIRoute + id,
			data = $taskForm.serialize();
			document.getElementById('tags').value.length ? data = data : data = data + '&tags=';
		$.ajax({
			url: url,
			method: method,
			data: data
		});
	});

}
