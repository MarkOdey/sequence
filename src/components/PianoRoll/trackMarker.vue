<template>

    <div ref="markerContainer" class="markerContainer" :style="{
    width:($parent.tickWidth*track.durationTicks +$parent.keyWidth)+'px',
    left: $parent.keyWidth +'px'
    }">
        <div ref="startMarker" :style="{
            left:track.startTick*$parent.tickWidth+'px'
        }" class="startMarker" @touchstart="startMarkerTouch($event)" @mousedown="startMarkerClick($event)"></div>

        <div ref="endMarker" :style="{
            left:track.endTick*$parent.tickWidth+'px'

        }" class="endMarker" @touchstart="endMarkerTouch($event)" @mousedown="endMarkerClick($event)"></div>

        </div>

</template>

<script>
export default {

    props: {
        track: Object
    },
    mounted: function () {
        this.$parent.$refs.pianoContainer.addEventListener('scroll', this.handleScroll)
    },

    methods: {
        handleScroll: function (e) {
            var markerContainer = this.$refs.markerContainer
            markerContainer.style.top = e.target.scrollTop + 'px'
        },
        startMarkerTouch: function (event) {
            console.log(event)

            window.document.addEventListener('touchmove', this.startMarkerDrag)
            window.document.addEventListener('touchend', this.startMarkerEndDrag)
        },
        startMarkerClick: function (event) {
            console.log(event)

            window.document.addEventListener('mousemove', this.startMarkerDrag)
            window.document.addEventListener('mouseup', this.startMarkerEndDrag)
        },
        startMarkerDrag: function (event) {
            var x = event.pageX
            var y = event.pageY

            var parent = this.$parent.$refs.noteGrid

            var bounds = parent.getBoundingClientRect()

            // If the event is fired from a mobile device
            if (event.touches !== undefined && event.touches.length === 1) {
                const touch = event.targetTouches.item(0)
                x = touch.pageX
                y = touch.pageY
            }

            var doc = document.documentElement
            var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)

            x -= bounds.left + left

            this.track.update({

                startTick: x / this.$parent.tickWidth
            })

            console.log(x, y)
        },
        startMarkerEndDrag: function (event) {
            window.document.removeEventListener('mousemove', this.startMarkerDrag)
            window.document.removeEventListener('mouseup', this.startMarkerEndDrag)
            window.document.removeEventListener('touchmove', this.startMarkerDrag)
            window.document.removeEventListener('touchend', this.startMarkerEndDrag)
        },
        endMarkerClick: function (event) {
            console.log(event)

            window.document.addEventListener('mousemove', this.endMarkerDrag)
            window.document.addEventListener('mouseup', this.endMarkerEndDrag)
        },
        endMarkerTouch: function (event) {

        },
        endMarkerDrag: function (event) {
            console.log(event)

            var x = event.pageX
            var y = event.pageY

            var parent = this.$parent.$refs.noteGrid

            var bounds = parent.getBoundingClientRect()

            // If the event is fired from a mobile device
            if (event.touches !== undefined && event.touches.length === 1) {
                const touch = event.targetTouches.item(0)
                x = touch.pageX
            }

            var doc = document.documentElement
            var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)

            x -= bounds.left + left

            this.track.update({

                endTick: x / this.$parent.tickWidth
            })

            console.log(x, y)
        },
        endMarkerEndDrag: function (event) {
            window.document.removeEventListener('mousemove', this.endMarkerDrag)
            window.document.removeEventListener('mouseup', this.endMarkerEndDrag)
        }
    }

}
</script>

<style>

  .markerContainer {

    height:100%;
    position:absolute;
    top:0;

  }
  .startMarker {
    position:absolute;
    border:solid 1px black;
    background:rgba(40,40,40,0.1);
    border-right:none;
    height:100%;

    width:20px;

    cursor:grab;

    z-index:1;
  }

  .endMarker {

    position:absolute;

    border:solid 1px black;
    background:rgba(40,40,40,0.1);
    border-left:none;
    height:100%;

    width:20px;

    cursor:grab;

    z-index:1;

  }

</style>
