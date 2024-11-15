<template>
  <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
    <div
      class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100 position-sticky top-0 start-0"
    >
      <router-link
        to="/"
        class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none mt-3"
      >
        <h1 class="fs-5 d-none d-sm-inline">Monitoring Apps</h1>
      </router-link>
      <ul
        class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
        id="menu"
      >
        <li class="nav-item">
          <router-link class="nav-link align-middle px-0" to="/">
            <i class="fs-4 bi bi-bar-chart text-white"></i>
            <span class="ms-1 d-none d-sm-inline text-white"> Dashboard</span>
          </router-link>
          <router-link class="nav-link align-middle px-0" to="/c">
            <i class="fs-4 bi-plus-square text-white"></i>
            <span class="ms-1 d-none d-sm-inline text-white"> Monitoring</span>
          </router-link>
        </li>
      </ul>
      <hr />
      <div class="dropdown pb-4">
        <a
          href="#"
          class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          id="dropdownUser1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="bi bi-person-circle fs-5"></i>
          <div v-if="currentUser.name">
            <span class="d-none d-sm-inline fw-bold mx-1">{{
              currentUser.name
            }}</span>
          </div>
          <div v-else>
            <span class="d-none d-sm-inline fw-bold mx-1">{{ "" }}</span>
          </div>
        </a>
        <ul class="dropdown-menu dropdown-menu-white text-small shadow">
          <li>
            <router-link to="/login" class="dropdown-item">
              <span class="text-danger fw-bold" @click="logout">Logout</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AppSidebar",
  data() {
    return {
      currentUser: {},
    };
  },
  methods: {
    logout() {
      axios
        .get("http://localhost:8000/api/logout", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(() => {
          localStorage.removeItem("token");
          this.$router.push({ path: "/login" });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    axios
      .get("http://127.0.0.1:8000/api/teachers/@me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        this.currentUser = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
body {
  font-family: "Montserrat", sans-serif;
}
</style>
