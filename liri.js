
require("dotenv").config();

var keys = require("./keys");
var spotify = new Spotify(keys.spotify);

var fs = require("fs");

fs.readFile("random.txt", "utf8", function(error, data) 
{
    // If the code experiences any errors it will log the error to the console.
    if (error)
      return console.log(error);
  
    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
});