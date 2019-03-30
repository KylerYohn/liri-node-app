require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");

//import the keys.js file and store it in a variable
// var spotify = spotify(keys.spotify);
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);


//grab what the user types from the command Line
var command = process.argv[2];
var search = "";
for (var e = 3; e < process.argv.length; e++) {
    search += process.argv[e];
}

var search2 = "";
for (var e = 3; e < process.argv.length; e++) {
    search2 += process.argv[e] + " ";
}


//Code for if the user wishes to search for a Concert
if (command === "concert-this") {

    axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp").then(function (events) {
        // console.log(events.data);    
        for (var i = 0; i < 6; i++) {
            var venueName = events.data[i].venue.name;
            var venueCity = events.data[i].venue.city;
            var venueCountry = events.data[i].venue.country;
            var venueDate = events.data[i].datetime;
            venueDate = moment(events.data[i].datetime).format("LL");


            console.log("==================== Number " + (i + 1) + "========================")
            console.log("Name: " + venueName + "\nCity: " + venueCity + "\nCountry: " + venueCountry + "\nDate: " + venueDate);
            console.log("\n=============================================")

        }
    })
};

if (command === "movie-this") {
    if (!process.argv[3]) {
        console.log("If you haven't watched 'Mr.Nobody,' Then you should: " + "http://www.imdb.com/title/tt0485947/" + "\nIt's on Netflix!")
    }

    else {
        axios.get("http://www.omdbapi.com/?t=" + search2 + "&y=&plot=short&apikey=trilogy").then(function (response) {
            var title = response.data.Title;
            var year = response.data.Year;
            var IMBDRating = response.data.Ratings[0].Value;
            var rottenRating = response.data.Ratings[1].Value;
            var country = response.data.Country;
            var Language = response.data.Language;
            var plot = response.data.Plot;
            var act = response.data.Actors;

            console.log("\nTitle: " + title + "\n\nYear: " + year + "\n\nIMDB Rating: " + IMBDRating + "\n\nRotten Tomatoes: " + rottenRating +
                "\n\nCountry: " + country + "\n\nLanguages: " + Language + "\n\nPlot: " + plot + "\n\nActors: " + act);
            console.log("===================================================")

        });
    }

};

if (command === "spotify-this-song") {
    if (!process.argv[3]) {
        spotify.search({ type: "track", query: "The-Sign", limit: 3 })
            .then(function (response) {
                var arti = response.tracks.items[0].artists[0].name;
                var song = response.tracks.items[0].name;
                var url = response.tracks.items[0].preview_url;
                var album = response.tracks.items[0].album.name;

                console.log("\nArtist: " + arti + "\n\nSong Name: " + song + "\n\nPreview: " + url + "\n\nAlbum: " + album);
            }).catch(function (err) {
                console.log(err);
            });


    }
    else {
        spotify.search({ type: "track", query: search, limit: 5 })
            .then(function (response) {
                
                for (var q = 0; q < response.tracks.items.length; q++) {
                    
                    var arti = response.tracks.items[q].artists[0].name;
                    var song = response.tracks.items[q].name;
                    var url = response.tracks.items[q].preview_url;
                    var album = response.tracks.items[q].album.name;
                    console.log("\nArtist: " + arti + "\n\nSong Name: " + song + "\n\nPreview: " + url + "\n\nAlbum: " + album);
                    console.log("\n===============================================================")
                    console.log(arti);
                }
            }).catch(function (err) {
                console.log(err);
            });
    }

};

if (command === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");

        if (dataArr[0] === "spotify-this-song") {
            spotifyThis(dataArr);
        }
        if (dataArr[0] === "movie-this") {
            movieThis(dataArr[1]);
        }

    })

}


var spotifyThis = function (arry) {
    var song = arry[1];
    spotify.search({ type: "track", query: song, limit: 3 })
        .then(function (response) {
            var arti = response.tracks.items[0].artists[0].name;
            var song = response.tracks.items[0].name;
            var url = response.tracks.items[0].preview_url;
            var album = response.tracks.items[0].album.name;

            console.log("\nArtist: " + arti + "\n\nSong Name: " + song + "\n\nPreview: " + url + "\n\nAlbum: " + album);
        }).catch(function (err) {
            console.log(err);
        });

}

var movieThis = function (arry) {
    var movie = arry;
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(function (response) {
        if(response.data.Ratings[1].Value === true && response.data.Ratings[0].Value === true){
        var title = response.data.Title;
        var year = response.data.Year;
        var IMBDRating = response.data.Ratings[0].Value;
        var rottenRating = response.data.Ratings[1].Value;
        var country = response.data.Country;
        var Language = response.data.Language;
        var plot = response.data.Plot;
        var act = response.data.Actors;

        console.log("\nTitle: " + title + "\n\nYear: " + year + "\n\nIMDB Rating: " + IMBDRating + "\n\nRotten Tomatoes: " + rottenRating +
            "\n\nCountry: " + country + "\n\nLanguages: " + Language + "\n\nPlot: " + plot + "\n\nActors: " + act);
        console.log("===================================================")
        }
        else{
            var title = response.data.Title;
            var year = response.data.Year;
            
            var country = response.data.Country;
            var Language = response.data.Language;
            var plot = response.data.Plot;
            var act = response.data.Actors;
    
            console.log("\nTitle: " + title + "\n\nYear: " + year +
                "\n\nCountry: " + country + "\n\nLanguages: " + Language + "\n\nPlot: " + plot + "\n\nActors: " + act);
            console.log("===================================================")

        }

    });
}


