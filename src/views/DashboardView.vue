<template>
  <AppSidebar />
  <div class="dashboard-container w-100" @click.self="toggleDropdown(null)">
    <div class="container p-3" ref="dashboard">
      <div
        class="header mt-3 mx-3 d-flex justify-content-between align-items-center mb-5 gap-2"
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
          <table
            class="table table-borderless table-hover shadow-sm"
            ref="tableRows"
          >
            <thead class="opacity-50">
              <tr class="opacity-100 table-light text">
                <th class="text-center">No</th>
                <th class="text-start">Judul</th>
                <th class="text-start">Deskripsi</th>
                <th class="text-start">Date</th>
                <th class="text-start">Jam Mulai</th>
                <th class="text-start">Jam Selesai</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data, index) in dashboardData" :key="data.id">
                <td class="text-center">
                  {{ (currentPage - 1) * perPage + index + 1 }}
                </td>
                <td class="text-start">{{ data.title }}</td>
                <td class="text-start">{{ data.description }}</td>
                <td class="text-start">{{ data.date }}</td>
                <td class="text-start">{{ data.start_time }}</td>
                <td class="text-start">
                  <div class="d-flex align-items-center">
                    <span>{{ data.end_time }}</span>
                    <button
                      class="btn border-0 ms-5 p-0"
                      @click="toggleDropdown(data.id)"
                    >
                      <i class="bi bi-three-dots"></i>
                    </button>
                    <div
                      @click.self="toggleDropdown(data.id)"
                      v-if="activeDropdownId === data.id"
                      class="dropdown-menu show horizontal-dropdown"
                    >
                      <li>
                        <button
                          class="btn p-2 w-100"
                          @click="openDetailModal(data.id)"
                        >
                          <i class="bi bi-eye fs-5"></i>
                        </button>
                      </li>
                      <li>
                        <button class="btn p-2 w-100">
                          <i class="bi bi-pencil fs-5"></i>
                        </button>
                      </li>
                      <li>
                        <button class="btn p-2 w-100">
                          <i class="bi bi-trash fs-5"></i>
                        </button>
                      </li>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile View -->
        <div class="d-block d-md-none">
          <div
            v-for="(data, index) in dashboardData"
            :key="data.id"
            class="card mb-3 shadow-sm"
          >
            <div class="card-body">
              <h5 class="card-title">
                No: {{ (currentPage - 1) * perPage + index + 1 }}
              </h5>
              <p class="card-text">Title: {{ data.title }}</p>
              <p v-if="data.image !== null" class="card-text">
                Image:
                <img
                  :src="'http://127.0.0.1:8000/storage/images/' + data.image"
                  alt=""
                  class="img-thumbnail"
                />
              </p>
              <p class="card-text">Description: {{ data.description }}</p>
              <p class="card-text">Date: {{ data.date }}</p>
              <p class="card-text">Jam Mulai: {{ data.start_time }}</p>
              <div class="card-text">
                <span>Jam Selesai: {{ data.end_time }}</span>
                <button @click="toggleDropdown(data.id)" class="btn ms-3 p-0">
                  <i class="bi bi bi-three-dots"></i>
                </button>
                <div
                  v-if="activeDropdownId === data.id"
                  class="dropdown-menu show vertical-dropdown"
                >
                  <li>
                    <button
                      @click="openDetailModal(data.id)"
                      class="btn p-2 w-100"
                    >
                      <i class="bi bi-eye fs-5"></i>
                    </button>
                  </li>
                  <li>
                    <button class="btn p-2 w-100">
                      <i class="bi bi-pencil fs-5"></i>
                    </button>
                  </li>
                  <li>
                    <button class="btn p-2 w-100">
                      <i class="bi bi-trash fs-5"></i>
                    </button>
                  </li>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PagintaionComponent
          :prevLink="links.prev"
          :nextLink="links.next"
          :links="paginationLinks"
          @change-page="fetchData"
          class="pagination"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DetailModal from "@/components/DetailModal.vue";
import CreateModal from "@/components/CreateModal.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import PagintaionComponent from "@/components/PagintaionComponent.vue";
import gsap from "gsap";
import axios from "axios";

export default {
  name: "DashboardView",
  components: {
    AppSidebar,
    CreateModal,
    DetailModal,
    PagintaionComponent,
  },
  data() {
    return {
      showModal: false,
      showDetail: false,
      selectedMonitoringId: null,
      dashboardData: [],
      activeDropdownId: null,
      links: {},
      paginationLinks: [],
      currentPage: null,
      perPage: null,
    };
  },
  mounted() {
    this.fetchData();
    gsap.from(this.$refs.tableRows, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
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
    document.addEventListener("click", this.closeDropdown);
  },
  methods: {
    closeDropdown(e) {
      const dropdown = document.querySelector(".dropdown-menu");
      if (
        dropdown &&
        !dropdown.contains(e.target) &&
        !e.target.closest(".btn")
      ) {
        this.activeDropdownId = null;
      }
    },
    toggleDropdown(id) {
      this.activeDropdownId = this.activeDropdownId === id ? null : id;
    },
    async fetchData(url = "http://127.0.0.1:8000/api/monitorings") {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const { data, links, meta } = response.data;

        this.dashboardData = data;
        this.links.prev = links.prev;
        this.links.next = links.next;
        this.paginationLinks = meta.links.map((link) => ({
          label: link.label,
          url: link.url,
          active: link.active,
        }));
        this.currentPage = meta.current_page;
        this.perPage = meta.per_page;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    openCreateModal() {
      this.showModal = true;
    },
    closeCreateModal() {
      this.showModal = false;
    },
    handleSubmit(data) {
      this.dashboardData.push(data);
      this.closeCreateModal();
    },
    openDetailModal(monitoringId) {
      this.selectedMonitoringId = monitoringId;
      this.showDetail = true;
    },
    closeDetailModal() {
      this.showDetail = false;
      this.selectedMonitoringId = null;
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
  margin-right: 1.2rem;
  margin-left: 1.2rem;
  margin-top: 1rem;
  overflow-x: auto;
  word-wrap: break-word;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  word-wrap: break-word;
  white-space: nowrap;
  text-overflow: ellipsis;
}

td:last-child {
  text-align: center;
}

th:first-child,
td:first-child {
  width: 50px;
}

.table-responsive {
  overflow-x: auto;
  overflow-y: visible;
  position: relative;
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

.dropdown-menu.show {
  display: block;
  position: absolute;
  z-index: 1000;
}

.horizontal-dropdown {
  display: flex !important;
  padding: 0.5rem;
  gap: 0.5rem;
}

.horizontal-dropdown li {
  list-style: none;
}

.horizontal-dropdown button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.horizontal-dropdown button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.vertical-dropdown {
  display: flex !important;
  position: relative;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.vertical-dropdown li {
  list-style: none;
}

.vertical-dropdown button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  width: 100%;
  text-align: left;
  transition: background-color 0.2s ease;
}

.vertical-dropdown button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.img-thumbnail {
  height: auto;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #dee2e6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .table-responsive {
    display: none;
  }

  .dashboard-container {
    padding: 10px;
  }

  .header {
    flex-direction: column;
    gap: 10px;
  }

  .pagination {
    display: flex;
    gap: 3px;
  }

  .content-container{
    margin-right: 0;
    margin-left: 0;
  }
}

@media (min-width: 768px) {
  .card {
    display: none;
  }
}
</style>
