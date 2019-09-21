<template>
  <div class="container-fluid">
    <div class="row flex-row flex-nowrap">

        <midiOut :updated="updateMidi()"/>
        <midiIn/>

        <pianoRoll :channel="channel"></pianoRoll>

        <synth :channel="channel"></synth>

        <mixer :channel="channel"></mixer>

    </div>

  </div>

</template>

<script>

import midiOut from './midiOut.vue'
import midiIn from './midiIn.vue'
import pianoRoll from './PianoRoll/pianoRoll.vue'
import mixer from './mixer.vue'

import Channel from '../factories/Channel.js'

import synth from './synth.vue'

export default {
  components: {
    midiOut,
    synth,
    midiIn,
    pianoRoll,
    mixer
  },
  watch: {

  },
  beforeMount: function (e) {

  },
  data: function (e) {
    // console.log(this.track)

    let channel = new Channel()

    // console.log(channel)

    if (this.track !== undefined) {
      channel.updateTrack(this.track)
    }

    channel.on('updated', function (e) {
      this.track = channel.track
      // console.log(this.track)
    })

    // console.log(channel)
    return {
      channel: channel
    }
  },
  props: {
    track: Object
  },
  methods: {
    updateMidi: function (e) {
      // console.log(e)
    }

  }
}
</script>

<style>

</style>
