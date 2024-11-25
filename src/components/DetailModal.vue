<template>
  <div class="modal-overlay" @click.self="closeDetail">
    <div class="modal-container">
      <div
        class="modal-header bg-primary text-white d-flex justify-content-between p-3"
      >
        <h5 class="modal-title">Detail Monitoring</h5>
        <button class="btn close text-white border-0" @click="closeDetail">
          &times;
        </button>
      </div>
      <div class="modal-body p-3">
        <div v-if="mainData">
          <div class="mb-3">
            <label class="form-label">Judul :</label>
            <p class="form-control-static">{{ mainData.title }}</p>
          </div>
          <div class="mb-3">
            <label class="form-label">Deskripsi :</label>
            <p class="form-control-static">{{ mainData.description }}</p>
          </div>
          <div class="mb-3">
            <label class="form-label">Tanggal :</label>
            <p class="form-control-static">{{ mainData.date }}</p>
          </div>
          <div class="mb-3">
            <label class="form-label">Jam Mulai :</label>
            <p class="form-control-static">{{ mainData.start_time }}</p>
          </div>
          <div class="mb-3">
            <label class="form-label">Jam Selesai :</label>
            <p class="form-control-static">{{ mainData.end_time }}</p>
          </div>
        </div>
        <div v-if="detailData.length > 0">
          <label class="form-label">Detail Keterangan Murid:</label>
          <ul>
            <li v-for="(detail, index) in detailData" :key="index">
              {{ detail.keterangan }}
            </li>
          </ul>
        </div>
        <div v-else>
          <p class="text-muted">Tidak ada detail murid untuk monitoring ini.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DetailModal",
  props: ["detailMonitoring"],
  data() {
    return {
      mainData: null,
    };
  },
  mounted() {
    this.getDetailData(this.detailMonitoring);
  },
  methods: {
    getDetailData(id) {
      const token = "Bearer " + localStorage.getItem("token");

      axios
        .get(`http://127.0.0.1:8000/api/monitorings/${id}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          this.mainData = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });

      axios
        .get(`http://127.0.0.1:8000/api/notpresents/${id}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          this.mainData = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    closeDetail() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background: #fff;
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1rem;
}

.form-control-static {
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ced4da;
}
</style>