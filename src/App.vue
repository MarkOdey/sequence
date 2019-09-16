<template>
  <div id="app">
    <midiFile file="beethoven_fur_elise.mid" @update='updateMidi'></midiFile>
    <div v-for="track in tracks" :key="track.id">
      <channel :track="track"></channel>
    </div>

  </div>
</template>

<script>
import channel from './components/channel.vue'
import midiFile from './components/midiFile.vue'

import Tone from 'tone'

// import VueGridLayout from 'vue-grid-layout'

export default {

  name: 'app',
  head: {
    // To use "this" in the component, it is necessary to return the object through a function
    title: function () {
      return {
        inner: 'Title'
      }
    },
    meta: [
      { name: 'description', content: 'Sequencer app based on Tonejs', id: 'desc' },
      { name: 'viewport', content: 'width=device-width, user-scalable=no' }
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/index.scss";
        `
      }
    }
  },
  data: function () {
    return {
      tracks: [],
      midi: {}
    }
  },
  methods: {
    updateMidi: function (midi) {
      console.log('at app level')
      this.midi = midi

      this.tracks = midi.tracks

      console.log(midi)

      Tone.Transport.PPQ = midi.header.ppq

      Tone.Transport.loopStart = 0
      Tone.Transport.loopEnd = midi.durationTicks + 'i'
      Tone.Transport.loop = true

      console.log(midi)

      // vm.durationTicks = track.durationTicks
    }

  },
  components: {
    channel,
    midiFile
  }
}
</script>

<style>
#app {
  font-family: Ubuntu;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
