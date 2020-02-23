import Tone from 'tone'

var EventEmitter = require('events')

var inherits = require('util').inherits
/**
 *
 */
class Note {
    constructor (payload) {
        var self = this
        this.duration = 0
        this.durationTicks = 0
        this.noteOffTimer = undefined
        this.noteOnTimer = undefined
        this.initialClientX = undefined
        this.initialClientY = undefined

        var noteOn = function noteOn () {
            if (this.channel !== undefined && this.channel.playing === false) {
                return
            }
            // console.log('note fired')
            self.emit('noteOn', self)
        }

        var noteOff = function noteOff () {
            // //console.log('note off')
            self.emit('noteOff', self)
        }

        this.setElement = function (element) {
            this.element = element
        }

        this.startDrag = function (event) {
            self.dragging = true

            var bounds = this.element.getBoundingClientRect()

            self.initialClientX = bounds.left
            self.initialClientY = bounds.top

            self.emit('startDrag', event)
        }

        this.select = function () {
            // //console.log('firing select state.')

            self.selected = true
            self.emit('selected', self)
        }

        this.deselect = function () {
            // //console.log('firing deselect state')
            self.selected = false
            self.emit('deselected', self)
        }
        this.update = function (payload) {
            // //console.log('updating')
            if (payload.ticks !== undefined) {
                this.ticks = payload.ticks
                this.time = payload.ticks + 'i'
            }

            if (payload.velocity !== undefined) {
                this.velocity = payload.velocity
            }

            if (payload.duration !== undefined) {
                this.duration = payload.duration
            }

            if (payload.durationTicks !== undefined) {
                this.durationTicks = payload.durationTicks
            }

            if (payload.midi !== undefined) {
                this.midi = payload.midi
            }

            if (payload.channel !== undefined) {
                this.channel = payload.channel
            }

            if (self.noteOnTimer !== undefined) {
                Tone.Transport.clear(self.noteOnTimer)
            }

            if (self.noteOffTimer !== undefined) {
                Tone.Transport.clear(self.noteOffTimer)
            }

            // console.log(this.channel)

            // console.log('scheduling a note')
            if (payload.ticks !== undefined) {
                // This is where the note is wrapped around the tonejs transport.
                this.noteOnTimer = Tone.Transport.schedule(noteOn, this.ticks + 'i')
            }

            // Once the noteOn fired we register the noteOff sequence.
            if (payload.durationTicks !== undefined || payload.ticks !== undefined) {
                this.noteOffTimer = Tone.Transport.schedule(noteOff, this.ticks + this.durationTicks + 'i')
            }

            // Lets loop through each notes to assign an id to it
            this.emit('updated', this)
        }

        self.update(payload)

        this.remove = function (note) {

        }
    }
}

inherits(Note, EventEmitter)

export default Note
