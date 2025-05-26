<template>
    <div class="modal-backdrop" @click.self="emit('close')">
        <div class="modal-content">
            <img :src="place.img" alt="place image" />
            <h3>{{ place.name }}</h3>
            <span>{{ place.overview }}</span>



            <button class="close-button" @click="emit('close')">닫기</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ place: Object })
const emit = defineEmits(['close'])
const liked = ref(false)
function toggleLike() {
    liked.value = !liked.value
}
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    max-width: 600px;
    width: 90%;
    text-align: center;
    position: relative;
}

.modal-content img {
    width: 100%;
    height: auto;
    border-radius: 6px;
    margin-bottom: 1rem;
}

.like-button {
    background: white;
    border: none;
    font-size: 1.5rem;
    color: #e53935;
    cursor: pointer;
    margin-bottom: 1rem;
}

.close-button {
    background: #ccc;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
}
</style>
