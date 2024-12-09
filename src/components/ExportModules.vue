<template>
  <div v-if="isVisible" class="export-overlay" ref="overlay" @click.self="closeModal">
    <div class="export-modal" ref="modal">
      <div class="export-header">
        <h3 class="modal-title">Export Data</h3>
        <button class="close-modal btn" @click="closeModal">
          <i class="bi bi-x-circle"></i>
        </button>
      </div>
      <div class="modal-description">
        <p>Pilih Format Export :</p>
      </div>
      <div class="export-buttons">
        <button @click="exportFile('pdf')" class="btn btn-pdf">
          <i class="bi bi-filetype-pdf"></i> Export as PDF
        </button>
        <button @click="exportFile('excel')" class="btn btn-excel">
          <i class="bi bi-file-earmark-spreadsheet"></i> Export as Excel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { gsap } from "gsap";
import Swal from "sweetalert2";

export default {
  name: "ExportModules",
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    exportFile(type) {
      const token = "Bearer " + localStorage.getItem("token");
      axios
      .get(`http://127.0.0.1:8000/api/export/${type}`, {
          headers: {
            Authorization: token
          },
          responseType: 'blob'
      })
      .then((response) => {
          const fileName = `Monitorings.${type === 'excel' ? 'xlsx' : 'pdf'}`;
          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();

          Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: `Data Berhasil di Export ke ${type === 'excel' ? 'Excel' : 'PDF'}`,
            showConfirmButton: false,
            timer: 1500
          })
      })
      .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: `Data Gagal di Export ke ${type === 'excel' ? 'Excel' : 'PDF'}`,
            showConfirmButton: false,
            timer: 1000
          })
      })
      this.closeModal();
    },
    closeModal() {
      const timeline = gsap.timeline({
        onComplete: () => {
          this.isVisible = false;
        },
      });
      timeline
        .to(this.$refs.modal, { scale: 0.5, opacity: 0, duration: 0.3 })
        .to(this.$refs.overlay, { opacity: 0, duration: 0.3 }, "-=0.3");
    },
    openModal() {
      this.isVisible = true;

      this.$nextTick(() => {
        const timeline = gsap.timeline();
        timeline
          .fromTo(
            this.$refs.overlay,
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
          )
          .fromTo(
            this.$refs.modal,
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
          );
      });
    },
  },
};
</script>

<style scoped>
.export-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.export-modal {
  background: white;
  padding: 30px 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.export-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.modal-description {
  font-size: 1rem;
  color: #555;
  margin-bottom: 20px;
}

.close-modal {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-modal:hover {
  color: #333;
}

.export-buttons .btn {
  margin: 10px;
  padding: 10px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.export-buttons .btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-pdf {
  background: rgb(201, 62, 62);
}

.btn-pdf:hover {
  background: rgb(138, 37, 37);
}

.btn-excel {
  background: rgb(11, 177, 55);
}

.btn-excel:hover {
  background: rgb(8, 128, 37);
}
</style>
