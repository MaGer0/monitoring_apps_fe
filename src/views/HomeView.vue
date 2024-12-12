<template>
  <div id="home" class="d-flex w-100">
    <AppSidebar />
    <div
      data-aos="fade-right"
      class="container d-flex justify-content-center align-items-center vh-100 w-100"
    >
      <h1 data-aos="zoom-out-up" class="text-center">Welcome!</h1>
    </div>
  </div>
</template>

<script>
import Aos from "aos";
import "aos/dist/aos.css";
import AppSidebar from "@/components/AppSidebar.vue";
export default {
  name: "HomeView",
  components: {
    AppSidebar,
  },
  mounted() {
    Aos.init({
      duration: 1000,
      once: true,
    });
  },
};
</script>

<style>
#home {
  background-image: url("https://img.freepik.com/free-vector/gradient-white-monochrome-background_23-2149017048.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
