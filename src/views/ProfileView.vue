<template>
  <div class="profile-container" ref="profileContainer">
    <router-link to="/dashboard" class="home-link">
      <i class="bi bi-house-door-fill"></i>
      <span>Back</span>
    </router-link>
    <div class="container d-flex justify-content-center align-items-center">
      <div class="row pb-5 pe-5 gap-5 w-100">
        <div class="profile-content col" ref="profileContent">
          <div
            class="content-container d-flex justify-content-center align-items-center flex-column"
            id="contentContainer"
          >
            <div class="image-container img-fluid mb-5">
              <img
                src="https://img.freepik.com/free-photo/3d-rendering-cartoon-character-with-eyeglasses-jacket_1142-51310.jpg"
                alt="User Profile Image"
                class="profile-image rounded-circle shadow"
                ref="profileImage"
              />
            </div>
            <div class="form-data">
              <form class="text-black">
                <div class="mb-3">
                  <label for="name" class="form-label">Name</label>
                  <p type="text" class="form-control" id="name">{{ teacherData.name }}</p>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <p type="email" class="form-control" id="email">{{ teacherData.email }}</p>
                </div>
                <div class="mb-3">
                  <label for="nik" class="form-label">NIK</label>
                  <p type="text" class="form-control" id="nik">{{ teacherData.nik }}</p>
                </div>
              </form>
              <div id="buttonContainer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import gsap from "gsap";

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

    // let name = document.getElementById("name");
    // let email = document.getElementById("email");
    // let nik = document.getElementById("nik");

    // function clearButton() {
    //   let buttonContainer = document.getElementById("buttonContainer");
    //   buttonContainer.innerHTML = "";
    // }

    // function clearAllButton() {
    //   let contentContainer = document.getElementById("contentContainer");
    //   contentContainer.addEventListener("click", (e) => {
    //     if (e.target === contentContainer) {
    //       clearButton();
    //     }
    //   });
    // }

    // function allButton() {
    //   clearButton();
    //   clearAllButton();
    //   let contentContainer = document.getElementById("contentContainer");
    //   let buttonContainer = document.getElementById("buttonContainer");
    //   let buttonEdit = document.createElement("button");
    //   let buttonCancel = document.createElement("button");

    //   buttonEdit.className = "btn btn-primary";
    //   buttonEdit.innerHTML = "<i class='bi bi-pencil'></i> Edit";
    //   buttonEdit.id = "edit";

    //   buttonCancel.className = "btn btn-secondary";
    //   buttonCancel.innerHTML = "<i class='bi bi-x'></i> Cancel";
    //   buttonCancel.id = "cancel";
    //   buttonCancel.addEventListener("click", () => {
    //     clearButton();
    //   });

    //   buttonContainer.appendChild(buttonEdit);
    //   buttonContainer.appendChild(buttonCancel);

    //   contentContainer.append(buttonContainer);
    // }

    // name.addEventListener("click", () => {
    //   allButton();
    // });

    // email.addEventListener("click", () => {
    //   allButton();
    // });

    // nik.addEventListener("click", () => {
    //   allButton();
    // });

    gsap.from(this.$refs.profileContainer, {
      opacity: 0,
      y: -100,
      duration: 1.5,
      ease: "power4.out",
    });

    gsap.from(this.$refs.profileContent, {
      opacity: 0,
      x: 200,
      duration: 1.5,
      delay: 0.7,
      ease: "power4.out",
    });

    gsap.from(this.$refs.profileImage, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.7)",
    });
  },
};
</script>

<style scoped>
.profile-container {
  background-image: url("https://img.freepik.com/premium-photo/abstract-white-background-with-smooth-lines_476363-1302.jpg");
  background-size: cover;
  width: 100%;
  height: 100vh;
}
.container {
  width: 500px;
  margin: 0 auto;
  height: 100vh;
}

.home-link {
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 1rem;
  font-weight: bold;
  color: #dc3545;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.3s, color 0.3s;
}

.home-link i {
  font-size: 1rem;
}

.home-link:hover {
  transform: scale(1.1);
  color: #a71d2a;
}

.profile-content {
  border-radius: 0.5rem;
  box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
  background-size: cover;
  background-position: center;
}

.content-container {
  height: 100%;
  padding: 2rem;
}

.image-container {
  width: 140px;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.form-data {
  width: 100%;
}

.form-label {
  font-weight: bold;
}

input.form-control {
  border-radius: 0.5rem;
}

#buttonContainer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
}

button {
  border-radius: 0.3rem;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .home-link {
    font-size: 1.5rem;
    top: 10px;
    left: 10px;
  }

  .home-link i {
    font-size: 1.2rem;
  }

  .content-container {
    padding: 1rem;
  }

  .profile-content {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .home-link {
    font-size: 1.2rem;
    top: 5px;
    left: 5px;
  }

  .home-link i {
    font-size: 1rem;
  }
}
</style>
