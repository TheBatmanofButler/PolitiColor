// Derek Hong 2016
// Run on server startup.  Authenticates server to have access to 
// "app authentication only" twitter API

var csvWriter = require('csv-write-stream');
var Twit = require('twit');
var fs = require('fs');
var states = {
	Alabama: 'AL',
    Alaska: 'AK',
    Arizona: 'AZ',
    Arkansas: 'AR',
    California: 'CA',
    Colorado: 'CO',
    Connecticut: 'CT',
    Delaware: 'DE',
    Florida: 'FL',
    Georgia: 'GA',
    Hawaii: 'HI',
    Idaho: 'ID',
    Illinois: 'IL',
    Indiana: 'IN',
    Iowa: 'IA',
    Kansas: 'KS',
    Kentucky: 'KY',
    Louisiana: 'LA',
    Maine: 'ME',
    Maryland: 'MD',
    Massachusetts: 'MA',
    Michigan: 'MI',
    Minnesota: 'MN',
    Mississippi: 'MS',
    Missouri: 'MO',
    Montana: 'MT',
    Nebraska: 'NE',
    Nevada: 'NV',
    NewHampshire: 'NH',
    NewJersey: 'NJ',
    NewMexico: 'NM',
    NewYork: 'NY',
    NorthCarolina: 'NC',
    NorthDakota: 'ND',
    Ohio: 'OH',
    Oklahoma: 'OK',
    Oregon: 'OR',
    Pennsylvania: 'PA',
    RhodeIsland: 'RI',
    SouthCarolina: 'SC',
    SouthDakota: 'SD',
    Tennessee: 'TN',
    Texas: 'TX',
    Utah: 'UT',
    Vermont: 'VT',
    Virginia: 'VA',
    Washington: 'WA',
    WestVirginia: 'WV',
    Wisconsin: 'WI',
    Wyoming: 'WY',
    AL: 'AL',
	AK: 'AK',
	AZ: 'AZ',
	AR: 'AR',
	CA: 'CA',
	CO: 'CO',
	CT: 'CT',
	DE: 'DE',
	FL: 'FL',
	GA: 'GA',
	HI: 'HI',
	ID: 'ID',
	IL: 'IL',
	IN: 'IN',
	IA: 'IA',
	KS: 'KS',
	KY: 'KY',
	LA: 'LA',
	ME: 'ME',
	MD: 'MD',
	MA: 'MA',
	MI: 'MI',
	MN: 'MN',
	MS: 'MS',
	MO: 'MO',
	MT: 'MT',
	NE: 'NE',
	NV: 'NV',
	NH: 'NH',
	NJ: 'NJ',
	NM: 'NM',
	NY: 'NY',
	NC: 'NC',
	ND: 'ND',
	OH: 'OH',
	OK: 'OK',
	OR: 'OR',
	PA: 'PA',
	RI: 'RI',
	SC: 'SC',
	SD: 'SD',
	TN: 'TN',
	TX: 'TX',
	UT: 'UT',
	VT: 'VT',
	VA: 'VA',
	WA: 'WA',
	WV: 'WV',
	WI: 'WI',
	WY: 'WY'
};

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

var numTweets = 1;




module.exports = {
	startStream: function(callback) {
		var stream = T.stream('statuses/filter', toTrack);

		stream.on('tweet', function(tweet) {
			var parsedTweet = JSON.parse(JSON.stringify(tweet))
			var tweetText = parsedTweet.text;
			var userLocation = parsedTweet.user.location;

			if (userLocation !== null) {
				var normalizedLocation = userLocation.replace(/\s/g, '');;
				normalizedLocation = normalizedLocation.split(',');

				for (var i in normalizedLocation) {
					var stateCode = states[normalizedLocation[i]];

					if (stateCode) {
						
						var responseObj = {
							location: {
								state: stateCode
							}, 
							sent: null,
							subj: null
						}

						callback(responseObj);
					}
				}
			}
		});
	}
}

//writer.end()






