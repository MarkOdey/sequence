<template>
    <div></div>
</template>

<script>
import Midi from '@tonejs/midi/build/Midi.js'

export default {

    props: {
        file: String

    },
    watch: {
        file: function (val) {
            var vm = this
            // console.log(vm.val)
            Midi.fromUrl(vm.val).then(function (midi) {
                // console.log(midi)
                vm.midi = midi
                vm.$emit('update', midi)
            })
        }
    },
    data: function () {
        return {
            midi: {}
        }
    },
    mounted: function () {
        var vm = this
        // console.log(this.file)
        Midi.fromUrl(vm.file).then((midi) => {
            // console.log(midi)
            this.midi = midi
            this.$emit('update', midi)
        })
    }

}
</script>

<style>

</style>
