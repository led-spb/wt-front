<script setup lang="ts">
    import { ref, computed, watch } from 'vue';
    import WordsStatistic from '@/components/WordsStatistic.vue';

    const word = defineModel('word', {
        type: Object,
    })
    const statistics = defineModel( 'statistics',
        {type: Object, default: {success: 0, failed: 0}}
    );
    const task = defineModel('task', 
        {type: Object, default: {count: 20, errors: 50, level: 10}}
    );

    const props = defineProps({
        title: { type: String }
    })

    const emit = defineEmits(['complete', 'next', 'start']);

    const inProcess = computed(() => typeof word.value?.result == 'undefined');
    const isSuccess = computed(() => word.value && word.value.result);

    watch( isSuccess, (newValue, oldValue) => {
        if( typeof oldValue == "undefined" && (typeof newValue !== 'undefined') ){
            if( newValue ) statistics.value.success++;
            else statistics.value.failed++;
            emit('complete', newValue);
        }
    })

</script>

<template>
    <va-card stripe :stripe-color=' inProcess ? "secondary" : isSuccess ? "success":"danger"'>
        <va-card-title><va-icon name="spellcheck" class="card-icon"/>{{ props.title }}</va-card-title>
        <va-card-content>
            
            <template v-if="!word && (statistics.success+statistics.failed)" >
                <words-statistic v-model="statistics"/>
                <va-divider/>
            </template>
            <div class="row" style="min-height: 1vh;"></div>

            <template v-if="!!word">
                <div class="row justify-center">
                    <slot></slot>
                </div>

                <div class="row" style="min-height: 1vh;"></div>
                <div class="va-text-block" v-if="!!word?.context">
                    <span>{{ word?.context }}</span>
                </div>
                <va-divider/>
                <div class="row justify-center">
                    <va-button :disabled="inProcess" class="primary" icon-right="arrow_forward" v-on:click="emit('next')">Дальше</va-button>
                </div>
            </template>
            <template v-else>
                <va-form>
                    <va-slider label="Уровень" pins track-label-visible :min="1" :max="10" v-model="task.level"></va-slider>
                    <div class="row" style="min-height: 2vh;"></div>
                    <va-slider label="Количество слов" pins track-label-visible :min="20" :max="50" :step="10" v-model="task.count"></va-slider>
                    <div class="row" style="min-height: 2vh;"></div>
                    <va-slider label="РНО %" pins track-label-visible :min="0" :max="100" :step="10" v-model="task.errors"></va-slider>
                    <div class="row" style="min-height: 2vh;"></div>
                </va-form>
                <va-divider/>
                <div class="row justify-center">
                    <va-button class="primary" icon-right="arrow_forward" v-on:click="emit('start')">Начать</va-button>
                </div>                    
            </template>

        </va-card-content>
    </va-card>
</template>
