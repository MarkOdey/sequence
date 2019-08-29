<style>

  .pianoContainer {

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

  .noteGridContainer {
    position: absolute;
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

  <div class="row pianoRoll">
    <div class="col-1">
      <font-awesome-icon @click="play()" icon="play" />
      <font-awesome-icon @click="pause()" icon="pause" />
      <font-awesome-icon icon="circle" />

    </div>

    <div class="col ">
      <div  ref="pianoContainer" class="pianoContainer">

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
          left: keyWidth +'px'
          }" class="noteGridContainer">
          <div :style="{
              height: keyHeight*keyNotes.length+'px',
              width:(tickWidth*channel.track.durationTicks +keyWidth)+'px'

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
              v-for="note in channel.track.notes"
              :index="note.index"
              :key="note.index"
              :data="note"
              :tickWidth="tickWidth"
              :keyHeight="keyHeight"
              @update="noteUpdated"
            >{{note.i}}</note>

          </div>
        </div>

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

    function animate () {
      vm.cursor.ticks = Tone.Transport.ticks % vm.channel.track.durationTicks

      window.setTimeout(function () {
        window.requestAnimationFrame(animate)
      }, 100)
    }

    window.requestAnimationFrame(animate)

    console.log(this.channel.track)

    this.channel.track.on('updated', function (track) {
      console.log(track)
    })
  },

  mounted: function () {
    this.id = this._uid
    this.$refs.pianoContainer.addEventListener('scroll', this.handleScroll)
  },

  watch: {

    keyHeight (val) {
      console.log('key Height changed')
      console.log(val)
    }

  },
  methods: {
    play: function (e) {
      console.log('starting')
      this.channel.play()
    },
    pause: function (e) {
      this.channel.pause()
    },
    handleScroll: function (e) {
      // console.log(e.target.scrollLeft)
      // console.log(this.$refs.keyNoteBar)

      var dom = this.$refs.keyNoteBar

      dom.style.left = e.target.scrollLeft + 'px'
    },
    noteUpdated: function (payload) {
      console.log(payload)
      console.log(this.channel.track)

      // this.channel.track.updateNote(payload)
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
    channel: Object
  },
  components: {
    note,
    keyNote

  }

}
</script>
