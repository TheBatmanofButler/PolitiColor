/**
	@author: Amol Kapoor
	@version: 0.1
	@date: 1-22-16

	Description: Normalization
**/

var stringMap = {
	':)':'happy',
	':(':'sad',
	':d':'very happy',
	'd:':'very sad',
	'dX':'dead',
	'>:(':'angry',
	'd:<':'very angry',
	'u':'you',
	'r':'are',
	'ur':'your',
	'b':'be',
	'b4':'before',
	'tho':'though',
	'bae':'awesome',
	'abt':'about',
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
	'donaldtrump':'trump',
	'berniesanders':'sanders',
	'bernardsanders':'sanders',
	'hillaryclinton':'clinton',
	'tedcruz':'cruz',
	'hillary':'clinton',
	'bernie':'sanders',
	'gov':'government',
	'dem':'democrat',
	'gop':'republican_party',
	'gr8': 'great',
	'lol': 'laugh out loud',
	'!!':'!',
	'never':'not',
}	

//Matches all white space
var spaceRegex =/[\s]+/g;

//Matches anything with 2 followed immediately by text
var twoTooRegex =/2([a-z]+)/g;

//Matches any number followed by k
var thousandRegex =/([0-9]+)k/g;

//Matches @lksjdf
var atRegex=/@([a-z]+)/g;

//Matches url
var urlRegex = /https?:\/\/[\w]+.[\w|\/]+((.)[\w]+)+/g

//Matches characters that repeat more than 2 times 
var repeatRegex = /(.)\1{2,}/g;

//Matches contractions
var notContractionRegex = /n't/g;
var haveContractionRegex = /'ve/g;
var willContractionRegex = /'ll/g;


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
		tweet = tweet.toLowerCase();
		tweet = tweet.replace(spaceRegex, ' ')
				.replace(twoTooRegex, function(match, p1) { return 'too ' + p1})
				.replace(thousandRegex, function(match, p1) { return p1 + '000'})
				.replace(atRegex, function(match, p1) { return 'at ' + p1})
				.replace(urlRegex, ' ')
				.replace(repeatRegex, function(match, p1) { return p1+p1})
				.replace(notContractionRegex, function(match) { return " not"})
				.replace(haveContractionRegex, function(match) {return " have"})
				.replace(willContractionRegex, function(match) {return " will"})
				.replace(/[^\x00-\x7F]/g, "")
				.replace('\'', '')
				.replace('republican party', 'republican_party')
				.replace('democratic party', 'democratic_party')
				.replace('general election', 'general_election')
				.replace('gop frontrunner', 'gop_frontrunner')
				.replace('democratic frontrunner', 'democratic_frontrunner')
				.replace('grass roots', 'grass_roots')
				.replace('donald trump', 'trump')
				.replace('ted cruz', 'cruz')
				.replace('hillary clinton', 'clinton')
				.replace('hillary rodham clinton', 'clinton')
				.replace('email scandal', 'email_scandal')
				.replace('bernie sanders', 'sanders')
				.replace('art of the deal', 'art_of_the_deal')
				.replace('#','')
				.replace('@', 'at ')
				.replace('tea party', 'teaparty');


		var words = tweet.split(' ');

		for(index in words) {
			if(stringMap[words[index]]) {
				words[index] = stringMap[words[index]];
			}
		}

		tweet = words.join(' ');

		response.tweet = tweet;

		callback(response);
	}
}

