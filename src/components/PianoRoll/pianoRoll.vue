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
    transition-property: left;
    transition-duration: 0.1s;

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

            <keyBar :keyHeight="keyHeight" @keyHeightChanged="keyHeightUpdate" ></keyBar>

          <trackMarker :track="track"></trackMarker>

          <div  class="noteGridContainer" :style="{
            height: keyHeight*keyNotes.length+'px',
            left: keyWidth +'px'
            }" >

            <div ref='noteGrid' class="noteGrid" :style="{
                height: keyHeight*keyNotes.length+'px',
                width:(tickWidth*track.durationTicks +keyWidth)+'px'
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

            <div @click="toggleEditMode()"  class="btn btn-outline-secondary">
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
import keyBar from './keyBar.vue'
import noteField from './noteField.vue'
import selectionBox from './selectionBox.vue'

import trackMarker from './trackMarker.vue'

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

    mounted: function () {
        this.id = this._uid

        this.selectionBox.on('rangeSelected', (event) => {
            // //console.log(event)

            var ticks = event.x / this.tickWidth
            var durationTicks = (event.x + event.width) / this.tickWidth

            var keyStart = (event.y) / this.keyHeight
            var keyEnd = (event.y + event.height) / this.keyHeight

            var notes = this.track.getNotesBetween(ticks, durationTicks, keyStart, keyEnd)

            // console.log(notes)

            for (var i in notes) {
                notes[i].select()
            }
        })

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

        // We instantiate listener for the channel.
        if (this.channel !== undefined) {
            // console.log('track updated')

            this.updateChannel()
        }
    },

    watch: {

        zoom () {
            // //console.log(this.zoom)
            this.tickWidth = Number(this.zoom)
        },
        channel  () {
            this.updateChannel()
        },
        track () {
            this.updateTrack()
        }

    },
    methods: {
        keyHeightUpdate: function (e) {
            // //console.log(e)
            this.keyHeight = e
        },
        backgroundMouseDown: function (event) {
            var self = this

            if (!this.doubleClickedInvoked) {
                this.doubleClickedInvoked = true
                window.setTimeout(function () {
                    self.doubleClickedInvoked = false
                }, 300)
            } else {
                // Double click event fired.
                // //console.log('Tapped twice')
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

                var parent = this.$refs['noteGrid']
                var bounds = parent.getBoundingClientRect()

                var noteX = (x - bounds.left)
                var noteY = (y - bounds.top)

                var ticks = Math.round(noteX / this.tickWidth)
                var midi = Math.floor((bounds.height - noteY) / this.keyHeight)

                // //console.log('adding note.', midi, ticks)

                this.track.addNote({ 'midi': midi, 'ticks': ticks, 'durationTicks': self.rate })

                this.renderNotesInView()
                // ////console.log(this)
            }

            if (this.track.selected === undefined) {
                this.track.deselectAll()
            }

            this.selectionBox.activate(event)
        },
        play: function (e) {
            // //console.log('starting')

            this.channel.play()

            this.playing = this.channel.playing
            this.$forceUpdate()
        },
        pause: function (e) {
            this.channel.pause()

            this.playing = this.channel.playing
            this.$forceUpdate()
        },
        handleScroll: function (e) {
            if (this.scrollBuffer !== undefined) {
                clearTimeout(this.scrollBuffer)
            }

            this.scrollBuffer = setTimeout(() => {
                delete this.scrollBuffer
                this.renderNotesInView()
            }, 100)
        },
        renderNotesInView: function () {
            this.notesInView = []

            let parentWidth = this.$refs.pianoContainer.offsetWidth
            let parentHeight = this.$refs.pianoContainer.offsetHeight

            let parentLeft = this.$refs.pianoContainer.scrollLeft
            let parentTop = this.$refs.pianoContainer.scrollTop

            let innerHeight = this.keyNotes.length * this.keyHeight

            for (var i in this.track.notes) {
                let note = this.track.notes[i]

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
                    // //console.log('In the viewport!')
                } else {
                    // this.notesInView.push(note)
                    // //console.log('Not in the viewport... whomp whomp')
                }
            }
        },
        toggleFollowCursor: function (e) {
            // console.log('toggling cursor')
            if (this.followCursor === true) {
                this.followCursor = false
            } else {
                this.followCursor = true
            }
        },
        toggleEditMode: function (e) {
            if (this.editMode === true) {
                this.editMode = false
            } else {
                this.editMode = true
            }
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
                    var selectedNotes = this.track.getSelected()
                    for (var i in selectedNotes) {
                        var selectedNote = selectedNotes[i]
                        selectedNote.startDrag(event)
                    }
                } else {
                    this.track.deselectAll()
                    note.select()
                    note.startDrag()
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

            var selectedNotes = this.track.getSelected()

            for (var i in selectedNotes) {
                var selectedNote = selectedNotes[i]

                // //console.log(selectedNote)

                if (selectedNote.initialClientX === undefined || selectedNote.initialClientY === undefined) {
                    continue
                }

                // //console.log(bounds.left, bounds.top)
                var noteX = (x - bounds.left) + (selectedNote.initialClientX)
                var noteY = (y - bounds.top) + (selectedNote.initialClientY)

                var ticks = Math.round(noteX / this.tickWidth)
                var midi = Math.floor((bounds.height - noteY) / this.keyHeight)
                // //console.log(this)

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
            // //console.log(payload)
            // //console.log(this.track)

            // this.track.updateNote(payload)
        },
        updateTrack: function () {
            this.track.on('updated', function (track) {
                // console.log('track updated')
                this.cursor.ticks = Tone.Transport.ticks % this.track.durationTicks
                this.durationTicks = this.track.durationTicks

                this.$forceUpdate()

                // console.log(this.track)

            // //console.log(track)
            })
        },
        channelTick: function () {
            // //console.log('animating cursor')
            this.cursor.ticks = Tone.Transport.ticks % this.track.durationTicks
            this.durationTicks = this.track.durationTicks

            var offset = this.cursor.ticks * tickWidth

            if (
                this.playing === true &&
                this.followCursor === true && (
                    offset <= this.$refs.pianoContainer.scrollLeft ||
                    offset >= this.$refs.pianoContainer.scrollLeft + this.$refs.pianoContainer.offsetWidth)) {
                this.$refs.pianoContainer.scrollLeft = offset - 20
            }
            this.$forceUpdate()
        },
        channelPlay: function () {
            this.playing = true
        },
        channelPause: function () {
            this.playing = false
        },
        updateChannel: function () {
            // console.log('channel instantiated in pianoRoll')

            this.cursor.ticks = Tone.Transport.ticks % this.track.durationTicks
            this.durationTicks = this.track.durationTicks

            if (this.channel === undefined) {
                return
            }

            this.channel.removeListener('tick', this.channelTick)
            this.channel.removeListener('play', this.channelPlay)
            this.channel.removeListener('pause', this.channelPause)

            this.channel.on('tick', this.channelTick)

            this.channel.on('play', this.channelPlay)

            this.channel.on('pause', this.channelPause)
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

            editMode: true, // Will allow to edit the current notes on the set. If not will create a new note.

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
        channel: Object,
        track: Object
    },
    components: {
        note,
        selectionBox,
        trackMarker,

        keyBar,
        noteField

    }

}
</script>
