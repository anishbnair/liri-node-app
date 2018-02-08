
require("dotenv").config();

var util = require('util');

// Load keys.js file
var liriKeys = require("./keys.js");

// Store Liri Bot actions (i.e. "my-tweets", "spotify-this-song", "movie-this", "do-what-it-says") as per user input
var liriBotAction = process.argv[2];

// Create an empty variable for holding the user response (e.g. movie/song name)
var userInput = "";


// Load the NPM Package request
var request = require("request");

// Load the NPM Package inquirer
var inquirer = require("inquirer");


function liriBot() {
    inquirer.prompt([
        {
            type: "list",
            name: "command",
            message: "Hello, I am Liri Bot. What would you like me to do?",
            choices: ["Search for a movie", "Search for a song", "Get my latest 20 tweets", "Search the song mentioned in random text file", "Ask me to speak", "Exit"]

        }
    ]).then(function (answer) {

        liriBotAction = answer.command;
        console.log(liriBotAction);

        switch (liriBotAction) {

            case "Search for a movie":
                movieInfo();
                break;

            case "Search for a song":
                spotifyInfo();
                break;

            case "Get my latest 20 tweets":
                twitterInfo();
                break;

            case "Search the song mentioned in random text file":
                doWhatItSays();
                break;

            case "Search the song mentioned in random text file":
                doWhatItSays();
                break;

            case "Ask me to speak":
                liriSpeak();
                break;

            case "Exit":
                console.log("Thank you! Please enter 'node liri.js' to chat with me again!");
                break;
        }
    })
}

liriBot();


// Function to get movie details
function movieInfo() {

    // OMDB API
    var movieAPI = "1f19de3a";

    inquirer.prompt([
        {
            type: "input",
            name: "movie",
            message: "Enter movie title to get details of the movie: ",
        }

    ]).then(function (userInput) {

        var movieName = "";
        movieName = userInput.movie;
        console.log(movieName);

        if (movieName === "") {

            logResult("\n*********************************************************************************************" +
                "\nDisplaying details of movie: Mr. Nobody since you haven't entered any movie name." +
                "\nIf you haven't watched it, then you should: http://www.imdb.com/title/tt0485947/" +
                "\nIt's on Netflix!");
            movieName = "Mr. Nobody";
        }

        // Then run a request to the OMDB API with the movie specified
        var movieQueryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + movieAPI;

        request(movieQueryUrl, function (error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {

                // Parse the body of the site and recover the movie details
                var movieDetails = JSON.parse(body);

                var movieRating = movieDetails.Ratings;

                if (movieRating != "") {

                    for (var i = 0; i < movieRating.length; i++) {

                        if (movieRating[i].Source === "Rotten Tomatoes") {

                            var rottenTomatoesRating = movieRating[i].Value;

                        }

                    }

                } else {

                    rottenTomatoesRating = "* Rotten Tomatoes Rating: Rating information is not available for this movie";
                }

                logResult("\n================================================================================================" +
                    "\n* Title of the movie: " + movieDetails.Title + "\n* Release Year: " + movieDetails.Year +
                    "\n* IMDB Rating: " + movieDetails.imdbRating + "\n* Rotten Tomatoes Rating: " + rottenTomatoesRating +
                    "\n* Country where the movie was produced: " + movieDetails.Country + "\n* Language of the movie: " + movieDetails.Language +
                    "\n* Actors in the movie: " + movieDetails.Actors + "\n* Plot of the movie: " + movieDetails.Plot +
                    "\n================================================================================================" +
                    "\n" + "\n");
            }
        })

    })
    
}


// Function to get last 20 tweets
function twitterInfo() {

    var Twitter = require('twitter');
    var client = new Twitter(liriKeys.twitter);

    // / Search parameters to get last 20 tweets
    var params = {
        q: 'gatech_anish',
        count: 20
    };

    // Display last 20 tweets
    client.get('search/tweets', params, function (error, tweets, response) {
        if (!error) {

            logResult("\n================================================================================================" +
                "\nYour last 20 tweets are below (displaying lastest tweet first):");

            for (var i = 0; i < tweets.statuses.length; i++) {

                var tweetText = tweets.statuses[i].text;
                var tweetCreationDate = tweets.statuses[i].created_at;

                logResult("Tweet# " + [i + 1]);
                logResult(" * Creation Date: " + tweetCreationDate);
                logResult(" * Text: " + tweetText);
                logResult("\n");

            }

            logResult("\n================================================================================================" + "\n" + "\n");

        } else {

            logResult(error);

        }
    });
}


// Function to get song details from Spotify
function spotifyInfo() {

    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(liriKeys.spotify);

    inquirer.prompt([
        {
            type: "input",
            name: "song",
            message: "Enter song title to get details of the song: ",
        }

    ]).then(function (userInput) {

        var songName = "";
        songName = userInput.song;
        console.log(songName);

        if (songName === "") {

            logResult("\n*********************************************************************************************" +
                "\nDisplaying details of song: The sign Ace of Base since you haven't entered any song title.");
            songName = "The sign Ace of Base";
        }

        // Spotify search with limit 1
        spotify.search({ type: 'track', query: songName, limit: 1 }, function (err, data) {
            if (err) {
                return logResult('Error occurred: ' + err);
            }

            var songTracks = data.tracks.items;

            var i = 0;
            var song = songTracks[i].name;
            var albumName = songTracks[i].album.name;
            // Artists name
            var artistsName = songTracks[i].album.artists[i].name;
            var previewUrl = songTracks[i].preview_url;

            logResult("\n================================================================================================" +
                "\n* The song's name: " + song + "\n* The album name : " + albumName + "\n* Artist(s): " + artistsName +
                "\n* Preview link: " + previewUrl + "\n================================================================================================" +
                "\n" + "\n");
        })
    })
}


// Function for 'do-what-it-says'
function doWhatItSays() {

    // Load the fs package to read and write
    var fs = require("fs");

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return logResult(err);
        } else {

            // Create an array to store data from random.txt file
            var inputArray = data.split(",");

            // Store the second value of the array (i.e. user input) to userInput
            var randSong = inputArray[1];

            var Spotify = require('node-spotify-api');
            var spotify = new Spotify(liriKeys.spotify);

            // Spotify search with limit 1
            spotify.search({ type: 'track', query: randSong, limit: 1 }, function (err, data) {
                if (err) {
                    return logResult('Error occurred: ' + err);
                }

                var songTracks = data.tracks.items;

                var i = 0;
                var song = songTracks[i].name;
                var albumName = songTracks[i].album.name;
                // Artists name
                var artistsName = songTracks[i].album.artists[i].name;
                var previewUrl = songTracks[i].preview_url;

                logResult("\n================================================================================================" +
                    "\n* The song's name: " + song + "\n* The album name : " + albumName + "\n* Artist(s): " + artistsName +
                    "\n* Preview link: " + previewUrl + "\n================================================================================================" +
                    "\n" + "\n");
            })
        }
    })
}



function liriSpeak() {

    var say = require("say");

    inquirer.prompt([
        {
            type: "input",
            name: "bot",
            message: "What do you want me to speak?",
        }

    ]).then(function (userInput) {

        var botSpeak = "";
        botSpeak = userInput.bot;
        say.speak(botSpeak);
    })
}


// Function to log result in log.txt and terminal using NPM package simple-node-logger
function logResult(inputData) {

    var SimpleNodeLogger = require("simple-node-logger"),
        opts = {
            timestampFormat: "YYYY-MM-DD HH:mm:ss",
            logFilePath: "./log.txt"

        }
    log = SimpleNodeLogger.createSimpleLogger(opts);
    log.info(inputData);
    // log.color
}