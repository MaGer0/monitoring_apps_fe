<template>
  <div class="dashboard-container d-flex w-100">
    <AppSidebar />
    <div class=" w-100">
      <div class="container p-3" ref="dashboard">
        <LoadingSpinner v-if="isLoading" />
        <div
          class="header mt-3 mx-3 d-flex justify-content-between align-items-center gap-2"
          ref="dashboardHeader"
          v-else
        >
          <h2 class="fw-bold">Student</h2>
          <button @click="showExampleOverlay" class="btn border-0">
            <label class="btn btn-primary custom-file-label"
              ><i class="bi bi-upload"></i> Import</label
            >
          </button>
        </div>

        <div v-if="showExample" class="example-overlay" ref="exampleOverlay">
          <div
            class="card-format p-3 shadow-lg"
            style="max-width: 400px; width: 90%"
          >
            <div class="card-body">
              <div
                class="card-head d-flex justify-content-between align-items-center"
              >
                <h5 class="card-title-format">Contoh Format</h5>
                <button @click="hideExample" class="btn button-close border-0">
                  <i class="close-format bi bi-x"></i>
                </button>
              </div>
              <img
                src="../assets/images/contoh-format.png"
                alt="Contoh Format"
                class="img-fluid mb-3"
              />
              <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-primary">
                  <label for="import-file">
                    <i class="bi bi-upload"></i> Pilih File
                  </label>
                  <input
                    type="file"
                    class="custom-file-input"
                    id="import-file"
                    @change="submitImport"
                    ref="importFile"
                  />
                </button>
                <button @click="downloadFormat" class="btn btn-success">
                  <i class="bi bi-download"></i> Download Format
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="input-group search-container">
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
            aria-describedby="basic-addon2"
            @keyup="searchDataStudent"
          />
        </div>

        <div class="d-flex justify-content-center" v-if="isSearching">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div class="content-container" v-if="!isSearching">
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
                <tr v-if="noDataStudent">
                  <td
                    colspan="6"
                    rowspan="6"
                    class="text-center p-5 fw-bold fs-4"
                  >
                    No Data Here ...
                  </td>
                </tr>
                <tr v-for="(data, index) in dashboardData" :key="index">
                  <td class="text-center">
                    {{ (currentPage - 1) * perPage + index + 1 }}
                  </td>
                  <td class="text-start">{{ data.nisn }}</td>
                  <td class="text-start">{{ data.name }}</td>
                  <td class="text-start">{{ data.class }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <LoadingSpinner v-if="isLoading" />

          <!-- Mobile -->
          <div class="d-block d-md-none" v-else>
            <div v-if="noDataStudent">
              <h1 class="text-center p-5 fw-bold fs-4">No Data Here ...</h1>
            </div>
            <div v-for="(data, index) in dashboardData" :key="index">
              <div class="card mb-3 shadow-sm">
                <div class="card-body">
                  <h5 class="card-title">
                    No: {{ (currentPage - 1) * perPage + index + 1 }}
                  </h5>
                  <p class="card-text">NISN: {{ data.nisn }}</p>
                  <p class="card-text">Nama: {{ data.name }}</p>
                  <p class="card-text">Kelas: {{ data.class }}</p>
                </div>
              </div>
            </div>
          </div>
          <PagintaionComponent
            v-if="dashboardData.length > 0"
            :prevLink="links.prev"
            :nextLink="links.next"
            :links="paginationLinks"
            @change-page="fetchDataStudent"
            class="pagination"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from "@/components/AppSidebar.vue";
import PagintaionComponent from "@/components/PagintaionComponent.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import axios from "axios";
import gsap from "gsap";
import Swal from "sweetalert2";

export default {
  name: "DashboardView",
  components: {
    AppSidebar,
    PagintaionComponent,
    Swal,
    LoadingSpinner,
  },
  data() {
    return {
      dashboardData: [],
      links: {},
      paginationLinks: [],
      currentPage: null,
      perPage: null,
      noDataStudent: false,
      showExample: false,
      isLoading: true,
      isSearching: false,
    };
  },
  mounted() {
    this.fetchDataStudent();
    gsap.from(this.$refs.dashboard, {
      opacity: 0,
      scale: 0.95,
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

    gsap.from(this.$refs.dashboardTable, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.4,
      ease: "power2.out",
    });

    gsap.from(".search-container", {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      delay: 0.6,
      ease: "back.out(1.7)",
    });
  },
  methods: {
    downloadFormat() {
      const token = "Bearer " + localStorage.getItem("token");
      axios
        .get("http://127.0.0.1:8000/api/students/example", {
          headers: {
            Authorization: token,
          },
          responseType: "blob",
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers["content-type"],
          });

          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "Students_Format.xlsx";
          link.click();

          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Format berhasil di Download",
            timer: 1000,
            showConfirmButton: false,
          });

          this.hideExample();
        })
        .catch((error) => {
          console.log(error);

          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Format gagal di Download",
            timer: 1000,
          });
          this.hideExample();
        });
    },
    showExampleOverlay() {
      this.showExample = true;
      this.$nextTick(() => {
        gsap.fromTo(
          this.$refs.exampleOverlay,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
        );
      });
    },
    hideExample() {
      gsap.to(".example-overlay", {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          this.showExample = false;
          // this.$refs.importFile.value = null;
        },
      });
    },

    searchDataStudent(event) {
      const token = "Bearer " + localStorage.getItem("token");
      const search = event.target.value;

      this.isSearching = true;

      if (search.trim() === "") {
        this.fetchDataStudent();
        this.noDataStudent = false;
        this.isSearching = false;
        this.isLoading = true;
        return;
      }

      axios
        .get(`http://127.0.0.1:8000/api/students/search/${search}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          if (response.data.data.length === 0) {
            this.noDataStudent = true;
            this.isSearching = false;
            this.dashboardData = [];
            this.paginationLinks = [];
          } else {
            this.dashboardData = response.data.data;
            this.noDataStudent = false;
            this.isSearching = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.isSearching = false;
          this.isLoading = false;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async fetchDataStudent(url = "http://127.0.0.1:8000/api/students") {
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
          this.noDataStudent = true;
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
        this.isLoading = false;
        this.isSearching = false;
      } finally {
        this.isLoading = false;
        this.isSearching = false;
      }
    },
    submitImport(e) {
      this.showExample = false;
      const file = e.target.files[0];
      if (file) {
        console.log(file);
        this.showExample = false;
        this.importData(file);
      }
    },
    importData(file) {
      const token = "Bearer " + localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", file);

      Swal.fire({
        title: "Mengimport Data",
        loaderHtml: '<i class="fa fa-refresh fa-spin"></i>',
        timer: 500,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      axios
        .post("http://127.0.0.1:8000/api/students/import", formData, {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setTimeout(() => {
            this.dashboardData.push(response.data.data);
            this.noDataStudent = false;
            this.showExample = false;
            this.isLoading = false;
            this.isSearching = false;
          }, 200);
          this.fetchDataStudent();

          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Berhasil Mengimport Data!",
            timer: 1000,
            showConfirmButton: false,
          });

          this.showExample = false;
          this.isLoading = false;
          this.isSearching = false;
        })
        .catch((error) => {
          console.log(error.response ? error.response.data : error.message);
          this.fetchDataStudent();

          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Terjadi Kesalahan saat Mengimport Data!",
            timer: 1000,
            showConfirmButton: false,
          });

          this.showExample = false;
          this.isLoading = false;
          this.isSearching = false;
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
  padding: 0;
}

.dashboard-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: -1;
}

.example-overlay {
  position: fixed;
  width: 100%;
  z-index: 1050;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.close-format {
  font-size: 1.5rem;
  color: #dc3545;
  border: 1px solid #dc3545;
  border-radius: 50%;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.close-format:hover {
  cursor: pointer;
  background-color: #dc3545;
  color: #fff;
}

.card-format {
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  margin: 0;
}
.card-format img {
  border-radius: 5px;
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
  border-radius: 10px;
  margin-bottom: 15px;
}
.card-body {
  padding: 1rem;
}
.card-title {
  font-size: 1rem;
  font-weight: 600;
}
.card-text {
  font-size: 0.9rem;
}

.table td {
  vertical-align: middle;
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
  .dashboard-container {
    padding: 0;
    margin: 0;
  }

  .table-responsive {
    display: none;
  }

  .search-container {
    margin-bottom: 2rem;
    width: 100%;
  }

  .dashboard-container {
    padding: 0;
  }

  .example-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-head .card-title-format, .button-close {
    font-size: 4vw;
  }

  .card-footer {
    display: flex;
    flex-direction: column-reverse;
    gap: 0.5rem;
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
