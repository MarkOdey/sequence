import { describe, it, expect } from 'vitest'
import Note from '../factories/Note.js'
import Track from '../factories/Track.js'
import SelectionBox from '../factories/SelectionBox.js'

describe('Note', () => {
    it('creates a note with midi and ticks', () => {
        const note = new Note({ midi: 60, ticks: 0, durationTicks: 100 })
        expect(note.midi).toBe(60)
        expect(note.ticks).toBe(0)
        expect(note.durationTicks).toBe(100)
    })

    it('updates note properties', () => {
        const note = new Note({ midi: 60, ticks: 0, durationTicks: 100 })
        note.update({ midi: 64, ticks: 50 })
        expect(note.midi).toBe(64)
        expect(note.ticks).toBe(50)
    })

    it('emits selected/deselected events', () => {
        const note = new Note({ midi: 60, ticks: 0, durationTicks: 100 })
        let selectedFired = false
        let deselectedFired = false
        note.on('selected', () => { selectedFired = true })
        note.on('deselected', () => { deselectedFired = true })
        note.select()
        expect(note.selected).toBe(true)
        expect(selectedFired).toBe(true)
        note.deselect()
        expect(note.selected).toBe(false)
        expect(deselectedFired).toBe(true)
    })
})

describe('SelectionBox', () => {
    it('activates and deactivates', () => {
        const box = new SelectionBox()
        let activated = false
        let deactivated = false
        box.on('activated', () => { activated = true })
        box.on('deactivated', () => { deactivated = true })
        box.activate({ clientX: 10, clientY: 20 })
        expect(box.active).toBe(true)
        expect(activated).toBe(true)
        box.deactivate()
        expect(box.active).toBe(false)
        expect(deactivated).toBe(true)
    })
})
