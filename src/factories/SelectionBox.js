// import Tone from 'tone'
// import Note from './Note.js'
// import Tone from 'tone'
import EventEmitter from 'events'

class SelectionBox extends EventEmitter {
    constructor (payload) {
        super()
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

export default SelectionBox
