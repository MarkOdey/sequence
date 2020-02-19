<template>

            <div class="selectionBox"
            :class="{
              'd-none': !active,
              'd-block': active

            }"
            :style="{
              'bottom':y+'px',
              'left':x+'px',
              'width':width +'px',
              'height':height+'px'
            }"></div>

</template>

<script>
export default {
    props: {
        data: Object
    },
    mounted: function () {
        var self = this
        this.data.on('activated', function (event) {
            // console.log('activated')
            var rect = self.$el.parentElement.getBoundingClientRect()
            var x = event.clientX - rect.left // x position within the element.
            var y = rect.bottom - event.clientY // y position within the element.
            self.activate(x, y)
            self.active = true
        })

        this.data.on('deactivated', function () {
            // console.log('deactivated')
            self.deactivate()
            self.active = false
        })
    },
    data: function () {
        return {

            active: false,
            resizeX: 0,
            resizeY: 0,
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }
    },
    methods: {
        activate: function (x, y) {
            this.resizeX = x
            this.resizeY = y
            this.moveBoxSelection(x, y)

            this.resizeBoxSelection(0, 0)

            window.document.addEventListener('mousemove', this.backgroundMouseMove)
            window.document.addEventListener('mouseup', this.backgroundMouseUp)
        },
        backgroundMouseMove: function (event) {
            console.log('move box selection')
            // var x = event.clientX - this.x
            // var y = event.clientY - this.y

            // e = Mouse click event.
            var rect = this.$el.parentElement.getBoundingClientRect()

            var x = this.resizeX
            var y = this.resizeY

            var w = (event.clientX - rect.left) - this.resizeX // x position within the element.
            var h = (rect.bottom - event.clientY) - this.resizeY // y position within the element.

            if (w < 0) {
                x = (event.clientX - rect.left)
                w = this.resizeX - (event.clientX - rect.left)
            }

            if (h < 0) {
                y = (rect.bottom - event.clientY)
                h = this.resizeY - (rect.bottom - event.clientY)
            }

            this.moveBoxSelection(x, y)
            this.resizeBoxSelection(w, h)
        },
        backgroundMouseUp: function (event) {
            // console.log('this is mouse up time')

            this.data.deactivate()
            window.document.removeEventListener('mousemove', this.backgroundMouseMove)
            window.document.removeEventListener('mouseup', this.backgroundMouseUp)
        },
        deactivate: function () {

        },
        moveBoxSelection: function (x, y) {
            this.x = x
            this.y = y
        },
        resizeBoxSelection: function (x, y) {
            this.width = x
            this.height = y

            this.data.selectRange({
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height
            })
        }
    }

}
</script>

<style>

  .selectionBox {
    position:absolute;
    border:1px dashed var(--secondary);
    user-select: none;
    touch-action: none;
  }

</style>
