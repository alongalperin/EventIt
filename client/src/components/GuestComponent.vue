<template>
  <div>
    <loaderComponent v-if="loadingEventDetails" />
    <div v-if="!loadingEventDetails" class="guest-container">
      <div class="guest-details">
        <h1>Hi {{ firstname }} {{ lastname }}, we invite you to our event</h1>
        <h2>{{ eventName }}</h2>
        <h2>{{ date }}</h2>
        <h2>{{ place.addressName }}</h2>
        <h2>{{ place.address }}</h2>

        <!-- status buttons -->
        <strong v-if="status == 'unknown'">Please reply:</strong><br />

        <div class="answer-buttons">
          <button class="btnStatus green-hover" v-bind:class="{ going: status === 'green' }" v-on:click="updateStatus('going')">Coming</button>
          <button class="btnStatus orange-hover" v-bind:class="{ notSure: status === 'orange' }" v-on:click="updateStatus('notSure')">Not Sure</button>
          <button class="btnStatus red-hover" v-bind:class="{ notGoing: status === 'red' }" v-on:click="updateStatus('notGoing')">Not Coming</button>
        </div>
      </div>
      <div style="margin-top: 10px;">
        <!--
      <GmapMap ref="mapRef" :center="{ lat: 32.570833, lng: 34.951667 }" :zoom="10" map-type-id="terrain" style="width: 100%; height: 500px"> </GmapMap>
      -->
        <myMapComponent :customCenter="placeGetter" />
      </div>

      <div class="flip" @click="openPlaylist">Want to help with the playlist?</div>
      <div id="playlist-section" class="closed" :class="{ open: playlistOpen === true }">
        <form @submit.prevent="">
          Please paste here Youtube link: <br />
          <input v-model="newSongURL" id="youtubeInput" type="text" />
          <button id="playlist-submit" @click="addSong">Add</button>
        </form>
        <loaderComponent v-if="loadingSongs" />
        <p v-if="errorOnLoadingSongs">We cant load playlist right now</p>
        <ul class="songs-list" v-if="!loadingSongs && songs.length > 0">
          <li v-for="(song, index) in songs" :key="song.id">
            <!-- The flexible grid (content) -->
            <div class="song-container">
              <div class="num-song-grid-container">
                {{ index + 1 }}
              </div>
              <div class="song-thmbnail-grid-container">
                <img class="song-thumbnail" v-bind:src="song.thumbnails" />
              </div>
              <div class="song-title-grid-container">
                <p class="song-title">{{ song.title }}</p>
              </div>
              <div class="song-like-container">
                <button @click="changeLikesCounter(song)" v-bind:class="{ green: song.isUserLiked === true }">
                  Like
                </button>
                likes: {{ song.likesCounter }}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- end of Playlist -->
    </div>
  </div>
</template>

<script>
import axios from "@/axios";
import MyMapComponent from "./MyMapComponent";
import LoaderComponent from "./UI/LoaderComponent";
// todo: create enum for going status

export default {
  name: "GuestEventComponent",
  components: {
    myMapComponent: MyMapComponent,
    loaderComponent: LoaderComponent,
  },
  data() {
    return {
      eventId: "",
      guestId: "",
      eventName: "",
      firstname: "",
      lastname: "",
      place: {
        lng: 0,
        lat: 0,
      },
      status: "",
      songs: [],
      playlistOpen: false,
      newSongURL: "",
      loadingSongs: false,
      songsLikedByUser: null,
      errorOnLoadingSongs: false,
      loadingEventDetails: true,
    };
  },
  async mounted() {
    this.eventId = this.$route.params.eventId;
    this.guestId = this.$route.params.guestId;
    const { data: eventData } = await axios.get(`/events/${this.eventId}`);
    this.eventName = eventData.name;
    this.place.addressName = eventData.addressName;
    this.place.address = eventData.address;
    this.place.lat = eventData.lat;
    this.place.lng = eventData.lng;
    const date = new Date(eventData.date);
    const dateFormat = new Intl.DateTimeFormat("UK", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    this.date = dateFormat.format(date);

    const { data: guestData } = await axios.get(`/guests/${this.eventId}/${this.guestId}`);
    this.firstname = guestData.firstname;
    this.lastname = guestData.lastname;
    this.status = guestData.status;

    this.loadingEventDetails = false;
  },
  methods: {
    async updateStatus(newStatus) {
      await axios.put("/guests/status", {
        eventId: this.eventId,
        guestId: this.guestId,
        newStatus: newStatus,
      });
      this.status = newStatus;
    },
    openPlaylist() {
      this.playlistOpen = !this.playlistOpen;
      this.initLikesForSongs();
      this.initSongs();
    },
    async addSong() {
      let apiKey = process.env.VUE_APP_YOUTUBE_KEY;
      let youtubeId = youtubeParser(this.newSongURL);
      if (!youtubeId) {
        alert("לא נמצא סירטון");
        return;
      }
      const createdSongResponse = await axios.post("/events/songs", {
        eventId: this.eventId,
        youtubeId,
      });
      let youtubeDataResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${youtubeId}&key=${apiKey}`);
      if (!youtubeDataResponse.data || youtubeDataResponse.data.items.length == 0) {
        alert("לא נמצא סירטון");
        return;
      }

      youtubeDataResponse = youtubeDataResponse.data.items[0];
      this.songs.push({
        id: createdSongResponse.data.id,
        youtubeId,
        title: youtubeDataResponse.snippet.title,
        thumbnails: youtubeDataResponse.snippet.thumbnails.high.url,
        likesCounter: 0,
        isUserLiked: false,
      });

      // reset input
      this.newSongURL = "";
    },
    async initSongs() {
      // check if songs already loaded
      this.loadingSongs = true;
      this.songs = [];
      const { data: songsResponse } = await axios.get(`/events/songs/${this.eventId}`);
      await window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
      try {
        for (let i = 0; i < songsResponse.length; i++) {
          const { id, youtubeId, likesCounter } = songsResponse[i];
          let songDataFromYoutube = await this.fetchSongData(youtubeId);
          songDataFromYoutube = {
            id: id,
            ...songDataFromYoutube,
            likesCounter,
            isUserLiked: this.songsLikedByUser.has(id),
          };
          this.songs.push(songDataFromYoutube);
        }
        this.loadingSongs = false;
      } catch (err) {
        this.songs = [];
        this.loadingSongs = false;
        this.errorOnLoadingSongs = true;
      }
    },
    async initLikesForSongs() {
      const { data: guestLikesData } = await axios.get(`/events/likes/${this.guestId}`);
      const likesArray = guestLikesData.map((song) => song.songInEventId);
      this.songsLikedByUser = new Set(likesArray);
    },
    isSongLikedByUser(id) {
      return this.songsLikedByUser.has(id);
    },
    updateSongsLikes(action, songId) {
      if (action === "addLike") {
        this.songsLikedByUser.add(songId);
      } else {
        this.songsLikedByUser.remove(songId);
      }
    },
    async fetchSongData(youtubeId) {
      let apiKey = process.env.VUE_APP_YOUTUBE_KEY;
      const { data: response } = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${youtubeId}&key=${apiKey}`);

      return {
        youtubeId,
        title: response.items[0].snippet.title,
        thumbnails: response.items[0].snippet.thumbnails.high.url,
        isUserLiked: false,
      };
    },
    async changeLikesCounter(song) {
      // todo: rename
      const songId = song.id;
      const action = song.isUserLiked === false ? "addLike" : "removeLike"; // todo: create enum
      const { data: updatedSong } = await axios.post(`/events/${action}`, {
        guestId: this.guestId,
        songId,
      });

      song.likesCounter = updatedSong.likesCounter;
      song.isUserLiked = !song.isUserLiked;
      this.updateSongsLikes(action, song.id);
    },
  },
  computed: {
    placeGetter: function() {
      return {
        lat: parseFloat(this.place.lat),
        lng: parseFloat(this.place.lng),
      };
    },
  },
};

function youtubeParser(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.guest-container {
  width: 80%;
  margin: 0 auto;
  margin-bottom: 2vh;
}

.answer-buttons {
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 700px) {
    flex-direction: column;
  }
}

.btnStatus {
  display: inline-block;
  padding: 20px 0px 20px 0px;
  width: 15vw;
  background-color: white;
  border: 2px solid #34495e;
  color: #34495e;
  overflow: hidden;
  -webkit-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;

  @media only screen and (max-width: 700px) {
    width: 100%;
    margin-bottom: 16px;
  }
}

.green {
  background: hsl(120, 64%, 66%);
}

.orange {
  background: hsla(39, 75%, 66%, 0.931);
}

.red {
  background: rgb(236, 129, 129);
}

.green-hover:hover {
  background: hsl(120, 64%, 66%);
}

.orange-hover:hover {
  background: hsla(39, 75%, 66%, 0.931);
}

.red-hover:hover {
  background: rgb(236, 129, 129);
}

.btnStatus:nth-child(2) {
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  @media only screen and (max-width: 700px) {
    margin-left: 0px;
    margin-right: 0px;
  }
}

.flip {
  cursor: pointer;
  font-size: 1.5rem;
  width: fit-content;
  margin: 0 auto;
  margin-top: 2rem;
}

#playlist-section {
  transition: max-height 0.5s ease;
  margin-top: 2vh;

  .songs-list {
    width: 80%;
    margin: 0 auto;
    margin-top: 2vh;

    @media only screen and (max-width: 700px) {
      width: 100%;
    }
  }

  #youtubeInput {
    line-height: inherit;
    width: 60%;
  }

  #playlist-submit {
    line-height: inherit;
    margin-left: 2px;
    border: 2px solid rgb(118, 118, 118);
    font-weight: bolder;
  }

  form {
    line-height: 24px;
  }

  .song-container {
    height: 8vh;
    display: grid;
    margin-top: 5px;
    grid-template-columns: 26px 123px auto 60px;
    grid-template-areas: "song-number thmbnail song-title song-like";
    align-items: center;

    &:hover {
      background: #f6fdfc;
    }

    @media only screen and (max-width: 700px) {
      height: auto;
      grid-template-columns: repeat(10, 1fr);
      grid-template-rows: auto;
      grid-template-areas:
        "song-title song-title song-title song-title song-title song-title song-title song-title song-title song-title"
        "song-number . thmbnail thmbnail thmbnail . song-like song-like . .";
    }

    .num-song-grid-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      grid-area: song-number;
    }

    .song-thmbnail-grid-container {
      height: inherit;
      width: inherit;
      grid-area: thmbnail;
    }

    .song-title-grid-container {
      grid-area: song-title;
    }

    .song-like-container {
      display: flex;
      flex-direction: column;
      margin-left: auto;
      grid-area: song-like;
    }

    .song-title {
      font-size: 1.5vw;
      margin: 0px;

      @media only screen and (max-width: 700px) {
        font-size: 3vw;
        font-weight: bold;
        margin-bottom: 2px;
      }
    }
  }
}

.song-thumbnail {
  max-width: 100%;
  max-height: 100%;
  box-sizing: border-box;
  height: inherit;
}

.closed {
  max-height: 0px;
  overflow-y: hidden;
}

.open {
  max-height: 1000px !important;
}
</style>
