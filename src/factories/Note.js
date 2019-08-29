import Tone from 'tone'

var EventEmitter = require('events')

var inherits = require('util').inherits

class Note {
  constructor (payload) {
    var self = this
    this.duration = 0
    this.durationTicks = 0

    var noteOnTimer, noteOffTimer

    var noteOn = function noteOn () {
      console.log('note fired')
      self.emit('noteOn', self)
    }

    var noteOff = function noteOff () {
      console.log('note off')
      self.emit('noteOff', self)
    }

    this.update = function (payload) {
      console.log('updating')
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

      if (noteOnTimer !== undefined) {
        Tone.Transport.cancel(noteOnTimer)
      }

      if (noteOffTimer !== undefined) {
        Tone.Transport.cancel(noteOffTimer)
      }

      console.log('scheduling a note')
      if (this.ticks !== undefined) {
        noteOnTimer = Tone.Transport.schedule(noteOn, this.ticks + 'i')
      }

      // Once the noteOn fired we register the noteOff sequence.
      if (this.durationTicks !== undefined) {
        noteOffTimer = Tone.Transport.schedule(noteOff, this.ticks + this.durationTicks + 'i')
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
