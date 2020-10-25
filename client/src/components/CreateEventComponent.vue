<template>
  <div>
    <header>
      <p>
        <span class="logo-name">EventIt</span>
        Create and manage your event guest list
      </p>
    </header>
    <div class="create-event-main-contaienr">
      <form id="create-form" @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="ownerEmail"> Your Email <small>(Mandatory for us to send you the manage event details)</small> </label>
          <input v-model="ownerEmail" class="form-control" id="ownerEmail" type="email" name="name" />
        </div>

        <div class="form-group">
          <label for="name">Event name</label>
          <input v-model="name" class="form-control" id="name" name="name" type="text" />
        </div>

        <div class="form-group">
          <label>Pick a date</label>
          <datetime id="calendar" v-model="date" type="datetime" input-class="form-control" placeholder="Select date" />
        </div>

        <div class="form-group">
          <label>Enter a location</label>
          <GmapAutocomplete @place_changed="setAddress" class="form-control"></GmapAutocomplete>
        </div>
        <myMapComponent :customCenter="placeGetter" />
        <div>
          <div>
            <ul class="list-errors">
              <li v-for="error in errors" :key="error">
                {{ error }}
              </li>
            </ul>
          </div>
          <input class="btn btn-info submit-btn" type="submit" value="Create" />
        </div>
      </form>
    </div>
    <modalComponent :active="isModalOpen" :onClose="navigateToEventManage">
      <template v-slot:header>
        Event Created Successfully
      </template>
      <template v-slot:body>
        Click continue to reach event management panel
        <h4>An Email with link to manage page was also sent to your email</h4>
      </template>
    </modalComponent>
  </div>
</template>

<script>
import axios from "@/axios";
import { Datetime } from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
import MyMapComponent from "./MyMapComponent";
import ModalComponent from "./UI/ModalComponent";

export default {
  name: "CreateEventComponent",
  data() {
    return {
      name: "",
      ownerEmail: "",
      date: "",
      place: {
        lat: 32.570833,
        lng: 34.951667,
      },
      manageId: "",
      errors: [],
      isModalOpen: false,
    };
  },
  components: {
    datetime: Datetime,
    myMapComponent: MyMapComponent,
    modalComponent: ModalComponent,
  },
  mounted() {},
  methods: {
    setAddress(place) {
      const { formatted_address: address } = place;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const name = place.name;

      this.place = { ...this.place, lat, lng, address, name };
    },
    async onSubmit() {
      this.clearErrors();
      try {
        this.validateInputs();
        const { data: manageId } = await axios.post("/events", {
          name: this.name,
          date: this.date,
          ownerEmail: this.ownerEmail.trim(),
          addressName: this.place.name,
          address: this.place.address,
          lat: this.place.lat,
          lng: this.place.lng,
        });
        this.manageId = manageId;
        this.isModalOpen = true;
      } catch (err) {
        console.error(err.message);
      }
    },
    validateInputs() {
      let isValid = true;
      if (this.ownerEmail.trim().length === 0) {
        this.errors.push("Please supply your emeil address");
        isValid = false;
      }
      if (this.name.trim().length === 0) {
        this.errors.push("Please choose a name to the event");
        isValid = false;
      }
      if (this.date.trim().length === 0) {
        this.errors.push("Please select a date for the event");
        isValid = false;
      }
      if (!isValid) {
        throw new Error("Form details not valid");
      }
    },
    clearErrors() {
      this.errors = [];
    },
    closeModal() {
      this.isModalOpen = false;
    },
    navigateToEventManage() {
      this.closeModal();
      this.$router.push({ path: `/manage/${this.manageId}` });
    },
  },
  computed: {
    placeGetter: function() {
      return {
        lat: this.place.lat,
        lng: this.place.lng,
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="@/style/creaete-event-map.css" />
<style lang="scss" scopped>
header {
  height: 20vh;
  width: 100%;
  display: flex;
  background-color: #41b3a3;
  align-items: center;
  justify-content: center;

  p {
    margin: 0px;
    font-size: 40px;
    font-weight: 500;
    color: white;
  }

  .logo-name {
    font-weight: bold;
    font-size: 60px;

    @media only screen and (max-width: 620px) {
      display: block;
    }
  }
}

.create-event-main-contaienr {
  height: 100% !important;
  width: 80% !important;
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  flex-direction: column;

  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;

    label {
      box-sizing: border-box;
      text-align: left;
      padding-left: 1px;
      margin-bottom: 0.5rem;
    }
  }

  .form-control {
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
}

.list-errors {
  width: fit-content;
  margin: 0 auto;
  margin-top: 1vh;
  text-align: left;

  li {
    font-weight: bold;
    margin-bottom: 3px;
    color: #dc3545 !important;
  }
}

.submit-btn {
  margin-top: 1rem;
}

.btn {
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  cursor: pointer;
}

.btn-info {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-info:hover {
  background-color: lighten(#17a2b8, 15%);
  border-color: lighten(#17a2b8, 15%);
}

.my-input-class {
  background: red;
}
</style>
