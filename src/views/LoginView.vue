<template>
  <div
    id="login"
    class="d-flex justify-content-center align-items-center vh-100 w-100"
  >
    <div class="login-container container">
      <div class="card w-100 shadow bg-body-teritary rounded">
        <div class="row g-0">
          <div class="col-md-6 col-lg-5 d-none d-md-block">
            <img
              ref="loginImage"
              src="../assets/images/register-access-login-password-internet-online-website-concept-flat-illustration_385073-108.png"
              alt="Login Illustration"
              class="img-fluid login-image"
            />
          </div>
          <div class="col-md-6 col-lg-7 d-flex align-items-center">
            <div ref="loginCard" class="card-body p-4 p-md-5">
              <form @submit.prevent="loginMethod">
                <div class="header text-center mb-4">
                  <h1>Login</h1>
                </div>
                <div class="mb-3">
                  <label for="nik" class="form-label"
                    ><i class="bi bi-card-text"></i> NIK</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter your NIK"
                    v-model="loginData.nik"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label"
                    ><i class="bi bi-key"></i> Password</label
                  >
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Enter your password"
                    v-model="loginData.password"
                    required
                  />
                </div>
                <div class="login-btn mb-4">
                  <button type="submit" class="btn btn-primary w-100">
                    Login
                  </button>
                </div>
                <div class="copy-right">
                  <p class="text-center">&copy; 2024 WellMagic Media Digital</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "LoginView",
  data() {
    return {
      loginData: {},
    };
  },

  methods: {
    loginMethod() {
      if (this.loginData.nik && this.loginData.password) {
        Swal.fire({
          title: "Tunggu Sebentar ...",
          loaderHtml: '<i class="fa fa-refresh fa-spin"></i>',
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const newLoginData = {
          nik: this.loginData.nik,
          name: this.loginData.name,
          password: this.loginData.password,
        };
        axios
          .post("http://localhost:8000/api/login", newLoginData, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            Swal.close();

            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Berhasil Login!",
              showConfirmButton: false,
              timer: 1000,
            });
            localStorage.setItem("token", response.data);

            const redirectPath = localStorage.getItem("lastPage") || "/";
            this.$router.push(redirectPath);
          })
          .catch((error) => {
            console.log(error);
            Swal.close();

            Swal.fire({
              icon: "error",
              title: "Error",
              text: "NIK atau Password Salah!",
              showConfirmButton: false,
              timer: 1000,
            });

            this.$router.push({ path: "/login" });
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "NIK atau Password Kosong!",
          showConfirmButton: false,
          timer: 1000,
        });
        this.$router.push({ path: "/login" });
      }
    },
  },
  mounted() {
    gsap.from(this.$refs.loginImage, {
      duration: 1,
      opacity: 0,
      x: -100,
    });

    gsap.from(this.$refs.loginCard, {
      duration: 1,
      opacity: 0,
      x: 100,
      delay: 0.5,
    });
  },
};
</script>

<style scoped>
.card {
  border-radius: 8px;
}

.header h1 {
  font-size: 2rem;
}

@media (min-width: 768px) {
  .card-body {
    padding: 4rem;
  }
}

@media (max-width: 576px) {
  .card-body {
    padding: 2rem;
  }
  .header h1 {
    font-size: 1.5rem;
  }
}
</style>
