var express = require('express');
app = express(),
  server = require('http').createServer(app),
  io = require('socket.io')(server),
  port = process.env.PORT || 3000,
  redis = require('redis'),
  redisclient = redis.createClient();

redisclient.on('connect', function () {
  console.warn("redis connect successfully")
  io.on('connection', function (socket) {
    console.warn("websocket  connect successfully");
    
    // 聊天记录初始化
    socket.on("chat init", function (data) {
      redisclient.get(data.id, function (err, res) {
        socket.emit("chat init", {
          id: data.id,
          data: res ? JSON.parse(res) : []
        })
      });
      redisclient.get(data.to, function (err, res) {
        socket.emit("chat init", {
          id: data.to,
          data: res ? JSON.parse(res) : []
        })
      });
    });
    
    
    /**
     * @tackle chat text messages
     */
    socket.on('chat message', function (data) {
      redisclient.get(data.id, function (err, res) {
        if (res == null) {
          console.log("创建新用户")
          var datas = [];
          datas.push(data);
          redisclient.set(data.id, JSON.stringify(datas), function (err) {
            if (!err) {
              console.log("创建新用户成功")
            }
          })
        } else {
          console.log("用户存在")
          var udata = JSON.parse(res);
          udata.push(data)
          redisclient.set(data.id, JSON.stringify(udata), function (err) {
            if (!err) {
              console.log("添加数据成功")
            }
          })
        }
      });
      io.emit('chat message', data);
    });
    
    /**
     * @tackle chat images
     */
    socket.on('chat img', function (data) {
      redisclient.get(data.id, function (err, res) {
        if (res == null) {
          console.log("创建新用户")
          var datas = [];
          datas.push(data);
          redisclient.set(data.id, JSON.stringify(datas), function (err) {
            if (!err) {
              console.log("创建新用户成功")
            }
          })
        } else {
          console.log("用户存在")
          var udata = JSON.parse(res);
          udata.push(data)
          redisclient.set(data.id, JSON.stringify(udata), function (err) {
            if (!err) {
              console.log("添加数据成功")
            }
          })
        }
      });
      io.emit('chat img', data);
    });
    
    socket.on('disconnect', function () {
      console.log('a user left');
    })
    
  });
  
});

app.use(express.static(__dirname + '/public'));

server.listen(port, function () {
  console.log('server start on port : localhost:%d', port);
});