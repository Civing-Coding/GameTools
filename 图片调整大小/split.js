const fs = require('fs');
const path = require('path');
const jimp = require('jimp');
const chalk = require('chalk');

const arguments = process.argv;
const sx = parseInt(arguments[2]);
const sy = parseInt(arguments[3]);
const filePath = path.resolve(arguments[4]);

async function main() {
    console.log(chalk.red('=====================START====================='));
    let state = fs.statSync(filePath);
    if (state.isFile()) {
        await fileExcute(filePath);
    }
    console.log(chalk.red('======================END======================'));
}

async function fileExcute(fileDir) {
    console.log(chalk.blue(`※convert: ${fileDir}`));
    const image = await jimp.read(fileDir);
    const width = image.getWidth();
    const height = image.getHeight();
    let dx = Math.ceil(width / sx);
    let dy = Math.ceil(height / sy);

    let tPath = path.dirname(fileDir) + "\\out";
    if (!fs.existsSync(tPath)) fs.mkdirSync(tPath, true);

    for (let i = 0; i < dx; i++) {
        for (let j = 0; j < dy; j++) {
            const clone = image.clone();
            if (i == dx - 1 || j == dy - 1) {
                clone.crop(i * sx, j * sy, i == dx - 1 ? width - i * sx - 1 : sx, j == dy - 1 ? height - j * sy - 1 : sy);
            } else {
                clone.crop(i * sx, j * sy, sx, sy);
            }
            console.log(chalk.blue(`${tPath}/${i}_${j}.png`));
            await clone.writeAsync(`${tPath}/${i}_${j}.png`);
        }
    }
}

main();