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
            @click="showModal = true"
          >
            <i class="bi bi-plus-square"></i> Create
          </button>
        </div>
      </div>

      <CreateModal
        v-if="showModal"
        :modals="modal"
        :submit="setSubmitData"
        @close="showModal = false"
      />

      <div class="content-container">
        <div class="table-responsive d-none d-md-block">
          <table
            class="table table-borderless table-hover shadow-sm"
            ref="dashboardTable"
          >
            <thead class="opacity-50">
              <tr class="opacity-100 table-light text">
                <th class="text-start">No</th>
                <th class="text-start">Judul</th>
                <th class="text-start">Deskripsi</th>
                <th class="text-start">Date</th>
                <th class="text-start">Jam Mulai</th>
                <th class="text-start">Jam Selesai</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(data, index) in dashboardData.slice().reverse()"
                :key="data.id"
                ref="tableRows"
              >
                <td class="text-start">{{ index + 1 }}</td>
                <td class="text-start">{{ data.title }}</td>
                <td class="text-start">{{ data.description }}</td>
                <td class="text-start">{{ data.date }}</td>
                <td class="text-start">{{ data.start_time }}</td>
                <td class="text-start">
                  <div class="d-flex align-items-center">
                    <span>{{ data.end_time }}</span>
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
              <p class="card-text">Title: {{ data.title }}</p>
              <p class="card-text">Description: {{ data.description }}</p>
              <p class="card-text">Date: {{ data.date }}</p>
              <p class="card-text">Jam Mulai: {{ data.start_time }}</p>
              <p class="card-text">
                <span>Jam Selesai: {{ data.end_time }}</span>
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
import CreateModal from "@/components/CreateModal.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import gsap from "gsap";
import axios from "axios";

export default {
  name: "DashboardView",
  components: {
    AppSidebar,
    CreateModal,
  },
  data() {
    return {
      dashboardData: [],
      modal: {},
      showModal: false,
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
    setSubmitData(data) {
      this.dashboardData.push(data);
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

.content-container {
  overflow-x: auto;
  word-wrap: break-word;
}

.table {
  table-layout: fixed;
  width: 100%;
}

th,
td {
  word-wrap: break-word;
  white-space: normal;
  overflow: auto;
  text-overflow: ellipsis;
}

td:last-child {
  text-align: center;
  word-wrap: break-word;
}

th:first-child,
td:first-child {
  width: 50px;
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
