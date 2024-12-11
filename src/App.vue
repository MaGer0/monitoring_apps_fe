<template>
  <div class="app d-flex">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.app {
  background-image: url("https://img.freepik.com/free-vector/gradient-white-monochrome-background_23-2149017048.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position-y: bottom;
  background-position-x: center;
  position: relative;
  overflow: hidden;
  height: 100vh;
}
</style>
