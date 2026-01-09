<script setup lang="ts">
    import { computed } from 'vue';

    const model = defineModel({type: Object});
    const emit = defineEmits(['onRight', 'onWrong']);

    const letters = computed(() => {
        const word_letters = model.value.fullword.split('').map(
            (letter: any) => {
                 return {'selected': letter}
            }
        )
        const wordParts = [...model.value.spellings]
        wordParts.sort(
            (a, b) => {return b.position - a.position}
        )

        wordParts.forEach(element => {
            return word_letters.splice(element.position, element.length, element);
        });
        return word_letters;
    });

    const isDone = computed(() =>{
        for(const part of model.value.spellings)
            if( part.selected === undefined )
                return false
        return true
    })

    function mapSpecialChars(value: string): string{
        const replaced = value.replace('_',' ').replace(' ',' ')
        return replaced == '' ? '_' : replaced
    }

    function selectVariant(item: any, variant: string){
        item.selected = prepareVariant(variant)

        if( isDone.value ){
            if( resultWord() == model.value.fullword )
                emit('onRight')
            else
                emit('onWrong')
        }
    }

    function resultWord(): string|undefined{
        const result = [];
        for (const letter of letters.value) {
            result.push(letter.selected);
        }
        return result.join('')
    }

    function prepareVariant(value: string): string{
        return value.replace(' ','').replace('_',' ')
    }

    function getLetterStyle(letter: any): string|void{
        if( isDone.value && letter.variants){
            const rightPart = model.value.fullword.slice( letter.position, letter.position+letter.length )
            return letter.selected === rightPart ? "right" : "wrong"
        }
    }

</script>


<template>
    <div class="word-block">
        <template v-for="item in letters">
            <template v-if="item.selected !== undefined">
                <h2 class="letter" 
                    v-bind:class="getLetterStyle(item)" 
                    v-for="letter in item.selected">{{ mapSpecialChars(letter) }}</h2>
            </template>
            <template v-else>
                <div class="variant" 
                    v-for="(variant, index) in item.variants" 
                    v-bind:class="index == item.variants.length-1 ? 'margin':''"
                    v-on:click="selectVariant(item, variant)">{{ mapSpecialChars(prepareVariant(variant)) }}</div>
            </template>
        </template>
    </div>
</template>


<style scoped>
    .word-block {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .letter {
        padding: 0 2px;
        font-size: 40px;
        transform: padding .25s;
    }
    .margin {
        margin-right: 5px;
    }
    .variant {
        padding: 0 2px;
        font-size: 35px;
        cursor: pointer;
        border: 1px solid;
        border-radius: 5px;
        transform: translateY(-25px);
    }
    .right {
        color: #14a76c;
    }
    .wrong {
        color: tomato;
    }
</style>