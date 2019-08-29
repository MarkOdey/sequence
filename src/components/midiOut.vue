<template>

  <div>

    <select  name="midi" >

      <option v-for="outputItem in outputs" :key="outputItem.id" >{{outputItem.name}}</option>

    </select>

  </div>

</template>

<script>
import WebMidi from 'webmidi'

WebMidi.enable(function (err) {
  if (err) {
    // console.log('WebMidi could not be enabled.', err)
  } else {
    // console.log('WebMidi enabled!')
  }
})

export default {

  data: function () {
    return {
      outputs: [],
      label: ''
    }
  },
  mounted () {
    // console.log(WebMidi.outputs)

    this.outputs = WebMidi.outputs
    this.output = this.outputs[0]

    // console.log(this.output)

    this.$emit('updated', this.output)
  }

}
</script>

<style>

</style>
