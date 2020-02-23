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

        this.loadMidi = function (midi) {
            Tone.Transport.PPQ = midi.header.ppq
            Tone.context.latencyHint = 'fastest'
            Tone.Transport.loopStart = 0
            Tone.Transport.loopEnd = midi.durationTicks + 'i'
            Tone.Transport.loop = true

            for (const track of midi.tracks) {
                this.channels.push(new Channel({ 'track': track }))
            }

            let payload = {

                midi: midi,
                tracks: midi.tracks

            }

            this.update(payload)
        }

        this.pause = function () {
            this.emit('pause')
            Tone.Transport.pause()
        }

        this.play = function () {
            this.emit('play')
            Tone.Transport.start()
        }

        this.update = function (payload) {
            if (payload === undefined) {
                return
            }

            if (payload.tracks) {

            }
        }
    }
}

inherits(Project, EventEmitter)

// We instantiate reference and return it.
export default new Project()
