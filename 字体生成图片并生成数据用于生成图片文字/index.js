var fs = require('fs');
var text2png = require('text2png');
var getPixels = require("get-pixels");

fs.writeFile('out.png', text2png('金昌博物馆', { color: 'black', font: '12px VonwaonBitmap 12px', localFontPath: 'VonwaonBitmap-12px.ttf', localFontName: 'VonwaonBitmap 12px' }), () => {
    getPixels("out.png", (err, pixels) => {
        if (err) {
            console.log("Bad image path")
            return
        }
        let width = pixels.shape[0];
        let height = pixels.shape[1];
        let data = pixels.data;
        let nd = [];
        for (let i = 0; i < data.length; i++) {
            if (i % 4 == 3 && data[i] == 255) {
                let x = Math.floor(i / 4) % width;
                let y = Math.floor(i / 4 / width);
                nd.push({ x: x, y: y });
            }
        }
        let str = JSON.stringify(nd);
        fs.writeFileSync("data.json.txt", str);
    })
});
