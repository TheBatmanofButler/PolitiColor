// Derek Hong
// Run on server startup.  Authenticates server to have access to 
// "app authentication only" twitter API

var csvWriter = require('csv-write-stream');
var Twit = require('twit');
var fs = require('fs');

// Establish OAuth1.1 authenticiation using twit
var T = new Twit({
    consumer_key:         '6THpxfSjcNqDhPHyhosa5fmem'
  , consumer_secret:      'FmWuPPvBbiJgnFBKjUutBvV5LjbJinC5u6ufH9cNFMmUcWQ0gc'
  , access_token:         '4836767349-vrlAL76iFSePpv61aFKLoFQaSJRJXzTqlYzL1nS'
  , access_token_secret:  'BAfrbJDtoGapiCJ9rwTvgRkzKP2HR0bbJZ0sCZgwNTEG5'
});

var toTrack = { 
	track: [
		'donaldtrump', 		'trump', 	'berniesanders', 
		'hillary clinton', 	'ted cruz', 'GOP', 
		'GOP frontrunner', 'realdonaldtrump', 'feelthebern',
		'hillaryclinton', 	'tedcruz', 'democrat',
		'republican', 'makeamericagreatagain', 'democratic frontrunner'],
	language: 'en'
};
var stream = T.stream('statuses/filter', toTrack);


var writer = new csvWriter({ headers: ['tweet', 'location'] });
writer.pipe(fs.createWriteStream('tweetData.csv'));

var numTweets = 0;


stream.on('tweet', function(tweet) {
	var parsedTweet = JSON.parse(JSON.stringify(tweet))
	var tweetText = parsedTweet.text;
	var userLocation = parsedTweet.user.location;

	numTweets++;

	if (userLocation !== null && userLocation.indexOf(',') > -1) {
		//console.log(tweetData);
		writer.write([tweetText, userLocation]);
	}

	if (numTweets%500==0) {
		console.log(numTweets);
	}
});


//writer.end()






