<template >
    <div :class="{'selected' : data.selected}" @mousedown="mousedown" @touchstart="touchstart"
    :style="{
        'bottom':data.midi*keyHeight+'px',
        'left':data.ticks*tickWidth+'px',
        'width':data.durationTicks*tickWidth +'px',
        'height': keyHeight + 'px',
        'line-height':keyHeight+'px'

    }"

    >{{data.midi | toNote}}</div>
</template>

<script>

import Tone from 'tone'

export default {
  name: 'note',
  methods: {
    touchstart: function (event) {
      // Emitting the selected state.
      this.$emit('selected', this)
      // console.log('touch move');
      if (event.touches.length === 1) {
        const touch = event.targetTouches.item(0)
        const offsetX = touch.clientX
        const offsetY = touch.clientY
        this.move(offsetX, offsetY)
      }

      window.document.addEventListener('touchend', this.touchend)
      window.document.addEventListener('touchmove', this.touchmove)
    },
    touchmove: function (event) {
      if (event.touches.length === 1) {
        const touch = event.targetTouches.item(0)
        const offsetX = touch.clientX
        const offsetY = touch.clientY
        this.move(offsetX, offsetY)
      }
    },
    touchend: function (event) {
      if (event.touches.length === 1) {
        const touch = event.targetTouches.item(0)
        const offsetX = touch.clientX
        const offsetY = touch.clientY
        this.move(offsetX, offsetY)
      }
      window.document.removeEventListener('touchend', this.touchend)
      window.document.removeEventListener('touchmove', this.touchmove)
    },
    mousedown: function (event) {
      console.log(event)

      // Emitting the selected state

      this.data.select()

      this.initialOffsetX = event.offsetX

      var x = event.clientX
      var y = event.clientY
      this.move(x, y)

      window.document.addEventListener('mousemove', this.mousemove)
      window.document.addEventListener('mouseup', this.mouseup)
    },
    mouseup: function (event) {
      var x = event.clientX
      var y = event.clientY

      this.move(x, y)

      window.document.removeEventListener('mousemove', this.mousemove)
      window.document.removeEventListener('mouseup', this.mouseup)
    },
    mousemove: function (event) {
      var x = event.clientX
      var y = event.clientY
      this.move(x, y)
    },
    move: function (x, y) {
      console.log(this.initialOffsetX)
      var parent = event.target.parentElement
      var bounds = parent.getBoundingClientRect()
      x = (x - bounds.left) + (-this.initialOffsetX)
      y = (y - bounds.top)
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

      initialOffsetY: 0,
      initialOffsetX: 0

    }
  },
  props: {
    data: Object,
    keyHeight: Number,
    tickWidth: Number
  }

}
</script>

<style lang="scss">

.note.selected {
  border:green solid 1px;
}

.note {
  position:absolute;
  background-color:rgba(0,0,0,0.1);
  cursor:grab;
  user-select: none;
  font-size:1.5vh;

  touch-action: none;
  border:solid 1px #DDDDDD66;
  border-radius:1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis // This is where the magic happens
}

</style>
