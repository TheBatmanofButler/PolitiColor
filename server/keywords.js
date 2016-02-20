/**
	@author: Amol Kapoor
	@version: 0.1
	@date: 1-22-16

	Description: Filter
**/

var curations = {
	'trump':1,
	'clinton':1,
	'sanders':1,
	'cruz':1, 
	'republican':1,
	'democrat':1
}

var keywords = {
	//trump
	'trump':'trump',
	'realDonaldTrump':'trump',
	'gop_frontrunner':'trump',
	'trump2016':'trump',
	'make_america_great_again': 'trump',
	'art_of_the_deal':'trump',
	'dumptrump':'trump',
	//clinton
	'clinton':'clinton',
	'democratic_frontrunner':'clinton',
	'benghazi':'clinton',
	'email_scandal':'clinton',
	'queenhill':'clinton',
	'hillary2016':'clinton',
	//sanders
	'sanders':'sanders',
	'feelthebern':'sanders',
	'feeltheburn':'sanders',
	'socialist':'sanders',
	'bernie2016':'sanders',
	//cruz
	'cruz':'cruz',
	'cruz2016':'cruz',
	'tedcruz2016':'cruz',
	'cruzcrew':'cruz',
	'teaparty':'cruz',
	//democrats
	'democrat':'democrat',
	'democratic':'democrat',
	'msnbc':'democrat',
	'liberal':'democrat',
	'socialist':'democrat',
	'demdebates':'democrat',
	//republican
	'republican':'republican',
	'fox':'republican',
	'conservative':'republican',
	'gop':'republican',
	'gop_party':'republican',

}

module.exports = {
	process: function(response, callback) {
		var tweet = response.tweet;

		if(!response.subj) {
			response.subj = [];
		}

		var wordlist = tweet.split(' ');

		for(i in wordlist) {
			if(keywords[wordlist[i]]) {
				response.subj.push(keywords[wordlist[i]]);
			}
		}

		callback(response);
	}
}
