// ============== Our Code For Managing Tooltip
// We have multiple jQuery objects so removing Conflicts
jQuery.noConflict();
(function($) {

	$(document).ready(function($) {

		// Utils 
		var getDataObjectForLabel = function(labelForWhichTooltipDataNeeded, listOfTooltipObjects) {

			for (var i = listOfTooltipObjects.length - 1; i >= 0; i--) {
				if(listOfTooltipObjects[i].key.toLowerCase() == labelForWhichTooltipDataNeeded.toLowerCase()) {
					return listOfTooltipObjects[i];
				}
			};
			return null;
		}
			
		// Getting model name from the SINGULAR PROPERTY of 
		var modelName = Keystone.list.singular.replace(/\s/g, '');
		
		// Fetching All Details
		console.log('Loading Data Sets for Tooltip File for Model Name - ', modelName);
		$.ajax({
			url: "/api/getTooltips/" + modelName,
			data: {
				modelName: modelName
			}
		}).done(function(response) {
			console.log('Data receieved from Server for Tooltip - ', response);

			// Finding all Labels
			var elements = document.getElementsByClassName('field-label');
			for (var i = elements.length - 1; i >= 0; i--) {
				
				var dataForLabelFromMap = getDataObjectForLabel($(elements[i]).text(), response.data);
				if(dataForLabelFromMap == null) {
					continue;
				}
				console.log(dataForLabelFromMap);

				// For each Row Add Icon at end
				$(elements[i]).append('&nbsp;&nbsp;<span id="tooltip-'+i+'" data="'+$(elements[i]).text()+'" class="ion-information-circled"></span>');


				// For each Row find LABEL & assigning on Click of that
				$('#tooltip-'+ i).on('click', {
					dataForLabel: dataForLabelFromMap
				}, function(event){

					var dataForLabel = event.data.dataForLabel;

					// Forming Content for Modal
					var popupContentForModal = dataForLabel.popupContent;
					if(dataForLabel.popupImage) {
						if(dataForLabel.popupImage.url.length > 3) {
							popupContentForModal += " <br/> <div style='text-align: center;'><img style='max-width: 250px;' src='" + dataForLabel.popupImage.url + "'/></div> <br/>";
						}
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