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
          <button class="btnStatus green-hover" v-bind:class="{ green: status === 'going' }" v-on:click="updateStatus('going')">Coming</button>
          <button class="btnStatus orange-hover" v-bind:class="{ orange: status === 'notSure' }" v-on:click="updateStatus('notSure')">Not Sure</button>
          <button class="btnStatus red-hover" v-bind:class="{ red: status === 'notGoing' }" v-on:click="updateStatus('notGoing')">Not Coming</button>
        </div>
      </div>
      <div style="margin-top: 10px;">
        <myMapComponent :customCenter="placeGetter" />
      </div>
      <songsListComponent v-if="eventId && guestId" :eventId="eventId" :guestId="guestId" :isEventOwner="false" />
    </div>
  </div>
</template>

<script>
import axios from "@/axios";
import MyMapComponent from "./MyMapComponent";
import SongsListComponent from "./SongsListComponent";
import LoaderComponent from "./UI/LoaderComponent";
// todo: create enum for going status

export default {
  name: "GuestEventComponent",
  components: {
    myMapComponent: MyMapComponent,
    loaderComponent: LoaderComponent,
    songsListComponent: SongsListComponent,
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
      loadingEventDetails: true,
    };
  },
  async mounted() {
    this.eventId = this.$route.params.eventId;
    this.guestId = this.$route.params.guestId;
    await this.initEventData();
    await this.initGuestData();
    this.loadingEventDetails = false;
  },
  methods: {
    async initEventData() {
      const { data: eventData } = await axios.get(`/events/${this.eventId}`);
      this.eventName = eventData.name;
      this.place.addressName = eventData.addressName;
      this.place.address = eventData.address;
      this.place.lat = eventData.lat;
      this.place.lng = eventData.lng;
      const date = new Date(eventData.date);
      const dateFormat = new Intl.DateTimeFormat("UK", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
      this.date = dateFormat.format(date);
    },
    async initGuestData() {
      const { data: guestData } = await axios.get(`/guests/${this.eventId}/${this.guestId}`);
      this.firstname = guestData.firstname;
      this.lastname = guestData.lastname;
      this.status = guestData.status;
    },
    async updateStatus(newStatus) {
      await axios.put("/guests/status", {
        eventId: this.eventId,
        guestId: this.guestId,
        newStatus: newStatus,
      });
      this.status = newStatus;
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
</style>
