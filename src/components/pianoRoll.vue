<style>
  .container {

    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    overflow:auto;

  }
  .noteGrid {
    position:absolute;
    width:100%;
    height:100%;
    top:0px;
    left:0px;
  }

  .grid {
    position:absolute;
    width:100%;
    height:100%;
    left:0px;
    top:0px;
  }

  .cursor {
    position:absolute;
    height:100%;
    width:1px;
    background-color:red;
  }

  .keyNoteBar {

    position: absolute;
    height:100%;
    left:0px;
    top:0px;
    z-index:1;
    background:white;

    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer */
    -khtml-user-select: none; /* KHTML browsers (e.g. Konqueror) */
    -webkit-user-select: none; /* Chrome, Safari, and Opera */
    -webkit-touch-callout: none; /* Disable Android and iOS callouts*/

  }

</style>

<template>

  <div ref="container" class="container">

    <div ref="keyNoteBar"
        :style="{
          width: keyWidth + 'px',
          height: keyHeight*keyNotes.length+'px',

          }" class="keyNoteBar">
      <keyNote
        v-for="keyNote in keyNotes"
        :key="keyNote.value"
        :value="keyNote.value"
        :keyHeight="keyHeight"

      ></keyNote>

    </div>

    <div :style="{
      height: keyHeight*keyNotes.length+'px',
       }" class="noteGridContainer">
      <div :style="{
          height: keyHeight*keyNotes.length+'px',
          width:(tickWidth*track.durationTicks +keyWidth)+'px',
          left: keyWidth +'px'

        }"
        class="noteGrid">

        <div class="grid"
          :style="{
              background : 'repeating-linear-gradient( to right, #EEE, #EEE '+tickWidth*rate+'px, #DDD '+tickWidth*rate+'px, #DDD '+tickWidth*rate*2+'px'

          }">

        </div>

        <div class="cursor"
        :style="{
          left:cursor.ticks*tickWidth+'px'
        }"></div>

        <note class="note"
          v-for="note in track.notes"
          :index="note.index"
          :key="note.index"
          :midi="note.midi"
          :ticks="note.ticks"
          :durationTicks="note.durationTicks"
          :tickWidth="tickWidth"
          :keyHeight="keyHeight"
          @update="noteUpdated"
        >{{note.i}}</note>

      </div>
    </div>
  </div>
</template>

<script>

import note from './note.vue'
import keyNote from './keyNote.vue'

import Tone from 'tone'

let noteRange = 128

let keyNotes = []
let tickWidth = 0.1

for (var i = 0; i < noteRange; i++) {
  keyNotes[i] = {

    key: i + 'keyNote',
    x: 0,
    y: Number(i),
    w: 1,
    h: 1,
    value: i

  }
}

export default {
  beforeMount: function () {
    var vm = this

    console.log(vm)

    for (var i in vm.track.notes) {
      vm.track.notes[i].index = i
    }

    function animate () {
      vm.cursor.ticks = Tone.Transport.ticks % vm.track.durationTicks

      window.setTimeout(function () {
        window.requestAnimationFrame(animate)
      }, 100)
    }

    window.requestAnimationFrame(animate)
    Tone.Transport.bpm.value = 400
    Tone.Transport.start('+0.1')
  },

  mounted: function () {
    this.id = this._uid

    this.$refs.container.addEventListener('scroll', this.handleScroll)
  },

  watch: {

    track: function (track) {
      console.log('Track is updated.')
      for (var i in track.notes) {
        track.notes[i].index = i
      }
    },
    keyHeight (val) {
      console.log('key Height changed')
      console.log(val)
    }

  },
  methods: {
    handleScroll: function (e) {
      console.log(e.target.scrollLeft)

      console.log(this.$refs.keyNoteBar)

      var dom = this.$refs.keyNoteBar

      dom.style.left = e.target.scrollLeft + 'px'
    },
    noteUpdated: function (event) {
      console.log(event)
      console.log(this.track.notes)
      for (var i in event) {
        this.track.notes[Number(event.index)][i] = event[i]
      }
    }
  },

  data: function () {
    return {
      notes: [],

      cursor: {
        ticks: 0

      },

      durationTicks: 100,
      noteRange: noteRange,
      keyNotes: keyNotes,
      keyHeight: 20,
      keyWidth: 100,
      tickWidth: tickWidth,
      rate: 16

    }
  },
  props: {
    track: Object
  },
  components: {
    note,
    keyNote

  }

}
</script>
