<template>
  <div v-if="audioAllowed" id="app" >

    <topHeader @updateMidi="updateMidi($event)"></topHeader>


    <div v-for="channel in channels" :key="channel.id">
      <channel :channel="channel"></channel>
    </div>

  </div>
  <div v-else @click="startAudio">
    PLEASE ENABLE CONTEXT BY CLICKING HERE
  </div>
</template>

<script>

import * as Tone from 'tone';
import { nextTick } from 'vue';
import channel from './components/channel.vue';
import topHeader from './components/topHeader.vue';
import Project from './factories/Project.js';

// import Tone from 'tone'

// import VueGridLayout from 'vue-grid-layout'

export default {

    name: 'app',
    mounted () {

        Project.on('updated', async () => {




            console.log('project mounted')
           this.channels = Project.channels



           await nextTick()
        })
    },

    methods: {
        startAudio: async function () {


            await Tone.start()

            this.audioAllowed= Tone.getContext().state === 'running';

            console.log(Tone.getContext())
        },
        updateMidi: function (payload) {
             console.log(payload)
        }
    },
    components: {
        topHeader,
        channel
    },
    data:  ()=> {
        return {
            channels: [],
            midi: {},
            audioAllowed:false,
        }
    }
}
</script>

<style>
#app {
  font-family: Ubuntu;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
