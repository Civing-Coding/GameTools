const fs = require('fs');
const path = require('path');
const jimp = require('jimp');
const chalk = require('chalk');

const arguments = process.argv;
const format = arguments[2];
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
    let tempArr = fileDir.split('.');
    let extension = tempArr[tempArr.length - 1];
    if (extension != format && fmt.has(extension)) {
        let newFileDir = fileDir.replace(extension, format);
        console.log(chalk.blue(`※convert: ${fileDir}`));
        let image = await jimp.read(fileDir);
        await image.writeAsync(newFileDir);
        fs.rmSync(fileDir);
    }
}

main();