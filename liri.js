// Read and set environment variables
require("dotenv").config();

//vars
// var keys = require("./keys.js");
// var fs = require("fs");
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
//creates log.txt file
// var filename = './log.txt';
//NPM module used to write output to console and log.txt simulatneously
//var log = require('simple-node-logger').createSimpleFileLogger(filename);
//log.setLevel('all');

//argv[2] chooses users actions; argv[3] is input parameter, ie; movie title
var userOption = process.argv[2]; //need to change this later//
var inputParameter = process.argv[3]; //need to change this later//
processCommands(userOption, inputParameter);

function processCommands (userOption, inputParameter){
    switch (userOption) {
    case 'concert-this':
        showConcertInfo(inputParameter);
        break;
    case 'spotify-this-song':
        showSongInfo(inputParameter);
        break;
    case 'movie-this':
        showMovieInfo(inputParameter);
        break;
    case 'do-what-it-says':
        showSomeInfo();
        break;
    default: 
            console.log("Invalid command. Please type any of the following commands: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")
    }
}
function showConcertInfo(inputParameter){
    var queryUrl = "https://rest.bandsintown.com/artists/" + inputParameter + "/events?app_id=codingbootcamp";
    request(queryUrl, function(error, response, body) {

        // If the request is successful
    if (!error && response.statusCode === 200) {
      
        var concerts = JSON.parse(body);
        //console.log(JSON.stringify(concerts,null,2));
        for (var i = 0; i < concerts.length; i++) {  
            console.log("**********EVENT INFO*********");  
            fs.appendFileSync("log.txt", "**********EVENT INFO*********\n");
            console.log(i);
            fs.appendFileSync("log.txt", i+"\n");
            console.log("Name of the Venue: " + concerts[i].venue.name);
            fs.appendFileSync("log.txt", "Name of the Venue: " + concerts[i].venue.name+"\n");
            console.log("Venue Location: " +  concerts[i].venue.city);
            fs.appendFileSync("log.txt", "Venue Location: " +  concerts[i].venue.city+"\n");
            console.log("Date of the Event: " +  concerts[i].datetime);
            fs.appendFileSync("log.txt", "Date of the Event: " +  concerts[i].datetime+"\n");
            console.log("*****************************");
            fs.appendFileSync("log.txt", "*****************************"+"\n");
        }

    } else{
      console.log('Error occurred.');
    }

});}

function showSongInfo(inputParameter) {
    if (inputParameter === undefined) {
        inputParameter = "The%20Sign";
    }

    spotify.search(
        {
            type: "track",
            query: inputParameter
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }
            //console.log(JSON.stringify(data,null,2));
            var songs = data.tracks.items;

             for (var i = 0; i < songs.length; i++) {
                console.log("**********SONG INFO*********");
                fs.appendFileSync("log.txt", "**********SONG INFO*********\n");
                console.log(i);
                fs.appendFileSync("log.txt", i +"\n");
                console.log("song name: " + songs[i].name);
                fs.appendFileSync("log.txt", "song name: " + songs[i].name +"\n");
                console.log("preview song: " + songs[i].preview_url);
                fs.appendFileSync("log.txt", "preview song: " + songs[i].preview_url +"\n");
                console.log("album: " + songs[i].album.name);
                fs.appendFileSync("log.txt", "album: " + songs[i].album.name + "\n");
                console.log("artist(s): " + songs[i].artists[0].name);
                fs.appendFileSync("log.txt", "artist(s): " + songs[i].artists[0].name + "\n");
                console.log("*****************************");  
                fs.appendFileSync("log.txt", "*****************************\n");
             }
        }
    );
};



function showMovieInfo(inputParameter){
   
    
    if (inputParameter === undefined) {
        inputParameter = "Mr. Nobody"
        console.log("-----------------------");
        fs.appendFileSync("log.txt", "-----------------------\n");
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        fs.appendFileSync("log.txt", "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" +"\n");
        console.log("It's on Netflix!");
        fs.appendFileSync("log.txt", "It's on Netflix!\n");
        
    }
    
    var queryUrl = "http://www.omdbapi.com/?t=" + inputParameter + "&y=&plot=short&apikey=b3c0b435";
    request(queryUrl, function(error, response, body) {

        // If the request is successful
    if (!error && response.statusCode === 200) {
      
        var movies = JSON.parse(body);
        //console.log(JSON.stringify(movies,null,2));
          
        console.log("**********MOVIE INFO*********");  
        fs.appendFileSync("log.txt", "**********MOVIE INFO*********\n");
        console.log("Title: " + movies.Title);
        fs.appendFileSync("log.txt", "Title: " + movies.Title + "\n");
        console.log("Release Year: " + movies.Year);
        fs.appendFileSync("log.txt", "Release Year: " + movies.Year + "\n");
        console.log("IMDB Rating: " + movies.imdbRating);
        fs.appendFileSync("log.txt", "IMDB Rating: " + movies.imdbRating + "\n");
        console.log("Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies));
        fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies) + "\n");
        console.log("Country of Production: " + movies.Country);
        fs.appendFileSync("log.txt", "Country of Production: " + movies.Country + "\n");
        console.log("Language: " + movies.Language);
        fs.appendFileSync("log.txt", "Language: " + movies.Language + "\n");
        console.log("Plot: " + movies.Plot);
        fs.appendFileSync("log.txt", "Plot: " + movies.Plot + "\n");
        console.log("Actors: " + movies.Actors);
        fs.appendFileSync("log.txt", "Actors: " + movies.Actors + "\n");
        console.log("*****************************");  
        fs.appendFileSync("log.txt", "*****************************\n");
    } else{
      console.log('Error occurred.');
    }

});}


function getRottenTomatoesRatingObject (data) {
    return data.Ratings.find(function (item) {
       return item.Source === "Rotten Tomatoes";
    });
  }
  
  function getRottenTomatoesRatingValue (data) {
    return getRottenTomatoesRatingObject(data).Value;
  }

function showSomeInfo(){
	fs.readFile('random.txt', 'utf8', function(err, data){
		if (err){ 
			return console.log(err);
		}
		var dataArr = data.split(',');
		processCommands(dataArr[0], dataArr[1]);
	});
}
