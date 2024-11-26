<template>
  <AppSidebar />
  <div class="dashboard-container w-100">
    <div class="container p-3" ref="dashboard">
      <div
        class="header d-flex justify-content-between align-items-center mb-5 gap-2"
        ref="dashboardHeader"
      >
        <h2 class="fw-bold">Student</h2>
        <label for="import-file" class="btn btn-primary custom-file-label"
          ><i class="bi bi-upload"></i> Import</label
        >
        <input
          type="file"
          class="custom-file-input"
          id="import-file"
          @change="submitImport"
        />
      </div>

      <div class="content-container">
        <div class="table-responsive">
          <table
            class="table table-borderless table-hover shadow-sm"
            ref="dashboardTable"
          >
            <thead class="opacity-50">
              <tr class="opacity-100 table-light text">
                <th class="text-center">No</th>
                <th class="text-start">NISN</th>
                <th class="text-start">Nama</th>
                <th class="text-start">Kelas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data, index) in dashboardData" :key="data.id">
                <td class="text-center">{{ index + 1 }}</td>
                <td class="text-start">{{ data.nisn }}</td>
                <td class="text-start">{{ data.name }}</td>
                <td class="text-start">{{ data.class }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile -->
        <div class="d-block d-md-none">
          <div v-for="(data, index) in dashboardData" :key="data.id">
            <div class="card mb-3 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">No: {{ index + 1 }}</h5>
                <p class="card-text">NISN: {{ data.nisn }}</p>
                <p class="card-text">Nama: {{ data.name }}</p>
                <p class="card-text">Kelas: {{ data.class }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from "@/components/AppSidebar.vue";
import axios from "axios";
import gsap from "gsap";

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
      .get("http://127.0.0.1:8000/api/students", {
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
    submitImport(e) {
      const file = e.target.files[0];
      if (file) {
        console.log(file);
        this.importData(file);
      }
    },
    importData(file) {
      const token = "Bearer " + localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", file);

      axios
        .post("http://127.0.0.1:8000/api/students/import", formData, {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data.data);
          this.dashboardData.push(response.data.data);
        })
        .catch((error) => {
          console.log(error.response ? error.response.data : error.message);
        });
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  background-image: url("https://img.freepik.com/free-vector/gradient-white-monochrome-background_23-2149017048.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding-bottom: 50px;
  position: relative;
  height: 100vh;
}

.dashboard-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: -1;
}

.container::-webkit-scrollbar {
  width: 13px;
}

.container::-webkit-scrollbar-thumb {
  background-color: #6c757d;
  border-radius: 5px;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.container::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.content-container::-webkit-scrollbar {
  height: 8px;
}

.content-container::-webkit-scrollbar-thumb {
  background-color: #6c757d;
  border-radius: 4px;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.content-container::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.container {
  scrollbar-color: rgba(0, 0, 0, 0.1);
  height: 100vh;
  overflow-y: auto;
}

.content-container {
  overflow-x: auto;
  word-wrap: break-word;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.container {
  scrollbar-color: rgba(0, 0, 0, 0.1);
  height: 100vh;
  overflow-y: auto;
}

.table td {
  vertical-align: middle;
}

th:first-child,
td:first-child {
  width: 50px;
}

th:last-child,
td:last-child {
  width: 200px;
}

th,
td {
  white-space: nowrap;
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
  overflow-y: visible;
  position: relative;
}

.custom-file-input {
  display: none;
}

.custom-file-label {
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-weight: 500;
  text-align: center;
  transition: background-color 0.3s ease;
}

.custom-file-label:hover {
  background-color: #0056b3;
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
