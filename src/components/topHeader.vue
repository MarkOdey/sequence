<template>

<nav class="navbar navbar-expand-lg navbar-light bg-light">

    <midiFile file="beat.mid" @update='updateMidi'></midiFile>
    <div class="col-2">
      <font-awesome-icon :class="{'d-none':playing}" @click="play()" icon="play" />
      <font-awesome-icon :class="{'d-none':!playing}" @click="pause()" icon="pause" />

    </div>

</nav>
</template>

<script>
// import Tone from 'tone'

import midiFile from './midiFile.vue'
import Project from '../factories/Project'

export default {

    mounted: function () {
        Project.on('play', () => {
            this.playing = true
        })

        Project.on('pause', () => {
            this.playing = false
        })
    },

    methods: {
        play: function () {
            Project.play()
        },
        pause: function () {
            Project.pause()
        },
        updateMidi: function (midi) {
            // console.log('at app level')

            Project.loadMidi(midi)

            this.$emit('updateMidi', midi)

            // console.log(midi)

            // vm.durationTicks = track.durationTicks
        }

    },
    props: {

    },
    data: function () {
        return {

            playing: false

        }
    },
    components: {
        midiFile
    }

}
</script>

<style>

</style>
