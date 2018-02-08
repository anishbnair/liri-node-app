

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
                // liriBot();
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
            logResult("\n");
            logResult("*********************************************************************************************");
            logResult("Displaying details of movie: Mr. Nobody since you haven't entered any movie name.");
            logResult("If you haven't watched it, then you should: http://www.imdb.com/title/tt0485947/");
            logResult("It's on Netflix!");
            movieName = "Mr. Nobody";
        }

        // Then run a request to the OMDB API with the movie specified
        var movieQueryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + movieAPI;

        console.log(movieQueryUrl);

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
                // logResult("================================================================================================");
                // logResult("\n");
                // liriBot();

            }

            // liriBot();
        })

        // liriBot();

    })
    // liriBot();

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
        // logResult("================================================================================================");
        // logResult("\n");
    });
}



// Function to get song details from Spotify
function spotifyInfo() {

    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(liriKeys.spotify);
    // console.log(liriKeys.spotify);

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
            logResult("\n");
            logResult("*********************************************************************************************");
            logResult("Displaying details of song: The sign Ace of Base since you haven't entered any song title.");
            songName = "The sign Ace of Base";
        }

        // Spotify search with limit 1
        spotify.search({ type: 'track', query: songName, limit: 1 }, function (err, data) {
            // spotify.search({ type: 'track', query: songName }, function (err, data) {
            if (err) {
                // return console.log('Error occurred: ' + err);
                return logResult('Error occurred: ' + err);
            }

            var songTracks = data.tracks.items;
            // console.log(songTracks);

            // for (var i = 0; i < songTracks.length; i++) {

            var i = 0;
            var song = songTracks[i].name;
            var albumName = songTracks[i].album.name;
            // Artists name
            var artistsName = songTracks[i].album.artists[i].name;
            var previewUrl = songTracks[i].preview_url;

            logResult("\n");
            // console.log("================================================================================================");
            logResult("================================================================================================");
            // console.log("* The song's name: " + songTracks[i].name);
            logResult("* The song's name: " + song);
            // console.log("* The album name : " + songTracks[i].album.name);
            logResult("* The album name : " + albumName);
            // console.log("* Artist(s): " + artistsName);
            logResult("* Artist(s): " + artistsName);
            // console.log("* Preview link: " + songTracks[i].preview_url);
            logResult("* Preview link: " + previewUrl);
            // console.log("================================================================================================");
            // logResult("================================================================================================");
            // logResult("\n");
            // }

            // console.log(util.inspect(data, { depth: null, colors: true }));
        })

    })

}



// Function for 'do-what-it-says'
function doWhatItSays() {

    // Load the fs package to read and write
    var fs = require("fs");

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            // return console.log(err);
            return logResult(err);
        } else {

            // Create an array to store data from random.txt file
            var inputArray = data.split(",");

            // Store the first value of the array (i.e. action) to liriBotAction varibale
            // liriBotAction = inputArray[0];
            // console.log(liriBotAction);

            // Store the second value of the array (i.e. user input) to userInput
            var randSong = inputArray[1];
            // console.log(randSong);

            // Calls liriBot main function
            // liriBot(liriBotAction, userInput);

            var Spotify = require('node-spotify-api');
            var spotify = new Spotify(liriKeys.spotify);
            // console.log(liriKeys.spotify);

            // Spotify search with limit 1
            spotify.search({ type: 'track', query: randSong, limit: 1 }, function (err, data) {
                // spotify.search({ type: 'track', query: songName }, function (err, data) {
                if (err) {
                    // return console.log('Error occurred: ' + err);
                    return logResult('Error occurred: ' + err);
                }

                var songTracks = data.tracks.items;
                // console.log(songTracks);

                // for (var i = 0; i < songTracks.length; i++) {

                var i = 0;
                var song = songTracks[i].name;
                var albumName = songTracks[i].album.name;
                // Artists name
                var artistsName = songTracks[i].album.artists[i].name;
                var previewUrl = songTracks[i].preview_url;

                logResult("\n");
                // console.log("================================================================================================");
                logResult("================================================================================================");
                // console.log("* The song's name: " + songTracks[i].name);
                logResult("* The song's name: " + song);
                // console.log("* The album name : " + songTracks[i].album.name);
                logResult("* The album name : " + albumName);
                // console.log("* Artist(s): " + artistsName);
                logResult("* Artist(s): " + artistsName);
                // console.log("* Preview link: " + songTracks[i].preview_url);
                logResult("* Preview link: " + previewUrl);
                // console.log("================================================================================================");
                // logResult("================================================================================================");
                // logResult("\n");
                // }

                // console.log(util.inspect(data, { depth: null, colors: true }));
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
        // console.log(botSpeak);

        say.speak(botSpeak);

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