<template>
          <div ref="keyNoteBar"
              @mousedown="keyNoteMousedown"
              @touchstart="keyNoteTouchstart"
              :style="{
                width: $parent.keyWidth + 'px',
                height: keyHeight*$parent.keyNotes.length+'px',
              }" class="keyNoteBar">

            <keyNote
              v-for="keyNote in $parent.keyNotes"
              :key="keyNote.value"
              :value="keyNote.value"
              :keyHeight="keyHeight"

            ></keyNote>

          </div>
</template>

<script>

import keyNote from './keyNote.vue'

export default {

    mounted: function () {
        this.$parent.$refs.pianoContainer.addEventListener('scroll', this.handleScroll)
    },

    methods: {
        handleScroll: function (e) {
            var keyNoteBar = this.$refs.keyNoteBar
            keyNoteBar.style.left = e.target.scrollLeft + 'px'
        },
        keyNoteMousedown: function (e) {
            this.initialKeyHeight = this.keyHeight
            this.initialOffsetY = e.pageY

            this.initialScrollTop = this.$parent.$refs.pianoContainer.scrollTop
            console.log('mouse height')
            window.document.addEventListener('mousemove', this.keyNoteMousemove)
            window.document.addEventListener('mouseup', this.keyNoteMouseup)
        },
        keyNoteMousemove: function (e) {
            var distance = this.initialOffsetY - e.pageY

            console.log('whhhuuu')

            if (this.initialKeyHeight + distance > 0.1) {
                this.keyHeight = this.initialKeyHeight + distance
            }

            console.log(this.initialScrollTop)

            const magnitude = this.keyHeight / this.initialKeyHeight

            this.$parent.$refs.pianoContainer.scrollTo({ top: this.initialScrollTop * magnitude })

            this.$emit('keyHeightChanged', this.keyHeight)

            // console.log(distance)
        },

        keyNoteMouseup: function (e) {
            window.document.removeEventListener('mousemove', this.keyNoteMousemove)
            window.document.removeEventListener('mouseup', this.keyNoteMouseup)
        },

        keyNoteTouchstart: function (e) {

        }
    },
    props: {
        keyHeight: Number
    },
    components: {
        keyNote
    }

}
</script>

<style>

  .keyNoteBar {

    position: absolute;
    height:100%;
    left:0px;
    top:0px;
    z-index:10;
    background:white;

    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer */
    -khtml-user-select: none; /* KHTML browsers (e.g. Konqueror) */
    -webkit-user-select: none; /* Chrome, Safari, and Opera */
    -webkit-touch-callout: none; /* Disable Android and iOS callouts*/

  }

</style>
