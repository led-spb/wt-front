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
        {type: Object, default: {count: 20, errors: 50, level: 10, tags: Array<any>}}
    );
    const showRules = ref(false);

    const props = defineProps({
        title: { type: String, default: "" },
        tags: { type: Array<any>, default: []},
        rules: { type: Array<any>, default: []},
    })

    const emit = defineEmits(['complete', 'next', 'start', 'report']);

    const inProcess = computed(() => typeof word.value?.result == 'undefined');
    const isSuccess = computed(() => word.value && word.value.result);

    watch( isSuccess, (newValue, oldValue) => {
        if( typeof newValue == 'undefined')
            showRules.value = false;

        if( typeof oldValue == "undefined" && (typeof newValue !== 'undefined') ){
            if( newValue && !showRules.value ) statistics.value.success++;
            else statistics.value.failed++;

            emit('complete', newValue && !showRules.value);
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
                <div class="va-text-block" v-for="rule, index in props.rules" v-if="(!inProcess && !isSuccess) || showRules">
                    <va-divider v-if="index > 0"/>
                    <p v-for="paragraph in rule.description.split('\n')" >{{ paragraph }}</p>
                </div>
                <va-divider/>
                <div class="row">
                    <va-button preset="secondary" @click="showRules = true" :disabled="!props.rules || props.rules.length == 0 || showRules">Правило</va-button>
                    <va-spacer/>
                    <va-button :disabled="inProcess" class="primary" icon-right="arrow_forward" v-on:click="emit('next')">Дальше</va-button>
                    <va-spacer/>
                    <va-button-dropdown preset="secondary">
                        <va-menu-list>
                            <va-menu-item @selected="emit('report')">Сообщить об ошибке</va-menu-item>
                        </va-menu-list>
                    </va-button-dropdown>
                </div>
            </template>
            <template v-else>
                <va-form>
                    <va-slider label="Уровень" pins track-label-visible :min="1" :max="10" v-model="task.level"></va-slider>
                    <div class="row" style="min-height: 2vh;"></div>
                    <va-select label="Темы" multiple 
                        :options="props.tags" 
                        text-by="desciption" 
                        value-by="id" 
                        v-model="task.tags" 
                        :max-visible-options="1" 
                        style="display: flex"/>
                    <div class="row" style="min-height: 2vh;"></div>
                    <va-slider label="Количество слов" pins track-label-visible :min="20" :max="50" :step="10" v-model="task.count"></va-slider>
                    <div class="row" style="min-height: 2vh;"></div>
                    <va-slider label="РНО %" pins track-label-visible :min="0" :max="100" :step="10" v-model="task.errors"></va-slider>
                    <div class="row" style="min-height: 2vh;"></div>
                </va-form>
                <va-divider/>
                <div class="row">
                    <va-spacer/>
                    <va-button class="primary" icon-right="arrow_forward" v-on:click="emit('start')">Начать</va-button>
                    <va-spacer/>
                </div>
            </template>

        </va-card-content>
    </va-card>
</template>
