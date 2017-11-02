/// <reference path="C:\Users\Leo.liu\AppData\Roaming\npm\node_modules\typings\typings\globals\node\index.d.ts" />

const argv = process.argv;
cmdStr = '';
for (var i = 2; i < argv.length; i++) {
    cmdStr += argv[i]+' ';
}
console.log(cmdStr);

var hprose = require("hprose");
//var client = hprose.Client.create("http://121.201.69.157:8081/", ["cmdRun"]);
var client = hprose.Client.create("http://121.201.68.23:8081/", ["cmdRun"]);
if (client==null) {
    console.log('cannot connect to rpc-cmd hprose server!');
}

client.cmdRun(cmdStr, function(result) {
    console.log(result);
});

// client.cmdRun("pwd", function(result) {
//     console.log(result);
// });
// client.cmdRun("whereis zoom", function(result) {
//     console.log(result);
// });

// client.cmdRun("/usr/bin/zoom", function(result) {
//     console.log(result);
// });

// client.cmdRun("WID = xdotool search --name 'Zoom' | head -1", function(result) {
//     console.log(result);
// });