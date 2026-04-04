<template>

  <div>

    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
        {{output.name}}
      </button>
      <ul class="dropdown-menu">
        <li v-for="outputItem in outputs" :key="outputItem.id">
          <a class="dropdown-item" href="#" @click.prevent="selectOutput(outputItem)">
            {{outputItem.name}}
          </a>
        </li>
      </ul>
    </div>

  </div>

</template>

<script>
import { WebMidi } from 'webmidi'

WebMidi.enable().catch(err => {
    // console.log('WebMidi could not be enabled.', err)
})

export default {
    name: 'midiOut',
    props: {
        channel: Object
    },
    methods: {
        selectOutput: function (p) {
            this.output = p
        }
    },
    watch: {
        'channel': function () {
            this.channel.track.on('noteOn', (e) => {
                var output = WebMidi.getOutputById(this.output.id)

                output.playNote(e.midi)
            })

            this.channel.track.on('noteOff', (e) => {
                var output = WebMidi.getOutputById(this.output.id)

                output.stopNote(e.midi)
            })
        }
    },

    data: function () {
        return {
            output: {
                name: 'untitled'
            },
            outputs: [],
            label: ''
        }
    },
    beforeMount: function () {
        this.outputs = WebMidi.outputs

        if (this.outputs[0]) {
            this.output = this.outputs[0]
        }
    }

}
</script>

<style>

</style>
