function dateFtt(fmt, date) { //author: meizz
  var o = {
    "M+": date.getMonth() + 1,                 //月份
    "d+": date.getDate(),                    //日
    "h+": date.getHours(),                   //小时
    "m+": date.getMinutes(),                 //分
    "s+": date.getSeconds(),                 //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function crtTimeFtt(value, row, index) {
  var crtTime = new Date(value);
  return top.dateFtt("yyyy-MM-dd hh:mm:ss", crtTime);//直接调用公共JS里面的时间类处理的办法
}

var socket = io(), query = {};
window.location.href.split("?")[1].split("&").forEach(function (item) {
  query[item.split("=")[0]] = item.split("=")[1];
});

function renderList(initData) {
  var all = [];
  initData.me.forEach(function (item) {
    all.push(item)
  })
  initData.he.forEach(function (item) {
    all.push(item)
  })
  all.sort(function (a, b) {
    return a.stamp - b.stamp
  }).forEach(function (item) {
    var who = item.id === id ? 'me' : 'he',_dom;
    if(item.msg){
      _dom = $("<li class='" + who + "'>" + item.msg + "</li>")
    } else {
      _dom = $("<li class='" + who + "'><img src='" + item.img + "'/></li>")
    }

    $('#message').append(_dom);
  })
};


var id = query.uid, chats = {me: null, he: null}, me = null, he = null;
/**
 * @get data from redis
 */
socket.emit('chat init', {id: query.uid, to: query.to});
Object.defineProperty(chats, 'me', {
  set: function (v) {
    me = v;
    if (chats.he) {
      renderList(chats)
    }
  },
  get: function () {
    return me;
  }
})

Object.defineProperty(chats, 'he', {
  set: function (v) {
    he = v;
    renderList(chats)
  },
  get: function () {
    return he;
  }
})


socket.on('chat init', function (data) {
  chats[data.id === id ? 'me' : 'he'] = data.data;
});

$('#send').on("click", function () {
  var file = $("#file")[0].files[0];
  if (file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      var data = {
        img: this.result,
        id: id,
        date: crtTimeFtt(new Date()),
        stamp: new Date().getTime()
      };
      socket.emit('chat img', data);
      $("#file")[0].value = ''
    }
  } else {
    if(!$('#input').val()){
      return false;
    }
    socket.emit('chat message',
      {
        id: id,
        date: crtTimeFtt(new Date()),
        msg: $('#input').val(),
        stamp: new Date().getTime()
      }
    );
    $('#input').val('');
  }
});

socket.on('chat message', function (data) {
  var _dom = $("<li class='" + (data.id === id ? 'm' : 'h') + "e'>" + data.msg + "</li>");
  $('#message').append(_dom);
});


socket.on('chat img', function (data) {
  var img = new Image();
  img.src = data.img;
  var _tmp = $("<li class='me'></li>");
  if(data.id !== id){
    _tmp.attr("class",'he')
  }
  $('#message').append(_tmp).find("li").last().append($(img))
});