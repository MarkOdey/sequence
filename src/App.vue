<template>
  <div id="app">
    <midiFile file="deb_clai.mid" @update='updateMidi'></midiFile>
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.pianoRoll {

  width:100%;
  height:300px;
  position:relative;

}
</style>
