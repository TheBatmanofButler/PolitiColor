/**
	@author: Ganesh Ravichandran
	@version: 0.1
	@date: 1-22-16

	Description: Brill
**/

var rules = {
	"NP VP":"S"
} 

var keywords = {
	'trump': 'NNP', 
	'clinton': 'NNP',
	'sanders': 'NNP',
	'cruz':'NNP',
	'democratic_party':'NNP',
	'republican_party':'NNP',
	'obama':'NNP',
	'general_election':'NN',
	'grass_roots': 'JJ'

}

// part-of-speech brill library
var pos = require('pos');

function addPoliticsLex(tagger) {
	for(key in keywords) {
		tagger.extendLexicon({key:[keywords[key]]});
	}

	return tagger;
}

module.exports = {
	process: function(response, callback) {
	    var words = new pos.Lexer().lex(response.tweet);
		var tagger = new pos.Tagger();

		tagger = addPoliticsLex(tagger);

		var taggedWords = tagger.tag(words);

		var posString = "";

		for(index in taggedWords) {
			posString = posString + taggedWords[index][1] + " ";
		}

		console.log(posString);



		response.tweet = taggedWords;

	    callback(response);
	}
}
