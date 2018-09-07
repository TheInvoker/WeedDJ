window.utterances = [];
function readText(str, callback) {
	var msg = new SpeechSynthesisUtterance();
	utterances.push( msg );
	//var voices = window.speechSynthesis.getVoices();
	//msg.voice = voices[10]; // Note: some voices don't support altering params
	//msg.voiceURI = 'native';
	//msg.volume = 1; // 0 to 1
	//msg.rate = 1; // 0.1 to 10
	//msg.pitch = 2; //0 to 2
	msg.text = str;
	msg.lang = 'en-US';

	msg.onend = function(e) {
		callback();
	};

	speechSynthesis.speak(msg);
}






$("#search_purchases").click(function() {
	
	var start_date = $("#start_date").val();
	var end_date = $("#end_date").val();

	$("#purchase_results").empty();
	$.ajax({
		url: '/getPurchases?start_date=' + start_date + '&end_date=' + end_date,
		type: 'GET',
		success: function(data, textStatus, jqXHR){
			//console.log(data);

			data.items.map(function(item) {
				$("#purchase_results").append(
				'<div class="purchase-item" data-barcode="' + item.barcode + '">' +
					'<div>' +
						'Purchased At: ' + item.createdAt +
					'</div>' +
					'<div>' +
						'Total Items: ' + item.totalItems +
					'</div>' +
					'<div>' +
						'Total Price: $' + item.finalTotal +
					'</div>' +
					'<div>' +
						'Notes: ' + item.notes +
					'</div>' +
				'</div>'
				);
			});
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			alert(errorThrown);
		}
	});

	$("body").on('click', '.purchase-item', function() {
		var barcode = this.getAttribute('data-barcode');

		$("#item_results").empty();
		$.ajax({
			url: '/getPurchase?barcode=' + barcode,
			type: 'GET',
			success: function(data, textStatus, jqXHR){
				//console.log(data);
				
				data.purchaseOrderItems.map(function(item) {
					$("#item_results").append(
					'<div class="order-item" data-id="' + item.id + '" data-strain-title="' + item.strain.title + '">' +
						'<div>' +
							'Strain: ' + item.strain.title +
						'</div>' +
						'<div>' +
							'Inventory Type: ' + item.inventoryType.title +
						'</div>' +
						'<div>' +
							'Total Price: $' + item.finalTotal +
						'</div>' +
						'<div>' +
							'Quantity: ' + item.quantityDescription +
						'</div>' +
					'</div>'
					);
				});
				$("#item_results").append('<button class="get-playlist">Get Playlist</button>');
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				alert(errorThrown);
			}
		});
	});

	$("body").on('click', '.get-playlist', function() {
		var strains = [];
		$(".order-item").each(function(i,x) {
			var name = x.getAttribute('data-strain-title');
			strains.push(name);
		});

		//var count = 0;
		$("#playlist_results").empty();

		$("#playlist_results").append(
			'<div><a target="_blank" href="https://www.youtube.com/watch?v=WeYsTmIzjkw&list=PLhUkYnexjFz8uJ_Q_9NdSdCgY0A33g38J">You may like this playlist</a></div><br/>'
		);

		$("#playlist_results").append(
			'<div class="playlist-item non-compliant">' +
				'<h2>Non-Compliant based on advertising cannabis</h2>' +
				'<div>' +
					'Title: ' + 'Weed For You' +
				'</div>' +
				'<div>' +
					'Artist: ' + 'SpliffMan' +
				'</div>' +
				'<div>' +
					'Result: ' + 'Hey buy some of this <em>banana</em> <em>peach</em> weed, its what you need' +
				'</div>' +
				'<div>' +
					'Preview: <span>Hey buy some of this banana peach weed, its what you need</span>' +
				'</div>' +
			'</div>'
			);

		strains.map(function(strain) {
			$.ajax({
				url: '/getPlaylist?search=' + strain,
				type: 'GET',
				success: function(data, textStatus, jqXHR){
					//console.log(data);
		
					data.tracks.map(function(item) {
						$("#playlist_results").append(
						'<div class="playlist-item">' +
							'<div>' +
								'Title: ' + item.title +
							'</div>' +
							'<div>' +
								'Artist: ' + item.artist.name +
							'</div>' +
							'<div>' +
								'Result: ' + item.context +
							'</div>' +
							'<div>' +
								'Preview: <span>' + item.snippet + '</span>' +
							'</div>' +
							'<div>' +
								'Youtube: <a target="_blank" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(item.title + ' by ' + item.artist.name) + '"><img src="/images/youtube-logo-icon-transparent---32.png" height="25px" style="position:relative;top:3px;"></a>' +
							'</div>' +
						'</div>'
						);
					});
				},
				error : function(XMLHttpRequest, textStatus, errorThrown){
					alert(errorThrown);
				}
			});
			//$("#playlist_results").append('<button>Loop All</button>');
		});
	});

	$("body").on('click', '.playlist-item:not(.non-compliant)', function() {
		var snippet = $(this).find('span').text();
		readText(snippet, function() {

		});
	});

	$("body").on('click', '.playlist-item a', function(e) {
		e.stopPropagation();
	});
});










