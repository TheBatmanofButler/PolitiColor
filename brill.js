/**
	@author: Ganesh Ravichandran
	@version: 0.1
	@date: 1-22-16

	Description: Brill
**/

// part-of-speech brill library
var pos = require('pos');

module.exports = {
	process: function(response, callback) {
	    var words = new pos.Lexer().lex(response);
		var tagger = new pos.Tagger();
		var taggedWords = tagger.tag(words);
	    callback(taggedWords)
	}
}

var main = function(response) {
    var words = new pos.Lexer().lex(response);
	var tagger = new pos.Tagger();
	var taggedWords = tagger.tag(words);
	console.log(taggedWords);
}

if (require.main === module) {
	main("Thursday evening, Sen. Bernie Sanders’ presidential campaign account tweeted out a promise that is likely to bring joy to anyone dismayed by the increasing flood of money seeking to influence American elections.");
}