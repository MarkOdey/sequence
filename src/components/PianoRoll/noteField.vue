<template>
    <div class="p-3 text-left">

        <b-form-input type="text" v-model="notation" @change="updateNotation"/>

        <div>Notation  : {{toNotation()}}</div>
        <div>Seconds : {{toSeconds()}}</div>
        <div>Ticks : {{toTicks()}}</div>

<!-- Temporaly disabled
            <div class="col">

            <b-dropdown
                split
                split-variant="outline-primary"
                variant="primary"
                text="Split Variant Dropdown"
                class="m-2"
            >
                <b-dropdown-item href="#">Action</b-dropdown-item>
                <b-dropdown-item href="#">Another action</b-dropdown-item>
                <b-dropdown-item href="#">Something else here...</b-dropdown-item>
            </b-dropdown>

        </div>-->
    </div>
</template>

<script>
import Tone from 'tone'

let signature = Tone.Time()
export default {
  props: {
    'value': String
  },
  methods: {
    updateNotation: function (e) {
      console.log('signature updated')
      signature = Tone.Time(e.target.value)

      // This not relevant. Only inject notation on setup.
      // this.notation = signature.toNotation()
    },
    toTicks: function () {
      return signature.toTicks()
    },
    toSeconds: function () {
      return signature.toSeconds()
    },
    toNotation: function () {
      return signature.toNotation()
    },
    toBarsBeatsSixteenths: function () {
      return signature.toBarsBeatsSixteenths()
    }
  },
  watch: {
    value: function () {
      signature = Tone.Time(this.value)
      this.notation = signature.toNotation()
    }
  },
  data: function () {
    return {
      'notation': 0
    }
  }

}
</script>

<style>

</style>
