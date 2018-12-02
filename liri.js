require("dotenv").config();

var axios = require("axios");
var moment = require("moment");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

var command = process.argv[2];
var nodeArgs = process.argv.slice(3).join(" ");


function mySwitch(command) {

    switch (command) {

        case "movie-this":
            getMovie();
            break;

        case "concert-this":
            getConcert();
            break;

        case "spotify-this-song":
            getSpotify();
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;

        default:
            console.log("Please enter a valid command.");
            return;

    }
}

function getMovie() {

    var movieName = nodeArgs;
    if (!movieName) {
        movieName = "Mr Nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=8b84b7d";

    axios.get(queryUrl).then(
        function (response) {
            //console.log(response);
            console.log("------------------------------------------");
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMdB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[2].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("------------------------------------------");
        }
    )
}

function getConcert() {

    var artist = nodeArgs;
    if (!artist) {
        artist = "Elton John"
    }
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=d299f3d77038a2beb28bb1122dce5ba9";

    // var bands = data.artistdata.name;

    axios.get(queryUrl).then(function (response) {
        //console.log(response);
        for (var i = 0; i < 5; i++) {
            console.log("------------------------------------------");
            console.log("Artist Name: " + artist);
            console.log("Venue Name: " + response.data[i].venue.name);
            console.log("Venue Location: " + response.data[i].venue.city);
            console.log("Date of Event: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
            console.log("------------------------------------------");
        }
    });
}

function getSpotify(nodeArgs) {

    var song = nodeArgs;
    if (!song) {
        song = "The Sign";
        console.log(song);
    }

    spotify.search(
        {
            type: "track",
            query: song,
            limit: 10
        },

        function (err, data) {
            if (err) {
                return console.log("No information found. Try again.");

            }

            for (var i = 0; i < data.tracks.items.length; i++) {
                console.log("------------------------------------------")
                console.log("Artist(s): " + data.tracks.items[i].album.artists[0].name);
                console.log("Song Name: " + data.tracks.items[i].name);
                console.log("Preview Link For the Song: " + data.tracks.items[i].preview_url);
                console.log("Album: " + data.tracks.items[i].album.name);
                console.log("------------------------------------------")
            }

        })
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) {
        return console.log(error);
      }
      var dataArr = data.replace(/(\r\n|\n|\r)/gm, "").split(",");
      console.log(dataArr);
      for (var i = 0; i < dataArr.length; i += 2) {
        var cmd = dataArr[i];
        var arg = dataArr[i + 1].replace(/['"]+/g, '').split(' ').join("+");
        mySwitch(cmd, arg);
      }
    });
  }




mySwitch(command);
