<template>
  <div class="pagination">
    <button
      v-for="(page, index) in pageLinks"
      :key="index"
      :class="['pagination-btn', { active: page.active }]"
      @click="changePage(page.url)"
    >
      <span v-html="page.label"></span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    links: Array,
  },
  computed: {
    pageLinks() {
      return this.links && Array.isArray(this.links)
        ? this.links.map((link) => ({
            label: link.label,
            url: link.url,
            active: link.active,
          }))
        : [];
    },
    hasPreviousPage() {
      return this.pageLinks && this.pageLinks.length > 0;
    },
    hasNextPage() {
      return this.links.meta.current_page < this.links.meta.last_page;
    },
  },
  methods: {
    changePage(url) {
      this.$emit("change-page", url);
    },
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  gap: 5px;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 8px 12px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  color: #6c757d;
  transition: all 0.2s ease;
}

.pagination-btn:hover {
  background-color: #e9ecef;
}

.pagination-btn.active {
  background-color: #0d6efd;
  color: white;
  font-weight: bold;
}

.pagination-btn:disabled {
  background-color: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
}
</style>
