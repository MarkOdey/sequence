<template >

    <div
      :class="{'selected' : selected}"
      :style="{
        'bottom':data.midi*keyHeight+'px',
        'left':data.ticks*tickWidth+'px',
        'width':data.durationTicks*tickWidth +'px',
        'height': keyHeight + 'px',
        'line-height':keyHeight+'px'

      }"

    >
      <div class="selectArea" @mousedown="mousedown" @touchstart="touchstart"></div>

      {{data.midi | toNote}}
      <handle-right :note='data' ref="handleLeft"></handle-right>
      <handle-left :note='data' ref="handleRight" ></handle-left>

    </div>
</template>

<script>

import Tone from 'tone'
import Note from '../../factories/Note.js'
import handleLeft from './note/handleLeft.vue'
import handleRight from './note/handleRight.vue'

export default {
    name: 'note',
    beforeDestroy: function () {
        this.data.removeListener('selected', this.onSelected)
        this.data.removeListener('deselected', this.onDeselected)
    },
    mounted: function () {
        if (this.data === undefined) {
            return
        }
        this.data.setElement(this.$el)

        this.data.on('selected', this.onSelected)
        this.data.on('deselected', this.onDeselected)
    },

    methods: {
        onSelected: function () {
            console.log('SELECTED!!!!!!!!!!!!!!!!!!!!!11')

            this.selected = true
        },
        onDeselected: function () {
            this.selected = false
        },
        touchstart: function (event) {
            console.log('at touch start')
            // Emitting the selected state.
            this.$emit('down', event)

            window.document.addEventListener('touchend', this.touchend)
            window.document.addEventListener('touchmove', this.touchmove)
        },
        touchmove: function (event) {
            this.$emit('move', event)
        },
        touchend: function (event) {
            this.$emit('up', event)

            window.document.removeEventListener('touchend', this.touchend)
            window.document.removeEventListener('touchmove', this.touchmove)
        },
        mousedown: function (event) {
            this.$emit('down', event, this.data)

            window.document.addEventListener('mousemove', this.mousemove)
            window.document.addEventListener('mouseup', this.mouseup)
        },
        mouseup: function (event) {
            this.$emit('up', event, this.data)

            window.document.removeEventListener('mousemove', this.mousemove)
            window.document.removeEventListener('mouseup', this.mouseup)
        },
        mousemove: function (event) {
            this.$emit('move', event, this.data)
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
            selected: false

        }
    },
    props: {
        data: Note,
        keyHeight: Number,
        tickWidth: Number
    },
    components: {
        handleLeft,
        handleRight
    }

}
</script>

<style lang="scss">

.note.selected {
  border: var(--secondary) dashed 1px;
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

.selectArea {
  width:100%;
  height:100%;
  position:absolute;
  top:0;
  left:0;
}

</style>
