var tweetNum = 0;
var tweets = {};

// file reader
$("#file-input").change( function(e) {
	var textFile = e.target.files[0];
	var reader = new FileReader();
	
	reader.onload = function(e) {
    var contents = e.target.result.split('\n');
	  for (var tweet in contents) {
	  	tweets[contents[tweet]] = '';
	  }
	  pullNewTweet(null);
  };
  reader.readAsText(textFile);


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

$("#positive-button").click( function() {
	pullNewTweet("positive");
});

$("#negative-button").click( function() {
	pullNewTweet("negative");
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