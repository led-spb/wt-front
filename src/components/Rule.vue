<script setup lang="ts">
    import { marked } from 'marked';
    import { computed } from 'vue';

    const props = defineProps({
        value: { type: Object, default: {}},
    })

    const formatted = computed(() => {
        return marked.parse(props.value?.description)
    })
</script>

<template>
     <div v-html="formatted"/>
</template>

<style>
    ul {
        list-style: inside;
    }
</style>