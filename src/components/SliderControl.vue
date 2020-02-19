<template>
  <div class="slider-element">

      <div
        :class="{
          vertical : orientation == 'vertical',
          horizontal : orientation == 'horizontal'
        }"
        :style="{
            'background-color': secondaryColor
        }"
        class="slider-container" v-on:mousedown="mouseDown">

        <div :style="{
          'background-color' : primaryColor,
          'height' : valuePercent + '%'
        }" class="slider-level"></div>

      </div>

      <div class="slider-value">{{value}}</div>

  </div>
</template>

<script>
export default {
    watch: {
        value: function () {
            this.internalValue = this.value
        }
    },
    props: {
        'value': {
            type: Number,
            required: true
        },
        'max': {
            type: Number,
            default: 100
        },
        'min': {
            type: Number,
            default: 0
        },
        'stepSize': {
            type: Number,
            default: 1
        },
        'disabled': {
            type: Boolean,
            default: false
        },
        'size': {
            type: Number,
            default: 100
        },
        'responsive': {
            type: Boolean,
            default: false
        },
        'orientation': {
            type: String,
            default: 'vertical'
        },
        'primaryColor': {
            type: String,
            default: '#409eff'
        },
        'secondaryColor': {
            type: String,
            default: '#dcdfe6'
        },
        'textColor': {
            type: String,
            default: '#000000'
        },
        'strokeWidth': {
            type: Number,
            default: 17
        },
        'valueDisplayFunction': {
            type: Function,
            default: (v) => v
        }

    },
    computed: {
        valuePercent: function () {
            return ((this.internalValue - this.min) / (this.max - this.min)) * 100
        }
    },
    methods: {

        mouseDown: function (e) {
            window.document.addEventListener('mousemove', this.mouseMove)
            window.document.addEventListener('mouseup', this.mouseUp)
        },
        mouseMove: function (e) {
            this.updatePosition(e.clientX, e.clientY)

            // console.log(element)
        },
        mouseUp: function (e) {
            window.document.removeEventListener('mousemove', this.mouseMove)
            window.document.removeEventListener('mouseup', this.mouseUp)
        },
        updatePosition: function (x, y) {
            // The constrain shall be the element.
            var elementContainer = this.$el.querySelector('.slider-container')

            const boundingClientRect = elementContainer.getBoundingClientRect()

            console.log(boundingClientRect)

            let positionX = -1 * (y - boundingClientRect.bottom)

            let value = this.min + (positionX / boundingClientRect.height) * (this.max - this.min)

            console.log(this.internalValue)

            // Rounding value to step size

            let stepChunks = this.stepSize.toString().split('.')
            let decimalSize = stepChunks[1] !== undefined ? stepChunks[1].length : 0
            // let numberSize = stepChunks[0] != undefined ?  stepChunks[0].length : 0;

            // Setting magnitude on base 10 for rounding. (10, 100, 1000) etc.
            let magnitude = Math.pow(10, decimalSize)

            // You multiply the magnitude to set rounding then divide it back to normalize
            value = Math.round(value * magnitude) / magnitude

            // Capping max and min value

            if (value > this.max) {
                value = this.max
            }

            if (value < this.min) {
                value = this.min
            }

            this.internalValue = value

            this.$emit('input', this.internalValue)
        }

    },
    data: function () {
        console.log(this.value)
        return {
            internalValue: this.value
        }
    }

}
</script>
<style>

    .vertical  {
        height: 100%;
        width:50px;
        min-height:250px;
    }

    .slider-container {
        position:relative;
        background-color:rgb(220, 223, 230)
    }

    .slider-element {
        display: inline-block;
        width:auto;
    }

    .slider-level {

        position:absolute;
        bottom:0;
        left:0;
        width:100%;

    }

</style>
