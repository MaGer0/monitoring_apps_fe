<template>
  <div class="content-container container">
    <button @click="scrollToTop" class="btn button-up">
      <i class="bi bi-arrow-up"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: "BackToTop",
  methods: {
    scrollToTop() {
        console.log("event dikirim");
        this.$emit("scroll")
    },
  },
};
</script>

<style scoped>
.content-container {
  position: fixed;
  top: 91.9%;
  left: 85%;
  z-index: 9999;
}

.button-up {
  border: 1px solid rgb(101, 166, 215);
  border-radius: 0.5rem;
  padding: 0.3rem 2%;
  width: 40px;
  background-color: transparent;
  color: rgb(101, 166, 215);
  transition: all 0.3s ease;
}

.button-up:hover {
  background-color: rgb(67, 137, 235);
  color: white;
}
</style>
