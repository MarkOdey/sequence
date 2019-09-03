<template>
    <div class="volume-control">
      <slider-control v-model="volume" :min="-100" :max="0"></slider-control>
      <div class="volume-meter" :style="{
        height:level+'%'
        }"></div>
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
  display: inline-block;
  position:relative;
}
.volume-meter {
  position:absolute;
  bottom:0;
  height: 100%;
  width:100%;
  background-color:green;
}

</style>
