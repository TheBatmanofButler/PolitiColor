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
	'grass_roots': 'JJ',
	'feeltheburn': 'NN',
	'trump2016':'NN',
	'theRealDonaldTrump':'NNP'
}

// part-of-speech brill library
var pos = require('pos');

function addPoliticsLex(tagger) {
	for(key in keywords) {
		tagger.extendLexicon({key:[keywords[key]]});
	}

	return tagger;
}

//Rules to match different portions of the sentence based on tagged words

//Any number of PDT, JJ, VBG, and CC's together
var NPpredescribers = /((((PDT|JJR|JJS|JJ|VBG)\s)?(CC\s|,\s)?)+)/

//Matches optional CC/, with various noun forms
var NPsubjects = /(((\s?(NNPS|NNP|NNS|NN))+(\s(CC\s|,\s))?)+)/

//Matches who/what can/should verb verbing
var NPpostdescribers = /((\s?(WP|WDT)\s(MD\s)?(VBD|VBP|VBZ|VB)(\sVBG|\sVBN)?)+)/

var VPprepostdescribers = /(\s?(RBR|RBS|RB)(\sCC|\s,)?)+/

var VPverbs = /\s?(((VBD|VBP)\s(((JJ\s)?TO\sVB)|VBD|VBN))|VBD|VBZ)/

var NP = (NPpredescribers) + (NPsubjects) + (NPpostdescribers);

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

		var match = NPsubjects.exec(posString);
		while (match != null) {
		    console.log(match[0]);
		    match = NPsubjects.exec(posString);
		}

		response.tweet = taggedWords;

	    callback(response);
	}
}
