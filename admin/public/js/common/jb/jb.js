// ============== Our Code For Managing Tooltip
// We have multiple jQuery objects so removing Conflicts
jQuery.noConflict();
(function($) {

	$(document).ready(function($) {

		// Utils 
		var getDataObjectForLabel = function(labelForWhichTooltipDataNeeded, listOfTooltipObjects) {

			for (var i = listOfTooltipObjects.length - 1; i >= 0; i--) {
				console.log('Key - ', listOfTooltipObjects[i].key);
				if(listOfTooltipObjects[i].key.toLowerCase() == labelForWhichTooltipDataNeeded.toLowerCase()) {
					console.log('Returning listOfTooltipObject - ', listOfTooltipObjects[i]);
					return listOfTooltipObjects[i];
				}
			};
			return "Entry not found. Contact Master Admin."
		}
			
		// Getting model name from the SINGULAR PROPERTY of 
		var modelName = Keystone.list.singular.replace(/\s/g, '');
		console.log('Modal for Page - ', modelName);
		
		// Fetching All Details
		console.log('Loading Data Sets for Tooltip File....');
		$.ajax({
			url: "/api/getTooltips/" + modelName,
			data: {
				modelName: modelName
			}
		}).done(function(response) {
			console.log('Data receieved from Server - ', response);

			// Finding all Labels
			// var elements = document.querySelectorAll('[data-field-path]');
			var elements = document.getElementsByClassName('field-label');
			console.log('Getting elements - ', elements);
			for (var i = elements.length - 1; i >= 0; i--) {
				
				// For each Row find LABEL & assigning on Click of that
				$(elements[i]).on('click', {
					elements: elements,
					i: i
				}, function(event){

					var dataForLabel = getDataObjectForLabel($(event.data.elements[event.data.i]).text(), response.data);

					var popupContentForModal = dataForLabel.popupContent;
					if(dataForLabel.popupImage) {
						popupContentForModal += " <br/> <div style='text-align: center;'><img src='" + dataForLabel.popupImage.url + "'/></div> <br/>";
					}
					if(dataForLabel.popupVideo) {
						popupContentForModal += " <br/> Video Url: " + dataForLabel.popupVideo;
					}

					// Create Simple Model
					var SM = new SimpleModal({"btn_ok":"Got it!"});
					SM.show({
						"title": dataForLabel.popupTitle,
						"contents": popupContentForModal
					});
				});
			};
		}).fail(function() {
			alert("Tooltip data could not be loaded.");
		});

		// For making jQ available to window
		window.$ = $;
	});

})(jQuery);