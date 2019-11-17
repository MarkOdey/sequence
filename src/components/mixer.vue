<template>
<div class="col">

    <div class="volume-control">
      <slider-control v-model="volume" :min="-100" :max="0"></slider-control>
      <div class="volume-meter-container">
        <div class="volume-meter" :style="{
        height:level+'%'
        }"></div>
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
      console.log(payload)
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

    setInterval(function () {
      let level = self.meter.getLevel()

      // provides the offset between 100db
      self.level = level + 100
    }, 50)
  },
  data: function () {
    var meter = new Tone.Meter(0.1)

    return {
      volume: 0,
      meter: meter,
      level: 0
    }
  }
}

</script>

<style>

.volume-control {
  height: max-content;
  position:relative;
}
.volume-meter {
  position:absolute;
  bottom:20px;
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

</style>
