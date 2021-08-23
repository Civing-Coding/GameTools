var walk = require('walk')
var fs = require("fs")
var Excel = require('exceljs');
//设置目录
var root = "../xlsx";
var resultRoot = "../result";

//设置存储目录结构
var files = [];
var nFiles = [];
var dirs = [];
var nDirs = [];

main()

//遍历删除文件夹
function deleteFolder(path) {
    var flist = [];
    if (fs.existsSync(path)) {
        flist = fs.readdirSync(path);
        flist.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

//解析文件夹结构
function getFileList(path) {
    var walker = walk.walk(path, {
        followLinks: false
    });

    walker.on('file', function (roots, stat, next) {
        files.push(roots + '/' + stat.name);
        const targetName = splitFileName(stat.name)
        nFiles.push(roots.replace(root, resultRoot) + "/" + targetName);
        next();
    });

    walker.on('directory', function (roots, stat, next) {
        dirs.push(roots + '/' + stat.name);
        nDirs.push(roots.replace(root, resultRoot) + "/" + stat.name);
        next();
    });

    walker.on('end', function () {
        fs.mkdirSync(resultRoot, err => {
            console.log(err)
        });
        for (var key in nDirs) {
            fs.mkdirSync(nDirs[key], err => {
                console.log(err)
            });
        }
        console.log("转换Excel文件");
        convertXls()
    });
}

//转换文件
function convertXls() {
    for (var fileKey in files) {
        const key = fileKey;
        if (checkFileType(files[key])) {
            const workbook = new Excel.Workbook();
            workbook.xlsx.readFile(files[key]).then(function () {
                workbook.eachSheet((sheet, sheetId) => {
                    const titles = [];
                    const result = [];
                    sheet.eachRow((row, rowNumber) => {
                        let obj = {};
                        // cell.type单元格类型：6-公式 ;2-数值；3-字符串
                        row.eachCell((cell, colNumber) => {
                            const value = cell.value;
                            if (rowNumber === 1) {
                                titles.push(value);
                            } else {
                                obj[titles[colNumber - 1]] = cell.type == 6 ? value.result : value;
                            }
                        });
                        if (rowNumber > 1) {
                            result.push(obj)
                        }
                    })
                    if (result.length > 1) {
                        fs.writeFileSync(sheetId > 1 ? nFiles[key] + sheetId + ".json" : nFiles[key] + ".json", JSON.stringify(result));
                    }
                })
            })
        }
    }
}

//置换文件名
function splitFileName(text) {
    var pattern = /\.{1}[a-z]{1,}$/;
    if (pattern.exec(text) !== null) {
        return (text.slice(0, pattern.exec(text).index));
    } else {
        return text;
    }
}

//检查文件类型是否是excel
function checkFileType(str) {
    var index = str.lastIndexOf(".");
    var ext = str.substr(index);
    if (ext == ".xls" || ext == ".xlsx") {
        return true
    }
    return false
}

function main() {
    console.log("清除上次生成的文件夹");
    deleteFolder(resultRoot)
    console.log("构造文件夹结构");
    getFileList(root)
}