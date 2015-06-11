// ============== Our Code For Managing Tooltip
// Utils 
var getDataObjectForLabel = function(labelForWhichTooltipDataNeeded, listOfTooltipObjects) {

	for (var i = listOfTooltipObjects.length - 1; i >= 0; i--) {
		if(listOfTooltipObjects[i].key.toLowerCase() == labelForWhichTooltipDataNeeded.toLowerCase()) {
			return listOfTooltipObjects[i];
		}
	};
	return null;
};

// Tooltip Initializing
function initTooltip() {

	console.log('initToolTip = Called...');

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
			// console.log(dataForLabelFromMap);

			// For each Row Add Icon at end
			$(elements[i]).append('&nbsp;&nbsp;<span id="tooltip-'+i+'" data="'+$(elements[i]).text()+'" class="ion-information-circled"></span>');


			// For each Row find LABEL & assigning on Click of that
			$('#tooltip-'+ i).on('click', {
				dataForLabel: dataForLabelFromMap
			}, function(event){
				// For Convinience 
				var dataForLabel = event.data.dataForLabel;
				// Forming Content for Modal
				var popupContentForModal = dataForLabel.popupContent;
				if(dataForLabel.popupImage) {
					if(dataForLabel.popupImage.url.length > 3) {
						popupContentForModal += " <br/> <div style='text-align: center;'><img style='max-height: 350px;' src='" + dataForLabel.popupImage.url + "'/></div> <br/>";
					}
				}
				if(dataForLabel.popupVideo) {
					popupContentForModal += " <br/> Video Url: " + dataForLabel.popupVideo;
				}

				// Create Simple Model
				picoModal({
					content: "<center><h2>" + dataForLabel.popupTitle + "</h2></center> <br/>" + popupContentForModal,
					closeStyles: {
						position: "absolute", top: "-10px", right: "-10px",
						color: "#fff",
						background: "#0080BF", padding: "5px 10px", cursor: "pointer",
						borderRadius: "50px", border: "1px solid #0080BF"
					},
					overlayStyles: {
						backgroundColor: "#CFE9FF",
						opacity: 0.75
					}
				}).show();

				/* For Simple Modal
					var SM = new SimpleModal({"btn_ok":"Got it!"});
					SM.show({
						"title": dataForLabel.popupTitle,
						"contents": popupContentForModal
					});
				*/
			});
		};
	}).fail(function() {
		console.log("Tooltip data could not be loaded.");
	});
};

// @JB : Optimize this
(function($) {
	$(document).ready(function($) {
		initTooltip($);
	});
})(window.jQuery);
