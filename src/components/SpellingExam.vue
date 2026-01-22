<script setup lang="ts">
    import { computed, watch } from 'vue';

    const model = defineModel(
        {type: Object}
    );
    const emit = defineEmits(['complete']);

    const letters = computed(() => {
        const word_letters = model.value.fullword.split('')

        const spellings = [...model.value.spellings||[]]
        spellings.sort(
            (a, b) => {return b.position-a.position == 0 ? (b.length-a.length) : (b.position - a.position)}
        )

        spellings.forEach(element => {
            return word_letters.splice(element.position, element.length, element);
        });
        return word_letters;
    });

    const isDone = computed(() =>{
        for(const part of model.value.spellings || [])
            if( part.selected === undefined )
                return false
        return true
    })

    const isComplete = computed(() => {
        return isDone.value && typeof model.value.result !== "undefined"
    })

    var timeoutId = -1;
    watch(isDone, (value, oldValue) => {
        if( value ){
            timeoutId = setTimeout(() => { emitCompleteEvent() }, 1000)
        }else{
            clearTimeout(timeoutId)
        }
    })

    function emitCompleteEvent(){
        if( isDone.value ){
            model.value.result = resultWord.value == model.value.fullword
            // emit('complete', model.value.result )
        }
    }

    const resultWord = computed(() => {
        const result = [];
        for (const letter of letters.value) {
            if( typeof(letter) == 'string' ){
                result.push(letter)
            }else{
                result.push(letter.selected)
            }
            
        }
        return result.join('')
    })

    function mapVariantChars(value: string): string{
        const replaced = encodeSpaces(value)
        return replaced == "" ? " " : replaced
    }

    function selectVariant(item: any, variant: string){
        item.selected = variant.replace("_","")
    }
    function cancelChoice(item: any){
        if (typeof item.selected !== "undefined"){
            item.selected = undefined;
        }
    }

    function getSpellingRight(spelling: any){
        return model.value.fullword.slice( spelling.position, spelling.position+spelling.length )
    }
    function isSpellingOk(spelling: any): Boolean{
        return spelling.selected == getSpellingRight(spelling)
    }

    function encodeSpaces(value: any): any {
        return value && value.replace(' ',' ')
    }

    function zip(...values: any[]) {
        var args = [].slice.call(values);
        var longest = args.reduce(function(a: Array<any>, b :Array<any>){
            return a.length > b.length ? a : b
        }, []);

        return longest.map(function(_,i){
            return args.map(function(array){return array[i]})
        });
    }
</script>


<template>
    <div class="word-block">
        <template v-if="isComplete">

            <template v-for="item in letters">
                <template v-if="typeof item == 'string'">
                    <h2 class="letter">{{ encodeSpaces(item) }}</h2>
                </template>
                <template v-else>
                    <div class="spelling spelling-ok" v-if="isSpellingOk(item)">
                        <h2 class="letter letter-right" v-for="letter in item.selected">{{ encodeSpaces(letter) }}</h2>
                    </div>
                    <div class="spelling spelling-wrong" v-else>
                        <template v-for="part in zip(item.selected.split(''), getSpellingRight(item).split(''))">
                            <h2 class="letter letter-wrong" v-if="!!part[0]">{{ encodeSpaces(part[0]) }}</h2>
                            <h2 class="letter" v-else>{{ encodeSpaces(" ") }}</h2>
                            <h2 class="letter letter-correct">{{ encodeSpaces(part[1]) }}</h2>
                        </template>
                    </div>
                </template>
            </template>

        </template>
        <template v-else>

            <template v-for="item in letters">
                <template v-if="typeof item == 'string'">
                    <h2 class="letter">{{ encodeSpaces(item) }}</h2>
                </template>

                <template v-else>
                    <div class="spelling" v-on:click="cancelChoice(item)" v-if='typeof item.selected !== "undefined"'>
                        <template v-if="item.selected == ''">
                            <!-- <h2 class="letter space">&thinsp;</h2> -->
                        </template>
                        <template v-else>
                            <h2 class="letter" v-for="letter in item.selected">{{ encodeSpaces(letter) }}</h2>
                        </template>
                    </div>
                    <div class="spelling" v-else>
                        <div class="variant-box">
                            <h2 v-for="(variant, index) in item.variants.toSorted(() => Math.random()-0.5)"
                                class="variant" 
                                @click="selectVariant(item, variant)">{{ mapVariantChars(variant) }}</h2>
                        </div>
                    </div>
                </template>
            </template>
        </template>

    </div>
</template>


<style scoped>
    .word-block {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        user-select: none;
    }
    .letter {
        padding: 0 2px;
        font-size: 40px;
        transform: padding .25s;
    }
    .spelling{
        display: flex;
        border-bottom: 1px dashed;
    }
    .variant {
        padding: 0px 2px;
        cursor: pointer;
        border: 1px solid;
        border-radius: 5px;
        transform: translateY(-20px);
        /* background-color: dimgray; */
    }
    .variant-box {
        margin: 0px 5px 0px 5px;
        display: flex;     
        font-size: 35px;
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
        /* text-decoration-line: spelling-error; */
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