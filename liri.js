
require("dotenv").config();

var fs = require("fs");
var keys = require("./keys");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var search = "";
var searchType = "";
var searchTermExists = true;

searchType = process.argv[2];
if (process.argv.length > 3)
    search = process.argv.slice(3).join(" ");
else
    searchTermExists = false;


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
    if (searchTermExists)
    {
        axios.get("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy").then(
        function(response)
        {
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("Rating: " + response.data.imdbRating);
            console.log("RT Rating: " + response.data.Ratings[1].Value);
            console.log("Country Made: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        })
        .catch(function(error)
        {
            console.log(error);
        });
    }
    else
    {
        console.log("If you haven't watched 'Mr. Nobody', then you should: http://www.imdb.com/title/tt0485947/");
        console.log("Its on Netflix!");
    }
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