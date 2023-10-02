
const client = require('ws');
var ws
//Sever side
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const Server = require('http').createServer(app);

const mongoose = require('mongoose');
const cors = require('cors'); //cơ chế cho phép nhiều tài nguyên khác nhau 
const morgan = require('morgan');//phần mềm trung gian cho phép ghi lại các yêu cầu, lỗi vào console
let bodyParser = require('body-parser');//phân tích các dạng dữ liệu khác nhau - dùng để phân tích json
const config = require('./config').config;
const SerialPort = require('serialport').SerialPort;
const fs = require("fs")
// const portFarm= new SerialPort({
//   path: config.serial.port,
//   baudRate: config.serial.baud,
// });
const portFarm = new SerialPort({
  path: "COM8", baudRate: 115200
});
dotenv.config();
// mongoose.connect(process.env.MONGODB_LOCAL_URL_FARM,()=>{
//   console.log(200,'[CONNECT]->Database');
// })

app.use(
  bodyParser.json({
    limit: '50mb',//maximum request body size
  })
)
app.use(express.json());
app.use(cors());
app.use(morgan('common'));

//---------------------------------------------------XEM LAI CAMERA ----------------------------------------------
// let videoName="";
// let videoSize;
// let path="D:/ftpserver/cam1/"
// let videoPath;
// let timeCamera
// app.get("/camera", function (req, res) {
//   videoName=timeCamera.slice(timeCamera.indexOf("x")+1)+".mp4"
//   // videoFolder=year+"-"+month+"-"+day
//   videoPath=path+timeCamera.slice(0,timeCamera.indexOf('x'))+"/video/"+videoName;
//   videoSize = fs.statSync(videoPath).size;
//   res.sendFile(__dirname + "/index.html");
// });
// app.get("/time/:day",function(req,res){
//   timeCamera=req.params.day
//   // year=req.year
//   // month=req.month
//   // day=req.day
//   // hour=req.hour
//   // minute=req.minute
//   console.log(timeCamera)
//   videoName=timeCamera.slice(timeCamera.indexOf("x")+1)
//   // videoFolder=year+"-"+month+"-"+day
//   videoPath=path+timeCamera.slice(0,timeCamera.indexOf('x'))+"/video/"+videoName;
//   videoSize = fs.statSync(videoPath).size;
//   res.sendFile(__dirname + "/index.html");
// })
// app.get("/video", function (req, res) {
//   // Ensure there is a range given for the video
//   const range = req.headers.range;
//   if (!range) {
//     res.status(400).send("Requires Range header");
//   }
//   // get video status (about 61MB)
//   //videoPath = "C:/Users/Nguyen Thi Van Anh/Desktop/ftpserver/test/20221004.mp4";
//   // Parse Range
//   // Example: "bytes=32324-"
//   const CHUNK_SIZE = 10 ** 6; // 1MB
//   const start = Number(range.replace(/\D/g, ""));
//   const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

//   // Create headers
//   const contentLength = end - start + 1;
//   const headers = {
//     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//     "Accept-Ranges": "bytes",
//     "Content-Length": contentLength,
//     "Content-Type": "video/mp4",
//   };

//   // HTTP Status 206 for Partial Content
//   res.writeHead(206, headers);

//   // create video read stream for this particular chunk
//   const videoStream = fs.createReadStream(videoPath, { start, end });

//   // Stream the video chunk to the client
//   videoStream.pipe(res);
// });
// const fileRouter= require('./router/fileRouter')
// app.use("/",fileRouter)


// app.listen(8000, function () {
//   console.log("Listening on port 8000!");
// });
//----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------STREAM CAMERA----------------------------------------------
// let broadcaster;
// const io = require("socket.io")(Server);
// app.use(express.static(__dirname + "/public"));

// var fs_store = require('fs-blob-store')
// var blobs = fs_store('C:')

// let ws = blobs.createWriteStream({

// });

// io.ws = ws; 
// io.on('store-video', function(d){
//   if(io.ws && d.blob){
//     console.log('recording data');
//     io.ws.write(d.blob);
//   }
// });
// ws.end(function() {
//   var rs = blobs.createReadStream({
//     key: 'C:/Users/Nguyen Thi Van Anh/Videos/video.webm'
//   })

//   rs.pipe(process.stdout)
// })

// io.sockets.on("error", e => console.log(e));
// io.sockets.on("connection", socket => {
//   socket.on("broadcaster", () => {
//     broadcaster = socket.id;
//     socket.broadcast.emit("broadcaster");
//   });
//   socket.on("watcher", () => {
//     socket.to(broadcaster).emit("watcher", socket.id);
//   });
//   socket.on("offer", (id, message) => {
//     socket.to(id).emit("offer", socket.id, message);
//   });
//   socket.on("answer", (id, message) => {
//     socket.to(id).emit("answer", socket.id, message);
//   });
//   socket.on("candidate", (id, message) => {
//     socket.to(id).emit("candidate", socket.id, message);
//   });
//   socket.on("disconnect", () => {
//     socket.to(broadcaster).emit("disconnectPeer", socket.id);
//   });
// });



//-----------------------------------------------------------FUNCTION---------------------------------------------------
//GLOBAL FUNCTION
//let nameFunction=require('./function/nameFunction');
let getDataSlave = require('./function/getDataSlave');

//SCHEDULE FUNCTION
const schedule = require('node-schedule');

let scheduleOn1 = [], scheduleOff1 = [], scheduleOn2 = [], scheduleOff2 = [], scheduleOn3 = [], scheduleOff3 = []
let jobOn1 = [], jobOff1 = [], jobOn2 = [], jobOff2 = [], jobOn3 = [], jobOff3 = []
let valve1 = [scheduleOn1, scheduleOff1, jobOn1, jobOff1]
let valve2 = [scheduleOn2, scheduleOff2, jobOn2, jobOff2]
let valve3 = [scheduleOn3, scheduleOff3, jobOn3, jobOff3]
let valve = [valve1, valve2, valve3]
//GLOBAL VARIABLES
let strDataFromSlave = '';

//Temporary data receive from slave
let dataSlaveObject = {
  data: '',
};
//status valve
let arrStatus = [true, true, true, true, true]

let temp_strDataFromSlave = ""
let flag_str_ok = 0
/* ------------------------------------------------------------ Serial Port ------------------------------------------------------------ */
//Read data from UART
portFarm.on('data', async (dataCatch) => {
  try {
    console.log(dataCatch.toString())
    let temp_char = ""
    temp_char = dataCatch.slice(dataCatch.length - 1)
    temp_strDataFromSlave += dataCatch
    if (temp_char != "\n") {
      flag_str_ok = 0;
    }
    else {
      strDataFromSlave = temp_strDataFromSlave
      temp_strDataFromSlave = ""
      flag_str_ok = 1
      console.log(702, strDataFromSlave)
    }
    if (flag_str_ok == 1 & strDataFromSlave.slice(0, 1) == "a") {
      //nếu là response của request data
      dataSlaveObject.data = strDataFromSlave.toString();
    }
    else if (strDataFromSlave.length < 10 & strDataFromSlave.slice(0, 1) == "b") {
      arrStatus[parseInt(strDataFromSlave.slice(2, 3)) - 1] = true;
    }
    else {
      strDataFromSlave = ""
    }
  } catch (error) {
    console.log(400, "Dữ liệu đầu vào sai " + error);
  }
});
//Send data to slave
const sendDataToSlave = async (data) => {
  try {

    await portFarm.write(data + "\n");
    portFarm.drain();
    let toDate = new Date();
    let toMonth = (toDate.getMonth() + 1).toString();
    let toYear = toDate.getFullYear().toString();
    let toHour = toDate.getHours().toString();
    let toMinute = toDate.getMinutes().toString();
    let toSecond = toDate.getSeconds().toString();

    console.log(500, ' =============================> Gửi Lúc: ' + toDate.getDate().toString() +
      '/' + toMonth + '/' + toYear + ' - Times: ' + toHour + 'h: ' + toMinute + 'm: ' + toSecond + 's' +
      'data: ' + data
    );
  } catch (error) {
    S
    console.log(401, '[LỖI]: DỮ LIỆU GHI XUỐNG PORT SAI');
  }
}

/* ------------------------------------------------------------ API ------------------------------------------------------------ */
const farmRouter = require('./router/farmRouter');
const valveRouter = require('./router/valveRouter');
const sensorRouter = require('./router/sensorRouter');
const statusRouter = require('./router/statusRouter.js');
app.use('/', farmRouter);
app.use('/', valveRouter);
app.use('/', sensorRouter);
app.use('/', statusRouter)
app.get('/', (req, res) => {
  res.send('SERVER IS RUNNING.......');
});

Server.listen(process.env.FARM_EXPRESS_PORT, () => {
  console.log(1000, `[OK] -> Server started on http://localhost:${process.env.FARM_EXPRESS_PORT}/`);
});
/* ------------------------------------------------------------ WEBSOCKET ------------------------------------------------------------ */

const getDataSensor = require('./function/getDataSensor');
const { time } = require('console');
const port = process.env.FARM_SOCKET_PORT;
var websocketState = false;
var cmd
var wsInterval
var state = 5
var connect = function () {
  try {
    ws = new client('ws://115.79.196.171:1234');
    // var WebSocket=require('ws');
    // var serverSocket=new WebSocket.Server({port});

    ws.on('open', () => {
      console.log('KẾT NỐI ĐẾN VPS');
      websocketState = true;
      if (wsInterval != null)
        clearInterval(wsInterval);
      setInterval(() => {
        if (dataSlaveObject.data != null) {
          let dataToApp = getDataSlave(dataSlaveObject.data);
          console.log(876, dataSlaveObject.data)

          ws.send(JSON.stringify(dataToApp));
          dataSlaveObject.data = null;
        }
      }, 5 * 1000);
    });
    // ws.on ('error', function (err) {
    //   console.log ('socket error', err);
    //   // try to reconnect after x seconds here
    //   setInterval(()=>connect(),1000*30)
    // });
    ws.on('close', () => {
      websocketState = false
      console.log('NGẮT KẾT NỐI VPS');
      wsInterval = setInterval(() => connect(), 1000 * 30)
    });
    ws.on('message', (data) => {
      try {
        console.log(data.toString());
        //nhận dữ liệu từ app và gửi cho slave
        dataFromApp = JSON.parse(data);
        let id = dataFromApp._id;
        date = new Date();
        timeSecond = parseInt(date.getTime() / 1000);
        let highThreshold = dataFromApp.infor.sensor.high;
        let lowThreshold = dataFromApp.infor.sensor.low;
        let statusValve = [dataFromApp.infor.statusValve.valve1, dataFromApp.infor.statusValve.valve2, dataFromApp.infor.statusValve.valve3, dataFromApp.infor.statusValve.valve4];
        console.log(1000, dataFromApp);

        if (dataFromApp.infor.status.manual == 1) {
          arrStatus[id - 1] = false
          state = 1
          updateCMD(id, statusValve, highThreshold, lowThreshold, state)
          console.log(1234, cmd)
          sendDataToSlave(cmd)
          // setTimeout(()=>{
          //   if(arrStatus[id-1]==false){
          //     timeSecond=parseInt(date.getTime()/1000);
          //     cmd="r,"+"0"+id+","+"01,00,00;"
          //     sendDataToSlave(cmd);
          //     console.log('Timeout')
          //   }
          // },12*1000)

        }
        else if (dataFromApp.infor.status.manual == 0) {
          arrStatus[id - 1] = false
          state = 0
          updateCMD(id, statusValve, highThreshold, lowThreshold, state)
          console.log(1234, cmd)
          sendDataToSlave(cmd)
          // setTimeout(()=>{
          //   if(arrStatus[id-1]==false){
          //     timeSecond=parseInt(date.getTime()/1000);
          //     cmd="r,"+"0"+id+","+"00,00,00;"
          //     sendDataToSlave(cmd);
          //     console.log('Timeout')
          //   }
          // },12*1000)
        }
        else if (dataFromApp.infor.status.auto == 1) {
          //xóa schedule
          //khởi tạo lại schedule
          try {
            if (valve[id - 1][0] != null) {
              for (let i = 0; i < valve[id - 1][0].length; i++) {
                valve[id - 1][2][i].cancel;
                valve[id - 1][3][i].cancel;
              }
            }
            valve[id - 1][0] = []
            valve[id - 1][1] = []
            valve[id - 1][2] = []
            valve[id - 1][3] = []
            console.log(500, '---------------------------[AUTO ON]')
            //create Task
            for (let i = 0; i < 7; i++) {
              if (dataFromApp.infor.dayObjectList[i].status == true) {
                let aTask = new schedule.RecurrenceRule();
                aTask.dayOfWeek = [dataFromApp.infor.dayObjectList[i].day];
                aTask.hour = dataFromApp.infor.dayObjectList[i].hour;
                aTask.minute = dataFromApp.infor.dayObjectList[i].minute;
                aTask.second = dataFromApp.infor.dayObjectList[i].second;

                let time = dataFromApp.infor.dayObjectList[i].timer; // time lay tu client
                let aTaskOff = new schedule.RecurrenceRule();
                aTaskOff.dayOfWeek = [dataFromApp.infor.dayObjectList[i].day];
                aTaskOff.second = dataFromApp.infor.dayObjectList[i].second;
                if (dataFromApp.infor.dayObjectList[i].minute + time >= 60) {
                  aTaskOff.minute = dataFromApp.infor.dayObjectList[i].minute + time - 60;
                  aTaskOff.hour = dataFromApp.infor.dayObjectList[i].hour + 1;
                }
                else {
                  aTaskOff.hour = dataFromApp.infor.dayObjectList[i].hour;
                  aTaskOff.minute = dataFromApp.infor.dayObjectList[i].minute + time;
                }
                valve[id - 1][0].push(aTask)
                valve[id - 1][1].push(aTaskOff)
                console.log(valve[id - 1])
              }
            }
            //Create Jobs
            if (valve[id - 1][0].length) {
              for (let i = 0; i < valve[id - 1][0].length; i++) {
                var job = schedule.scheduleJob(valve[id - 1][0][i], function () {
                  console.log(500, "----------------Send auto on to slave" + id)
                  timeSecond = parseInt(date.getTime() / 1000);
                  state = 1
                  updateCMD(id, statusValve, highThreshold, lowThreshold, state)
                  sendDataToSlave(cmd)
                  console.log(1235, cmd)
                  arrStatus[id - 1] == false
                  // setTimeout(()=>{
                  //   if(arrStatus[id-1]==false){
                  //     timeSecond=parseInt(date.getTime()/1000);
                  //     cmd="r,"+"0"+id+","+"01,00,00;"
                  //     sendDataToSlave(cmd);
                  //     console.log('Timeout')
                  //   }
                  // },12*1000)
                });
                var job2 = schedule.scheduleJob(valve[id - 1][1][i], function () {
                  console.log(500, "----------------Send auto off to slave" + id)
                  timeSecond = parseInt(date.getTime() / 1000);
                  state = 0
                  updateCMD(id, statusValve, highThreshold, lowThreshold, state)
                  sendDataToSlave(cmd)
                  console.log(1236, cmd)

                  // setTimeout(()=>{
                  //   if(arrStatus[id-1]==false){
                  //     timeSecond=parseInt(date.getTime()/1000);
                  //     cmd="r,"+"0"+id+","+"00,00,00;"
                  //     sendDataToSlave(cmd);
                  //     console.log('Timeout')          
                  //   }
                  // },12*1000)
                  arrStatus[id - 1] == false
                  // setTimeout(()=>{
                  //   if(arrStatus[id-1]==false){
                  //     ws.send('Valve '+id + " timeout")
                  //     console.log('Timeout')
                  //   }
                  // },12*1000)
                });
                valve[id - 1][2].push(job)
                valve[id - 1][3].push(job2)
              }
            }
            console.log(1000, '----------------------[JOBS LENGTH]:', valve[id - 1][0].length);
            console.log(1000, '----------------------[JOBS LENGTH]:', valve[id - 1][2].length);
          } catch (error) {
            return console.log(404, error)
          }

        }
        else if (dataFromApp.infor.status.auto == 0) {
          //xóa schedule
          if (valve[id - 1][0] != null) {
            for (let i = 0; i < valve[id - 1][0].length; i++) {
              valve[id - 1][2][i].cancel;
              valve[id - 1][3][i].cancel;
            }
          }
          valve[id - 1][0] = []
          valve[id - 1][1] = []
          valve[id - 1][2] = []
          valve[id - 1][3] = []
        }
        else if (dataFromApp.infor.status.sensor == 1) {
          // sendDataToSlave("c,"+id+","+timeSecond+","+"2,"+highThreshold+","+lowThreshold)
          state = 2
          updateCMD(id, statusValve, highThreshold, lowThreshold, state)
          sendDataToSlave(cmd)
          console.log(1237, cmd)

          // cmd="r,"+"0"+id+","+"01,00,00;"
          arrStatus[id - 1] == false
          // setTimeout(()=>{
          //   if(arrStatus[id-1]==false){
          //     timeSecond=parseInt(date.getTime()/1000);
          //     sendDataToSlave("r,"+"0"+id+","+"02,"+highThreshold+lowThreshold+";")
          //     console.log('Timeout')            
          //   }
          // },12*1000)
        }
        else if (dataFromApp.infor.status.sensor == 0) {
          state = 3
          updateCMD(id, statusValve, highThreshold, lowThreshold, state)
          sendDataToSlave(cmd)
          console.log(1237, cmd)
          arrStatus[id - 1] == false
          // setTimeout(()=>{
          //   if(arrStatus[id-1]==false){
          //     timeSecond=parseInt(date.getTime()/1000);
          //     sendDataToSlave("r,"+"0"+id+","+"03,00,00;")
          //     console.log('Timeout')
          //   }
          // },12*1000)
        }
        else {
          updateCMD(id, statusValve, highThreshold, lowThreshold, state)
          sendDataToSlave(cmd)
          console.log(1237, cmd)
          arrStatus[id - 1] == false
        }

      } catch (error) {
        console.log(1000, error);
      }

    });
  } catch (error) {
    console.log(error)
  }

}
connect()
var updateCMD = function (id, statusValve, highT, lowT, state) {
  cmd = "r," + "0" + id + "," + "0" + state + "," + highT + "," + lowT + "," + "0" + statusValve[0] + "," + "0" + statusValve[1] + "," + "0" + statusValve[2] + "," + "0" + statusValve[3] + ";"

}