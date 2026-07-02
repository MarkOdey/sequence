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
import * as Tone from 'tone';
import { markRaw, toRaw } from 'vue';
import KnobControl from 'vue-knob-control';

export default {
    watch: {

        attack: {

            handler: function (val) {
                this.polySynth.set({ envelope: { attack: val } })
            }

        },

        release: {

            handler: function (val) {
                this.polySynth.set({ envelope: { release: val } })
            }

        },
        sustain: {

            handler: function (val) {
                this.polySynth.set({ envelope: { sustain: val } })
            }

        },
        decay: {

            handler: function (val) {
                this.polySynth.set({ envelope: { decay: val } })
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
            const channel = toRaw(this.channel)
            this.polySynth.connect(channel.audio)

            if (channel.track !== undefined) {
                this.updateTrack(channel.track)
            }

            channel.on('play', function () {
                // this.part.start()
            })
            channel.on('pause', function () {
                // this.part.stop()
            })

            if (channel.track !== undefined) {
                channel.track.on('noteOn', (note) => {
                    // Converting midi note to pitch.
                    var pitch = Tone.Frequency(note.midi, 'midi').toNote()
                    // the notes given as the second element in the array
                    // will be passed in as the second argument
                    this.polySynth.triggerAttackRelease(pitch, note.durationTicks + 'i')
                })

                channel.track.on('noteOff', (note) => {
                    console.log('note off!!')
                    // //console.log(note)
                    // Converting midi note to pitch.
                    Tone.Frequency(note.midi, 'midi').toNote()
                    // this.polySynth.triggerRelease(pitch)
                })

                channel.track.on('updated', this.updateTrack)
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
        var polySynth = markRaw(new Tone.PolySynth(Tone.Synth))

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
