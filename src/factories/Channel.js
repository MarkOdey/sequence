import Tone from 'tone'
import Track from './Track.js'
import Project from './Project.js'
var EventEmitter = require('events')

Tone.Transport.bpm.value = 120

var inherits = require('util').inherits

class Channel {
    constructor (payload) {
        this.track = {}
        this.audio = new Tone.Channel()
        this.midiIn = {}
        this.midiOut = {}

        this.loop = setInterval(() => {
            // triggered every eighth note.

            this.tick()
        }, 200)

        // //console.log(payload)

        this.audio.toMaster()

        this.playing = true

        this.id = Math.round(Math.random() * 10000)

        // Object.assign(this, payload)

        this.tick = (payload) => {
            this.emit('tick')
        }

        this.updateTrack = (payload) => {
            // Adding the channel to the payload.
            payload.channel = this
            if (this.track !== undefined) {
                this.track = new Track(payload)
            } else {
                this.track.update(payload)
            }

            // console.log(this.track)
            this.emit('updated', this)
            this.emit('trackUpdated', this.track)
        }

        this.play = (payload) => {
            // this.loop.start()
            // Tone.Transport.start('+1')
            this.playing = true
            this.emit('play', payload)
        }

        this.pause = (payload) => {
            // this.loop.stop()
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
                    // console.log(store)
                })
            }
        }

        if (payload !== undefined && payload.track !== undefined) {
            this.updateTrack(payload.track)
        }

        Project.on('play', () => {
            if (this.playing) {
                this.play()
            }
        })

        Project.on('pause', () => {

        })

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
