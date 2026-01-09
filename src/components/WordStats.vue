<script setup lang="ts">
    const props = defineProps(['totalAnswers', 'rightAnswers'])
</script>

<template>
    <p>{{ rightAnswers }}/{{ totalAnswers }}</p>
</template>

<style lang="css" scoped>

</style>