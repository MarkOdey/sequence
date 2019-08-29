<template>
  <div>

      <div
        :class="{
          vertical : orientation == 'vertical',
          horizontal : orientation == 'horizontal'
        }"
        :style="{
            'background-color': secondaryColor
        }"
        class="slider-container" v-on:click="changeClick">

        <div :style="{
          'background-color' : primaryColor
        }" class="slider-level"></div>

      </div>

      <div class="slider-value">{{value}}</div>

  </div>
</template>

<script>
export default {
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
  methods: {

    changeClick: function () {
      console.log('on change click')
    }

  },
  data: function () {
    return {

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
        background-color:rgb(220, 223, 230)
    }

</style>
