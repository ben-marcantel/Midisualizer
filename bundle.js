(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const init = require('./scripts/midiControl');

//browserify main.js -o bundle.js

$('#initProgram').click(()=>{return init.initMidi()});
},{"./scripts/midiControl":3}],2:[function(require,module,exports){
//TODO move all drawing functions to js file Create parsed midi note object

const midiAsNote = require('./noteLUT.js');

const rand = (x) => {
    return Math.floor(Math.random() * x)
}

const colorLookUp = (note) => {
    const array = [
        [255, 0, 0],
        [255, 0, 128],
        [255, 0, 255],
        [128, 0, 255],
        [0, 0, 225],
        [0, 128, 255],
        [0, 255, 255],
        [0, 255, 128],
        [0, 255, 0],
        [128, 255, 0],
        [255, 255, 0],
        [255, 128, 0]
    ];
    return array[note % 12];
}

const colorBackground = (ctx, note, octave) => {
      return handleOctave(ctx, note, octave);
}

const drawSpinner = (ctx, note, octave) => {
    let startX = note * octave;
    let startY = note * octave;

    // draw an unrotated reference rect
    ctx.beginPath();
    ctx.clearRect(rand(startX)*5, rand(startY)*5, 100, 20);
    ctx.fillStyle = `rgba(${colorLookUp(note)},.25)`;
    ctx.fill();

    // draw a rotated rect
    for (let i = octave.length; i > 0; i--) {
        let degrees = 40 * i;
        drawRotatedRect(startX * rand(note) * .1, startY * rand(note) * .1, 100, 20, degrees, ctx, note);

    }
}

const drawRotatedRect = (x, y, width, height, degrees, ctx, note) => {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(degrees * Math.PI / 180);
    ctx.rect(-width / 2, -height / 2, width, height);
    ctx.fillStyle = `rgb(${colorLookUp(note)})`;
    ctx.fill();
    ctx.restore();
}

const drawCircles = (ctx, note, octave) => {

    for (var i = 0; i < rand(note); i++) {
        for (var j = 0; j < rand((octave + 1) * note); j++) {
            ctx.save();
            // ctx.fillStyle = 'rgb(' + (51 * i) + ', ' + (255 - 51 * i) + ', 255)';
            ctx.fillStyle = `rgba(${colorLookUp(note)},.9)`;
            ctx.translate(10 + j * rand(50), 10 + i * rand(50));
            ctx.fillRect(0, 0, note * .1 * i, note * .1 * i);
            ctx.restore();
        }
    }
    ctx.strokeStyle = (`rgba(${colorLookUp(note)},.75)`);
    ctx.stroke();
    ctx.fill();
}

const handleOctave = (ctx, note, octave) => {
    //let rgb= colorLookUp(note);
    ctx.shadowColor = `rgba(${colorLookUp(note)},.5)`;
    ctx.shadowBlur = 15;
    ctx.fillStyle = `rgba(${colorLookUp(note)},.3)`;
    for (let i = 0; i < octave; i++) {
        ctx.save();
        ctx.beginPath();
        let path1 = new Path2D();
        path1.rect(innerWidth * .1 * i * rand(note), rand(.1 * i * innerHeight), rand(100), rand(100));
        let path2 = new Path2D(path1);
        path2.arc(rand(innerWidth * i), rand(innerHeight * i), rand(50 * i), 0, 2 * Math.PI);
        path2.fillStyle = `rgba(${colorBackground},.3)`;
        ctx.strokeStyle = `rgba(${colorBackground},.75)`;
        ctx.stroke(path2);
        ctx.fill(path2);
        ctx.fillRect(note * octave * i, rand(note * octave * i), rand(150)*note, rand(100)*note);
        ctx.translate(10 + i * rand(50), 10 + i * rand(50));
        ctx.rotate((octave * 40) * Math.PI / 180);
        ctx.restore();
    }
}
const drawSpace = (ctx, note, octave)=>{
    ctx.clearRect(rand(innerHeight/2),rand(innerWidth/2),
    rand(innerWidth), rand(innerHeight));
}

const addImages = (ctx, note, octave) => {
    drawSpinner(ctx, note, octave);
    drawSpace(ctx, note,octave);
    drawCircles(ctx, note, octave);
}

module.exports = (ctx, midiData) => {
    let note = midiData[1];
    let str = midiAsNote[note];
    let octave = str[str.length - 1];
    //  let toggle = (midiData[0]>100) ? true: false;

    colorBackground(ctx, note, octave);
    return addImages(ctx, note, octave);
}
},{"./noteLUT.js":4}],3:[function(require,module,exports){
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
},{"./imageControl.js":2}],4:[function(require,module,exports){
module.exports = ["C_1", "C#_1", "D_1", "D#_1", "E_1", "F_1", "F#_1", "G_1", "G#_1", "A_1", "A#_1", "B_1",
        "C0", "C#0", "D0", "D#0", "E0", "F0", "F#0", "G0", "G#0", "A0", "A#0", "B0",
        "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1",
        "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
        "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
        "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
        "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
        "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
        "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7",
        "C8", "C#8", "D8", "D#8", "E8", "F8", "F#8", "G8", "G#8", "A8", "A#8", "B8",
        "C9", "C#9", "D9", "D#9", "E9", "F9", "F#9", "G9"
    ];
},{}]},{},[1]);
