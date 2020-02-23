<template>

  <div class="col-2">

    <div class="row">

      <div class="col-12">
        <knob-control :size=75 :min=0 :max=2 :stepSize=0.001  v-model="attack"></knob-control>
      </div>
      <div class="col-12">
        <span>Attack</span>
      </div>

    </div>

    <div class="row">
      <div class="col-12">
        <knob-control :size=75 :min=0 :max=2 :stepSize=0.001  v-model="release"></knob-control>
      </div>
      <div class="col-12">
        <span>Release</span>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <knob-control :size=75 :min=0 :max=2 :stepSize=0.001  v-model="sustain"></knob-control>
      </div>
      <div class="col-12">
        <span>Sustain</span>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <knob-control :size=75 :min=0 :max=2 :stepSize=0.001  v-model="decay"></knob-control>
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
                // console.log(this.attack + 'changed')

                for (var i in this.polySynth.voices) {
                    this.polySynth.voices[i].envelope.attack = val
                }
            }

        },

        release: {

            handler: function (val) {
                // console.log(this.release + 'changed')

                for (var i in this.polySynth.voices) {
                    this.polySynth.voices[i].envelope.release = val
                }
            }

        },
        sustain: {

            handler: function (val) {
                // console.log(this.sustain + 'changed')

                for (var i in this.polySynth.voices) {
                    this.polySynth.voices[i].envelope.sustain = val
                }
            }

        },
        decay: {

            handler: function (val) {
                // console.log(this.decay + 'changed')

                for (var i in this.polySynth.voices) {
                    this.polySynth.voices[i].envelope.decay = val
                }
            }

        },
        channel: {

            handler: function (payload) {
                // console.log(payload)

                this.updateChannel()
            }
        }

    },
    methods: {
        updateChannel: function () {
            this.polySynth.connect(this.channel.audio)

            if (this.channel.track !== undefined) {
                this.updateTrack(this.channel.track)
            }

            this.polySynth.connect(this.channel.audio)

            this.channel.on('play', function () {
                // this.part.start()
            })
            this.channel.on('pause', function () {
                // this.part.stop()
            })

            if (this.channel.track !== undefined) {
                this.channel.track.on('noteOn', (note) => {
                    // Converting midi note to pitch.
                    var pitch = Tone.Frequency(note.midi, 'midi').toNote()
                    // the notes given as the second element in the array
                    // will be passed in as the second argument
                    this.polySynth.triggerAttackRelease(pitch, note.durationTicks + 'i')
                })

                this.channel.track.on('noteOff', (note) => {
                    // //console.log('note off!!')
                    // //console.log(note)
                    // Converting midi note to pitch.
                    Tone.Frequency(note.midi, 'midi').toNote()
                    // this.polySynth.triggerRelease(pitch)
                })

                this.channel.track.on('updated', this.updateTrack)
            }
        },
        updateTrack: function (track) {

            // //console.log(track)
        }

    },

    mounted: function () {
        self.notes = []

        this.updateChannel()
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
