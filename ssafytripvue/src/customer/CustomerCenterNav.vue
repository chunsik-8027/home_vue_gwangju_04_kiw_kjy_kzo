<template>
  <aside class="sidebar">
    <ul>
      <li v-for="item in menuItems" :key="item.key" :class="{ active: selected === item.key }"
        @click="selectMenu(item.key)">
        {{ item.label }}
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['menu-change'])

const menuItems = [
  { key: 'notice', label: '공지사항 및 FAQ' },
  { key: 'apply', label: 'QnA' },
  { key: 'question', label: '질문하기' },
]

const selected = ref('notice')

const selectMenu = (key) => {
  selected.value = key
  emit('menu-change', key)
}
</script>

<style scoped>
.sidebar {
  margin-top: 4%;
  width: 200px;
  border: none;
  background-color: #f7fcfe;
  border-radius: 16px;
  box-shadow: 0 1px 6px 0 rgba(105, 209, 244, 0.08);
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 16px 18px;
  cursor: pointer;
  border-bottom: none;
  color: #222;
  font-weight: 500;
  background: transparent;
  transition:
    background 0.16s,
    color 0.16s;
  border-radius: 10px;
  margin: 2px 8px;
}

.sidebar li.active,
.sidebar li:hover {
  background-color: #69d1f4;
  color: #fff;
  font-weight: 700;
}
</style>
