<template>
  <div class="profile-container">
    <router-link to="/home" class="text-decoration-none text-black">
      <i
        class="row d-flex justify-content-end w-100 bi bi-box-arrow-in-right fs-4 mt-2 fw-bold"
      ></i>
    </router-link>
    <div class="container d-flex vh-100">
      <div class="row pb-5 pe-5 gap-5 w-100">
        <div class="profile col-2 text-center">
          <div class="profile-title text-white p-3">
            <h2>Profile</h2>
          </div>
        </div>
        <div class="content col p-3">
          <div
            class="content-container d-flex justify-content-center align-items-center flex-column"
            id="contentContainer"
          >
            <div class="image-container img-fluid mb-5">
              <img
                src="https://img.freepik.com/free-photo/3d-rendering-cartoon-character-with-eyeglasses-jacket_1142-51310.jpg"
                alt="User Profile Image"
                class="profile-image rounded-circle shadow"
              />
            </div>
            <div class="form-data">
              <form>
                <div class="mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    v-model="teacherData.name"
                  />
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="teacherData.email"
                  />
                </div>
                <div class="mb-3">
                  <label for="nik" class="form-label">NIK</label>
                  <input
                    type="text"
                    class="form-control"
                    id="nik"
                    v-model="teacherData.nik"
                  />
                </div>
              </form>
              <div
                id="buttonContainer"
                class="d-flex justify-content-end gap-2"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProfileView",
  data() {
    return {
      teacherData: {},
    };
  },
  mounted() {
    const token = "Bearer " + localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/api/teachers/@me", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        this.teacherData = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });

    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let nik = document.getElementById("nik");

    function clearButton() {
      let buttonContainer = document.getElementById("buttonContainer");
      buttonContainer.innerHTML = "";
    }

    function clearAllButton() {
      let contentContainer = document.getElementById("contentContainer");
      contentContainer.addEventListener("click", (e) => {
        if (e.target === contentContainer) {
          clearButton();
        }
      });
    }

    function allButton() {
      clearButton();
      clearAllButton();
      let contentContainer = document.getElementById("contentContainer");
      let buttonContainer = document.getElementById("buttonContainer");
      let buttonEdit = document.createElement("button");
      let buttonCancel = document.createElement("button");

      buttonEdit.className = "btn btn-primary";
      buttonEdit.innerHTML = "<i class='bi bi-pencil'></i> Edit";
      buttonEdit.id = "edit";

      buttonCancel.className = "btn btn-secondary";
      buttonCancel.innerHTML = "<i class='bi bi-x'></i> Cancel";
      buttonCancel.id = "cancel";
      buttonCancel.addEventListener("click", () => {
        clearButton();
      });

      buttonContainer.appendChild(buttonEdit);
      buttonContainer.appendChild(buttonCancel);

      contentContainer.append(buttonContainer);
    }

    name.addEventListener("click", () => {
      allButton();
    });

    email.addEventListener("click", () => {
      allButton();
    });

    nik.addEventListener("click", () => {
      allButton();
    });
  },
};
</script>

<style>
.profile-container {
  background-image: url("https://img.freepik.com/premium-photo/abstract-white-background-with-smooth-lines_476363-1302.jpg");
  background-size: cover;
  width: 100%;
  height: 100vh;
}
.profile {
  border-radius: 0.5rem;
  box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
  background-color: white;
  background-image: url("https://img.freepik.com/free-photo/digital-art-moon-dolphin-wallpaper_23-2150918931.jpg");
  background-size: cover;
  background-position: center;
}

.content {
  border-radius: 0.5rem;
  box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
  background-color: white;
}

.content-container {
  height: 100%;
}

.image-container {
  width: 140px;
  height: 100px;
  display: flex;
}

.image-container img {
  width: 100%;
  cursor: pointer;
  height: 100%;
  object-fit: cover;
}
</style>
