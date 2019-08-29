import Tone from 'tone'
import Track from './Track.js'
var EventEmitter = require('events')

Tone.Transport.bpm.value = 120

var inherits = require('util').inherits

class Channel {
  constructor (payload) {
    this.track = []
    this.audio = new Tone.AudioNode()
    this.midiIn = {}
    this.midiOut = {}

    // console.log(payload)

    this.playing = true

    Tone.Transport.on('start', function () {

    })

    this.id = Math.round(Math.random() * 10000)

    Object.assign(this, payload)

    this.updateTrack = (payload) => {
      if (this.track !== undefined) {
        this.track = new Track(payload)
      } else {
        this.track.update(payload)
      }
      this.emit('updated', this)
      this.emit('trackUpdated', this.track)
    }

    this.play = (payload) => {
      Tone.Transport.start()
      this.emit('play', payload)
    }

    this.pause = (payload) => {
      Tone.Transport.pause()
      this.emit('pause', payload)
    }

    // Added Channels in the global reference.
    Channel.Channels.push(this)
  }

  update (payload) {
    Object.assign(this, payload)
    this.emit('updated', this)
  }

  getTrack () {
    return this.track
  }

  noteOn () {
    this.emit('noteOn')
  }

  noteOff () {
    this.emit('noteOff')
  }
}

inherits(Channel, EventEmitter)

Channel.Channels = []

export default Channel
