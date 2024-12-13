<template>
  <button
    class="btn d-md-none m-2 hamburger-btn"
    :style="hamburgerStyle"
    @click="toggleSidebar"
  >
    <i class="bi" :class="showSidebar ? 'bi-x-lg' : 'bi-list'"></i>
  </button>
  <div
    :class="[
      'col-auto col-md-3 col-xl-2 px-sm-2 px-0 sidebar position-sticky',
      { 'd-none d-md-block': !showSidebar },
    ]"
    ref="sidebar"
  >
    <div
      class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100 position-sticky top-0 start-0"
    >
      <router-link
        to="/home"
        class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none mt-3"
        ref="logo"
      >
        <h1 class="fs-5 d-none d-sm-inline text">Monitoring Apps</h1>
      </router-link>
      <ul
        class="nav flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
        id="menu"
        ref="menu"
      >
        <li class="nav-item">
          <router-link
            class="nav-link active align-middle bg-transparent px-0"
            active-class="fw-bold"
            to="/dashboard"
            ref="dashboardLink"
          >
            <i class="fs-4 bi bi-bar-chart text-white"></i>
            <span class="ms-1 d-none d-sm-inline text-white text">
              Dashboard</span
            >
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            class="nav-link active bg-transparent align-middle px-0"
            active-class="fw-bold"
            to="/student"
            ref="studentLink"
          >
            <i class="fs-4 bi bi-people text-white fw-bold"></i>
            <span class="ms-1 d-none d-sm-inline text-white text">
              Student</span
            >
          </router-link>
        </li>
      </ul>
      <hr />
      <div class="dropdown pb-4" ref="dropdown">
        <router-link
          to="/profile"
          class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          id="dropdownUser1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="bi bi-person-circle fs-5"></i>
          <div v-if="currentUser.name">
            <span class="d-none d-sm-inline fw-bold mx-2">{{
              currentUser.name
            }}</span>
          </div>
          <div v-else>
            <span class="d-none d-sm-inline fw-bold mx-1">{{ "" }}</span>
          </div>
        </router-link>
        <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
          <li>
            <button class="btn dropdown-item" @click="logout">
              <span class="text-danger fw-bold">Logout</span>
            </button>
          </li>
          <li>
            <router-link to="/profile" class="dropdown-item">
              <span class="text-info fw-bold">Profile</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "AppSidebar",
  data() {
    return {
      currentUser: {},
      showSidebar: false,
    };
  },
  computed: {
    hamburgerStyle() {
      return this.showSidebar
        ? {
            transform: "translateX(60px)",
          }
        : { transform: "translateX(0)" };
    },
  },
  methods: {
    fetchTeacherData() {
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
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;

      if (this.showSidebar) {
        gsap.to(this.$refs.sidebar, {
          x: 0,
          duration: 1,
          ease: "power3.out",
        });
      } else {
        gsap.to(this.$refs.sidebar, {
          x: "-100%",
          duration: 1,
          ease: "power3.in",
        });
      }
    },
    logout() {
      const currentPath = this.$route.fullPath;
      localStorage.setItem("lastPage", currentPath);

      Swal.fire({
        title: "Logout",
        text: "Apakah Anda yakin ingin logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Logout",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Sedang Logout ...",
            loaderHtml: '<i class="fa fa-refresh fa-spin"></i>',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          axios
            .get("http://localhost:8000/api/logout", {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then(() => {
              localStorage.removeItem("token");

              setTimeout(() => {
                this.$router.push({
                  path: "/login",
                  query: { redirect: currentPath },
                });
              }, 200);

              Swal.fire({
                icon: "success",
                title: "Logout Berhasil",
                showConfirmButton: false,
                timer: 1000,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          this.$router.push(currentPath);
        }
      });
    },
  },
  mounted() {
    this.fetchTeacherData();
    gsap.from(this.$refs.sidebar, {
      x: "-100%",
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(this.$refs.logo, {
      opacity: 0,
      y: -50,
      duration: 0.8,
      delay: 0.5,
    });

    gsap.from(this.$refs.menu.children, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      delay: 0.8,
      stagger: 0.2,
    });

    gsap.from(this.$refs.dropdown, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 1.5,
    });
  },
};
</script>

<style scoped>
.sidebar {
  background-image: url("https://img.freepik.com/premium-photo/blue-future-technology-book-cover-background-25_769134-404.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  transition: transform 0.1s ease-out;
}

.hamburger-btn {
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  transition: transform 0.3s ease;
  border: none;
}

/* .dropdown {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
} */

.dropdown .dropdown-menu.show {
  min-width: 100%;
  z-index: 9999;
}

@media (min-width: 768px) {
  .sidebar {
    display: block;
  } 
}
</style>
