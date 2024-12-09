<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container" ref="modalContainer">
      <div
        class="modal-header bg-primary text-white d-flex justify-content-between p-3"
      >
        <h5 class="modal-title">Edit Monitoring</h5>
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
            />
            <div v-if="isSubmit">
              <div v-if="!mainData.title">
                <p class="text-danger">Judul Wajib Diisi!</p>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="image" class="form-label">Image :</label>
            <br />
            <input
              v-show="!mainData.image"
              type="file"
              ref="fileInput"
              class="form-control"
              @change="setImage"
              id="image"
            />
            <div v-if="mainData.image" class="d-flex flex-column">
              <img
                :src="
                  image
                    ? image
                    : 'http://127.0.0.1:8000/storage/images/' + mainData.image
                "
                :alt="'http://127.0.0.1:8000/storage/images/' + mainData.image"
                class="img-fluid mt-3"
              />
              <button
                @click="removeImage"
                class="btn btn-danger text-light mt-2"
              >
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
          <div class="mb-3">
            <label for="deskripsi" class="form-label">Deskripsi :</label>
            <textarea
              id="deskripsi"
              class="form-control"
              v-model="mainData.description"
              rows="4"
            ></textarea>
            <div v-if="isSubmit">
              <div v-if="!mainData.description">
                <p class="text-danger">Deskripsi Wajib Diisi!</p>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="tanggal" class="form-label">Tanggal :</label>
            <input
              type="date"
              id="tanggal"
              class="form-control"
              v-model="mainData.date"
            />
            <div v-if="isSubmit">
              <div v-if="!mainData.date">
                <p class="text-danger">Tanggal Wajib Diisi!</p>
              </div>
            </div>
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
            <div v-if="isSubmit">
              <div v-if="!mainData.start_time">
                <p class="text-danger">Jam Mulai Wajib Diisi!</p>
              </div>
            </div>
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
            <div v-if="isSubmit">
              <div v-if="!mainData.end_time">
                <p class="text-danger">Jam Selesai Wajib Diisi!</p>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="detail" class="form-label">Keterangan Murid :</label>
            <treeselect
              :options="options"
              :clearable="true"
              :searchable="true"
              :multiple="true"
              :value="value"
              v-model="mainData.detailDataModel"
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
            <button
              type="submit"
              class="btn btn-primary"
              @click="submitForm(mainData.id)"
            >
              <i class="bi bi-save"></i> Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
import axios from "axios";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";
import Swal from "sweetalert2";
export default {
  name: "EditModal",
  props: ["detailMonitoring"],
  components: { Treeselect },
  data() {
    return {
      mainData: {},
      detailData: [],
      isSubmit: false,
      detailDataModel: [],
      options: [],
      value: [],
      image: null,
      monitoring: {},
    };
  },
  methods: {
    closeModal() {
      this.animateModalOut();
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
    setImage(e) {
      let file = e.target.files[0];
      console.log(file);
      if (file) {
        console.log("jojojo");
        const reader = new FileReader();
        // reader.onload = () => {
        //   this.mainData.image = reader.result;
        console.log(e.target.files[0]);
        this.image = URL.createObjectURL(e.target.files[0]);
        console.log(image);
        // };
      }
    },

    removeImage() {
      this.mainData.image = null;
      this.$refs.fileInput.value = null;
    },
    getMonitoringData(id) {
      const token = "Bearer " + localStorage.getItem("token");
      const headers = { Authorization: token };
      console.log(id);

      Promise.all([
        axios.get(`http://127.0.0.1:8000/api/monitorings/${id}`, { headers }),
        axios.get(`http://127.0.0.1:8000/api/notpresents/${id}`, { headers }),
      ])
        .then(([mainResponse, detailResponse]) => {
          this.mainData = mainResponse.data.data;
          this.detailData = detailResponse.data.data;

          this.mainData.detailDataModel = this.detailData.map((item) => {
            return item.students_nisn + " " + item.keterangan;
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    submitForm(id) {
      console.log(id);
      this.isSubmit = true;
      const token = "Bearer " + localStorage.getItem("token");

      this.detailData = this.detailDataModel.map((item) => {
        const [students_nisn, keterangan] = item.split(" ");
        return { students_nisn, keterangan };
      });

      const dataForSubmit = new FormData();
      dataForSubmit.append("_method", "PUT");
      dataForSubmit.append("image", this.$refs.fileInput.files[0]);

      this.monitoring.title = this.mainData.title;
      this.monitoring.description = this.mainData.description;
      this.monitoring.date = this.mainData.date;
      this.monitoring.start_time = this.mainData.start_time.substring(0, 5);
      this.monitoring.end_time = this.mainData.end_time.substring(0, 5);
      axios
        .put(`http://127.0.0.1:8000/api/monitorings/${id}`, this.monitoring, {
          headers: {
            Authorization: token,
            Accept: "application/json",
          },
        })
        .then((response) => {
          axios.post(
            `http://127.0.0.1:8000/api/monitorings/${id}/image`,
            dataForSubmit,
            {
              headers: {
                Authorization: token,
                Accept: "application/json",
              },
            }
          );
          console.log(response.data.data.id);

          const monitoringsId = response.data.data.id;
          axios
            .put(
              `http://127.0.0.1:8000/api/notpresents/${monitoringsId}`,
              this.detailData,
              {
                headers: {
                  Authorization: token,
                  Accept: "application/json",
                },
              }
            )
            .then(() => {
              setTimeout(() => {
                this.$emit("update");
              }, 150);
              Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data Monitoring Berhasil Di Ubah!",
                timer: 1000,
                showConfirmButton: false,
              });
              this.closeModal();
              this.isSubmit = false;
            });
        })
        .catch((error) => {
          console.log(error);
        });
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
  mounted() {
    this.animateModalIn();
    this.getMonitoringData(this.detailMonitoring);
    this.getDetailMonitoring();
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
  height: 600px;
  border-radius: 8px;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.modal-header {
  font-weight: bold;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
}
</style>
