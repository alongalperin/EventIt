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
  },
  methods: {
    async addGuest() {
      console.log(this.newGuest);
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
    },
  },
};
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
</style>
