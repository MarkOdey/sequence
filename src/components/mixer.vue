<template>
<div class="col ">
<div class="d-flex flex-column h-100">
    <div class="row flex-grow-1 volume-control">
      <slider-control v-model="volume" :min="-100" :max="0"></slider-control>
      <div class="volume-meter-container">
        <div class="volume-meter" :style="{
        height:level+'%'
        }"></div>
      </div>
    </div>

    <div class="row bottom">
       <div class="p2">
         <font-awesome-icon v-show="!muted"  class="volume-unmute" @click='mute()' icon="volume-up" />
          <font-awesome-icon  v-show="muted" class="volume-mute" @click='unmute()' icon="volume-mute" />
       </div>

      <div class="p2">
          <font-awesome-icon v-show="!recording" @click="record()" icon="circle"/>
          <font-awesome-icon v-show="recording" @click="stopRecord()" icon="stop"/>
      </div>

    </div>

  </div>

</div>

</template>

<script>
import SliderControl from './SliderControl.vue'

import Tone from 'tone'
import { setInterval } from 'timers'

export default {
    name: 'mixer',
    props: {
        channel: Object

    },
    watch: {
        channel: function (payload) {
            // console.log(payload)
            if (payload !== undefined) {

            }
        },
        volume: function (payload) {
            this.channel.audio.set('volume', payload)
        }
    },
    components: {
        SliderControl
    },
    beforeMount: function () {
        var self = this
        this.channel.audio.connect(this.meter)

        this.channel.on('mute', () => {
            this.muted = true

            // console.log('muted changed.')
        })

        this.channel.on('unmute', () => {
            this.muted = false
            // console.log('unmuted.')
        })

        setInterval(function () {
            let level = self.meter.getLevel()

            // provides the offset between 100db
            self.level = level + 100
        }, 50)
    },
    methods: {
        mute: function () {
            this.channel.mute()
            this.muted = true
        },
        unmute: function () {
            this.channel.unmute()
            this.muted = false
        },
        record: function () {

        },
        stopRecord: function () {

        }
    },
    data: function () {
        var meter = new Tone.Meter(0.1)

        return {
            volume: 0,
            muted: true,
            meter: meter,
            level: 0,
            recording: false
        }
    }
}

</script>

<style>

    .bottom {

      padding-bottom:20px;
    }

.volume-control {

  /*position:relative;
  height: 100%;*/
  position:relative;
  padding-bottom:30px;
}

.slider-element {
  height:100%
}
.volume-meter {
  position:absolute;
  bottom:30px;
  height: 100%;
  width:100%;
  background-color:green;
}

.volume-meter-container {
  position:absolute;
  pointer-events: none;
  top:0;
  height:100%;
  width:100%;
}
.bottom {
  height:100px;
}

</style>
