(function () {
    const fs = require('fs');
    const Fontmin = require('fontmin');
    let txt = fs.readFileSync('in/include.txt', 'utf-8');
    txt = txt.replace(/\s*/g, "");
    console.log('简化前文本数:', txt.length);
    txt = [].filter.call(txt, (s, i, o) => o.indexOf(s) == i).join('');
    console.log('简化后文本数:', txt.length);
    let fontmin = new Fontmin()
        .src('in/*.ttf')
        .dest('out')
        .use(Fontmin.glyph({
            text: txt,
            hinting: false
        }))

    fontmin.run();
})()