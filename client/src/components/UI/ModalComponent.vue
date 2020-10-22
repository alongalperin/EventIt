<template>
  <transition name="fade">
    <div class="modal-container" v-if="active === true">
      <!-- TODO: change to fragment like in react -->
      <div class="backdrop" @click="onClose"></div>
      <div class="modal" :class="{ show: active, hide: !active }">
        <h2 class="modal-header">
          <slot name="header"></slot>
        </h2>
        <hr />
        <p class="modal-body">
          <slot name="body"></slot>
        </p>
        <button class="modal-button" @click="onClose">Continue</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["active", "onClose"],
};
</script>

<style lang="scss" scopped>
.modal-container {
  display: flex;
  justify-content: center;
}

.modal {
  position: fixed;
  z-index: 500;
  background-color: white;
  width: 40%;
  border-radius: 3px;
  top: 30%;
  box-sizing: border-box;
  padding-bottom: 10px;

  @media only screen and (max-width: 620px) {
    width: 90%;
  }
}

.backdrop {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.show {
  transform: translateY(0);
  opacity: 1;
}

.hide {
  transform: translateY(-100vh);
  opacity: 0;
}

.modal-header {
  top: 0px;
  width: 100%;
  left: 0px;
  margin: 0px;
  padding-top: 5px;
}

.modal-body {
  font-size: 1.2rem;
}

.modal-button {
  margin-bottom: 10px;
  border: none;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
