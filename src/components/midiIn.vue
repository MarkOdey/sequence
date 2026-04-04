<template>
<div>
  <div v-for="input in inputs" :key="input.id">

  </div>

</div>
</template>

<script>
import { WebMidi } from 'webmidi'

export default {

    data: function () {
        return {

            label: '',
            inputs: []
        }
    },
    mounted () {
        WebMidi.enable().then(() => {
            this.inputs = WebMidi.inputs
            this.$emit('updated', this.inputs[0])
        }).catch(err => {
            // console.log('WebMidi could not be enabled.', err)
        })
    }

}
</script>

<style>

</style>
