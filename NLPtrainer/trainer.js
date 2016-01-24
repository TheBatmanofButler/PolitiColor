var tweetNum = 0;
var tweets = {};

// file reader
$("#file-input").change( function(e) {
  var reader = new FileReader();
  reader.onload = function (event) {
    var obj = JSON.parse(event.target.result);

		for (var tweet in obj) {
	  	tweets[tweet] = '';
	  }

	  pullNewTweet(null);

	  $("#positive-button").click( function() {
			pullNewTweet("positive");
		});

		$("#neutral-button").click( function() {
			pullNewTweet("neutral");
		});

		$("#negative-button").click( function() {
			pullNewTweet("negative");
		});

		$(document).keydown(function(e) {
		  if(e.which == 81) {
				pullNewTweet("positive");
		  }
		  else if(e.which == 87) {
				pullNewTweet("neutral");
		  }
		  else if (e.which == 69) {
				pullNewTweet("negative");
		  }
	  });

		$("#create-json-button").click( function() {
			var json = JSON.stringify(tweets);
			var blob = new Blob([json], {type: "application/json"});
			var url  = URL.createObjectURL(blob);

			var a = document.createElement('a');
			a.download    = "trainer.json";
			a.href        = url;
			a.textContent = "Download backup.json";

			a.click();
		});
  }

  reader.readAsText(event.target.files[0]);

});

// pulls down next tweet from tweets object
function pullNewTweet(boolValue) {

	var tweet = Object.keys(tweets)[tweetNum];

	if (boolValue == null) {
		$("#tweet").text(tweet);
	}
	else {
		tweets[tweet] = boolValue;

		tweetNum++;

		var tweet = Object.keys(tweets)[tweetNum];
		$("#tweet").text(tweet);

	}
}