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
        <form @submit.prevent="submitForm">
          <div class="modal-body p-3">
            <div class="mb-3">
              <label for="judul" class="form-label">Judul :</label>
              <input
                type="text"
                id="judul"
                class="form-control"
                v-model="modals.title"
                placeholder="Masukkan Judul"
              />
            </div>
            <div class="mb-3">
              <label for="deskripsi" class="form-label">Deskripsi :</label>
              <textarea
                id="deskripsi"
                class="form-control"
                v-model="modals.description"
                rows="4"
                placeholder="Masukkan Deskripsi"
              ></textarea>
            </div>
            <div class="mb-3 d-flex flex-column">
              <label for="jam-mulai">Jam Mulai :</label>
              <input
                type="range"
                name="jam-mulai"
                id="jamMulai"
                min="0"
                max="23"
                v-model="modals.start"
              />
              <span>{{ modals.start }}:00</span>
            </div>
            <div class="mb-3 d-flex flex-column">
              <label for="jam-selesai">Jam Selesai :</label>
              <input
                type="range"
                name="jam-selesai"
                id="jamSelesai"
                min="0"
                max="23"
                v-model="modals.end"
              />
              <span>{{ modals.end }}:00</span>
            </div>
            <div class="modal-footer d-flex justify-content-end gap-2">
              <button
                type="button"
                class="btn btn-secondary"
                @click="cancelModal"
              >
                <i class="bi bi-x"></i> Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-send"></i> Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { gsap } from "gsap";
  
  export default {
    name: "CreateModals",
    props: ["modals"],
    mounted() {
      this.animateModalIn();
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
        this.$emit("submit", this.modals);
        this.closeModal();
      },
      cancelModal() {
        this.closeModal();
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
  </style>