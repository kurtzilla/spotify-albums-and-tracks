// Self envoking function! once the document is ready, bootstrap our application.
// We do this to make sure that all the HTML is rendered before we do things
// like attach event listeners and any dom manipulation.
(function() {
    $(document).ready(function() {
        bootstrapSpotifySearch();
    })
})();

/**
  This function bootstraps the spotify request functionality.
*/
function bootstrapSpotifySearch() {

    var userInput, searchUrl, results;
    var outputArea = $("#q-results");

    $('#spotify-q-button').on("click", function() {

        // clear thisout between searches
        var $appendToMe = $('#albums-and-tracks').html('');

        var spotifyQueryRequest;
        spotifyQueryString = $('#spotify-q').val();
        searchUrl = "https://api.spotify.com/v1/search?type=artist&q=" + spotifyQueryString;

        // Generate the request object
        spotifyQueryRequest = $.ajax({
            type: "GET",
            dataType: 'json',
            url: searchUrl
        });

        // Attach the callback for success
        // (We could have used the success callback directly)
        spotifyQueryRequest.done(function(data) {
            var artists = data.artists;

            // Clear the output area
            outputArea.html('');

            // The spotify API sends back an arrat 'items'
            // Which contains the first 20 matching elements.
            // In our case they are artists.
            artists.items.forEach(function(artist) {
                var artistLi = $("<li>" + artist.name + " - " + artist.id + "</li>")
                artistLi.attr('data-spotify-id', artist.id);
                outputArea.append(artistLi);

                artistLi.click(displayAlbumsAndTracks);
            })
        });

        // Attach the callback for failure
        // (Again, we could have used the error callback direcetly)
        spotifyQueryRequest.fail(function(error) {
            console.log("Something Failed During Spotify Q Request:")
            console.log(error);
        });
    });
}

/* COMPLETE THIS FUNCTION! */
// 1. Query the Spotify API for every album produced by the artist you clicked on.
// 2. For each of those albums fetch every track on the album.
// 3. Display this information to the user such that:



// 	* Albums appear with its release date.
// 	* Each album has its tracks displayed before the next album appears.
// 	* All of this information should be appended to this div: `<div id='albums-and-tracks'>`

//<li data-spotify-id="2xaAOVImG2O6lURwqperlD">Catfish and the Bottlemen - 2xaAOVImG2O6lURwqperlD</li>

function displayAlbumsAndTracks(event) {

    var $appendToMe = $('#albums-and-tracks');
    var artistId = $(event.target).attr('data-spotify-id');

    // clear this out in between selections
    $appendToMe.html('');

    returnAlbumListByArtist(artistId, $appendToMe);

}


function returnAlbumListByArtist(artistId, $container) {

    var ul = document.createElement("ul");
    var searchUrl = "https://api.spotify.com/v1/artists/" + artistId + "/albums";

    var spotifyQuery = $.ajax({
        type: "GET",
        dataType: 'json',
        url: searchUrl
    });

    spotifyQuery.done(function(data) {

        var albums = data.items;

        // console.log(albums);

        for (var i = 0; i < albums.length; i++) {

            var li = document.createElement("li");
            li.innerText = albums[i].name;

            returnTrackListByAlbum(albums[i].id, li);

            ul.appendChild(li);
        }

        $container.append(ul);
    });
}

function getReleaseDateAndPopularity(albumId, listItem) {

    var searchUrl = "https://api.spotify.com/v1/albums/" + albumId;

    var spotifyQueryRequestTracks = $.ajax({
        type: "GET",
        dataType: 'json',
        url: searchUrl
    });

    spotifyQueryRequestTracks.done(function(data) {

        listItem.innerText += ' (' + data.release_date + ') popularity: ' + data.popularity;

    });
}

function returnTrackListByAlbum(albumId, container) {

    getReleaseDateAndPopularity(albumId, container);

    // https://api.spotify.com/v1/albums/{id}/tracks
    var ul = document.createElement("ol");
    var searchUrl = "https://api.spotify.com/v1/albums/" + albumId + "/tracks";

    var spotifyQueryRequestTracks = $.ajax({
        type: "GET",
        dataType: 'json',
        url: searchUrl
    });

    spotifyQueryRequestTracks.done(function(data) {

        // console.log("tracks", data);
        var tracks = data.items;
        tracks.sort(function(a,b){
            if (a.track_number < b.track_number) {
                return -1;
              }
              if (a.track_number > b.track_number) {
                return 1;
              }
              // a must be equal to b
              return 0;
        });

        for (var i = 0; i < tracks.length; i++) {

            var li = document.createElement("li");
            li.innerText = tracks[i].name; + ' - ' + tracks[i].track_number;
            ul.appendChild(li);
        }

        container.appendChild(ul);
    });
}

    /* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
    /* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
    /* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */
