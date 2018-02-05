

require("dotenv").config();

var util = require('util');

var liriKeys = require("./keys.js");


// Include the request npm package
var request = require("request");

// Load the fs package to read and write
var fs = require("fs");

// Store Liri Bot actions (i.e. "my-tweets", "spotify-this-song", "movie-this", "do-what-it-says")
var liriBotAction = process.argv[2];

// Create an empty variable for holding the user response
var userResponse = "";


// Function to get movie/song name
function getArgValue() {

    // Store all of the arguments in an array
    var nodeArgs = process.argv;

    // Loop through all the words in the node argument
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {

            userResponse = userResponse + "+" + nodeArgs[i];
            // console.log(songName);

        } else {

            userResponse += nodeArgs[i];
            // console.log(songName);
        }
    }
    return userResponse;
}


// Switch-case statement and it will direct which function gets run
switch (liriBotAction) {

    case "movie-this":
        userResponse = getArgValue();
        console.log(userResponse);

        if (userResponse === "") {
            userResponse = "Mr. Nobody";
            console.log("Displaying the details of movie: Mr. Nobody since you haven't entered any movie name");
            console.log("If you haven't watched it, then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
            movieInfo();
        } else {
            movieInfo();
        }
        break;

    case "spotify-this-song":
        userResponse = getArgValue();
        // console.log(userResponse);

        if (userResponse === "") {
            userResponse = "The sign Ace of Base";
            spotifyInfo();
        } else {
            spotifyInfo();
        }
        break;

    case "my-tweets":
        twitterInfo();
        break;
}


// Function to get movie details
function movieInfo() {

    // OMDB API
    var movieAPI = "1f19de3a";

    // Then run a request to the OMDB API with the movie specified
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + userResponse + "&y=&plot=short&apikey=" + movieAPI;

    // console.log(movieQueryUrl);

    request(movieQueryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // console.log(body);
            // Parse the body of the site and recover the movie details
            var movieDetails = JSON.parse(body);
            // console.log(movieDetails);
            console.log("================================================================================================");
            console.log("* Title of the movie: " + movieDetails.Title);
            console.log("* Release Year: " + movieDetails.Year);
            console.log("* IMDB Rating: " + movieDetails.imdbRating);

            var movieRating = movieDetails.Ratings;
            // console.log(rating);

            if (movieRating != "") {

                for (var i = 0; i < movieRating.length; i++) {

                    if (movieRating[i].Source === "Rotten Tomatoes") {

                        console.log("* Rotten Tomatoes Rating: " + movieRating[i].Value);

                    }
                }

            } else {
                console.log("* Rotten Tomatoes Rating: Rating information is not available");
            }

            console.log("* Country where the movie was produced: " + movieDetails.Country);
            console.log("* Language of the movie: " + movieDetails.Language);
            console.log("* Plot of the movie: " + movieDetails.Plot);
            console.log("* Actors in the movie: " + movieDetails.Actors);
            console.log("================================================================================================");
        }
    })
}

// Function to get song details from Spotify
function spotifyInfo() {

    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(liriKeys.spotify);
    // console.log(liriKeys.spotify);

    // Spotify search with limit 1
    spotify.search({ type: 'track', query: userResponse, limit: 1 }, function (err, data) {
        // spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var songTracks = data.tracks.items;
        // console.log(songTracks);

        for (var i = 0; i < songTracks.length; i++) {

            // Artists name
            var artistsName = songTracks[i].album.artists[i].name;
            // console.log(artistsName);

            console.log("================================================================================================");
            console.log("* The song's name: " + songTracks[i].name);
            console.log("* The album name : " + songTracks[i].album.name);
            console.log("* Artist(s): " + artistsName);
            console.log("* Preview link: " + songTracks[i].preview_url);
            console.log("================================================================================================");
        }

        // console.log(console.log(util.inspect(data, { depth: null, colors: true })));
    })
}

