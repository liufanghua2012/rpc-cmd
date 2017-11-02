/// <reference path="C:\Users\Leo.liu\AppData\Roaming\npm\node_modules\typings\typings\globals\node\index.d.ts" />

const argv = process.argv;//port:argv[]
cmdStr = '';
for (var i = 2; i < argv.length; i++) {
    cmdStr += argv[i]+' ';
}
console.log(cmdStr);
var port = argv[2];// command line: node rpc-cmd.js 8081
//console.log(port);

var hprose = require("hprose");
var server = new hprose.Server("http://0.0.0.0:"+port);
//var funcStep = require('./Step');
//var Future = hprose.Future;

var iconv = require('iconv-lite');
var child_process = require('child_process');
var spawn = child_process.spawn;
var fork = child_process.fork;
var BufferHelper = require('bufferhelper');

var bufferHelper = new BufferHelper();
function executeCmd(argStr,callback) {
	if (argStr==null || callback==null) {
		return false;
	}

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

function forkCmd(cmdStr,callback) {
	if (cmdStr==null || callback==null) {
		return false;
	}
  console.log("fork cmd is running!!");
	var child = fork('fork-cmd.js');//, [], options);
  console.log(child);
	child.on('message', function(message) {
		console.log('Served: ' + message);
		callback(message);
	});
 console.log(cmdStr);
	child.send({cmdStr:cmdStr});
	return true;
}

function cmdRun(cmdStr,callback) {
    var cmdRun_result={};
    console.log(cmdStr);
    if (cmdStr===null || cmdStr===undefined) {
        callback(cmdRun_result);
    }else{
		executeCmd(
			cmdStr,
			function(data){
				console.log(data);
				//console.log(data.toString('utf8'));
				var result = {};
				//result.group_id = groupId;
				//result.terminal_id = terminalId;
				//result.room = groupId+terminalId;
				result.cmdResultJson = data;//.toString('utf8');
				callback(result);
			}
		);
	}
}

function winCmdRun(winCmdStr,callback) {
    var cmdRun_result={};
    console.log(winCmdStr);
    if (winCmdStr===null || winCmdStr===undefined) {
        callback(cmdRun_result);
    }else{
		executeCmd(
			"xdotool "+winCmdStr,
			function(data){
				console.log(data);
				var result = {};
				result.cmdResultJson = data;//.toString('utf8');
				callback(result);
			}
		);
	}
}

function getActiveWindow(callback) {
    if (callback===null || callback===undefined) {
        console.log("no callback function defined!");
    }else{
		executeCmd(
			"xdotool getactivewindow",
			function(data){
				console.log(data);
				var result = {};
				result.description = "return window ID";
				result.winID = data.replace(/[\r\n]/g, "");//.toString('utf8');
				callback(result);
			}
		);
	}
}

function getWindowFocus(callback) {
    if (callback===null || callback===undefined) {
        console.log("no callback function defined!");
    }else{
		executeCmd(
			"xdotool getwindowfocus",
			function(data){
				console.log(data);
				var result = {};
				result.description = "return window ID";
				result.winID = data.replace(/[\r\n]/g, "");//.toString('utf8');
				callback(result);
			}
		);
	}
}

function getWindowName(winId, callback) {
	var cmdRun_result={};
    if (callback===null || callback===undefined) {
		console.log("no callback function defined!");
		return;
    }else if (winId===null || winId===undefined) {
		console.log("no window id defined!");
		cmdRun_result.error = "no window id defined!";
		callback(cmdRun_result);
		return;
	}else {
		executeCmd(
			"xdotool getwindowname "+ winId,
			function(data){
				console.log(data);
				var result = {};
				result.description = "return window name/title";
				result.winName = data.replace(/[\r\n]/g, "");//.toString('utf8');
				callback(result);
			}
		);
	}
}

function getWindowPid(winId, callback) {
	var cmdRun_result={};
    if (callback===null || callback===undefined) {
		console.log("no callback function defined!");
		return;
    }else if (winId===null || winId===undefined) {
		console.log("no window id defined!");
		cmdRun_result.error = "no window id defined!";
		callback(cmdRun_result);
		return;
	}else {
		executeCmd(
			"xdotool getwindowpid "+ winId,
			function(data){
				console.log(data);
				var result = {};
				result.description = "return window pid";
				result.winPid = data.replace(/[\r\n]/g, "");//.toString('utf8');
				callback(result);
			}
		);
	}
}

function getWindowGeometry(winId, callback) {
	var cmdRun_result={};
    if (callback===null || callback===undefined) {
		console.log("no callback function defined!");
		return;
    }else if (winId===null || winId===undefined) {
		console.log("no window id defined!");
		cmdRun_result.error = "no window id defined!";
		callback(cmdRun_result);
		return;
	}else {
		executeCmd(
			"xdotool getwindowgeometry "+ winId,
			function(data){
				console.log(data);
				var result = {};
				result.description = "return window ID/topleft_x/topleft_y/weight/height";
				result.winId = data.split('\n')[0].split(' ')[1];
				var pos = data.split('\n')[1].split(':')[1].split(' ')[1];
				result.x = pos.split(',')[0];
				result.y = pos.split(',')[1];
				var size = data.split('\n')[2].split(':')[1];
				console.log(size);
				result.weight = size.split('x')[0];
				result.height = size.split('x')[1];
				callback(result);
			}
		);
	}
}

function getDisplayGeometry(callback) {
	var cmdRun_result={};
    if (callback===null || callback===undefined) {
		console.log("no callback function defined!");
		return;
    }else {
		executeCmd(
			"xdotool getdisplaygeometry",
			function(data){
				console.log(data);
				var result = {};
				result.description = "return weight/height";
				result.weight = data.split('\n')[0].split(' ')[0];
				result.height = data.split('\n')[0].split(' ')[1];
				callback(result);
			}
		);
	}
}

function searchWindow(winName, callback) {
	var cmdRun_result={};
    if (callback===null || callback===undefined) {
		console.log("no callback function defined!");
		return;
    }else if (winName===null || winName===undefined) {
		console.log("no window name defined!");
		cmdRun_result.error = "no window name defined!";
		callback(cmdRun_result);
		return;
	}else {
		executeCmd(
			"xdotool search --name "+ winName,
			function(data){
				console.log(data);
				var result = {};
				result.description = "return win id array";
				result.winIdArray = data.split('\n');
				result.winIdArray.splice(result.winIdArray.length-1,1);
				callback(result);
			}
		);
	}
}

function mouseClick(buttonNumber, callback) {
	var cmdRun_result={};
    if (callback===null || callback===undefined) {
		console.log("no callback function defined!");
		return;
    }else if (buttonNumber===null || buttonNumber===undefined) {
		console.log("no button number defined!");
		cmdRun_result.error = "no button number defined!";
		callback(cmdRun_result);
		return;
	}else {
		executeCmd(
			"xdotool click "+ buttonNumber,
			function(data){
				console.log(data);
				var result = {};
				result.description = "no return value";
				callback(result);
			}
		);
	}
}

function mouseMove(winId,x,y, callback) {
	var cmdRun_result={};
    if (callback===null || callback===undefined) {
		console.log("no callback function defined!");
		return;
    }else if (x===null || x===undefined) {
		console.log("no x defined!");
		cmdRun_result.error = "no x defined!";
		callback(cmdRun_result);
		return;
	}else if (y===null || y===undefined) {
		console.log("no y defined!");
		cmdRun_result.error = "no y defined!";
		callback(cmdRun_result);
		return;
	}else if (winId===null || winId===undefined) {
		executeCmd(
			"xdotool mousemove "+ x +" "+ y,
			function(data){
				console.log(data);
				var result = {};
				result.description = "no return value";
				callback(result);
			}
		);
		return;
	}else {
		executeCmd(
			"xdotool mousemove --window "+ winId + " "+ x +" "+ y,
			function(data){
				console.log(data);
				var result = {};
				result.description = "no return value";
				callback(result);
			}
		);
	}
}

function getMouseLocation(callback) {
	var cmdRun_result={};
    if (callback===null || callback===undefined) {
		console.log("no callback function defined!");
		return;
    }else {
		executeCmd(
			"xdotool getmouselocation",
			function(data){
				console.log(data);
				var result = {};
				result.description = "return x/y/screen/win Id";
				result.x = data.split(' ')[0].split(':')[1];
				result.y = data.split(' ')[1].split(':')[1];
				result.screen = data.split(' ')[2].split(':')[1];
				result.winId = data.split(' ')[3].split(':')[1].replace(/[\r\n]/g, "");
				callback(result);
			}
		);
	}
}

function setWindowTitle(winId, winTitle, callback) {
	var cmdRun_result={};
    if (callback===null || callback===undefined) {
		console.log("no callback function defined!");
		return;
    }else if (winId===null || winId===undefined) {
		console.log("no window id defined!");
		cmdRun_result.error = "no window id defined!";
		callback(cmdRun_result);
		return;
	}else if (winTitle===null || winTitle===undefined) {
		console.log("no window title defined!");
		cmdRun_result.error = "no window title defined!";
		callback(cmdRun_result);
		return;
	}else {
		executeCmd(
			"xdotool set_window --name "+ winTitle + " "+winId,
			function(data){
				console.log(data);
				var result = {};
				result.description = "no return value";
				callback(result);
			}
		);
	}
}

function type(winId, content, callback) {
	var cmdRun_result={};
    if (callback===null || callback===undefined) {
		console.log("no callback function defined!");
		return;
    }else if (content===null || content===undefined) {
		console.log("no content defined!");
		cmdRun_result.error = "no content defined!";
		callback(cmdRun_result);
		return;
	}else if (winId===null || winId===undefined) {
		executeCmd(
			"xdotool type "+content,
			function(data){
				console.log(data);
				var result = {};
				result.description = "no return value";
				callback(result);
			}
		);
		return;
	}else {
		executeCmd(
			"xdotool type --window "+ winId + " "+content,
			function(data){
				console.log(data);
				var result = {};
				result.description = "no return value";
				callback(result);
			}
		);
	}
}

function activateWindow(winId, callback) {
	var cmdRun_result={};
    if (callback===null || callback===undefined) {
		console.log("no callback function defined!");
		return;
    }else if (winId===null || winId===undefined) {
		console.log("no window id defined!");
		cmdRun_result.error = "no window id defined!";
		callback(cmdRun_result);
		return;
	}else {
		executeCmd(
			"xdotool windowactivate "+ winId,
			function(data){
				console.log(data);
				var result = {};
				result.description = "no return value";
				callback(result);
			}
		);
	}
}

function moveWindow(winId, x, y, callback) {
	var cmdRun_result={};
    if (callback===null || callback===undefined) {
		console.log("no callback function defined!");
		return;
    }else if (winId===null || winId===undefined) {
		console.log("no window id defined!");
		cmdRun_result.error = "no window id defined!";
		callback(cmdRun_result);
		return;
	}else if (x===null || x===undefined) {
		console.log("no x defined!");
		cmdRun_result.error = "no x defined!";
		callback(cmdRun_result);
		return;
	}else if (y===null || y===undefined) {
		console.log("no y defined!");
		cmdRun_result.error = "no y defined!";
		callback(cmdRun_result);
		return;
	}else {
		executeCmd(
			"xdotool windowmove "+ winId +" "+ x + " " + y,
			function(data){
				console.log(data);
				var result = {};
				result.description = "no return value";
				callback(result);
			}
		);
	}
}

function raiseWindow(winId, callback) {
	var cmdRun_result={};
    if (callback===null || callback===undefined) {
		console.log("no callback function defined!");
		return;
    }else if (winId===null || winId===undefined) {
		console.log("no window id defined!");
		cmdRun_result.error = "no window id defined!";
		callback(cmdRun_result);
		return;
	}else {
		executeCmd(
			"xdotool windowraise "+ winId,
			function(data){
				console.log(data);
				var result = {};
				result.description = "no return value";
				callback(result);
			}
		);
	}
}

function setWindowSize(winId, weight, height, callback) {
	var cmdRun_result={};
    if (callback===null || callback===undefined) {
		console.log("no callback function defined!");
		return;
    }else if (winId===null || winId===undefined) {
		console.log("no window id defined!");
		cmdRun_result.error = "no window id defined!";
		callback(cmdRun_result);
		return;
	}else if (weight===null || weight===undefined) {
		console.log("no weight defined!");
		cmdRun_result.error = "no weight defined!";
		callback(cmdRun_result);
		return;
	}else if (height===null || height===undefined) {
		console.log("no height defined!");
		cmdRun_result.error = "no height defined!";
		callback(cmdRun_result);
		return;
	}else {
		executeCmd(
			"xdotool windowsize "+ winId +" "+ x + " " + y,
			function(data){
				console.log(data);
				var result = {};
				result.description = "no return value";
				callback(result);
			}
		);
	}
}



server.addFunction(forkCmd, { async: true });
server.addFunction(cmdRun, { async: true });
server.addFunction(winCmdRun, { async: true });
server.addFunction(getActiveWindow, { async: true });
server.addFunction(getWindowFocus, { async: true });
server.addFunction(getWindowName, { async: true });
server.addFunction(getWindowPid, { async: true });
server.addFunction(getWindowGeometry, { async: true });
server.addFunction(getDisplayGeometry, { async: true });
server.addFunction(searchWindow, { async: true });
server.addFunction(mouseClick, { async: true });
server.addFunction(mouseMove, { async: true });
server.addFunction(getMouseLocation, { async: true });
server.addFunction(setWindowTitle, { async: true });
server.addFunction(type, { async: true });
server.addFunction(activateWindow, { async: true });
server.addFunction(moveWindow, { async: true });
server.addFunction(raiseWindow, { async: true });
server.addFunction(setWindowSize, { async: true });
server.start();


/*------------------------------------------------------------------------------------------------
Usage method in browser client side with hprose-html5:
--------------------------------------------------------------------------------------------------
var client = new hprose.HttpClient("http://127.0.0.1:8080/", ["cmdRun"]);
client.cmdRun(cmdStr, function(result) {
    console.log(result);
}, function(name, err) {
    alert(err);
});
--------------------------------------------------------------------------------------------------*/


/*-------------------------------------------------------------------------------------------------
Usage method in browser client side with hprose-nodejs-client:
---------------------------------------------------------------------------------------------------
var hprose = require("hprose");
var client = hprose.Client.create("http://121.201.69.157:8080/", ["cmdRun"]);
client.cmdRun(cmdStr, function(result) {
    console.log(result);
});
*/
