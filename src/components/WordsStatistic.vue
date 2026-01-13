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
            <va-list-item-section>
                <va-list-item-label>Всего слов</va-list-item-label>
                
            </va-list-item-section>
            <va-list-item-section icon>{{ totalCount }}</va-list-item-section>
        </va-list-item>
        <va-list-item>
            <va-list-item-section>
                <va-list-item-label>Правильно</va-list-item-label>
            </va-list-item-section>
            <va-list-item-section icon>{{ successCount }}</va-list-item-section>
        </va-list-item>
        <va-list-item>
            <va-list-item-section>
                <va-list-item-label>Ошибок</va-list-item-label>
            </va-list-item-section>
            <va-list-item-section icon>{{ wrongCount }}</va-list-item-section>
        </va-list-item>
        <va-list-item>
            <va-list-item-section>
                <va-list-item-label>Процент</va-list-item-label>
            </va-list-item-section>
            <va-list-item-section icon>{{ successPercent }}%</va-list-item-section>
        </va-list-item>
    </va-list>
</template>


<style lang="scss">
    .stat {
        --va-list-item-label-color: "primary"
    }
</style>