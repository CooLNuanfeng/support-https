#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var through2 = require('through2');
var program = require('commander');

const pathname = path.resolve();

const defalutExts= ['css','js','html','scss'];
var extsArr;

program
  .version('0.1.0')
  .option('-a, --add <a>+<b>', 'Add support file extname, split + ',extnames)
  .parse(process.argv);


if(program.add){
    extsArr = defalutExts.concat(program.add);
    // console.log(extsArr);
    traverseFile(pathname,extsArr);
}else{
    extsArr = defalutExts;
    traverseFile(pathname,extsArr);
}

function extnames(val) {
  return val.split('+');
}


function transform(file){
    let ext = path.extname(file).substring(1);
    if(extsArr.indexOf(ext)!== -1){
        fs.createReadStream(file)
        .pipe(through2(function(chunk,enc,callback){
            chunk = chunk.toString().replace(/http(s)?\:\/\//g,'//');
            // console.log(chunk);
            this.push(chunk)
            callback()
        })).pipe(fs.createWriteStream(file+'.tmp.bak'))
        .on('finish', function () {
            // fs.unlinkSync(file);
            // console.log(path.basename(file)+' finish');
            cleanTmp(file);
        });
    }else{
        return;
    }

}

function cleanTmp(file){
    fs.createReadStream(file+'.tmp.bak')
    .pipe(fs.createWriteStream(file)).on('finish',function(){
        console.log('finish change: '+ path.basename(file));
        fs.unlinkSync(file+'.tmp.bak');
    })

}

function traverseFile(pathname){
    fs.readdir(pathname,function(err,files){
        if(err){
            console.log(err);
            return
        }
        if(path.basename(pathname) == 'node_modules'){
            return;
        }
        files.forEach(function(file){
            let filename = path.join(pathname,file);
            fs.stat(filename,function(err,stats){
                if(err){
                    console.log(err);
                    return
                }
                if(stats.isDirectory()){
                    // console.log(file + ' is dir');
                    traverseFile(filename);
                }
                if(stats.isFile()){
                    // console.log(file + ' is file');
                    transform(filename);
                }
            })
        });
    })
}
