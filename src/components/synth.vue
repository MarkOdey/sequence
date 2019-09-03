<template>

  <div>
    <div class="row">

      <div class="col-12">
        <knob-control :min=0 :max=2 :stepSize=0.001  v-model="attack"></knob-control>
      </div>
      <div class="col-12">
        <span>Attack</span>
      </div>

    </div>

    <div class="row">
      <div class="col-12">
        <knob-control :min=0 :max=2 :stepSize=0.001  v-model="release"></knob-control>
      </div>
      <div class="col-12">
        <span>Release</span>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <knob-control :min=0 :max=2 :stepSize=0.001  v-model="sustain"></knob-control>
      </div>
      <div class="col-12">
        <span>Sustain</span>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <knob-control :min=0 :max=2 :stepSize=0.001  v-model="decay"></knob-control>
      </div>
      <div class="col-12">
        <span>Sustain</span>
      </div>
    </div>
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

    release: {

      handler: function (val) {
        console.log(this.release + 'changed')

        for (var i in this.polySynth.voices) {
          this.polySynth.voices[i].envelope.release = val
        }
      }

    },
    sustain: {

      handler: function (val) {
        console.log(this.sustain + 'changed')

        for (var i in this.polySynth.voices) {
          this.polySynth.voices[i].envelope.sustain = val
        }
      }

    },
    decay: {

      handler: function (val) {
        console.log(this.decay + 'changed')

        for (var i in this.polySynth.voices) {
          this.polySynth.voices[i].envelope.decay = val
        }
      }

    },
    channel: {

      handler: function (payload) {
        console.log(payload)

        self.polySynth.connect(self.channel.audio)

        if (payload.track !== undefined) {
          self.updateTrack(payload.track)
        }
      }
    }

  },
  methods: {

    updateTrack: function (track) {
      var self = this

      // console.log(track)

      // console.log(this.channel.track)
      for (var i in track.notes) {
        var note = track.notes[i]

        note.on('noteOn', function (payload) {
          // console.log('note on!!!')
          // console.log(payload)
          // Converting midi note to pitch.
          var pitch = Tone.Frequency(payload.midi, 'midi').toNote()
          // the notes given as the second element in the array
          // will be passed in as the second argument
          self.polySynth.triggerAttackRelease(pitch, payload.durationTicks + 'i')
        })

        note.on('noteOff', function (payload) {
          // console.log('note off!!')
          // console.log(payload)
          // Converting midi note to pitch.
          var pitch = Tone.Frequency(payload.midi, 'midi').toNote()
          // self.polySynth.triggerRelease(pitch)
        })
      }

      track.on('noteUpdated', function (payload) {
        console.log('note updated')
        // console.log(payload)
      })
    }
  },

  beforeMount: function () {
    var self = this

    self.notes = []

    console.log(this.channel)
    self.polySynth.connect(self.channel.audio)

    this.channel.on('play', function () {
      // self.part.start()
    })
    this.channel.on('pause', function () {
      // self.part.stop()
    })

    if (this.channel.track !== undefined) {
      this.updateTrack(this.channel.track)

      this.channel.track.on('updated', self.updateTrack)
    }
  },

  data: function () {
    var synth = Tone.Synth

    var polySynth = new Tone.PolySynth(6, synth)

    polySynth.volume.value = -20

    return {
      data: {},
      attack: 0.005,
      release: 1,
      sustain: 0.3,
      decay: 0.1,

      polySynth: polySynth

    }
  },
  props: {
    channel: Object
  },
  components: {
    KnobControl
  }

}
</script>

<style>

</style>
