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
        <div class="mb-3">
          <label for="judul" class="form-label">Judul :</label>
          <p class="form-control-static">{{ mainData.title }}</p>
        </div>
        <div class="mb-3">
          <label for="deskripsi" class="form-label">Deskripsi :</label>
          <p class="form-control-static">{{ mainData.description }}</p>
        </div>
        <div class="mb-3">
          <label for="tanggal" class="form-label">Tanggal :</label>
          <p class="form-control-static">{{ mainData.date }}</p>
        </div>
        <div class="mb-3">
          <label for="jam-mulai" class="form-label">Jam Mulai :</label>
          <p class="form-control-static">{{ mainData.start_time }}</p>
        </div>
        <div class="mb-3">
          <label for="jam-selesai" class="form-label">Jam Selesai :</label>
          <p class="form-control-static">{{ mainData.end_time }}</p>
        </div>
        <div class="mb-3">
          <label for="keterangan" class="form-label">Keterangan :</label>
          <p class="form-control-static">{{ detailData.keterangan }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DetailModal",
  props: ["mainData", "detailData"],
  mounted() {
    const token = "Bearer " + localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/api/monitorings/" + this.mainData.id, {
        headers: {
          Authorization: token,
        },
      })
      .then(() => {
        this.$emit("getMain", this.mainData);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("http://127.0.0.1:8000/api/notpresents/" + this.detailData.id, {
        headers: {
          Authorization: token,
        },
      })
      .then(() => {
        this.$emit("getDetail", this.detailData);
      })
      .catch((error) => {
        console.log(error);
      });
    this.closeDetail();
  },
  methods: {
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
