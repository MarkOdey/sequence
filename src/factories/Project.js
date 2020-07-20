import Tone from 'tone'

import Channel from '../factories/Channel.js'

var EventEmitter = require('events')
var inherits = require('util').inherits

/**
 *
 */
class Project {
    constructor () {
        this.channels = []

        this.ppq = 1
        this.loop = false

        this.durationTicks = 0

        this.loadMidi = function (midi) {
            let payload = {

                midi: midi,
                tracks: midi.tracks

            }

            this.update(payload)
        }

        this.pause = function () {
            this.emit('pause')
            Tone.Transport.pause()
            for (var channel of this.channels) {
                channel.pause()
            }
        }

        this.play = function () {
            this.emit('play')
            Tone.Transport.start()
            for (var channel of this.channels) {
                channel.play()
            }
        }

        this.update = function (payload) {
            if (payload === undefined) {
                return
            }

            this.ppq = Tone.Transport.PPQ = payload.midi.header.ppq
            this.durationTicks = payload.midi.durationTicks
            Tone.context.latencyHint = 'fastest'
            Tone.Transport.loopStart = 0
            Tone.Transport.loopEnd = payload.midi.durationTicks + 'i'

            Tone.Transport.loop = true

            if (Tone) {
                setInterval(() => {
                    // console.log(Tone.Transport.ticks)
                }, 500)
            }

            for (const track of payload.midi.tracks) {
                this.channels.push(new Channel({ 'track': track }))

                console.log(track)
            }

            this.emit('updated')

            if (payload.tracks) {

            }
        }
    }
}

inherits(Project, EventEmitter)

function contextClick () {
    Tone.context.resume()

    console.log('context click')
    window.document.removeEventListener('click', contextClick)
}

window.document.addEventListener('click', contextClick)

// We instantiate reference and return it.
export default new Project()
