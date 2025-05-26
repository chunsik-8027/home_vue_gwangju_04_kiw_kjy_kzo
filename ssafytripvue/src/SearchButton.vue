<template>
  <div class="Search">
    <input placeholder="검색" class="search" v-model="searchText" />
    <button @click="onSearchClick" class="SearchButton">
      <img src="@/assets/img/searchIcon.png" alt="검색" class="ReadingGlass" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['search'])  // 부모에게 search 이벤트 전달

const searchText = ref('')

function onSearchClick() {
  emit('search', searchText.value)
}
</script>

<style scoped>
.Search {
  display: flex;
  align-items: center;
  width: 435px;
  height: 40px;
  padding: 5px 0px 5px 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
}

.search {
  height: 45px;
  width: 100%;
  border: none;
  font-size: 20px;
  outline: none;
}

.ReadingGlass {
  width: 35px;
  height: 35px;
}

.SearchButton {
  border: none;
  background-color: white;
}
</style>
