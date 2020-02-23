<template>
  <div id="app">

    <topHeader @updateMidi="updateMidi($event)"></topHeader>

    <div v-for="channel in channels" :key="channel.id">
      <channel :channel="channel"></channel>
    </div>

  </div>
</template>

<script>

import Project from './factories/Project.js'
import topHeader from './components/topHeader.vue'
import channel from './components/channel.vue'

// import Tone from 'tone'

// import VueGridLayout from 'vue-grid-layout'

export default {

    name: 'app',
    head: {
    // To use "this" in the component, it is necessary to return the object through a function
        title: function () {
            return {
                inner: 'Title'
            }
        },
        meta: [
            { name: 'description', content: 'Sequencer app based on Tonejs', id: 'desc' },
            { name: 'viewport', content: 'width=device-width, user-scalable=no' }
        ]
    },
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/index.scss";`
            }
        }
    },
    mounted: function () {
        Project.on('updated', (panel) => {

        })
    },
    watch: {
        channels () {
            // console.log(this.channels)

            // console.log('channel changed.')
        }
    },
    methods: {
        updateMidi: function (payload) {
            // console.log(payload)
        }
    },
    components: {
        topHeader,
        channel
    },
    data: function () {
        return {
            channels: Project.channels,
            midi: {}
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
