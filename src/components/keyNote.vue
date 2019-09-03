<template>
    <div :style="{
        'bottom': keyHeight*value + 'px',
        'height': keyHeight + 'px',
        'line-height': keyHeight + 'px'

        }"
        :class="{
          sharp : isSharp(value)
        }"
    class="keyNote">{{value | toNote}}</div>
</template>

<script>

import Tone from 'tone'

export default {

  name: 'keyNote',
  data: function () {
    return {

    }
  },
  props: {
    value: Number,
    keyHeight: Number

  },
  methods: {
    isSharp: function (midi) {
      return Tone.Midi(midi).toNote().indexOf('#') !== -1
    }
  },
  filters: {
    toNote: function (midi) {
      // console.log(midi)
      return Tone.Midi(midi).toNote()
    }
  }

}
</script>

<style>

  .keyNote{
    position:absolute;
    left:0;

    background-color: rgba(0,0,0,0.01);

    position:absolute;
    left:0px;
    width:100%;
    font-size:1.5vh;

  }

  .keyNote.sharp {

    background-color: rgba(0,0,0,0.05);

  }

</style>
