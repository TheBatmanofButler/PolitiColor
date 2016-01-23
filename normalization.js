/**
	@author: Amol Kapoor
	@version: 0.1
	@date: 1-22-16

	Description: Normalization
**/

var stringMap = {
	' :)': ' happy',
	' :(': ' sad',
	' :D': ' very happy',
	' D:': ' ver'
}

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

	}
}