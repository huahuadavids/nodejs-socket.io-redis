# node socket.io redis的简单demo 

### 1 安装依赖
```
yarn 
```
### 2 启动redis 
```
cd c:/Redis 
// 启动服务端
redis-server.exe redis.windows.conf 
// 启动client
redis-cli.exe -h 127.0.0.1 -p 6379 
```
### 3 启动 web 服务器
```
node server 
```

### 4 打开url 
```
// 模拟uid是100和101的聊天
http://localhost:3000/?uid=100&to=101

http://localhost:3000/?uid=101&to=100 

```
