const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const process = require("process");
const { join } = require('path');
const readlineSync = require('readline-sync');

const arguments = process.argv;
const filePath = path.resolve(arguments[2]);

const historyStr = fs.readFileSync(path.join(__dirname, 'changeList.json')).toString();
let history = JSON.parse(historyStr);

function main() {
    console.log(chalk.red('=====================START====================='));
    let state = fs.statSync(filePath);
    if (state.isFile()) {
        fileExcute(filePath);
    } else if (state.isDirectory()) {
        lookDir(filePath);
    }
    fs.writeFileSync(path.join(__dirname, 'changeList.json'), JSON.stringify(history));
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

function fileExcute(fileDir) {
    if (!fileDir.endsWith('ske.json')) return;
    let aginBool = false;
    let dgFileName = path.basename(fileDir).split('.')[0];
    let dirName = path.dirname(fileDir);
    console.log(`正在处理 ${dgFileName}`);
    if (history.includes(dgFileName)) {
        console.log(chalk.yellow(`重复文件: ${dgFileName} ,是否继续进行处理(y)`));
        if (readlineSync.question('') != 'y') return;
        aginBool = true;
    }

    let frontName = dgFileName.slice(0, -3);
    let skePath = fileDir;
    let texJsonPath = path.join(dirName, `${frontName}tex.json`);
    let texPath = path.join(dirName, `${frontName}tex.png`);
    if (!fs.existsSync(texJsonPath) || !fs.existsSync(texPath)) {
        console.log(chalk.red(`${dgFileName}未找到tex.json 或 tex.png`));
        return;
    }
    fs.copyFileSync(skePath, path.join(__dirname, 'old', `${dgFileName}.json`));
    fs.copyFileSync(texJsonPath, path.join(__dirname, 'old', `${frontName}tex.json`));
    fs.copyFileSync(texPath, path.join(__dirname, 'old', `${frontName}tex.png`));

    !aginBool && history.push(dgFileName);
    let postfix = prefixZero(aginBool ? history.indexOf(dgFileName) : history.length, 4);
    let targetName = `${frontName}${postfix}`;
    console.log(`${frontName}  ======>  ${targetName}`);
    let skeStr = fs.readFileSync(skePath).toString();
    let skeData = JSON.parse(skeStr);
    skeData.name = targetName;
    for (let i in skeData.armature) {
        let str = skeData.armature[i].defaultActions[0].gotoAndPlay;
        skeData.armature[i].defaultActions[0].gotoAndPlay = `${str}_${postfix}`;
        skeData.armature[i].name = `${skeData.armature[i].name}_${postfix}`;
        for (let j in skeData.armature[i].animation) {
            let n = skeData.armature[i].animation[j].name;
            skeData.armature[i].animation[j].name = `${n}_${postfix}`;
        }
    }
    fs.writeFileSync(path.join(__dirname, 'new', `${targetName}_ske.json`), JSON.stringify(skeData));
    let texJsonStr = fs.readFileSync(texJsonPath).toString();
    let texJson = JSON.parse(texJsonStr);
    texJson.name = targetName;
    texJson.imagePath = `${targetName}_tex.png`;
    fs.writeFileSync(path.join(__dirname, 'new', `${texJson.name}_tex.json`), JSON.stringify(texJson));
    fs.copyFileSync(texPath, path.join(__dirname, 'new', texJson.imagePath));
}

function prefixZero(n, m) {
    var _a = (Array(m).join(0) + n).slice(-m);
    return _a;
}

main();