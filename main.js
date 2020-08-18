const init = require('./scripts/midiControl');

//browserify main.js -o bundle.js

$('#initProgram').click(()=>{return init.initMidi()});