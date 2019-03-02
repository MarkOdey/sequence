<template>
  <div id="app">
    <MidiOut msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import MidiOut from './components/MidiOut.vue'
import MidiIn from './components/MidiIn.vue'

export default {
  name: 'app',
  components: {
    MidiOut
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
</style>
