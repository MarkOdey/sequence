import Tone from 'tone'
import Track from './Track.js'
var EventEmitter = require('events')

Tone.Transport.bpm.value = 120

var inherits = require('util').inherits

class Channel {
    constructor (payload) {
        this.track = []
        this.audio = new Tone.Channel()
        this.midiIn = {}
        this.midiOut = {}

        // console.log(payload)

        this.audio.toMaster()

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
            Tone.Transport.start('+1')
            this.playing = true
            this.emit('play', payload)
        }

        this.pause = (payload) => {
            Tone.Transport.pause()
            this.playing = false
            this.emit('pause', payload)
        }

        this.mute = () => {
            this.audio.mute = true
            this.emit('mute')
        }

        this.unmute = () => {
            this.audio.mute = false
            this.emit('unmute')
        }

        this.record = () => {
            const audio = document.querySelector('audio')

            const actx = Tone.context
            const dest = actx.createMediaStreamDestination()
            const recorder = new MediaRecorder(dest.stream)

            this.audio.connect(dest)

            const chunks = []

            recorder.ondataavailable = evt => chunks.push(evt.data)
            recorder.onstop = evt => {
                let blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
                audio.src = URL.createObjectURL(blob)

                window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 1024, function (store) {
                    console.log(store)
                })
            }
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
