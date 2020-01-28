<template>
<div class="handleRight" @mousedown="startDrag"></div>
</template>

<script>
export default {
  name: 'handleRight',
  methods: {
    'startDrag': function (e) {
      var x = event.pageX
      var y = event.pageY

      // If the event is fired from a mobile device
      if (event.touches !== undefined && event.touches.length === 1) {
        const touch = event.targetTouches.item(0)
        x = touch.pageX
        y = touch.pageY
      }

      window.document.addEventListener('mousemove', this.dragUpdate)
      window.document.addEventListener('mouseup', this.dragEnd)

      this.initialPageX = x
      this.initialPageY = y

      if (this.note) {
        this.initialTicks = this.note.ticks
        this.initialDurationTicks = this.note.durationTicks
      }
    },
    'dragUpdate': function (e) {
      var x = event.pageX

      // If the event is fired from a mobile device
      if (event.touches !== undefined && event.touches.length === 1) {
        const touch = event.targetTouches.item(0)
        x = touch.pageX
      }

      var tickWidth = this.$parent.tickWidth

      var tickOffsetX = (x - this.initialPageX) / tickWidth
      this.note.update({ 'durationTicks': this.initialDurationTicks + tickOffsetX })
    },
    'dragEnd': function (e) {
      console.log('remove dragUpdate')
      window.document.removeEventListener('mousemove', this.dragUpdate)
      window.document.removeEventListener('mouseup', this.dragEnd)
    }
  },
  data: function () {
    return {
      initialPageX: 0,
      initialPageY: 0,
      initialTicks: 0,
      initialDurationTicks: 0
    }
  },
  props: {
    note: Object
  }
}
</script>

<style>

.handleRight {

  position:absolute;
  right:0px;
  max-width:10px;
  width:25%;
  height: 100%;
  top:0;
  background:blue;

}

</style>
