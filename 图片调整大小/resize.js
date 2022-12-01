const fs = require('fs');
const path = require('path');
const jimp = require('jimp');
const chalk = require('chalk');

const arguments = process.argv;
const sx = arguments[2];
const sy = arguments[3];
const filePath = path.resolve(arguments[4]);

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
    await image.resize(parseInt(sx), parseInt(sy));
    await image.writeAsync(fileDir);
}

main();