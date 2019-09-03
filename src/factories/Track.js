// import Tone from 'tone'
import Note from './Note.js'
import Tone from 'tone'
var EventEmitter = require('events')

var inherits = require('util').inherits

class Track {
  constructor (payload) {
    var self = this
    this.notes = []

    // Creating an audio node.

    this.duration = 0
    this.durationTicks = 0

    this.ticks = 0

    this.addNote = function (payload) {
      var note = new Note(payload)
      this.notes.push(note)
      this.emit('noteAdded', note)

      note.on('updated', function (note) {
        self.emit('noteUpdated', note)
        self.emit('updated', this)
      })

      note.on('selected', function (note) {
        self.deselectAll([note])
      })
    }

    /**
     * Deselect all
     */
    this.deselectAll = function (excludes) {
      for (var i in self.notes) {
        if (excludes.indexOf(self.notes[i]) === -1) {
          continue
        }

        self.notes[i].deselect()
      }
    }

    this.update = function (payload) {
      if (payload.duration !== undefined) {
        this.duration = payload.duration
      }

      if (payload.durationTicks !== undefined) {
        this.durationTicks = payload.durationTicks
      }

      // Lets loop through each notes to assign an id to it
      for (var i in payload.notes) {
        self.addNote(payload.notes[i])
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
