<template>
  <div class="col-2">

    <div class="row">

        <label for="devices">Audio Device</label>
        <br/>
        <b-dropdown id="devices" :text="input.label" class="m-2 w-100">
            <b-dropdown-item  v-for="inputItem in inputs" :key="inputItem.id" @click="selectInput(inputItem)">
                {{inputItem.label}}
            </b-dropdown-item>
        </b-dropdown>

        <i class="fas fa-volume-mute"></i>
        <i class="fas fa-volume-unmute"></i>

  </div>
    </div>
</template>

<script>

import Tone from 'tone'

export default {
  props: {
    'channel': Object
  },
  methods: {
    'selectInput': function (o) {
      let self = this
      console.log(o)

      // https://stackoverflow.com/questions/58676929/how-to-connect-web-audio-api-to-tone-js

      if (self.media === undefined) {
        self.media = new Tone.UserMedia()
      } else {
        self.media.close()
      }

      self.media.open(o.deviceId).then(input => {
        self.input = input

        if (self.channel !== undefined && self.channel.audio !== undefined) {
          console.log(self.channel.audio)

          self.input.connect(self.channel.audio)
        }
      })
    }

  },
  data: function () {
    return {

      input: Object,
      inputs: []
    }
  },
  mounted: function () {
    navigator.mediaDevices.enumerateDevices().then(payload => {
      console.log(payload)
      // this.input = payload[0]

      self.media = new Tone.UserMedia()

      self.media.open(payload[0]).then(input => {
        self.input = input
      })

      this.inputs = payload
    })

    console.log(this)

    navigator.getUserMedia({ audio: true }, function (stream) {

      // audio.connect(this.channel.audio)

      // Create an AudioNode from the stream.
      // var mediaStreamSource = audioContext.createMediaStreamSource(stream)

      // Connect it to the destination to hear yourself (or any other node for processing!)
      // mediaStreamSource.connect(audioContext.destination)
    }, function () {

    })
  }

}
</script>

<style>

</style>
