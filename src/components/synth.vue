<template>
    <div>
      <knob-control min="0" max="60" stepSize="0.1"  v-model="attack"></knob-control>

    </div>
</template>

<script>
import Tone from 'tone'
import KnobControl from 'vue-knob-control'

export default {
  watch: {

    attack: {

      handler: function (val) {
        console.log(this.attack + 'changed')

        for (var i in this.polySynth.voices) {
          this.polySynth.voices[i].envelope.attack = val
        }
      }

    },
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
            durationTicks: note.durationTicks,
            velocity: note.velocity

          }
        }

        var part = new Tone.Part(function (time, note) {
          var pitch = Tone.Frequency(note.midi, 'midi').toNote()
          // the notes given as the second element in the array
          // will be passed in as the second argument

          vm.polySynth.triggerAttackRelease(pitch, note.durationTicks + 'i', time, note.velocity)
        }, notes)

        part.loopStart = 0
        part.loopEnd = this.track.durationTicks + 'i'
        part.loop = true

        part.start(0)
      },
      deep: true
    }

  },
  beforeMount: function () {
    this.polySynth.toMaster()
  },
  data: function () {
    var synth = Tone.Synth
    var polySynth = new Tone.PolySynth(6, synth)

    console.log(polySynth.voices)
    return {
      data: {},
      attack: 0,
      release: 0,
      polySynth: polySynth

    }
  },
  props: {
    track: Object
  },
  components: {
    KnobControl
  }

}
</script>

<style>

</style>
