<style>

  .signature {
    width:40px;
    display:inline;
  }
  .pianoContainer {

    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    overflow:auto;

  }

  .piano-bottom-menu {
    height:20px;

  }

  .piano-left-menu {
    height:300px;
  }

  .noteGrid {
    position:absolute;
    min-width:100%;
    width:100%;
    height:100%;
    top:0px;
    left:0px;
  }

  .noteGridContainer {
    position: absolute;
    min-width:100%;
  }

  .grid {
    opacity: 0.5;
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

  .zoom-control {

    float:right

  }

  .zoom-range {

    width:150px!important;
    display:inline-block;

  }

  .zoom-in {
   display:inline-block;
  }

  .zoom-out {
   display:inline-block;

  }
</style>

<template>

  <div class="row pianoRoll">
    <div class="col-2">
      <font-awesome-icon :class="{'d-none':playing}" @click="play()" icon="play" />
      <font-awesome-icon :class="{'d-none':!playing}" @click="pause()" icon="pause" />
      <font-awesome-icon icon="circle" />

      <signature></signature>
    </div>

    <div class="col-10 piano-left-menu">

      <div  ref="pianoContainer" class="pianoContainer">

        <div ref="keyNoteBar"
            @mousedown="keyNoteMousedown"
            @touchstart="keyNoteTouchstart"
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

        <div class="noteGridContainer" :style="{
          height: keyHeight*keyNotes.length+'px',
          left: keyWidth +'px'
          }" >

          <div class="noteGrid" :style="{
              height: keyHeight*keyNotes.length+'px',
              width:(tickWidth*channel.track.durationTicks +keyWidth)+'px'

          }">

            <div class="grid"
              :style="{
                background : 'repeating-linear-gradient( to right, #EEE, #EEE '+tickWidth*rate+'px, #DDD '+tickWidth*rate+'px, #DDD '+tickWidth*rate*2+'px'

            }">

            </div>

            <div class="grid"
              :style="{
                background : 'repeating-linear-gradient( to top, #EEE, #EEE '+keyHeight+'px, #DDD '+keyHeight+'px, #DDD '+keyHeight*2+'px)'

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
              :tickWidth=tickWidth
              :keyHeight="keyHeight"
              @update="noteUpdated"
              @selected="noteSelected"
            >{{note.i}}</note>

          </div>
        </div>

      </div>

    </div>

    <div class="col-12 piano-bottom-menu">

      <!-- Zoom in Zoom control-->
      <div class="zoom-control">
        <font-awesome-icon class="zoom-in" @click="zoomW(-0.1)" icon="search-minus" />
        <b-form-input  class="zoom-range" id="controls"  v-model=zoom type="range" min="0" max="1" step="0.001"></b-form-input>
        <font-awesome-icon  class="zoom-out" @click="zoomW(+0.1)" icon="search-plus" />
      </div>

    </div>

  </div>

</template>

<script>

import note from './note.vue'
import keyNote from './keyNote.vue'
import signature from './signature.vue'

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

    // console.log(this.channel.track)

    this.channel.track.on('updated', function (track) {
      // console.log(track)
    })

    this.channel.on('play', function () {
      vm.playing = true
    })

    this.channel.on('pause', function () {
      vm.playing = false
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
    },
    zoom () {
      console.log(this.zoom)
      this.tickWidth = Number(this.zoom)
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

    keyNoteMousedown: function (e) {
      this.initialKeyHeight = this.keyHeight
      this.initialOffsetY = e.clientY
      console.log('mouse height')
      window.document.addEventListener('mousemove', this.keyNoteMousemove)
      window.document.addEventListener('mouseup', this.keyNoteMouseup)
    },
    keyNoteMousemove: function (e) {
      var distance = this.initialOffsetY - e.clientY

      console.log('whhhuuu')

      if (this.initialKeyHeight + distance > 0.1) {
        this.keyHeight = this.initialKeyHeight + distance
      }

      // console.log(distance)
    },

    keyNoteMouseup: function (e) {
      window.document.removeEventListener('mousemove', this.keyNoteMousemove)
      window.document.removeEventListener('mouseup', this.keyNoteMouseup)
    },

    keyNoteTouchstart: function (e) {

    },

    zoomW: function (increment) {
      this.zoom += increment
    },
    noteSelected: function (payload) {
      // console.log(payload)
      // console.log(this.channel.track)

      // this.channel.track.updateNote(payload)
    },
    noteUpdated: function (payload) {
      // console.log(payload)
      // console.log(this.channel.track)

      // this.channel.track.updateNote(payload)
    }
  },
  computed: {
    'PPQ': function () {
      return Tone.Transport.PPQ
    }
  },

  data: function () {
    return {
      notes: [],

      cursor: {
        ticks: 0

      },

      playing: false,

      durationTicks: 100,
      noteRange: noteRange,
      keyNotes: keyNotes,
      keyHeight: 20,
      keyWidth: 100,
      tickWidth: tickWidth,
      zoom: 1,
      rate: 32

    }
  },
  props: {
    channel: Object
  },
  components: {
    note,
    keyNote,
    signature

  }

}
</script>
