const canvas = $("canvas");
const ctx = canvas.get(0).getContext("2d");
canvas.get(0).width = innerWidth;
canvas.get(0).height = innerHeight;


const initImage = require('./imageControl.js');

const onMIDISuccess = (midiAccess) => {
   $("#systemMessages").html(`Device Connected: Midisualizer, $ynthGuild proof of concept`);
    for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = getMIDIMessage;
    }
    // var inputs = midiAccess.inputs;
    // var outputs = midiAccess.outputs;
}

const getMIDIMessage = (midiMessage) => {
    return initImage(ctx, midiMessage.data);
}

const onMIDIFailure = ()=> {
    $("#systemMessages").html("Could not access your MIDI devices.");
  }

module.exports = {
    initMidi : () => {
        return navigator.requestMIDIAccess()
        .then(onMIDISuccess, onMIDIFailure);
    }
}