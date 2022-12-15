const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const process = require("process");
const { join } = require('path');
const readlineSync = require('readline-sync');

const arguments = process.argv;
const filePath = path.resolve(arguments[2]);

function main() {
    console.log(chalk.red('=====================START====================='));
    let state = fs.statSync(filePath);
    state.isFile() && fileExcute(filePath);
}

function fileExcute(fileDir) {
    if (!fileDir.endsWith('ske.json')) return;
    let dgFileName = path.basename(fileDir).split('.')[0];
    let dirName = path.dirname(fileDir);
    let frontName = dgFileName.slice(0, -4);
    let skePath = fileDir;
    let texJsonPath = path.join(dirName, `${frontName}_tex.json`);
    let texPath = path.join(dirName, `${frontName}_tex.png`);
    if (!fs.existsSync(texJsonPath) || !fs.existsSync(texPath)) {
        console.log(chalk.red(`${dgFileName}未找到tex.json 或 tex.png`));
        return;
    }

    let newName = readlineSync.question(`Rename project '${frontName}'?   `);
    console.log(`${frontName}  ======>  ${newName}`);
    let skeStr = fs.readFileSync(skePath).toString();
    let skeData = JSON.parse(skeStr);
    skeData.name = newName;
    for (let i in skeData.armature) {
        skeData.armature[i].name = readlineSync.question(`Rename armature ${i} name '${skeData.armature[i].name}'?   `) || skeData.armature[i].name;
        for (let j in skeData.armature[i].animation) {
            let n = skeData.armature[i].animation[j].name;
            skeData.armature[i].animation[j].name = readlineSync.question(`Rename animation ${j} name '${n}'?   `) || n;
        }
        skeData.armature[i].defaultActions[0].gotoAndPlay = skeData.armature[i].animation[0].name;
    }
    fs.writeFileSync(path.join(__dirname, 'single', `${newName}_ske.json`), JSON.stringify(skeData));
    let texJsonStr = fs.readFileSync(texJsonPath).toString();
    let texJson = JSON.parse(texJsonStr);
    texJson.name = newName;
    texJson.imagePath = `${newName}_tex.png`;
    fs.writeFileSync(path.join(__dirname, 'single', `${texJson.name}_tex.json`), JSON.stringify(texJson));
    fs.copyFileSync(texPath, path.join(__dirname, 'single', texJson.imagePath));
}

main();