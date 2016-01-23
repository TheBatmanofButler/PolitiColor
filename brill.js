/**
	@author: Ganesh Ravichandran
	@version: 0.1
	@date: 1-22-16

	Description: Brill
**/
var pos = require('pos');

module.exports = {
	process: function(response, callback) {
	    var words = new pos.Lexer().lex(response);
		var tagger = new pos.Tagger();
		var taggedWords = tagger.tag(words);
	    callback(taggedWords)
	}
}