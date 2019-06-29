
//Importing The Packages
require("dotenv").config();

var moment = require("moment");
var fs = require("fs");
var keys = require("./keys");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

//Inialzing Variables
var log = "";
var search = "";
var searchType = "";
var currentTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
var searchTermExists = true;
var maxResults = 5;

//Getting The User Input
searchType = process.argv[2].toLowerCase();
if (process.argv.length > 3)
    search = process.argv.slice(3).join(" ");
else
    searchTermExists = false;

//Setting Up String To Put In The Log (Date/Time & Search)
var log = "";

//Gets the command from the file
getCommand(searchType);

//Calls A Search Function Depending On What The Command Is
function getCommand(command)
{
    //Logs The Search Into A Text File (log.txt)
    log = "\n" + currentTime + ": " + searchType + " " + search + "\n";
    logData(log);

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
    var apiTime;

    //If The User Provided A Term To Search For
    if (searchTermExists)
    {
        //Uses Axios To Get Data From Bands In Town API
        axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp").then(
        function(response)
        {
            console.log("\nSearch Results:");
            if (maxResults > response.data.length)
                maxResults = response.data.length;

            //If Condition To Check If The API Found Any Concerts With The Specified Artist
            if (maxResults != 0)
            {
                //Prints Out The Information For Up To 5 Venues
                for (i = 0; i < maxResults; i++)
                {
                    console.log(response.data[i].venue.name);
                    console.log(response.data[i].venue.country);
                    console.log(response.data[i].venue.city);
                    apiTime = response.data[i].datetime;
                    console.log(moment(apiTime).format("MM/DD/YYYY") + "\n");

                    //Logs The Search Data Into A Text File (log.txt)
                    logData(response.data[i].venue.name);
                    logData(response.data[i].venue.country);
                    logData(response.data[i].venue.city);
                    logData(moment(apiTime).format("MM/DD/YYYY"));
                }
            }
            else
                console.log("\nSorry, There Are No Venues Playing This Artist Anytime Soon");
        })
        //If There Is An Error, Prints It
        .catch(function(error)
        {
            return console.log("Sorry, That Artist Is Not In The Database");
        });
    }
    //If No Terms Are Provided, Lets The User Know
    else
        console.log("There was no band/artist provided to search");
}

//Searches For The Songs Using The Spotify API
function spotifySearch()
{
    console.log("\nSearch Results: ");

    //If The User Doesn't Enter A Search Term, It Will Search For The Sign By Ace Of Base
    if (searchTermExists === false)
        search = "The Sign Ace Of Base";

    //Using The Spotify Package To Get The Track Information From Spotify (Up To 5 Results)
    spotify.search({type: "track", query: search, limit: 5}, function(error, response)
    {
        if (error)
            return console.log(error);

        console.log(response.tracks.items[0].artists[0].name);
        console.log(response.tracks.items[0].name);
        console.log(response.tracks.items[0].external_urls.spotify);
        console.log(response.tracks.items[0].album.name);

        //Logs The Search Data Into A Text File (log.txt)
        logData(response.tracks.items[0].artists[0].name);
        logData(response.tracks.items[0].name);
        logData(response.tracks.items[0].external_urls.spotify);
        logData(response.tracks.items[0].album.name);
    })
}

//Searches For Movies Usings The OMDB API 
function movieSearch()
{
    //If The User Put In A Search Term
    if (searchTermExists)
    {
        console.log("\nSearch Results:");
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


            logData("Title: " + response.data.Title);
            logData("Year: " + response.data.Year);
            logData("Rating: " + response.data.imdbRating);
            logData("RT Rating: " + response.data.Ratings[1].Value);
            logData("Country Made: " + response.data.Country);
            logData("Language: " + response.data.Language);
            logData("Plot: " + response.data.Plot);
            logData("Actors: " + response.data.Actors);
        })
        .catch(function(error)
        {
            return console.log(error);
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
  
        // Then split it by commas
        var dataArray = data.split(",");

        //Condtions Depending Of How Many Words Are In The Array
        if (dataArray.length < 2)
        {
            console.log("Error: Something Is Wrong With Search In File");
            searchTermExists = false;
        }
        else if (dataArray.length === 2)
        {
            search = dataArray[1];
            //Removes The Quotation Marks From The String, Doesn't Work With Bands In Town API
            search = search.replace(/\"/g, "");
            searchTermExists = true;
        }

        //Calls A Command Depending On The First Element Of The Array
        searchType = dataArray[0];
        getCommand(searchType);
    });
}

//Puts Whatever The Argument Is In A Log File (log.txt)
function logData(data)
{
    log = "\n";
    log += data;
    fs.appendFile("log.txt", log, function(error)
    {
        if(error)
            return console.log(error);
    })
}