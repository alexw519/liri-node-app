
require("dotenv").config();

var fs = require("fs");
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var search = "";
var searchType = "";

searchType = process.argv[2];
if (process.argv.length > 2)
    search = process.argv[3];

//Gets the command from the file
getCommand(searchType);


//Calls A Search Function Depending On What The Command Is
function getCommand(command)
{
    switch (command)
    {
        case "concert-this":
            concertSearch();
            break;
        case "spotify-this-song":
            spotifySearch();
            break;
        case "movie-this":
            movieSearch();
            break;
        case "do-what-it-says":
            readFrom();
            break;
        default:
            console.log("The command, " + command +  ", was not recoginized.");
    }
}

//Searches For Concerts Using The Bands Town API
function concertSearch()
{

}

//Searches For The Songs Using The Spotify API
function spotifySearch()
{
    spotify.search({type: "track", query: search}, function(error, response)
    {
        if (error)
            return console.log(error);

        console.log(response.items[0]);
    })
}

//Searches For Movies Usings The OMDB API 
function movieSearch()
{

}

//Reads What To Do From The File
function readFrom()
{
    fs.readFile("random.txt", "utf8", function(error, data) 
    {
        // If the code experiences any errors it will log the error to the console.
        if (error)
            return console.log(error);
  
        // Then split it by commas (to make it more readable)
        var dataArray = data.split(",");
        search = dataArray[1];
        getCommand(dataArray[0]);
    });
}