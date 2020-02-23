// import Tone from 'tone'
import Note from './Note.js'
// import Tone from 'tone'
var EventEmitter = require('events')

var inherits = require('util').inherits

class Track {
    constructor (payload) {
        var self = this
        this.notes = []

        // Warning these elements are keyed by midi X ticks to ensure its unicity.
        this.noteOnEvents = {}
        this.noteOffEvents = {}
        this.noteUpdatedEvents = {}

        // Creating an audio node.

        this.duration = 0
        this.durationTicks = 0

        this.startTick = 0

        this.ticks = 0

        this.getNotesBetween = function (start, end, keyStart, keyEnd) {
            var notes = []
            // //console.log(start, end)
            for (var i in this.notes) {
                var note = this.notes[i]

                // //console.log(keyStart, keyEnd, note.midi)
                if (start < note.ticks && end > note.ticks &&
          keyStart < note.midi && keyEnd > note.midi) {
                    notes.push(note)
                }
            }

            return notes
        }

        this.addNote = function (payload) {
            // Setting the channel reference to each notes.
            if (this.channel !== undefined) {
                payload.channel = this.channel
            }
            var note = new Note(payload)
            this.notes.push(note)
            this.emit('noteAdded', note)

            const noteOnEvent = function (note) {
                self.emit('noteOn', note)
            }

            const noteOffEvent = function (note) {
                self.emit('noteOff', note)
            }

            const noteUpdatedEvent = function (note) {
                self.emit('noteUpdated', note)
                self.emit('updated', self)
            }

            this.noteOnEvents['m' + note.midi + 't' + note.ticks] = noteOnEvent
            this.noteOffEvents['m' + note.midi + 't' + note.ticks] = noteOffEvent
            this.noteUpdatedEvents['m' + note.midi + 't' + note.ticks] = noteUpdatedEvent
            note.on('updated', noteUpdatedEvent)

            note.on('noteOn', noteOnEvent)

            note.on('noteoff', noteOffEvent)
        }

        this.removeNote = function (note) {
            const i = this.notes.indexOf(note)
            this.notes.splice(i, 1)

            this.emit('noteAdded', note)

            note.removeListener('updated', this.noteUpdatedEvents['m' + note.midi + 't' + note.ticks])

            note.removeListener('noteOn', this.noteOnEvents['m' + note.midi + 't' + note.ticks])

            note.removeListener('noteoff', this.noteOffEvents['m' + note.midi + 't' + note.ticks])
        }

        /**
     * Deselect all
     */
        this.deselectAll = function (excludes) {
            for (var i in self.notes) {
                if (excludes !== undefined && excludes.indexOf(self.notes[i]) !== -1) {
                    continue
                }

                self.notes[i].deselect()
            }
        }

        this.getSelected = function () {
            var notes = []
            for (var i in self.notes) {
                var note = self.notes[i]
                if (note.selected === true) {
                    notes.push(note)
                }
            }

            return notes
        }

        this.hasSelected = function () {
            var selected = this.getSelected()
            if (selected.length === 0) {
                return false
            } else {
                return true
            }
        }

        this.update = function (payload) {
            if (payload.channel !== undefined) {
                this.channel = payload.channel
            }
            if (payload.duration !== undefined) {
                this.duration = payload.duration
            }

            if (payload.durationTicks !== undefined) {
                this.durationTicks = payload.durationTicks
            }

            if (payload.endTick !== undefined) {
                this.endTick = payload.endTick
            }

            if (payload.startTick !== undefined) {
                this.startTick = payload.startTick
            }

            // If endTick is not defined in payload use durationTicks as the endTicks
            if (this.endTick === undefined && payload.durationTicks !== undefined) {
                this.endTick = this.durationTicks
            }

            if (payload.notes !== undefined) {

                console.log('updating notest')

                for (var note of this.notes) {
                    this.removeNote(note)
                }

                // Lets loop through each notes to assign an id to it
                for (var i in payload.notes) {
                    this.addNote(payload.notes[i])
                }
            }

            this.emit('updated', this)
        }

        this.play = function () {

        }

        this.remove = function (note) {

        }

        this.update(payload)
    }
}

inherits(Track, EventEmitter)

export default Track
