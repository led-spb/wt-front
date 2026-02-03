<script setup lang="ts">
    import { computed, watch } from 'vue';
    import type { Word } from '@/api/words';

    const model = defineModel<Word>();
    const emit = defineEmits(['complete']);

    const letters = computed(() => {
        if( !model.value ) return

        const word = model.value?.fullword;
        const result = new Array();
        let position = 0;

        const spellings = [...(model.value.spellings || [])].sort(
            (a: any, b: any) => {return a.position-b.position == 0 ? (a.length-b.length) : (a.position - b.position)}
        )

        for(const [index, spelling] of spellings.entries()){
            const letters = word.substr(position, spelling.position - position)
            position = spelling.position + spelling.length
            if(letters != ""){
                result.push( letters )
            }
            spelling.variants?.sort(() => Math.random()-0.5)
            spelling.index = index
            result.push(spelling)
        }
        if( word.substr(position) != ""){
            result.push(word.substr(position));
        }
        return result;
    });

    const isDone = computed(() =>{
        for(const part of model.value?.spellings || [])
            if( part.selected === undefined )
                return false
        return true
    })

    const isComplete = computed(() => {
        return isDone.value && typeof model.value?.result !== "undefined"
    })

    var timeoutId = -1;
    watch(isDone, (value, oldValue) => {
        if( value ){
            timeoutId = setTimeout(() => { emitCompleteEvent() }, 1000)
        }else{
            clearTimeout(timeoutId)
        }
    })

    const emitCompleteEvent = () => {
        if( model.value && isDone.value ){
            model.value.result = resultWord.value == model.value.fullword
        }
    }

    const resultWord = computed(() => {
        if( !model.value ) return
        const result = [];
        for (const letter of letters.value || []) {
            if( typeof(letter) == 'string' ){
                result.push(letter)
            }else{
                result.push(letter.selected)
            }
        }
        return result.join('')
    })

    const displayVariants = (variants: string[]): string[] => {
        const filtered = variants.filter( (item) => item != "_" && item != "" )
        if( filtered.length != variants.length ){
            return filtered.map( (item) => item+"?" )
        }
        return filtered
    }

    const getSpellingRight = (spelling: any) => {
        if( !model.value ) return
        return model.value.fullword.slice( spelling.position, spelling.position+spelling.length )
    }
    const isSpellingOk = (spelling: any): Boolean => {
        return spelling.selected == getSpellingRight(spelling)
    }

    const mapVariant = (variant: string): string => variant.replace('_','')

    const encodeSpaces = (value: any): any => {
        return value && value.replace(' ',' ')
    }

    const currentSpelling = computed( () => {
        if( !model.value ) return

        return [...(model.value.spellings || [])].sort(
            (a: any, b: any) => {return a.position-b.position == 0 ? (a.length-b.length) : (a.position - b.position)}
        ).find(
            (item: any) => item.selected === undefined
        )
    })
</script>


<template>
    <div>
        <div class="row justify-center">
        <div class="word-block">
            <template v-if="isComplete">
                <template v-for="item in letters">
                    <template v-if="typeof item == 'string'">
                        <h2 class="letter" v-for="s in item">{{ encodeSpaces(s) }}</h2>
                    </template>
                    <template v-else>
                        <div class="spelling spelling-ok" v-if="isSpellingOk(item)">
                            <h2 class="letter letter-right">{{ encodeSpaces(item.selected) }}</h2>
                        </div>
                        <div class="spelling spelling-wrong" v-else>
                            <h2 class="letter letter-wrong" v-if="item.selected">{{ encodeSpaces(item.selected) }}</h2>
                            <h2 class="letter letter-wrong" v-else>{{ encodeSpaces(' ') }}</h2>
                            <h2 class="letter letter-correct">{{ getSpellingRight(item) }}</h2>
                        </div>
                    </template>
                </template>
            </template>

            <template v-else>

                <template v-for="item in letters">
                    <template v-if="typeof item == 'string'">
                        <h2 class="letter" v-for="s in item">{{ encodeSpaces(s) }}</h2>
                    </template>

                    <template v-else>
                        <div v-if='typeof item.selected !== "undefined"'>
                            <h2 class="letter">{{ encodeSpaces(item.selected) }}</h2>
                        </div>
                        <div v-else class="spelling spelling-variant" :class="item.id == currentSpelling?.id ? 'spelling-active' : ''">
                            <h2 class="variant" v-for="variant in displayVariants(item.variants)">{{ variant }}</h2>
                        </div>
                    </template>
                </template>
            </template>
        </div>
        </div>
        <div style="min-height: 1vh;"></div>
        <div class="row justify-space-evenly" v-if="currentSpelling">
            <va-button v-for="variant in currentSpelling.variants" @click="currentSpelling.selected = mapVariant(variant)">{{ variant }}</va-button>
        </div>
    </div>
</template>


<style scoped>
    .word-block {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        user-select: none;
        letter-spacing: 4px;
    }
    .letter {
        font-size: 30px;
        transform: padding .25s;
        line-height: 70px;
    }
    .spelling {
        display: flex;
        font-size: 20px;
    }
    .spelling-variant {
        border-bottom: 2px dashed;
        border-color: var(--va-secondary);
    }
    .spelling-active {
        border-color: var(--va-danger);
    }
    .variant {
        padding: 0px 2px;
        color: var(--va-secondary);
        transform: translateY(25px);
    }
    .even .variant {
        background-color: var(--va-background-border);
    }
    .letter-right {
        color: #14a76c;
    }
    .letter-wrong {
        display: flex;
        position: relative;
    }
    .spelling-wrong {
        background: linear-gradient(to top left, transparent 0%, transparent 45%, red 50%, transparent 55%, transparent 100%);
    }
    .letter-correct {
        color: tomato;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        opacity: 1;
        transform: translateY(-60%);
    }
</style>