<template>
  <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
    <div
      class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100 position-sticky top-0 start-0"
    >
      <a
        href="/"
        class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <span class="fs-5 d-none d-sm-inline">Monitoring Apps</span>
      </a>
      <ul
        class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
        id="menu"
      >
        <li class="nav-item">
          <router-link class="nav-link align-middle px-0" to="/">
            <i class="fs-4 bi-house text-white"></i>
            <span class="ms-1 d-none d-sm-inline text-white">Dashboard</span>
          </router-link>
          <router-link class="nav-link align-middle px-0" to="/c">
            <i class="fs-4 bi-plus-square text-white"></i>
            <span class="ms-1 d-none d-sm-inline text-white">Monitoring</span>
          </router-link>
          <router-link class="nav-link align-middle px-0" to="/">
            <i class="fs-4 bi bi-person-circle text-white"></i>
            <span class="ms-1 d-none d-sm-inline text-white">My Account</span>
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
          <div class="bi bi-person-circle" width="50" height="50"></div>
          <!-- <span class="d-none d-sm-inline mx-1">{{currentUser.username}}</span> -->
        </a>
        <ul class="dropdown-menu dropdown-menu-white text-small shadow">
          <li>
            <router-link to="/" class="dropdown-item">
              <span class="text-black fw-block" @click="logout">Log Out</span>
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
    return {};
  },
  methods: {
    logout() {
      axios
        .get("http://localhost:8000/api/login", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        })
        .then(() => {
          localStorage.removeItem("token");
        })
        .catch(() => {
            this.$router.push({ path: "/login" });
            alert("Logout Berhasil");
        });
    },
  },
  mounted(){

  }
};
</script>

<style>
</style>