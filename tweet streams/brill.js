/**
	@author: Ganesh Ravichandran
	@version: 0.1
	@date: 1-22-16

	Description: Brill
**/

var posFilter = {
	JJ:1,
	JJR:1,
	JJS:1,
	VB:1,
	VBZ:1,
	VBD:1,
	VBP:1,
	VBG:1,
	VBN:1,
	RB:1,
	RBR:1,
	RBS:1,
	NN:1,
	NNPS:1,
	NNP:1,
	NNS:1
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
var NPpredescribers = /((((PDT|JJR|JJS|JJ|VBG)\s)?(CC\s|,\s)?)+)/g

//Matches who/what can/should verb verbing
var NPpostdescribers = /((\s?(WP|WDT)\s(MD\s)?(VBD|VBP|VBZ|VB)(\sVBG|\sVBN)?)+)/g

var VPprepostdescribers = /(\s?(RBR|RBS|RB)(\sCC|\s,)?)+/g

var VPverbs = /\s?(((VBD|VBP)\s(((JJ\s)?TO\sVB)|VBD|VBN))|VBD|VBZ)/g

//Matches optional CC/, with various noun forms
var NPsubjects = /(((\s?(NNPS|NNP|NNS|NN))+(\s(CC\s|,\s))?)+)/

module.exports = {
	process: function(response, callback) {
	    var words = new pos.Lexer().lex(response.tweet);
		var tagger = new pos.Tagger();

		tagger = addPoliticsLex(tagger);

		var taggedWords = tagger.tag(words);

		var posString = "";
		var actualString = "";

		console.log(taggedWords)

		for(var i=0; i < taggedWords.length; i++) {
			if(!posFilter[taggedWords[i][1]]) {
				taggedWords.splice(i, 1);
				i--;
			}
		}

		console.log(taggedWords)

		var possibleSubjects = [];


		
		console.log(subjects);

		response.tweet = taggedWords;

	    callback(response);
	}
}
