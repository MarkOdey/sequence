<template>
    <div></div>
</template>

<script>
import Tone from 'tone'

export default {
  watch: {
    track: {

      handler: function (val) {
        var vm = this

        console.log(val)
        console.log('registering notest')
        console.log(this.track)
        var notes = []
        for (var i in this.track.notes) {
          var note = this.track.notes[i]
          notes[i] = {
            time: note.ticks + 'i',
            midi: note.midi,
            durationTicks: note.durationTicks

          }
        }

        var part = new Tone.Part(function (time, note) {
          var pitch = Tone.Frequency(note.midi, 'midi').toNote()
          // the notes given as the second element in the array
          // will be passed in as the second argument
          vm.synth.triggerAttackRelease(pitch, note.durationTicks + 'i', time, note.velocity)
        }, notes)

        part.loopStart = 0
        part.loopEnd = this.track.durationTicks + 'i'
        part.loop = true

        part.start(0)

        /* for (var i in this.track.notes) {
          var note = this.track.notes[i]
          Tone.Transport.scheduleRepeat(function (time) {
            var pitch = Tone.Frequency(note.midi, 'midi').toNote()
          }, note.ticks + 'i')
        } */
      },
      deep: true
    }

  },
  beforeMount: function () {
    this.synth.toMaster()
  },
  data: function () {
    return {
      data: {},
      synth: new Tone.PolySynth(6, Tone.Synth)
    }
  },
  props: {
    track: Object
  }

}
</script>

<style>

</style>
