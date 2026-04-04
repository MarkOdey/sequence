<template>
    <div class="p-3 text-left">

        <input type="text" class="form-control" v-model="notation" @change="updateNotation"/>

        <div>Notation  : {{toNotation()}}</div>
        <div>Seconds : {{toSeconds()}}</div>
        <div>Ticks : {{toTicks()}}</div>

    </div>
</template>

<script>
import * as Tone from 'tone'

let signature = new Tone.Time()
export default {
    props: {
        'value': String
    },
    methods: {
        updateNotation: function (e) {
            // console.log('signature updated')
            signature = new Tone.Time(e.target.value)
        },
        toTicks: function () {
            return signature.toTicks()
        },
        toSeconds: function () {
            return signature.toSeconds()
        },
        toNotation: function () {
            return signature.toNotation()
        },
        toBarsBeatsSixteenths: function () {
            return signature.toBarsBeatsSixteenths()
        }
    },
    watch: {
        value: function () {
            signature = new Tone.Time(this.value)
            this.notation = signature.toNotation()
        }
    },
    data: function () {
        return {
            'notation': 0
        }
    }

}
</script>

<style>

</style>
