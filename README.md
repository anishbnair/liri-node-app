# LIRI BOT

LIRI Bot is a Language Interpretation and Recognition Interface. It is a command line node application that takes in parameters and gives you back data.

## LIRI Bot Features:

* Speak
    - Liri can speak! Just type what you want Liri to speak! Make sure your system is not on mute! 

* Search for a movie
    -  Liri can search a movie for you! Just type movie title!

* Search for a song
    -  Liri can search a song for you! Just type song title!

* Get your latest tweets
    -  Liri can retrive your latest 20 tweets!

* Search a song mentioned in random.txt
    -  Liri reads the song title from the text file and search the details for you

* Log search results
    -  Liri logs all your search results in log.txt with date and time stamp!

## Installs:
The [package.json](https://github.com/anishbnair/liri-node-app/blob/master/package.json). lists dependent node packages, but for your convenvice, these are the ones to install.

* [Twitter](https://www.npmjs.com/package/twitter)
    - npm install twitter

* [Spotify](https://www.npmjs.com/package/node-spotify-api)
    - npm install --save node-spotify-api

* [Say](https://www.npmjs.com/package/say)
    - npm install simple-node-logger

* [Simple Node Logger](https://www.npmjs.com/package/request)
    - npm install simple-node-logger

* [Request](https://www.npmjs.com/package/request)
    - npm install request


## Get Started
* Type node liri.js to begin
* Liri will prompt choices 
    - Speak
    - Search for a movie
    - Search for a song
    - Get my latest 20 tweets
    - Search the song mentioned in random text file
    - Exit
* Select options using up or down keys until you choose Exit option
