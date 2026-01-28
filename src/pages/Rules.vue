<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { onMounted } from 'vue';
    import { rulesApi } from '@/api/rules';

    const paging = ref({
        page: 0,
        pages: 0,
        items: Array(),
    });
    const searchString = ref()
    const rules = ref(Array())

    // onMounted(() => loadRuleList() )

    function loadRuleList(title: string|null = null, page :number = 1){
        rulesApi.getRules(title, page).then( (data) => {
            paging.value.page = data.page
            paging.value.pages = data.pages
            paging.value.items = data.items
        })
    }

    const currentPage = computed({
        get(){
            return paging.value.page
        },
        set(value){
            loadRuleList(searchString.value, value)
        },
    })

    async function loadRules() {
        console.log("load next rule")
        const data = await rulesApi.getRules()
        // rules.value.push()
    }
</script>

<template>
    <va-card class="item"> 
        <va-card-title><va-icon name="rule" class="card-icon"/>Правила</va-card-title>
        <va-card-content>
            <!-- <va-input class="row" label="Поиск" inner-label v-model="searchString" @change="loadRuleList(searchString)"></va-input> -->
            <va-divider/>

            <!-- <va-pagination size="small" v-model="currentPage" gapped :pages="paging.pages" v-if="paging.pages > 1" style="margin-bottom: 10px"/>
            <va-list>
                <va-list-item v-for="(rule, index) in paging.items" :key="index"  class="list__item">
                    <va-list-item-section>
                        <va-list-item-label caption>{{ rule.title }}</va-list-item-label>
                    </va-list-item-section>
                </va-list-item> 
            </va-list> -->
        </va-card-content>                 
    </va-card>

    <va-infinite-scroll :load="loadRules">
        <va-card class="item" v-for="rule in rules">
            <va-card-title>{{ rule.title }}</va-card-title>
        </va-card> 
    </va-infinite-scroll>

</template>

<style scoped>
    .list__item {
        padding-bottom: 20px;
        padding-left: 6px;
        border-left: 4px solid green;
    }
</style>