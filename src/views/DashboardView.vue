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
          <button class="btn btn-warning" @click="openCreateModal(id)">
            <i class="bi bi-plus-square"></i> Create
          </button>
        </div>
      </div>

      <CreateModal
        v-if="showModal"
        :modals="modal"
        @submit="handleSubmit"
        @close="closeCreateModal"
      />

      <DetailModal
        v-if="showDetail"
        :detailMonitoring="selectedMonitoringId"
        @close="closeDetailModal"
      />

      <div class="content-container">
        <div class="table-responsive d-none d-md-block">
          <table class="table table-borderless table-hover shadow-sm" ref="tableRows">
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
              >
                <td class="text-start">{{ index + 1 }}</td>
                <td class="text-start">{{ data.title }}</td>
                <td class="text-start">{{ data.description }}</td>
                <td class="text-start">{{ data.date }}</td>
                <td class="text-start">{{ data.start_time }}</td>
                <td class="text-start">
                  <div class="d-flex align-items-center">
                    <span>{{ data.end_time }}</span>
                    <button
                      class="btn ms-5 p-0"
                      @click="openDetailModal(data.id)"
                    >
                      <i class="bi bi-eye fs-5"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile View -->
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
                <button @click="openDetailModal(data.id)" class="btn ms-3 p-0">
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
import DetailModal from "@/components/DetailModal.vue";
import CreateModal from "@/components/CreateModal.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import gsap from "gsap";
import axios from "axios";

export default {
  name: "DashboardView",
  components: {
    AppSidebar,
    CreateModal,
    DetailModal,
  },
  data() {
    return {
      showModal: false,
      showDetail: false,
      modal: {},
      selectedMonitoringId: null,
      dashboardData: [],
      // idMonitorings: null,
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
        console.log(response.data.data);
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
    openCreateModal() {
      // this.idMonitorings = id;
      this.showModal = true;
    },
    closeCreateModal() {
      this.showModal = false;
    },
    handleSubmit(data) {
      this.dashboardData.push(data)
      this.fetchDashboardData()
      this.closeCreateModal();
    },
    openDetailModal(monitoringId) {
      this.selectedMonitoringId = monitoringId;
      this.showDetail = true;
    },
    fetchDashboardData() {
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
    },
    closeDetailModal() {
      this.showDetail = false;
      this.selectedMonitoringId = null;
    },
    animateTableRows() {
      gsap.from(this.$refs.tableRows, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
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
