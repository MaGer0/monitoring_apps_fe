<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container" ref="modalContainer">
      <div
        class="modal-header bg-primary text-white d-flex justify-content-between p-3"
      >
        <h5 class="modal-title">Create Monitoring</h5>
        <button class="close btn text-white border-0" @click="closeModal">
          &times;
        </button>
      </div>
      <form v-on:submit.prevent>
        <div class="modal-body p-3">
          <div class="mb-3">
            <label for="judul" class="form-label">Judul :</label>
            <input
              type="text"
              id="judul"
              class="form-control"
              v-model="mainData.title"
              placeholder="Masukkan Judul"
            />
          </div>
          <div class="mb-3">
            <label for="deskripsi" class="form-label">Deskripsi :</label>
            <textarea
              id="deskripsi"
              class="form-control"
              v-model="mainData.description"
              rows="4"
              placeholder="Masukkan Deskripsi"
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="tanggal" class="form-label">Tanggal :</label>
            <input
              type="date"
              id="tanggal"
              class="form-control"
              v-model="mainData.date"
            />
          </div>
          <div class="mb-3 d-flex flex-column">
            <label for="jam-mulai">Jam Mulai :</label>
            <input
              type="time"
              name="jam-mulai"
              id="jamMulai"
              v-model="mainData.start_time"
              class="input-time"
            />
          </div>
          <div class="mb-3 d-flex flex-column">
            <label for="jam-selesai">Jam Selesai :</label>
            <input
              type="time"
              name="jam-selesai"
              id="jamSelesai"
              v-model="mainData.end_time"
              class="input-time"
            />
          </div>
          <div class="mb-3">
            <label for="detail" class="form-label">Keterangan Murid :</label>
            <treeselect
              :options="options"
              :clearable="true"
              :searchable="true"
              :multiple="true"
              :value="value"
              v-model="detailDataModel"
              class="treeselect"
            >
              <template #value-label="{ node }">
                <div>{{ node.raw.customLabel }}</div>
              </template>
            </treeselect>
          </div>
          <div class="modal-footer d-flex justify-content-end gap-2">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cancelModal"
            >
              <i class="bi bi-x"></i> Cancel
            </button>
            <button type="submit" class="btn btn-primary" @click="submitForm">
              <i class="bi bi-send"></i> Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { gsap } from "gsap";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";

export default {
  name: "CreateModals",
  components: {
    Treeselect,
  },
  data() {
    return {
      value: null,
      options: [],
      detailData: [],
      detailDataModel: null,
      mainData: {},
    };
  },
  mounted() {
    this.animateModalIn();
    this.getDetailMonitoring();
  },
  methods: {
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
    closeModal() {
      this.animateModalOut();
    },
    submitForm() {
      const token = "Bearer " + localStorage.getItem("token");
      this.detailData = this.detailDataModel.map((item) => {
        const [students_nisn, keterangan] = item.split(" ");
        return { students_nisn, keterangan };
      });

      axios
        .post("http://127.0.0.1:8000/api/monitorings", this.mainData, {
          headers: {
            Authorization: token,
            Accept: "application/json",
          },
        })
        .then((response) => {
          const monitoringId = response.data.data.id;

          axios.post(
            "http://127.0.0.1:8000/api/notpresents/" + monitoringId,
            this.detailData,
            {
              headers: {
                Authorization: token,
                Accept: "application/json",
              },
            }
          );
        })
        .then(() => {
          this.$emit("submit");
        })
        .catch((error) => {
          console.log(error.response.data);
        });
      this.closeModal();
    },
    cancelModal() {
      this.closeModal();
    },
    getDetailMonitoring() {
      const token = "Bearer " + localStorage.getItem("token");
      axios
        .get("http://127.0.0.1:8000/api/students", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          this.options = response.data.data.map((student) => ({
            id: student.nisn,
            label: student.name,
            children: [
              {
                id: student.nisn + " Sakit",
                label: `Sakit`,
                customLabel: `${student.name} - Sakit`,
              },
              {
                id: student.nisn + " Izin",
                label: "Izin",
                customLabel: `${student.name} - Izin`,
              },
              {
                id: student.nisn + " Alpha",
                label: "Alpha",
                customLabel: `${student.name} - Alpha`,
              },
            ],
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>
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

.close {
  font-size: 1.5rem;
  cursor: pointer;
  background: none;
  border: none;
  color: #fff;
}

.close:hover {
  transition: 0.3s;
  transform: scale(1.1);
}

.form-control {
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.25);
}

.input-time {
  border-radius: 0.4rem;
  padding: 0.4em;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.25);
  border: none;
}

.input-time:focus {
  outline: none;
}
</style>
