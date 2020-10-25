<template>
  <div class="manage-container">
    <div class="event-details">
      <h1>Your Event Details:</h1>
      <h1>{{ eventName }}</h1>
      <p>{{ date }}</p>
      <p class="event-address-name">
        <strong>{{ addressName }}</strong>
      </p>
      <p>{{ address }}</p>
      <hr />
    </div>
    <div class="event-guests">
      <div id="add-guest">
        <h3>Add Guest:</h3>
        <form @submit.prevent="addGuest" id="addGuest-form">
          <div class="form-group">
            <label>First name:</label>
            <input v-model="newGuest.firstname" id="firstname" type="text" />
          </div>
          <div class="form-group">
            <label>Last name:</label>
            <input v-model="newGuest.lastname" id="lastname" type="text" />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="newGuest.email" id="email" type="text" />
          </div>
          <input type="submit" value="Add Guest" />
        </form>
      </div>
      <!-- add guest -->
      <!-- TODO: remove BR -->
      <br />
      <hr />
      <br />
      <div id="event-guests-lists">
        <h3>Guests list</h3>
        <p>Coming:</p>
        <ul>
          <!-- todo: change keys to id -->
          <li v-for="guest in guests.going" :key="guest.firstname">{{ guest.firstname }} {{ guest.lastname }} {{ guest.status }}</li>
        </ul>
        <p>Not Coming:</p>
        <ul>
          <li v-for="guest in guests.notGoing" :key="guest.firstname">{{ guest.firstname }} {{ guest.lastname }} {{ guest.status }}</li>
        </ul>
        <p>Not Sure:</p>
        <ul>
          <li v-for="guest in guests.notSure" :key="guest.firstname">{{ guest.firstname }} {{ guest.lastname }} {{ guest.status }}</li>
        </ul>
        <p>Didn't Answer:</p>
        <ul>
          <li v-for="guest in guests.unknown" :key="guest.firstname">{{ guest.firstname }} {{ guest.lastname }}</li>
        </ul>
      </div>
    </div>
    <div class="event-songs">
      <div id="playlist-section">
        <form @submit.prevent="">
          Please paste here Youtube link: <br />
          <input v-model="newSongURL" id="youtubeInput" type="text" />
          <button id="playlist-submit" @click="addSong">Add</button>
        </form>
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
                <button @click="changeLikesCounter(song)" v-bind:class="{ going: song.isUserLiked === true }">
                  Like
                </button>
                likes: {{ song.likesCounter }}
              </div>
              <div>
                <button @click="deleteSong(song.id)" class="song-delete-button">Delete</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  name: "ManageEventComponent",
  data() {
    return {
      eventId: "",
      eventName: "",
      addressName: "",
      address: "",
      date: "",
      guests: [],
      songs: [],
      newGuest: {
        firstname: "",
        lastname: "",
        email: "",
      },
      newSongURL: "",
      loadingSongs: false,
      errorOnLoadingSongs: false,
    };
  },
  async mounted() {
    const manageId = this.$route.params.id;
    // fetch event data
    const { data: eventData } = await axios.get(`/events/${manageId}`);
    this.eventId = eventData.eventId;
    this.eventName = eventData.name;
    this.addressName = eventData.addressName;
    this.address = eventData.address;
    // todo: move to util file and use also in GuestComponent
    const date = new Date(eventData.date);
    const dateFormat = new Intl.DateTimeFormat("UK", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    this.date = dateFormat.format(date);

    // fetch event guests list
    const { data: guestsData } = await axios.get(`/events/guests/${manageId}`);
    this.guests = guestsData;

    this.initPlaylist();
  },
  methods: {
    async initPlaylist() {
      this.errorOnLoadingSongs = false;
      // check if songs already loaded
      this.songs = [];
      const { data: songsResponse } = await axios.get(`/events/songs/${this.eventId}`);
      try {
        for (let i = 0; i < songsResponse.length; i++) {
          const { id, youtubeId, likesCounter } = songsResponse[i];
          let songDataFromYoutube = await this.fetchSongData(youtubeId);
          songDataFromYoutube = {
            id: id,
            ...songDataFromYoutube,
            likesCounter,
          };
          this.songs.push(songDataFromYoutube);
        }
      } catch (err) {
        this.songs = [];
        this.errorOnLoadingSongs = true;
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
    async addGuest() {
      const { data: responseGuest } = await axios.post("/events/guests", {
        manageId: this.$route.params.id,
        eventId: this.eventId,
        ...this.newGuest,
      });

      this.guests.unknown.push({
        firstname: responseGuest.firstname,
        lastname: responseGuest.lastname,
        status: "no",
      });
      this.resetAddGuestForm();
    },
    resetAddGuestForm() {
      this.firstname = "";
      this.lastname = "";
      this.email = "";
    },
    async changeLikesCounter(song) {
      // todo: rename
      const songId = song.id;
      const action = song.isUserLiked === false ? "addLike" : "removeLike";
      const response = await axios.post(`/events/${action}`, {
        eventId: this.eventId,
        guestId: this.guestId,
        songId,
      });

      song.likesCounter = response.data.likesCounter;
      song.isUserLiked = !song.isUserLiked;
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
    async deleteSong(songId) {
      await axios.delete(`/events/song/${songId}`);
      this.songs = this.songs.filter((song) => song.id !== songId);
    },
  },
};

function youtubeParser(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 2.5rem;
  font-weight: 500;
}

h3 {
  margin: 0px;
}

p {
  font-size: 1.2rem;
  margin: 0 auto;
  margin-bottom: 0.2rem;
}

hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.event-address-name {
  margin-top: 10px;
}

.manage-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 1rem;
}

#addGuest {
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 5px;
}

.event-details {
  h1 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
}

.event-guests {
  text-align: left;

  #add-guest {
    background-color: #f0f0f0;
    border-radius: 10px;
    padding: 0.5rem;
    text-align: left;

    #addGuest-form {
      display: flex;
      justify-content: start;
      margin-top: 0.5rem;

      @media only screen and (max-width: 620px) {
        flex-direction: column;

        input[type="text"] {
          width: 100%;
        }

        input[type="submit"] {
          margin: 0 auto;
          width: 40%;
          padding: 5px;
        }

        .form-group {
          margin-bottom: 16px;
        }
      }

      div {
        margin-right: 10px;
      }

      input {
        margin-left: 3px;
        margin-top: 3px;
        line-height: 27px;
        font-size: 1rem;
      }
    }
  }

  #event-guests-lists {
    p {
      font-size: 1rem;
      padding-left: 5px;
    }

    h3 {
      margin-bottom: 8px;
    }

    li {
      padding-left: 15px;
    }
  }
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
    grid-template-columns: 26px 123px auto 60px 90px;
    grid-template-areas: "song-number thmbnail song-title song-like song-delete-button";
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
        "song-number song-delete-button thmbnail thmbnail thmbnail . song-like song-like . .";
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

  .song-delete-button {
    grid-area: song-delete-button;
    background: #dc3545;
    color: white;
    font-weight: bold;
    border: none;
    padding: 7px;
    border-radius: 1px;
    margin-right: 2px;
    justify-self: right;
  }
}

.song-thumbnail {
  max-width: 100%;
  max-height: 100%;
  box-sizing: border-box;
  height: inherit;
}
</style>
