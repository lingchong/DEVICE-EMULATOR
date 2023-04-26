
import mybus from "./bus.js";
import net from 'net';
// const net = window.require("net");

 
export const dataConvert = ( data ) => {
    var dataBuf = Buffer.from(data, 'utf8');  //字符串构建buffer
    var dataLen = data.length;
    console.log(dataBuf);
    var headBuf = Buffer.alloc(32);     // 协议头32字节
    headBuf.writeUInt32LE(0x1002, 4);   //协议头命令字
    headBuf.writeUInt32LE(dataLen, 28); // 协议头中的数据长度
    var sendBuf = Buffer.concat([headBuf, dataBuf]); 
} 


export const initTcpServer = (tcpServer) => {
    let server = tcpServer.split(":")[0];
    let port = tcpServer.split(":")[1];
    let clientSocket;
    try {
        clientSocket = net.createConnection(port, server);
        localStorage.setItem(tcpServer, "true");
        mybus.emit("sendTcpLog", tcpServer + " connect success");
    } catch (error) {
        mybus.emit("sendTcpLog", tcpServer + " 初始化连接失败,错误信息：" + error);
        return "";
    }
    // 接收来自服务端的信息
    clientSocket.on('data', function (data) {
        mybus.emit("sendTcpLog", tcpServer + "<", data.toString('utf-8'));
        console.log('接收到来自服务端的信息：', data.toString('utf-8'));
    });

    // 有错误发生调用的事件
    clientSocket.on('error', function (e) {
        localStorage.removeItem(tcpServer);
        mybus.emit("sendTcpLog", tcpServer + " socket error.", e.toString('utf-8'));
        console.log('socket error', e);
    });

    // socket关闭的事件
    clientSocket.on('close', function () {
        localStorage.removeItem(tcpServer);
        mybus.emit("sendTcpLog", tcpServer + " socket close.");
        console.log('socket close');
    });

    // 对方发送了关闭数据包过来的事件
    clientSocket.on('end', function () {
        localStorage.removeItem(tcpServer);
        mybus.emit("sendTcpLog", tcpServer + " close connect.");
        console.log('服务端关闭了连接');
    });
    return clientSocket;
}
