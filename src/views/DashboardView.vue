<template>
  <AppSidebar />
  <div class="dashboard-container w-100" @click.self="toggleDropdown(null)">
    <div class="container p-md-3" ref="dashboard">
      <div
        class="header mt-3 mx-3 d-flex justify-content-between align-items-center gap-2"
        ref="dashboardHeader"
      >
        <h2 class="fw-bold">Dashboard</h2>
        <div class="d-flex gap-2">
          <button
            class="btn btn-primary"
            @click="$refs.exportModules.openModal"
          >
            <i class="bi bi-box-arrow-in-right"></i> Export
          </button>
          <button class="btn btn-warning" @click="openCreateModal(id)">
            <i class="bi bi-plus-square"></i> Create
          </button>
        </div>
      </div>

      <LoadingSpinner v-if="isLoading" />

      <div class="input-group search-container" v-else>
        <span class="input-group-text" id="basic-addon2">
          <button class="btn btn-sm">
            <i class="bi bi-search"></i>
          </button>
        </span>
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="Cari Judul atau Deskripsi"
          aria-label="Cari Judul atau Deskripsi"
          @keyup="searchValue"
        />
      </div>

      <ExportModules ref="exportModules" />

      <CreateModal
        v-if="showModal"
        @kirimData="handleSubmit"
        @close="closeCreateModal"
      />

      <DetailModal
        v-if="showDetail"
        :detailMonitoring="selectedMonitoringId"
        @close="closeDetailModal"
      />

      <EditModal
        v-if="showEditModal"
        :detailMonitoring="selectIdMonitoring"
        @update="handleEditSubmit"
        @close="closeEditModal"
      />

      <div class="content-container">
      <div class="d-flex justify-content-center" v-if="isSearching">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div class="content-container" v-if="!isSearching">
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
              <tr v-if="noData === true">
                <td
                  colspan="6"
                  rowspan="6"
                  class="text-center p-5 fw-bold fs-4"
                >
                  No Data Here ...
                </td>
              </tr>
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
                        <button
                          class="btn p-2 w-100"
                          @click="openEditModal(data.id)"
                        >
                          <i class="bi bi-pencil fs-5"></i>
                        </button>
                      </li>
                      <li>
                        <button
                          class="btn p-2 w-100"
                          @click="deleteMonitoring(data.id)"
                        >
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

        <LoadingSpinner v-if="isLoading" />

        <!-- Mobile View -->
        <div class="d-block d-md-none" v-else>
          <div v-if="noData === true">
            <p colspan="6" class="text-center">No Data Here ...</p>
          </div>
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
                    <button
                      class="btn p-2 w-100"
                      @click="openEditModal(data.id)"
                    >
                      <i class="bi bi-pencil fs-5"></i>
                    </button>
                  </li>
                  <li>
                    <button
                      @click="deleteMonitoring(data.id)"
                      class="btn p-2 w-100"
                    >
                      <i class="bi bi-trash fs-5"></i>
                    </button>
                  </li>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PagintaionComponent
          v-if="dashboardData.length > 0"
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
import ExportModules from "@/components/ExportModules.vue";
import PagintaionComponent from "@/components/PagintaionComponent.vue";
import EditModal from "@/components/EditModal.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import gsap from "gsap";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "DashboardView",
  components: {
    AppSidebar,
    CreateModal,
    DetailModal,
    PagintaionComponent,
    ExportModules,
    Swal,
    EditModal,
    LoadingSpinner,
  },
  data() {
    return {
      showModal: false,
      showDetail: false,
      showEditModal: false,
      selectedMonitoringId: null,
      dashboardData: [],
      activeDropdownId: null,
      links: {},
      paginationLinks: [],
      currentPage: null,
      perPage: null,
      noData: false,
      isLoading: true,
      isSearching: false,
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

    gsap.from(this.$refs.dashboard, {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: "power2.out",
    });

    gsap.from(this.$refs.dashboardHeader, {
      opacity: 0,
      y: -50,
      duration: 1,
      delay: 0.2,
      ease: "power2.out",
    });

    document.addEventListener("click", this.closeDropdown);
  },
  methods: {
    searchValue(event) {
      const token = "Bearer " + localStorage.getItem("token");
      const search = event.target.value;

      this.isSearching = true;

      if (search.trim() === "") {
        this.fetchData();
        this.noData = false;
        this.isSearching = false;
        this.isLoading = true;
        return;
      }

      axios
        .get(`http://127.0.0.1:8000/api/monitorings/search/${search}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          if (response.data.data.length === 0) {
            this.noData = true;
            this.isSearching = false;
            this.dashboardData = [];
            this.paginationLinks = [];
          } else {
            this.dashboardData = response.data.data;
            this.noData = false;
            this.isSearching = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.isSearching = false;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
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
    async fetchData(
      url = `http://127.0.0.1:8000/api/monitorings?page=${this.currentPage}`
    ) {
      try {
        this.isLoading = true;
        const response = await axios.get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const { data, links, meta } = response.data;

        this.dashboardData = data;
        this.links.prev = links.prev;
        this.links.next = links.next;
        if (this.dashboardData.length === 0) {
          this.noData = true;
          this.paginationLinks = [];
        }
        this.paginationLinks = meta.links.map((link) => ({
          label: link.label,
          url: link.url,
          active: link.active,
        }));
        this.currentPage = meta.current_page;
        this.perPage = meta.per_page;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    deleteMonitoring(id) {
      Swal.fire({
        title: "Konfirmasi Hapus",
        text: "Apakah Anda yakin ingin menghapus data ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Menghapus Data ...",
            loaderHtml: '<i class="fa fa-refresh fa-spin"></i>',
            timer: 500,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            },
          })
          const token = "Bearer " + localStorage.getItem("token");

          axios
            .delete("http://127.0.0.1:8000/api/monitorings/" + id, {
              headers: {
                Authorization: token,
              },
            })
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data Monitoring berhasil dihapus!",
                timer: 1000,
                showConfirmButton: false,
              });
              const currentUrl = `http://127.0.0.1:8000/api/monitorings?page=${this.currentPage}`;
              this.fetchData(currentUrl).then(() => {
                if (this.dashboardData.length === 0 && this.currentPage > 1) {
                  this.currentPage--;
                  const prevUrl = `http://127.0.0.1:8000/api/monitorings?page=${this.currentPage}`;
                  this.fetchData(prevUrl);
                }
              });
            })
            .catch((error) => {
              console.error(error);
              Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal menghapus data monitoring.",
              });
            });
        }
      });
    },
    openCreateModal() {
      this.showModal = true;
    },
    closeCreateModal() {
      this.showModal = false;
    },
    handleSubmit() {
      axios
        .get("http://127.0.0.1:8000/api/monitorings", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.dashboardData = response.data.data;
          this.noData = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openDetailModal(monitoringId) {
      this.selectedMonitoringId = monitoringId;
      this.showDetail = true;
    },
    closeDetailModal() {
      this.showDetail = false;
      this.selectedMonitoringId = null;
    },

    openEditModal(id) {
      this.selectIdMonitoring = id; // Menyimpan data yang dipilih
      this.showEditModal = true; // Tampilkan modal edit
    },
    closeEditModal() {
      this.showEditModal = false; // Sembunyikan modal edit
      this.selectIdMonitoring = null; // Reset data yang dipilih
    },
    handleEditSubmit() {
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
  },
};
</script>

<style scoped>
.dashboard-container {
  background-image: url("https://img.freepik.com/free-vector/gradient-white-monochrome-background_23-2149017048.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  overflow: hidden;
  height: 100vh;
}

.dashboard-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: -1;
}

.header {
  margin-bottom: 2rem;
}

.container::-webkit-scrollbar {
  display: none;
}

.content-container::-webkit-scrollbar {
  display: none;
}

.search-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  border-radius: 1.3rem;
  margin-bottom: 1.7rem;
}

.search-container:focus-within {
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

.search-container input {
  border-radius: 1.3rem;
  box-shadow: none;
}

.search-container input:focus {
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border-color: transparent;
}

.input-group-text {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 1.3rem;
}

.input-group-text:hover {
  background-color: #dee2e6;
  border-color: rgba(0, 0, 0, 0.2);
}

.container {
  scrollbar-color: rgba(0, 0, 0, 0.1);
  height: 100vh;
  overflow-y: auto;
}

.content-container {
  margin-right: 1.2rem;
  margin-left: 1.2rem;
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

  .search-container {
    margin-bottom: 2rem;
    width: 100%;
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

  .content-container {
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
