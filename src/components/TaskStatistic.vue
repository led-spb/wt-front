<script setup lang="ts">
    import { computed } from 'vue';

    const model = defineModel(
        {type: Object}
    );

    const totalCount = computed(()=>{
        if( model.value ) return model.value.success + model.value.failed
    })
    const successCount = computed(()=>{
        if( model.value ) return model.value.success
    })
    const wrongCount = computed(()=>{
        if( model.value ) return model.value.failed
    })
    const successPercent = computed(()=>{
        if( totalCount.value ) return Math.ceil( successCount.value / totalCount.value * 100 )
    })

</script>


<template>
    <va-list class="stat">
        <va-list-item>
            <va-list-item-section>Попыток</va-list-item-section>
            <va-list-item-section icon>{{ totalCount }}</va-list-item-section>
        </va-list-item>
        <va-list-item>
            <va-list-item-section>Правильно</va-list-item-section>
            <va-list-item-section icon>{{ successCount }}</va-list-item-section>
        </va-list-item>
        <va-list-item>
            <va-list-item-section>Ошибок</va-list-item-section>
            <va-list-item-section icon>{{ wrongCount }}</va-list-item-section>
        </va-list-item>
        <va-list-item>
            <va-list-item-section>Процент</va-list-item-section>
            <va-list-item-section icon>{{ successPercent }}%</va-list-item-section>
        </va-list-item>
    </va-list>
</template>

