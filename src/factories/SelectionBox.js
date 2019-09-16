// import Tone from 'tone'
import Note from './Note.js'
import Tone from 'tone'
var EventEmitter = require('events')

var inherits = require('util').inherits

class SelectionBox {
  constructor (payload) {
    var self = this

    if (payload !== undefined && payload.track !== undefined) {
      self.track = payload.track
    }
    self.active = false
    this.activate = function (event) {
      self.active = true
      self.emit('activated', event)
    }
    this.deactivate = function (event) {
      self.active = false
      self.emit('deactivated', event)
    }

    this.selectRange = function (payload) {
      this.emit('rangeSelected', payload)
    }
  }
}

inherits(SelectionBox, EventEmitter)

export default SelectionBox
