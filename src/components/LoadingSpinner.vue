<template>
  <div class="loading-spinner d-flex justify-content-center align-items-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingSpinner",
};
</script>

<style scoped>
.loading-spinner {
  height: 100%;
}
</style>
