const fs = require('fs');
const path = require('path');
const jimp = require('jimp');
const chalk = require('chalk');

const arguments = process.argv;
const filePath = path.resolve(arguments[2]);
const targetColor = { r: 0, g: 0, b: 0, a: 1 };
const replaceColor = { r: 0, g: 0, b: 0, a: 0 };

function main() {
    console.log(chalk.red('=====================START====================='));
    let state = fs.statSync(filePath);
    if (state.isFile()) {
        fileExcute(filePath);
    } else if (state.isDirectory()) {
        lookDir(filePath);
    }
    console.log(chalk.red('======================END======================'));
}

function lookDir(dir) {
    let files = fs.readdirSync(dir);
    files.forEach(fileName => {
        let fileDir = path.join(dir, fileName);
        let state = fs.statSync(fileDir);
        if (state.isFile()) {
            fileExcute(fileDir);
        } else if (state.isDirectory()) {
            lookDir(fileDir);
        }
    })
}

async function fileExcute(fileDir) {
    console.log(chalk.blue(`※convert: ${fileDir}`));
    const image = await jimp.read(fileDir);
    await image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const color = this.getPixelColor(x, y);
        if (color == targetColor) {
            this.setPixelColor(replaceColor, x, y);
        }
    });

    await image.writeAsync(fileDir.replace('.jpg', 'png'));
}

main();


// import Jimp from 'jimp';

// Jimp.read('./sample.png').then(image => {
//   const targetColor = {r: 0, g: 0, b: 0, a: 255};  // black
//   const replaceColor = {r: 0, g: 0, b: 0, a: 0};  // transparent
//   const colorDistance = (c1, c2) => Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2) + Math.pow(c1.a - c2.a, 2));  // Distance between two colors
//   const threshold = 32;
//   image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
//     const thisColor = {
//       r: image.bitmap.data[idx + 0],
//       g: image.bitmap.data[idx + 1],
//       b: image.bitmap.data[idx + 2],
//       a: image.bitmap.data[idx + 3]
//     };
//     if(colorDistance(targetColor, thisColor) <= threshold) {
//       image.bitmap.data[idx + 0] = replaceColor.r;
//       image.bitmap.data[idx + 1] = replaceColor.g;
//       image.bitmap.data[idx + 2] = replaceColor.b;
//       image.bitmap.data[idx + 3] = replaceColor.a;
//     }
//   });
//   image.write('transparent.png');
// });