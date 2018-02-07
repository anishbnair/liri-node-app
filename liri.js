

require("dotenv").config();

var util = require('util');

// Load keys.js file
var liriKeys = require("./keys.js");

// Store Liri Bot actions (i.e. "my-tweets", "spotify-this-song", "movie-this", "do-what-it-says") as per user input
var liriBotAction = process.argv[2];

// Create an empty variable for holding the user response (e.g. movie/song name)
var userInput = "";


// Function to get the value of 3rd argument (process.argv[3]) which is the user input (i.e. movie/song name)
function getArgValue() {

    // Store all of the arguments in an array
    var nodeArgs = process.argv;

    // Loop through all the words in the node argument
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {

            userInput = userInput + "+" + nodeArgs[i];

        } else {

            userInput += nodeArgs[i];
        }
    }
    return userInput;
}

// calls Liri Bot main function
liriBot(liriBotAction, userInput);

// Liri Bot Main function
function liriBot(liriBotAction, userInput) {

    userInput = getArgValue();

    // Switch-case statement and it will direct which function gets run
    switch (liriBotAction) {

        case "movie-this":
            var movieName = "";
            movieName = userInput;

            if (movieName === "") {
                // console.log("*********************************************************************************************");
                // console.log("Displaying details of movie: Mr. Nobody since you haven't entered any movie name");
                // console.log("If you haven't watched it, then you should: http://www.imdb.com/title/tt0485947/");
                // console.log("It's on Netflix!");
                // console.log("*********************************************************************************************");
                logResult("\n");
                logResult("*********************************************************************************************");
                logResult("Displaying details of movie: Mr. Nobody since you haven't entered any movie name.");
                logResult("If you haven't watched it, then you should: http://www.imdb.com/title/tt0485947/");
                logResult("It's on Netflix!");
                logResult("*********************************************************************************************");
                movieInfo("Mr. Nobody");
            } else {
                movieInfo(movieName);
            }
            break;

        case "spotify-this-song":
            var songName = "";
            songName = userInput;

            if (userInput === "") {
                spotifyInfo("The sign Ace of Base");
            } else {
                spotifyInfo(songName);
            }
            break;

        case "my-tweets":
            twitterInfo();
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;
    }

}

// Function to get movie details
function movieInfo(movieName) {

    // Include the request npm package
    var request = require("request");

    // OMDB API
    var movieAPI = "1f19de3a";

    // Then run a request to the OMDB API with the movie specified
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + movieAPI;

    // console.log(movieQueryUrl);

    request(movieQueryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // console.log(body);
            // Parse the body of the site and recover the movie details
            var movieDetails = JSON.parse(body);
            // console.log(movieDetails);
            // console.log("================================================================================================");
            // console.log("* Title of the movie: " + movieDetails.Title);
            // console.log("* Release Year: " + movieDetails.Year);
            // console.log("* IMDB Rating: " + movieDetails.imdbRating);

            logResult("\n");
            logResult("================================================================================================");
            logResult("* Title of the movie: " + movieDetails.Title);
            logResult("* Release Year: " + movieDetails.Year);
            logResult("* IMDB Rating: " + movieDetails.imdbRating);            

            var movieRating = movieDetails.Ratings;
            // console.log(rating);

            if (movieRating != "") {

                for (var i = 0; i < movieRating.length; i++) {

                    if (movieRating[i].Source === "Rotten Tomatoes") {

                        // console.log("* Rotten Tomatoes Rating: " + movieRating[i].Value);
                        logResult("* Rotten Tomatoes Rating: " + movieRating[i].Value);

                    }
                }

            } else {
                // console.log("* Rotten Tomatoes Rating: Rating information is not available");
                logResult("* Rotten Tomatoes Rating: Rating information is not available");
            }

            // console.log("* Country where the movie was produced: " + movieDetails.Country);
            // console.log("* Language of the movie: " + movieDetails.Language);
            // console.log("* Plot of the movie: " + movieDetails.Plot);
            // console.log("* Actors in the movie: " + movieDetails.Actors);
            // console.log("================================================================================================");

            logResult("* Country where the movie was produced: " + movieDetails.Country);
            logResult("* Language of the movie: " + movieDetails.Language);
            logResult("* Plot of the movie: " + movieDetails.Plot);
            logResult("* Actors in the movie: " + movieDetails.Actors);
            logResult("================================================================================================");            
        }
    })
}

// Function to get last 20 tweets
function twitterInfo() {

    var Twitter = require('twitter');
    var client = new Twitter(liriKeys.twitter);
    // console.log(client);

    // / Search parameters to get last 20 tweets
    var params = {
        q: 'gatech_anish',
        // q: 'node.js',
        count: 20
    };

    // Display last 20 tweets
    client.get('search/tweets', params, function (error, tweets, response) {
        if (!error) {

            // console.log(tweets);
            // console.log("Tweet Status: " + tweets.statuses);
            // console.log(util.inspect(tweets.statuses, { depth: null, colors: true }));

            // Loops through tweets and prints out tweet text and creation date
            // console.log("================================================================================================");
            logResult("\n");
            logResult("================================================================================================");
            logResult("Your last 20 tweets are below (displaying lastest tweet first): ");

            for (var i = 0; i < tweets.statuses.length; i++) {

                // console.log(tweets.statuses);
                var tweetText = tweets.statuses[i].text;

                var tweetCreationDate = tweets.statuses[i].created_at;
                // console.log(tweetCreationDate);
                // console.log("Tweet# " + [i + 1]);
                logResult("Tweet# " + [i + 1]);
                // console.log(" * Creation Date: " + tweetCreationDate);
                logResult(" * Creation Date: " + tweetCreationDate);

                // console.log("Tweet text is " + tweetText);
                // console.log("Tweet# " + [i + 1] + ": Tweet text is " + tweetText);
                // console.log(" * Text: " + tweetText);
                logResult(" * Text: " + tweetText);

            }
        } else {
            // console.log(error);
            logResult(error);
        }
        // console.log("================================================================================================");
        logResult("================================================================================================");
    });
}

// Function to get song details from Spotify
function spotifyInfo(songName) {

    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(liriKeys.spotify);
    // console.log(liriKeys.spotify);

    // Spotify search with limit 1
    spotify.search({ type: 'track', query: songName, limit: 1 }, function (err, data) {
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

// Function for 'do-what-it-says'
function doWhatItSays() {

    // Load the fs package to read and write
    var fs = require("fs");

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        } else {

            // Create an array to store data from random.txt file
            var inputArray = data.split(",");

            // Store the first value of the array (i.e. action) to liriBotAction varibale
            liriBotAction = inputArray[0];

            // Store the second value of the array (i.e. user input) to userInput
            userInput = inputArray[1];

            // Calls liriBot main function
            liriBot(liriBotAction, userInput);

        }
    })
}

// Function to log result in log.txt and terminal using NPM package simple-node-logger
function logResult(inputData) {

    var SimpleNodeLogger = require("simple-node-logger"),
        opts = {
            logFilePath: "./log.txt",
            timestampFormat: "YYYY-MM-DD HH:mm:ss"
        }
        log = SimpleNodeLogger.createSimpleLogger(opts);
        log.info(inputData);
        // log.color();
}

