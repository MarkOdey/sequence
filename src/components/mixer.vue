<template>
    <div>
      <slider-control :value="volume"></slider-control></div>
</template>

<script>
import SliderControl from './SliderControl.vue'
// import Tone from 'tone'

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
    }
  },
  components: {
    SliderControl
  },
  data: function () {
    return {
      volume: 100
    }
  }
}

</script>

<style>

</style>
