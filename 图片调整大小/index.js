const fs = require('fs');
const path = require('path');
const jimp = require('jimp');
const chalk = require('chalk');

const arguments = process.argv;
const multiple = arguments[2];
const fmt = new Set(['jpg', 'jpeg', 'bmp', 'gif', 'png', 'tiff']);
const filePath = path.resolve(arguments[3]);

function main() {
    console.log(chalk.red('=====================START====================='));
    let state = fs.statSync(filePath);
    if (state.isFile()) {
        fileExcute(filePath);
    } else if (state.isDirectory()) {
        lookDir(filePath);
    }
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
    let tempArr = fileDir.split('.');
    let extension = tempArr[tempArr.length - 1];
    if (!fmt.has(extension)) {
        return;
    }
    let image = await jimp.read(fileDir);
    let w = multipleN(image.bitmap.width, multiple);
    let h = multipleN(image.bitmap.height, multiple);
    if (w != image.bitmap.width || h != image.bitmap.height) {
        console.log(chalk.blue(`※resize: ${fileDir}`));
        image.resize(w, h, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE).write(fileDir);
    }
}

function multipleN(x, n) {
    return x % n == 0 ? x : x + (n - x % n);
}


main();