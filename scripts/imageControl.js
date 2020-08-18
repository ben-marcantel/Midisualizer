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