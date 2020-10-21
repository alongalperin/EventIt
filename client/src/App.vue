<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto");

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #212529;
  margin-bottom: 2rem;
}

h1,
h2,
h3,
h4,
h5,
h6,
h7 {
  font-weight: 500;
}

h3 {
  font-size: 1.75rem;
}

ul {
  list-style-type: none;
  padding: 0px;
}
</style>
