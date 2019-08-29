<template>
    <div></div>
</template>

<script>
import Midi from '@tonejs/midi/build/Midi.js'

export default {

  props: {
    file: String

  },
  watch: {
    file: function (val) {
      var vm = this
    }
  },
  data: function () {
    return {
      midi: {}
    }
  },
  beforeMount: function () {
    var vm = this
  }

}
</script>

<style>

</style>
