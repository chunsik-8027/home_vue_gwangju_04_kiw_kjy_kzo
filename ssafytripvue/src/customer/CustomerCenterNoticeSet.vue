<template>
  <div class="notice-wrapper">
    <CustomerCenterCheckPoint />
    <CustomerCenterAlarm />
    <CustomerCenterFAQ />
  </div>
</template>

<script setup>
import CustomerCenterCheckPoint from './CustomerCenterCheckPoint.vue'
import CustomerCenterAlarm from './CustomerCenterAlarm.vue'
import CustomerCenterFAQ from './CustomerCenterFAQ.vue'
</script>

<style scoped>
.notice-wrapper {
  width: 100%;
}
</style>
