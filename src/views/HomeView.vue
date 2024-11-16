<template>
  <AppSidebar/>
  <div id="home" data-aos="fade-up" class="container d-flex justify-content-center align-items-center vh-100">
    <h1 class="text-center">Welcome!</h1>
  </div>
</template>

<script>
import Aos from 'aos';
import "aos/dist/aos.css";
import AppSidebar from '@/components/AppSidebar.vue';
export default {
  name: "HomeView",
  components: {
    AppSidebar
  },
  mounted() {
    Aos.init({
      duration: 1000,
      once: true
    })
  }
}
</script>

<style>

</style>