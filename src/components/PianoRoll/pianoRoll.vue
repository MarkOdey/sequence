<style>

  .signature {
    width:40px;
    display:inline;
  }

  .pianoRoll {
    height:100%;
  }
  .pianoContainer {

    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    overflow:auto;

  }

  .piano-main {
    display: flex;
    flex-flow: column;

  }
  .piano-main-content {
    flex:1;
    position:relative;

  }
  .piano-bottom-menu {
    min-height:40px;

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
      touch-action: none;
      user-select: none;
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
  <div class="col-12">
  <div class="row pianoRoll">
    <div class="col-2">
      <font-awesome-icon :class="{'d-none':playing}" @click="play()" icon="play" />
      <font-awesome-icon :class="{'d-none':!playing}" @click="pause()" icon="pause" />
      <font-awesome-icon icon="circle" />

      <noteField :value="durationTicks+'i'"></noteField>
    </div>

    <div class="col piano-main">

      <div class="row piano-main-content">

        <div ref="pianoContainer" class="pianoContainer">

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

          <div  class="noteGridContainer" :style="{
            height: keyHeight*keyNotes.length+'px',
            left: keyWidth +'px'
            }" >

            <div ref='noteGrid' class="noteGrid" :style="{
                height: keyHeight*keyNotes.length+'px',
                width:(tickWidth*channel.track.durationTicks +keyWidth)+'px'
              }">

              <div  class="grid"
                :style="{
                  background : 'repeating-linear-gradient( to right, #EEE, #EEE '+tickWidth*rate+'px, #DDD '+tickWidth*rate+'px, #DDD '+tickWidth*rate*2+'px'

              }">

              </div>

              <div  @mousedown="backgroundMouseDown" class="grid"
                :style="{
                  background : 'repeating-linear-gradient( to top, #EEE, #EEE '+keyHeight+'px, #DDD '+keyHeight+'px, #DDD '+keyHeight*2+'px)'

              }">

              </div>

              <selectionBox :data="selectionBox"></selectionBox>

              <div class="cursor"
              :style="{
                left:cursor.ticks*tickWidth+'px'
              }"></div>

              <note class="note"

                v-for="note in notesInView"
                :index="note.index"
                :key="note.index"
                :data="note"
                :tickWidth=tickWidth
                :keyHeight="keyHeight"
                @update="noteUpdated"
                @selected="noteSelected"
                @down="noteDown"
                @move="noteMove"
                @up="noteUp"
              >{{note.i}}</note>

            </div>
          </div>

        </div>
      </div>

      <div class="row piano-bottom-menu">

        <div class="col-12">
          <!-- Zoom in Zoom control-->
          <div class="float-right">

              <font-awesome-icon class="zoom-in" @click="zoomW(-0.1)" icon="search-minus" />
              <b-form-input  class="zoom-range" id="controls"  v-model=zoom type="range" min="0" max="1" step="0.001"></b-form-input>
              <font-awesome-icon  class="zoom-out" @click="zoomW(+0.1)" icon="search-plus" />

          </div>

          <div class="float-right">

            <div :class="{ active : followCursor}" @click="toggleFollowCursor()" class=" btn btn-outline-secondary follow-cursor ">
              <font-awesome-icon class="i-cursor" icon="i-cursor" />
            </div>

            <div class="btn btn-outline-secondary">
              <font-awesome-icon class="edit"  icon="edit" />
            </div>

          </div>
        </div>

      </div>

    </div>

  </div>

  </div>

</template>

<script>

import note from './note.vue'
import keyNote from './keyNote.vue'
import noteField from './noteField.vue'
import selectionBox from './selectionBox.vue'

import Tone from 'tone'

// Possibility to use https://github.com/entwicklerstube/babel-plugin-root-import
// Could be formated at ~/factories/etc...
import SelectionBox from '../../factories/SelectionBox.js'
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
      vm.durationTicks = vm.channel.track.durationTicks

      var offset = vm.cursor.ticks * tickWidth

      if (
        vm.playing === true &&
        vm.followCursor === true && (
          offset <= vm.$refs.pianoContainer.scrollLeft ||
        offset >= vm.$refs.pianoContainer.scrollLeft + vm.$refs.pianoContainer.offsetWidth)) {
        console.log(vm.$refs.pianoContainer.offsetWidth)

        vm.$refs.pianoContainer.scrollLeft = offset - 20

        // Updating keybar to be at the right position
        var dom = vm.$refs.keyNoteBar

        dom.style.left = vm.$refs.pianoContainer.scrollLeft + 'px'
      }

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

    this.selectionBox.on('rangeSelected', function (event) {
      // console.log(event)

      var ticks = event.x / vm.tickWidth
      var durationTicks = (event.x + event.width) / vm.tickWidth

      var keyStart = (event.y) / vm.keyHeight
      var keyEnd = (event.y + event.height) / vm.keyHeight

      var notes = vm.channel.track.getNotesBetween(ticks, durationTicks, keyStart, keyEnd)

      console.log(notes)

      for (var i in notes) {
        notes[i].select()
      }
    })
  },

  mounted: function () {
    this.id = this._uid
    this.$refs.pianoContainer.addEventListener('scroll', this.handleScroll)

    this.$el.addEventListener('mouseover', function () {
      this.focused = true
    })
    this.$el.addEventListener('mouseout', function () {
      this.focused = false
    })

    this.$el.addEventListener('touchenter', function () {
      this.focused = true
    })
    this.$el.addEventListener('touchleave', function () {
      this.focused = false
    })
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
    backgroundMouseDown: function (event) {
      var self = this

      if (!this.doubleClickedInvoked) {
        this.doubleClickedInvoked = true
        window.setTimeout(function () {
          self.doubleClickedInvoked = false
        }, 300)
      } else {
        // Double click event fired.
        console.log('Tapped twice')
        // Resetting state.
        this.doubleClickedInvoked = false

        var x = event.pageX
        var y = event.pageY

        // If the event is fired from a mobile device
        if (event.touches !== undefined && event.touches.length === 1) {
          const touch = event.targetTouches.item(0)
          x = touch.pageX
          y = touch.pageY
        }

        var parent = event.target.parentElement
        var bounds = parent.getBoundingClientRect()

        var noteX = (x - bounds.left)
        var noteY = (y - bounds.top)

        var ticks = Math.round(noteX / this.tickWidth)
        var midi = Math.floor((bounds.height - noteY) / this.keyHeight)

        self.channel.track.addNote({ 'midi': midi, 'ticks': ticks, 'durationTicks': self.rate })

        // console.log(this)
      }

      if (self.channel.track.selected === undefined) {
        self.channel.track.deselectAll()
      }

      self.selectionBox.activate(event)
    },
    play: function (e) {
      console.log('starting')
      this.channel.play()
    },
    pause: function (e) {
      this.channel.pause()
    },
    handleScroll: function (e) {
      var dom = this.$refs.keyNoteBar
      if (this.scrollBuffer !== undefined) {
        clearTimeout(this.scrollBuffer)
      }

      this.scrollBuffer = setTimeout(() => {
        delete this.scrollBuffer
        this.renderNotesInView()
      }, 100)

      dom.style.left = e.target.scrollLeft + 'px'
    },
    renderNotesInView: function () {
      this.notesInView = []

      let parentWidth = this.$refs.pianoContainer.offsetWidth
      let parentHeight = this.$refs.pianoContainer.offsetHeight

      let parentLeft = this.$refs.pianoContainer.scrollLeft
      let parentTop = this.$refs.pianoContainer.scrollTop

      let innerHeight = this.keyNotes.length * this.keyHeight

      for (var i in this.channel.track.notes) {
        let note = this.channel.track.notes[i]

        let bottom = parentHeight + parentTop + ((note.midi * this.keyHeight) - innerHeight)
        let left = note.ticks * this.tickWidth - parentLeft
        let right = left + note.durationTicks * this.tickWidth
        let top = parentHeight + parentTop + ((note.midi * this.keyHeight - this.keyHeight) - innerHeight)

        if (
          top >= 0 - parentWidth &&
          left >= 0 - parentHeight &&
          right <= (parentWidth) * 2 &&
          bottom <= (parentHeight) * 2
        ) {
          this.notesInView.push(note)
          // console.log('In the viewport!')
        } else {
          // this.notesInView.push(note)
          // console.log('Not in the viewport... whomp whomp')
        }
      }
    },
    toggleFollowCursor: function (e) {
      console.log('toggling cursor')
      if (this.followCursor === true) {
        this.followCursor = false
      } else {
        this.followCursor = true
      }
    },
    keyNoteMousedown: function (e) {
      this.initialKeyHeight = this.keyHeight
      this.initialOffsetY = e.pageY
      console.log('mouse height')
      window.document.addEventListener('mousemove', this.keyNoteMousemove)
      window.document.addEventListener('mouseup', this.keyNoteMouseup)
    },
    keyNoteMousemove: function (e) {
      var distance = this.initialOffsetY - e.pageY

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
    noteUp: function (event, note) {

    },
    noteDown: function (event, note) {
      if (!event) event = window.event
      if (event.shiftKey) {
        /* shift is down */
        note.select()
      } else if (event.altKey) {
        /* alt is down */
      } else if (event.ctrlKey) {
        /* ctrl is down */

      } else if (event.metaKey) {
        /* cmd is down */
      } else {
        /* No key is down */

        this.initialClientX = event.pageX
        this.initialClientY = event.pageY

        // If the event is fired from a mobile device
        if (event.touches !== undefined && event.touches.length === 1) {
          const touch = event.targetTouches.item(0)

          this.initialClientX = touch.pageX
          this.initialClientY = touch.pageY
        }

        // Let Check if the note is already selected.
        if (note.selected === true) {
          var selectedNotes = this.channel.track.getSelected()
          for (var i in selectedNotes) {
            var selectedNote = selectedNotes[i]
            selectedNote.startDrag(event)
          }
        } else {
          this.channel.track.deselectAll()
          note.select()
        }
      }
    },
    noteMove: function (event, note) {
      var x = event.pageX
      var y = event.pageY

      // If the event is fired from a mobile device
      if (event.touches !== undefined && event.touches.length === 1) {
        const touch = event.targetTouches.item(0)
        x = touch.pageX
        y = touch.pageY
      }

      x -= this.initialClientX
      y -= this.initialClientY

      var parent = this.$refs['noteGrid']
      var bounds = parent.getBoundingClientRect()

      var selectedNotes = this.channel.track.getSelected()

      for (var i in selectedNotes) {
        var selectedNote = selectedNotes[i]

        // console.log(selectedNote)

        if (selectedNote.initialClientX === undefined || selectedNote.initialClientY === undefined) {
          continue
        }

        console.log(bounds.left, bounds.top)
        var noteX = (x - bounds.left) + (selectedNote.initialClientX)
        var noteY = (y - bounds.top) + (selectedNote.initialClientY)

        var ticks = Math.round(noteX / this.tickWidth)
        var midi = Math.floor((bounds.height - noteY) / this.keyHeight)
        // console.log(this)

        selectedNote.update({ midi: midi, ticks: ticks })
      // this.$emit('update', { index: this.index, midi: midi, ticks: ticks })
      }
    },
    zoomW: function (increment) {
      this.zoom += increment
    },
    noteSelected: function (payload) {

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
      notesInView: [],

      selectionBox: new SelectionBox(),

      cursor: {
        ticks: 0

      },

      doubleClickedInvoked: false,

      focused: false,
      playing: false,

      durationTicks: 100,
      noteRange: noteRange,
      keyNotes: keyNotes,
      bufferRenderNote: false,

      initialClientX: 0,
      initialClientY: 0,
      keyHeight: 20,
      keyWidth: 100,
      tickWidth: tickWidth,
      followCursor: true,
      zoom: 1,
      rate: 256

    }
  },
  props: {
    channel: Object
  },
  components: {
    note,
    selectionBox,
    keyNote,
    noteField

  }

}
</script>
