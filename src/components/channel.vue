
<style>

  .channel {
    height:40vh;
  }

  @media screen and (max-height:800px) {
    .channel {
      height: 80vh;
    }
  }

</style>

<template>
  <div class="container-fluid">
    <div class="row flex-row flex-nowrap channel">

        <midiOut :channel="channel" />
        <midiIn/>

        <pianoRoll :track="channel.track" :channel="channel"></pianoRoll>

        <synth :channel="channel"></synth>

        <mixer :channel="channel"></mixer>

        <audioInput :channel="channel"></audioInput>

    </div>

  </div>

</template>

<script>

import midiOut from './midiOut.vue'
import midiIn from './midiIn.vue'
import pianoRoll from './PianoRoll/pianoRoll.vue'
import mixer from './mixer.vue'
import audioInput from './audioInput.vue'

// import Channel from '../factories/Channel.js'

import synth from './synth.vue'

export default {
    components: {
        audioInput,
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
    mounted: function () {
        this.channel.on('updated', function (e) {

        })
    },
    data: function (e) {
    // //console.log(this.track)

        // //console.log(channel)
        return {
        }
    },
    props: {
        channel: Object
    },
    methods: {
        updateMidi: function (e) {
            // //console.log(e)
        }

    }
}
</script>

<style>

</style>
