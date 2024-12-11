<template>
  <div class="modal-overlay" @click.self="closeDetail">
    <div class="modal-container" ref="modalContainer">
      <div
        class="modal-header bg-primary text-white d-flex justify-content-between p-3"
      >
        <h5 class="modal-title">Detail Monitoring</h5>
        <button class="btn close text-white border-0" @click="closeDetail">
          &times;
        </button>
      </div>
      <div class="modal-body p-3">
        <div v-if="isLoading">
          <p class="text-muted">Loading...</p>
        </div>
        <div v-if="!isLoading && mainData">
          <div class="mb-3">
            <label class="form-label">Judul :</label>
            <p class="form-control-static">{{ mainData.title }}</p>
          </div>
          <div class="mb-3">
            <label class="form-label">Gambar :</label>
            <div v-if="mainData.image === null">
              <p class="text-muted">Tidak ada gambar untuk monitoring ini.</p>
            </div>
            <img
              v-else
              :src="'http://127.0.0.1:8000/storage/images/' + mainData.image"
              class="img-thumbnail"
              :alt="mainData.title"
            />
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
        <div v-if="!isLoading && detailData.length > 0">
          <label class="form-label">Murid Tidak Masuk:</label>
          <ul>
            <li v-for="(detail, index) in detailData" :key="index">
              {{ detail.student.name }} - {{ detail.keterangan }}
            </li>
          </ul>
        </div>
        <div v-else-if="!isLoading">
          <p class="text-muted">Tidak ada detail murid untuk monitoring ini.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import gsap from "gsap";

export default {
  name: "DetailModal",
  props: ["detailMonitoring"],
  data() {
    return {
      mainData: null,
      detailData: [],
      isLoading: true,
    };
  },
  mounted() {
    this.getDetailData(this.detailMonitoring);
    this.animateModalIn();
  },
  methods: {
    getDetailData(id) {
      const token = "Bearer " + localStorage.getItem("token");
      const headers = { Authorization: token };

      this.isLoading = true;
      Promise.all([
        axios.get(`http://127.0.0.1:8000/api/monitorings/${id}`, { headers }),
        axios.get(`http://127.0.0.1:8000/api/notpresents/${id}`, { headers }),
      ])
        .then(([mainResponse, detailResponse]) => {
          this.mainData = mainResponse.data.data;
          this.detailData = detailResponse.data.data;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    animateModalIn() {
      gsap.from(this.$refs.modalContainer, {
        duration: 0.5,
        scale: 0,
        opacity: 0,
        ease: "back.out(1.7)",
      });
    },
    animateModalOut() {
      gsap.to(this.$refs.modalContainer, {
        duration: 0.5,
        scale: 0,
        opacity: 0,
        ease: "back.in(1.7)",
        onComplete: () => {
          this.$emit("close");
        },
      });
    },
    closeDetail() {
      this.animateModalOut();
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
  height: 105vh;
  padding-bottom: 1rem;
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
  overflow: auto;
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

.img-thumbnail {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
  border: 1px solid #ced4da;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .modal-overlay {
    height: 970px;
    padding-bottom: 20rem;
  }
  .modal-container {
    width: 90%;
    height: 60%;
  }
}
</style>
