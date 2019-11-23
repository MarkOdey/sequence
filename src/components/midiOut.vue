<template>

  <div>

    <b-dropdown :text="output.name">

      <b-dropdown-item  v-for="outputItem in outputs" :key="outputItem.id" @click="selectOutput(outputItem)">
        {{outputItem.name}}
      </b-dropdown-item>
    </b-dropdown>

  </div>

</template>

<script>
import { BDropdown, BDropdownItem } from 'bootstrap-vue'
import WebMidi from 'webmidi'

WebMidi.enable(function (err) {
  if (err) {
    console.log('WebMidi could not be enabled.', err)
  } else {
    console.log('WebMidi enabled!')
  }
})

export default {
  name: 'midiOut',
  props: {
    channel: Object
  },
  methods: {
    selectOutput: function (p) {
      console.log('at selected', p)
      this.output = p
    }
  },

  data: function () {
    return {
      output: {},
      outputs: [],
      label: ''
    }
  },
  beforeMount: function () {
    let vm = this

    this.outputs = WebMidi.outputs
    this.output = this.outputs[0]

    // console.log(WebMidi.outputs)

    this.channel.track.on('noteOn', function (e) {
      // console.log(WebMidi.outputs)
      var output = WebMidi.getOutputById(vm.output.id)

      output.playNote(e.midi)
    })

    this.channel.track.on('noteOff', function (e) {
      var output = WebMidi.getOutputById(vm.output.id)

      console.log('e')

      output.stopNote(e.midi)
    })
  },
  components: {
    'b-dropdown': BDropdown,
    'b-dropdown-item': BDropdownItem
  }

}
</script>

<style>

</style>
