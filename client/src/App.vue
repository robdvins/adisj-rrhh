<template>
  <div id="app">
    <!-- <Navbar v-if="show" /> -->
    <router-view />
  </div>
</template>

<script>
// import Navbar from '@/components/Navbar.vue';

export default {
  name: 'App',
  components: {
    // Navbar,
  },
  computed: {
    show() {
      if (this.$route.name !== 'login' && this.$route.name !== 'vote') return true;

      return false;
    },
  },
};
</script>

<style>
html {
  background-color: #f7fafc !important;
}

.h-full {
  height: 100vh;
}

.items-center {
  align-items: center;
}

.flex {
  display: flex;
}

.mt-1 {
  margin-top: 0.25rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mt-3 {
  margin-top: 0.75rem;
}
.mt-4 {
  margin-top: 1rem;
}
.mt-5 {
  margin-top: 1.25rem;
}
.mt-6 {
  margin-top: 1.5rem;
}
.mt-8 {
  margin-top: 2rem;
}
.mt-10 {
  margin-top: 2.5rem;
}

.mr-1 {
  margin-right: 0.25rem;
}
.mr-2 {
  margin-right: 0.5rem;
}
.mr-3 {
  margin-right: 0.75rem;
}
.mr-4 {
  margin-right: 1rem;
}
.mr-5 {
  margin-right: 1.25rem;
}
.mr-6 {
  margin-right: 1.5rem;
}
.mr-8 {
  margin-right: 2rem;
}
.mr-10 {
  margin-right: 2.5rem;
}

.mb-1 {
  margin-bottom: 0.25rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-3 {
  margin-bottom: 0.75rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.mb-5 {
  margin-bottom: 1.25rem;
}
.mb-6 {
  margin-bottom: 1.5rem;
}
.mb-8 {
  margin-bottom: 2rem;
}
.mb-10 {
  margin-bottom: 2.5rem;
}

.ml-1 {
  margin-left: 0.25rem;
}
.ml-2 {
  margin-left: 0.5rem;
}
.ml-3 {
  margin-left: 0.75rem;
}
.ml-4 {
  margin-left: 1rem;
}
.ml-5 {
  margin-left: 1.25rem;
}
.ml-6 {
  margin-left: 1.5rem;
}
.ml-8 {
  margin-left: 2rem;
}
.ml-10 {
  margin-left: 2.5rem;
}

.leading-none {
  line-height: 1;
}
</style>
