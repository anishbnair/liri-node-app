

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


// Function to get movie details
function movieInfo() {

    // Create an empty variable for holding the movie name
    var movieName = "";
    // OMDB API
    var movieAPI = "1f19de3a";

    // Loop through all the words in the node argument
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {

            movieName = movieName + "+" + nodeArgs[i];

        } else {

            movieName += nodeArgs[i];
        }
    }

    // Then run a request to the OMDB API with the movie specified
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + movieAPI;

    // This line is just to help us debug against the actual URL.
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

