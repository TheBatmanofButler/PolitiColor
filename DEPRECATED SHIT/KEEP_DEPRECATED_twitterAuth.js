// Derek Hong
// Obtain twitter App API authentication


// Required for stuff (RFC738 Encoded)
var bearer_cred = '6THpxfSjcNqDhPHyhosa5fmem:FmWuPPvBbiJgnFBKjUutBvV5LjbJinC5u6ufH9cNFMmUcWQ0gc';
var base64_bearer_cred = 'NlRIcHhmU2pjTnFEaFBIeWhvc2E1Zm1lbTpGbVd1UFB2QmJpSmduRkJLalV1dEJ2VjVMamJKaW5DNXU2dWZIOWNORk1tVWNXUTBnYw==';
var httppost_bearer_cred = 'Basic ' + base64_bearer_cred;

//used after the bearer access token is obtained
var bearerAccess_token = '';

var request = require('request');

var options = {
	url: 'https://api.twitter.com/oauth2/token',
	headers: {
		Host: 'api.twitter.com',
		'User-Agent': 'PolitiColoration',
		Authorization: httppost_bearer_cred,
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	},
	body: 'grant_type=client_credentials'
};

// Obtain the bearer access token.  This allows us to make app-authentication only API calls
request.post(
    options,
    function (error, response, body) {
    	console.log(typeof body);

        if (!error && response.statusCode == 200) {
        	console.log(body);
        	bearerAccess_token = body.access_token;
            console.log(bearerAccess_token);
        }
    }
);