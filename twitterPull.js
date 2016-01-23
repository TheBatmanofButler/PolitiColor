// Derek Hong
// Run on server startup.  Authenticates server to have access to 
// "app authentication only" twitter API


var Twit = require('twit');

// Establish OAuth2 authenticiation using twit
var T = new Twit({
    consumer_key:         '6THpxfSjcNqDhPHyhosa5fmem'
  , consumer_secret:      'FmWuPPvBbiJgnFBKjUutBvV5LjbJinC5u6ufH9cNFMmUcWQ0gc'
  , app_only_auth:        true
});

// Set up the query according to Twitter standard protocol
var query = {
	q: 'until:2016-01-20',
	lang: 'en',
	//since_id: '1111111111111',
	//max_id: '682916583073779712',
	geocode: '40.7127,-74.0059,10mi',
	count: 100
};

// Send the GET request using the query to the Twitter API 
T.get('search/tweets', query, function(err, data, response) {
	var requestsRemaining = JSON.parse(JSON.stringify(response)).headers['x-rate-limit-remaining'];
	var parsedData = JSON.stringify(data);

	console.log(parsedData);
	//console.log(data);
	//console.log(requestsRemaining);

	//lonlat(parsedData.statuses);
})














