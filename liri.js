

require("dotenv").config();

var util = require('util');

var liriKeys = require("./keys.js");


// Include the request npm package
var request = require("request");

// Store all of the arguments in an array
var nodeArgs = process.argv;

// Load the fs package to read and write
var fs = require("fs");

// Store Liri Bot actions (i.e. "my-tweets", "spotify-this-song", "movie-this", "do-what-it-says")
var liriBotAction = process.argv[2];


// Switch-case statement and it will direct which function gets run
switch (liriBotAction) {
    case "movie-this":
        movieInfo();
        break;

    case "spotify-this-song":
        spotifyInfo();
        break;

    case "my-tweets":
        twitterInfo();
        break;
}
