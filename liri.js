require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var nodeArgs = process.argv;
var movieName = "";
var artist = process.argv[3];

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];


for (var i = 4; i < process.argv.length; i++) {
    secondInput += '+' + process.argv[i];
}

for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        movieName = movieName + "+" + nodeArgs[i];
    }
    else {
        movieName += nodeArgs[i];

    }
}


function mySwitch(command) {

    switch (command) {

        case "spotify-this-song":
            getSpotify();
            break;

        case "movie-this":
            getMovie();
            break;

        case "concert-this":
            getConcert();
            break;

    }

    function getSpotify(song) {
        if (song === undefined) {
            song = "The Final Countdown";
        }

        spotify.search(
            {
                type: "track",
                query: command
            },
            function (err, data) {
                if (err) {
                    console.log("No information found. Try again.");
                    return;
                }

                var songs = data.tracks.items;

                for (var i = 0; i < songs.length; i++) {
                    console.log("------------------------------------------")
                    console.log(i);
                    console.log("Artist(s): " + songs[i].artists.map(getArtistNames));
                    console.log("Song Name: " + songs[i].name);
                    console.log("Preview Link For the Song: " + songs[i].preview_url);
                    console.log("Album: " + songs[i].album.name);
                    console.log("------------------------------------------")
                }
            }
        )
    }

    function getMovie() {

        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=8b84b7d";

        console.log(queryUrl)

        axios.get(queryUrl).then(
            function (response) {
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

        var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        console.log(queryUrl)

        axios.get(queryUrl).then(
            function () {
                console.log("------------------------------------------");
                console.log("Artist Name: " );
                console.log("Venue Name: " );
                console.log("Venue Location: " );
                console.log("Date of Event: " );
                console.log("------------------------------------------");
            }
        )
    }
}


mySwitch(command);
