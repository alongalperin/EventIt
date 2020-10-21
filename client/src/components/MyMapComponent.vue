<template>
  <GmapMap ref="mapRef" :center="customCenter" :zoom="10" map-type-id="terrain" style="width: 100%; height: 500px"> </GmapMap>
</template>

<script>
export default {
  name: "MyMapComponent",
  props: ["customCenter"],
};
</script>

<style></style>
