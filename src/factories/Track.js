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

    this.getNotesBetween = function (start, end, keyStart, keyEnd) {
      var notes = []
      // console.log(start, end)
      for (var i in this.notes) {
        var note = this.notes[i]

        // console.log(keyStart, keyEnd, note.midi)
        if (start < note.ticks && end > note.ticks &&
          keyStart < note.midi && keyEnd > note.midi) {
          notes.push(note)
        }
      }

      return notes
    }

    this.addNote = function (payload) {
      var note = new Note(payload)
      this.notes.push(note)
      this.emit('noteAdded', note)

      note.on('updated', function (note) {
        self.emit('noteUpdated', note)
        self.emit('updated', self)
      })

      note.on('noteOn', function (note) {
        self.emit('noteOn', note)
      })

      note.on('noteoff', function (note) {
        self.emit('noteOff', note)
      })
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
