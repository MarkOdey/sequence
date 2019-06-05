<template>
  <div id="app">

    <midiOut/>
    <midiIn/>

    <midiFile file="deb_pass.mid" @update='updateMidi'></midiFile>

    <div class="pianoRoll"><pianoRoll :track="track"></pianoRoll></div>
    <div class="synth"><synth :track="track"></synth></div>

  </div>
</template>

<script>
import midiOut from './components/midiOut.vue'
import midiIn from './components/midiIn.vue'
import pianoRoll from './components/pianoRoll.vue'
import midiFile from './components/midiFile.vue'
import synth from './components/synth.vue'

import VueGridLayout from 'vue-grid-layout'

export default {

  name: 'app',
  data: function () {
    return {
      track: {},
      midi: {}
    }
  },
  methods: {
    updateMidi: function (midi) {
      console.log('at app level')
      this.midi = midi

      this.track = midi.tracks[0]

      // vm.notes = track.notes

      // vm.durationTicks = track.durationTicks
    }
  },
  components: {
    midiFile,
    midiOut,
    synth,
    midiIn,
    pianoRoll
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
