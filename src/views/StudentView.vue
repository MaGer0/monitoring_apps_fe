<template>
    <AppSidebar />
    <div class="dashboard-container w-100">
      <div class="container p-3" ref="dashboard">
        <div
          class="header d-flex justify-content-between align-items-center mb-5 gap-2"
          ref="dashboardHeader"
        >
          <h2 class="fw-bold">Student</h2>
          <button class="btn btn-primary" @click="importData">
            <i class="bi bi-cloud-upload"></i> Import
          </button>
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
      importData() {
        console.log();
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
  
  th:first-child, td:first-child {
    width: 50px;
  }

  th:last-child, td:last-child {
    width: 200px;
  }

  th,
  td {
    white-space: nowrap;
    overflow: hidden;
  }
  
  .table-responsive {
    overflow-x: auto;
  }
  </style>
  