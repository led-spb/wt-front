+<script setup lang="ts">
    import { computed } from 'vue';

    const props = defineProps({
        value: { type: Object }
    })

    const letters = computed(() => {
        return props.value?.fullword.split('')
    })

    function letterClass(index :Number): String{
        if( props.value?.accents.includes(index) )
            return "accent"

        for( var spelling of props.value?.spellings )
            if( index >= spelling.position && index < spelling.position+spelling.length )
                return "spelling"

        return ""
    }

</script>

<template>
    <span :class='letterClass(Number(index))'  v-for="(letter, index) in letters">{{ letter }}</span>
</template>

<style scoped>
    .accent {
        text-decoration: underline #14a76c 3px;
    }
    .accent::after{
        content: "\301";
        color: #14a76c;
    }

    .spelling {
        text-decoration: underline #14a76c 3px;
    }

</style>