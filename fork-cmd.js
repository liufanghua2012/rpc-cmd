/// <reference path="C:\Users\Leo.liu\AppData\Roaming\npm\node_modules\typings\typings\globals\node\index.d.ts" />

var iconv = require('iconv-lite');
var spawn = require('child_process').spawn;
var BufferHelper = require('bufferhelper');

var bufferHelper = new BufferHelper();
function executeCmd(argStr,callback) {
	if (argStr==null || callback==null) {
		return false;
	}
    console.log(argStr);
	var cmd = spawn('/bin/sh');//ubuntu //////spawn('cmd');//windows
	cmd.stdout.on('data', function(chunk){
		bufferHelper.concat(chunk);
	});
	cmd.stdout.on('end',function(){
		var str = iconv.decode(bufferHelper.toBuffer(),'gbk');
		bufferHelper.empty();
		console.log(str);
		callback(str);
	});
	cmd.stdin.write(argStr+'\n');
	cmd.stdin.end();
	return true;
}

process.on('message', function(message, parent) {
  console.log(message);
  process.send("child receive: "+message);
    executeCmd(message.cmdStr,function(data) {
        process.send(data);
    });
});


