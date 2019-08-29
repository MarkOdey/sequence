<template >
    <div draggable="true" @dragstart="dragstart" @dragend="dragend" class="note"
    :style="{
        bottom:data.midi*keyHeight+'px',
        left:data.ticks*tickWidth+'px',
        width:data.durationTicks*tickWidth +'px',
        height: keyHeight + 'px'

    }"

    >{{data.midi | toNote}}</div>
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
      var ticks = Math.round(x / this.tickWidth)
      var midi = Math.floor((bounds.height - y) / this.keyHeight)
      console.log(this)

      this.data.update({ midi: midi, ticks: ticks })
      // this.$emit('update', { index: this.index, midi: midi, ticks: ticks })
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
    data: Object,
    keyHeight: Number,
    tickWidth: Number
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
