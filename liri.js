
require("dotenv").config();

var moment = require("moment");
var fs = require("fs");
var keys = require("./keys");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var log = "";
var search = "";
var searchType = "";
var searchTermExists = true;

searchType = process.argv[2];
if (process.argv.length > 3)
    search = process.argv.slice(3).join(" ");
else
    searchTermExists = false;

var log = "\n" + searchType + " " + search;
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

    //Logs The Search Into A Text File (log.txt)
    fs.appendFile("log.txt", log, function(error)
    {
        if(error)
            console.log(error);
        else
            console.log("Search Logged");
    })
}

//Searches For Concerts Using The Bands Town API
function concertSearch()
{
    var apiTime;

    if (searchTermExists)
    {
        axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp").then(
        function(response)
        {
            for (i = 0; i < response.data.length; i++)
            {
                console.log(response.data[i].venue.name);
                console.log(response.data[i].venue.country);
                console.log(response.data[i].venue.city);
                apiTime = response.data[i].datetime;
                console.log(moment(apiTime).format("MM/DD/YYYY") + "\n");
            }
        })
        .catch(function(error)
        {
            console.log(error);
        });
    }
    else
        console.log("There was no band/artist provided to search");
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
    //If The User Put In A Search Term
    if (searchTermExists)
    {
        //Uses Axios To Get Data From The OMDB API
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
    //If There Is No Search Time, Will Recommend Mr. Nobody
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

        //Condtions Depending Of How Many Words Are In The Array
        if (dataArray.length < 2)
            console.log("Error: Something Is Wrong With Search In File");
        else if (dataArray.length === 2)
            search = dataArray[1];
        else
            search = dataArray.slice(1).join(" ");

        //Calls A Command Depending On The First Element Of The Array
        getCommand(dataArray[0]);
    });
}