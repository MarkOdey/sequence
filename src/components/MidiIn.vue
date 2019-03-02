<template>

<h1>
    this is a test.
</h1>
</template>

<script>
console.log('this is a tsete', document);

import WebMidi from 'webmidi';

WebMidi.enable(function (err) {

  if (err) {
    console.log("WebMidi could not be enabled.", err);
  } else {
    console.log("WebMidi enabled!");

    var inputs = WebMidi.inputs;

    console.log(inputs);


  }
  
});


export default {

    data : function () {

        return {

            label : ""
        }

    },
    compiled: () => {
        console.log('compiled');
    }

}
</script>

<style>

</style>
