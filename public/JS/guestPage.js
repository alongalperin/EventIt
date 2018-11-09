let params = jQuery.deparam(window.location.search);
let eventId = params['eventId'];
let guestId = params['guestId'];
let status;
let apiKey = "AIzaSyAlhNPlBgLMp5MXg7cCRJ4L5CfSNvrHaxA";
let songsLikesByUser = new Set();

const app = new Vue({
    el: '#app',
    data: {
        eventName : '',
        firstname: '',
        lastname: '',
        address : '',
        time : '',
        status: '',
        lng: 0.0,
        lat: 0.0,
        songs: []
    },
    methods: {
        updateStatus: function (newStatus) {
            $.ajax({
                type: 'POST',
                data: JSON.stringify({eventId : eventId, guestId : guestId, newStatus : newStatus}),
                contentType: 'application/json',
                url: '/guest/updateGuestStatus/',
                success: function(){
                    app.status = newStatus;
                }
            });
        },

        changeCounter: function (song) {
            let songId = song.id;
            if (song.isUserLiked === false ) { // user add like song
                // /POST /event/songs/likes  updates like to song
                $.post(`/event/addLike/${eventId}/${guestId}/${songId}`, function(data, status){
                    song.likecounter += 1;
                    song.isUserLiked = true;
                });
            } else { // user remove like
                // /POST /event/songs/likes  updates like to song
                $.post(`/event/removeLike/${eventId}/${guestId}/${songId}`, function(data, status){
                    song.likecounter -= 1;
                    song.isUserLiked = false;
                });
            }
        }
    }
});


// loads the response the guest gave to the invitation & first and last names
$.get("/guest/getGuestData/" + eventId + '/'+ guestId, function(data, status){
    app.firstname = data.firstname;
    app.lastname = data.lastname;
    app.status = data.status;
});


// Loads Likes to songs the user gave
$.get(`/event/songsLikedByUser/${eventId}/${guestId}`, function(Songsdata, status){
    for (let i = 0; i < Songsdata.length; i++) {
        songsLikesByUser.add( Songsdata[i].songInEventId );
    }
});


// Loads songs of event
$.get("/event/songs/" + eventId, function(Songsdata, status){
    for (let i = 0, len = Songsdata.length; i < len; i++) {
        let songId = Songsdata[i].songId;
        $.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + songId + "&key=" + apiKey, function (data) {
            if (data.items.length == 0) {
                return;
            }
            let song = {
                id: Songsdata[i].id,
                songId: songId,
                title: data.items[0].snippet.title,
                thumbnails: data.items[0].snippet.thumbnails.high.url,
                likecounter: Songsdata[i].likesCounter
            }

            if (songsLikesByUser.has(song.id)) {
                song.isUserLiked = true;
            } else {
                song.isUserLiked = false;                
            }

            app.songs.push(song);
        });
    }
});
    

// Initialize and add the map
function initMap() {
    // The location of Uluru
    var uluru = {lat: app.lat, lng: app.lng};
    // The map, centered at Uluru
    var map = new google.maps.Map(
    document.getElementById('map'), {zoom: 15, center: uluru});
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({position: uluru, map: map});
}


$(document).ready(function(){
    // playlist flip button
    $("#flip").click(function(){
        $("#playlistPanel").slideToggle("fast");
    });
});

function sendSong(){
    let url = $("#youtubeInput").val();
    let songId = youtube_parser(url);

    $.post("/event/addSong/" + eventId + '/'+ songId, function(songDetails, status){
        let songId = songDetails.songId;
        $.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + songId + "&key=" + apiKey, function (data) {
            if (data.items.length == 0) {
                alert("לא נמצא סירטון");
                return;
            }
            app.songs.push({
                id: songDetails.id, // the id of the song from the database
                songId: songId,
                title: data.items[0].snippet.title,
                thumbnails: data.items[0].snippet.thumbnails.high.url,
                likecounter: 0,
                isUserLiked: false
            });

            // reset input
            $("#youtubeInput").val('');
        });
    });
}