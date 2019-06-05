<template >
    <div draggable="true" @dragstart="dragstart" @dragend="dragend" class="note"
    :style="{
        bottom:midi*keyHeight+'px',
        left:ticks*tickWidth+'px',
        width:durationTicks*tickWidth +'px',
        height: keyHeight + 'px'

    }"

    >{{midi | toNote}}</div>
</template>

<script>

import Tone from 'tone'

export default {
  name: 'note',
  methods: {
    dragstart: function (event) {
      console.log(event)
      console.log('at drag start')
    },
    dragend: function (event) {
      var parent = event.target.parentElement
      var bounds = parent.getBoundingClientRect()
      var x = event.clientX - bounds.left
      var y = event.clientY - bounds.top
      var ticks = x / this.tickWidth
      var midi = Math.floor((bounds.height - y) / this.keyHeight)
      console.log(this)
      this.$emit('update', { index: this.index, midi: midi, ticks: ticks })
      console.log(event)
      console.log('drag end')
    }
  },
  filters: {
    toNote: function (midi) {
      // console.log(midi)
      return Tone.Midi(midi).toNote()
    }
  },
  data: function () {
    return {

    }
  },
  props: {
    index: String,
    midi: Number,
    ticks: Number,
    durationTicks: Number,
    tickWidth: Number,
    keyHeight: Number
  }

}
</script>

<style>

.note {
  position:absolute;
  background-color:rgba(0,0,0,0.1);
  cursor:grab;
  user-select: none;
}

</style>
