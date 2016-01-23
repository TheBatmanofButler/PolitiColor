/**
	@author: Amol Kapoor
	@version: 0.1
	@date: 1-22-16

	Description: Normalization
**/

var stringMap = {
	':)':'happy',
	':(':'sad',
	':D':'very happy',
	'D:':'very sad',
	'>:(':'angry',
	'D:<':'very angry',
	'u':'you',
	'r':'are',
	'ur':'your',
	'b':'be',
	'b4':'before',
	'tho':'though',
	'bae':'awesome',
	'abt':'about',
	'..':'...',
	'<3':'love',
	'w/':'with',
	'b/c':'because',
	'w/o':'without',
	'@':'at',
	'wtf':'what the fuck',
	'btw':'by the way',
	'da':'the',
	'deets':'details',
	'fab':'fabulous',
	'ftw':'for the win',
	'ic':'I see',
	'idk':'I do not know',
	'tbh':'to be honest',
	'donald trump':'trump',
	'bernie sanders':'sanders',
	'hillary clinton':'clinton',
	'gov':'government',
	'dem':'democrat',
	'GOP':'republican'
}	

//Matches all white space
var spaceRegex =/[\s]+/g;

//Matches anything with 2 followed immediately by text
var twoTooRegex =/2([a-z]+)/g;

//Matches any number followed by k
var thousandRegex =/([0-9]+)k/g;

var atRegex=/@([a-z]+)/g;

module.exports = {
	/**
		Input is tweet
		Output is tweet normalized
		Normalization applied: 
			all lower case; 
			multiple white spaces converted to one;
			slang conversion;
			repeated dots converted to 1 or 3;
			
	**/
	process: function(response, callback) {
		var tweet = response.tweet;
		console.log(tweet)
		tweet = tweet.toLowerCase();
		console.log(tweet)
		tweet = tweet.replace(spaceRegex, ' ')
				.replace(twoTooRegex, function(match, p1) { return 'too ' + p1})
				.replace(thousandRegex, function(match, p1) { return p1 + '000'})
				.replace(atRegex, function(match, p1) { return 'at ' + p1});

		console.log(tweet)

		var words = tweet.split(' ');

		for(index in words) {
			if(stringMap[words[index]]) {
				words[index] = stringMap[words[index]];
			}
		}

		tweet = words.join(' ');

		console.log(tweet);

		return tweet;
	}
}

module.exports.process({tweet:'@WhiteGenocideTM: @realDonaldTrump       Poor Jeb. I        1000k           couldve sworn I saw him outside Trump Tower the other day! 2much man 2much. u suk'});