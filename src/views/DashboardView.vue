<template>
  <AppSidebar />
  <div class="dashboard-container w-100">
    <div class="container p-3" data-aos="fade-right">
      <div class="header mb-5">
        <h2 class="fw-bold">Dashboard</h2>
      </div>
      <div class="content-container">
        <table
          class="table table-responsive-md table-bordered rounded shadow-sm"
        >
          <thead class="table-dark">
            <tr>
              <th rowspan="2" class="text-center align-middle">No</th>
              <th rowspan="2" class="text-center align-middle">Teachers NIK</th>
              <th rowspan="2" class="text-center align-middle">Name</th>
              <th rowspan="2" class="text-center align-middle">Title</th>
              <th rowspan="2" class="text-center align-middle">Description</th>
              <th rowspan="2" class="text-center align-middle">Date</th>
              <th colspan="2" class="text-center align-middle">
                Monitoring Detail
              </th>
            </tr>
            <tr>
              <th class="text-center">Name</th>
              <th class="text-center">Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in dashboardData" :key="data.id">
              <td class="text-center align-middle">{{ index + 1 }}</td>
              <td class="text-center align-middle">{{ data.Teacher.nik }}</td>
              <td class="text-center align-middle">{{ data.Teacher.name }}</td>
              <td class="text-center align-middle">{{ data.title }}</td>
              <td class="text-center align-middle">{{ data.description }}</td>
              <td class="text-center align-middle">{{ data.date }}</td>
              <td>
                <table class="w-100 table table-sm">
                  <tbody>
                    <tr v-for="detail in data.not_presents" :key="detail.id">
                      <td class="text-center">{{ detail.student.name }}</td>
                    </tr>
                    <tr v-if="data.not_presents.length === 0">
                      <td class="text-center text-muted">No Data</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td>
                <table class="w-100 table table-sm">
                  <tbody>
                    <tr v-for="detail in data.not_presents" :key="detail.id">
                      <td class="text-center">{{ detail.keterangan }}</td>
                    </tr>
                    <tr v-if="data.not_presents.length === 0">
                      <td class="text-center text-muted">No Data</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from "@/components/AppSidebar.vue";
import Aos from "aos";
import "aos/dist/aos.css";
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
      })
      .catch((error) => {
        console.log(error);
      });
    Aos.init();
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

.table-responsive-md {
  overflow-x: auto;
}

h2 {
  font-size: 2rem;
}

.table th,
.table td {
  vertical-align: middle;
}
</style>
