<template>
  <div class="col-2">

    <div class="row">

        <label for="devices">Audio Device</label>
        <br/>
        <div class="dropdown">
          <button id="devices" class="btn btn-secondary dropdown-toggle m-2 w-100" type="button" data-bs-toggle="dropdown">
            {{inputLabel}}
          </button>
          <ul class="dropdown-menu">
            <li v-for="inputItem in inputs" :key="inputItem.deviceId">
              <a class="dropdown-item" href="#" @click.prevent="selectInput(inputItem)">
                {{inputItem.label}}
              </a>
            </li>
          </ul>
        </div>

    </div>
  </div>
</template>

<script>

import * as Tone from 'tone'

export default {
    props: {
        'channel': Object
    },
    methods: {

        'mute': function () {

        },
        'unmute': function () {

        },
        'selectInput': function (o) {
            let self = this
            // console.log(o)

            if (self.media === undefined) {
                self.media = new Tone.UserMedia()
            } else {
                self.media.close()
            }

            self.media.open(o.deviceId).then(input => {
                self.input = input
                self.inputLabel = o.label

                if (self.channel !== undefined && self.channel.audio !== undefined) {
                    self.input.connect(self.channel.audio)
                }
            })
        }

    },
    data: function () {
        return {
            input: null,
            inputLabel: 'Select device',
            inputs: []
        }
    },
    mounted: function () {
        navigator.mediaDevices.enumerateDevices().then(payload => {
            this.inputs = payload.filter(d => d.kind === 'audioinput')
        })
    }

}
</script>

<style>

</style>
