<template>
  <AppSidebar />
  <div class="dashboard-container w-100">
    <div class="container p-3" ref="dashboard">
      <div
        class="header d-flex justify-content-between align-items-center mb-5 gap-2"
        ref="dashboardHeader"
      >
        <h2 class="fw-bold">Dashboard</h2>
        <div class="d-flex gap-2">
          <button class="btn btn-primary">
            <i class="bi bi-box-arrow-in-right"></i> Export
          </button>
          <button
            class="btn btn-warning"
            id="modalCreate"
            @click="openCreateModal"
          >
            <i class="bi bi-plus-square"></i> Create
          </button>
        </div>
      </div>

      <div class="content-container">
        <div class="table-responsive d-none d-md-block">
          <table
            class="table table-borderless table-hover shadow-sm"
            ref="dashboardTable"
          >
            <thead class="opacity-50">
              <tr class="opacity-100 table-light text">
                <th class="text-start">No</th>
                <th class="text-start">Teachers NIK</th>
                <th class="text-start">Name</th>
                <th class="text-start">Title</th>
                <th class="text-start">Description</th>
                <th class="text-start">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(data, index) in dashboardData.slice().reverse()"
                :key="data.id"
                ref="tableRows"
              >
                <td class="ps-2 pe-3 text-start">{{ index + 1 }}</td>
                <td class="ps-2 pe-3 text-start">{{ data.Teacher.nik }}</td>
                <td class="ps-2 pe-3 text-start">{{ data.Teacher.name }}</td>
                <td class="ps-2 pe-3 text-start">{{ data.title }}</td>
                <td class="ps-2 pe-3 text-start">{{ data.description }}</td>
                <td class="ps-2 pe-3 text-start">
                  <div class="d-flex align-items-center">
                    <span>{{ data.date }}</span>
                    <button class="btn ms-5 p-0">
                      <i class="bi bi-eye fs-5"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile -->
        <div class="d-block d-md-none">
          <div
            v-for="(data, index) in dashboardData.slice().reverse()"
            :key="data.id"
            class="card mb-3 shadow-sm"
          >
            <div class="card-body">
              <h5 class="card-title">No: {{ index + 1 }}</h5>
              <p class="card-text">Teachers NIK: {{ data.Teacher.nik }}</p>
              <p class="card-text">Name: {{ data.Teacher.name }}</p>
              <p class="card-text">Title: {{ data.title }}</p>
              <p class="card-text">Description: {{ data.description }}</p>
              <p class="card-text">
                <span>Date: {{ data.date }}</span>
                <button class="btn ms-3 p-0">
                  <i class="bi bi-eye fs-5"></i>
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from "@/components/AppSidebar.vue";
import gsap from "gsap";
import axios from "axios";

export default {
  name: "DashboardView",
  components: {
    AppSidebar,
  },
  data() {
    return {
      dashboardData: [],
    };
  },
  mounted() {
    const token = "Bearer " + localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/api/monitorings", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        this.dashboardData = response.data.data;
        this.animateTableRows();
      })
      .catch((error) => {
        console.log(error);
      });

    gsap.from(this.$refs.dashboardHeader, {
      opacity: 0,
      y: -100,
      duration: 1.8,
      ease: "power4.out",
    });

    gsap.from(this.$refs.dashboard, {
      opacity: 0,
      scale: 0.95,
      duration: 1.2,
      delay: 0.8,
      ease: "power2.out",
    });
  },
  methods: {
    animateTableRows() {
      const rows = this.$refs.tableRows;
      gsap.from(rows, {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        delay: 1.1,
        duration: 0.8,
        ease: "power2.out",
      });
    },
    exportData() {
      const token = "Bearer " + localStorage.getItem("token");
    },
    createData() {
      const token = "Bearer " + localStorage.getItem("token");
    },
    openCreateModal() {
      const modalContainer = document.createElement("div");
      modalContainer.className = "modal-container";

      const modalHeader = document.createElement("div");
      modalHeader.className = "modal-header";

      const closeBtn = document.createElement("span");
      closeBtn.className = "close";
      closeBtn.textContent = "×";
      closeBtn.style.cursor = "pointer";

      const formHeader = document.createElement("h3");
      formHeader.textContent = "Create Data";

      modalHeader.appendChild(formHeader);
      modalHeader.appendChild(closeBtn);

      const modalBody = document.createElement("div");
      modalBody.className = "modal-body";

      const form = document.createElement("form");

      const inputNIK = this.createInput("text", "Enter your NIK");
      const inputName = this.createInput("text", "Enter your name");
      const inputTitle = this.createInput("text", "Enter title");
      const inputDescription = this.createInput("text", "Enter description");
      const inputDate = this.createInput("date", "");

      const buttonSubmit = document.createElement("button");
      buttonSubmit.type = "submit";
      buttonSubmit.textContent = "Submit";
      buttonSubmit.className = "btn btn-primary";

      form.append(
        inputNIK,
        inputName,
        inputTitle,
        inputDescription,
        inputDate,
        buttonSubmit
      );

      modalBody.appendChild(form);
      modalContainer.appendChild(modalHeader);
      modalContainer.appendChild(modalBody);

      document.body.appendChild(modalContainer);

      modalContainer.style.display = "block";

      closeBtn.addEventListener("click", () => {
        modalContainer.remove();
      });
    },

    createInput(type, placeholder) {
      const input = document.createElement("input");
      input.type = type;
      input.placeholder = placeholder;
      input.className = "form-control mb-2";
      return input;
    },
  },
};
</script>

<style>
.dashboard-container {
  background-image: url("https://img.freepik.com/free-vector/gradient-white-monochrome-background_23-2149017048.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding-bottom: 50px;
  position: relative;
}

.dashboard-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: -1;
}

.table td {
  vertical-align: middle;
}

.table .btn i {
  margin: 0;
}

th,
td {
  white-space: nowrap;
  overflow: hidden;
}

td:last-child {
  text-align: center;
  width: 15%;
}

.table-responsive {
  overflow-x: auto;
}

.card {
  border-radius: 8px;
  background: #fff;
}

.card-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.card-text {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  width: 100%;
  max-width: 500px;
  background-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  background-color: #007bff;
  color: white;
  padding: 1rem !important;
}

.modal-body {
  display: flex;
  flex-direction: column;
  margin: 1rem;
}

.close {
  font-size: 1.5rem;
  cursor: pointer;
  color: #fff;
  background: transparent;
  border: none;
  outline: none;
  transition: transform 0.3s ease;
}

.close:hover {
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .table-responsive {
    display: none;
  }
}

@media (min-width: 768px) {
  .card {
    display: none;
  }
}
</style>
