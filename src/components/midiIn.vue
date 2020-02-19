<template>
<div>
  <div v-for="input in inputs" :key="input.id">

  </div>

</div>
</template>

<script>
import WebMidi from 'webmidi'

export default {

    data: function () {
        return {

            label: '',
            inputs: []
        }
    },
    mounted () {
    // console.log('compiled')

        // console.log(WebMidi.inputs)

        this.inputs = WebMidi.inputs

        this.$emit('updated', this.inputs[0])
    }

}
</script>

<style>

</style>
