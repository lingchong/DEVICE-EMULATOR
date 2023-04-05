
import mybus from "./bus.js";
import  net from "net";

export const initTcpServer = (tcpServer) => {
    let server = tcpServer.split(":")[0];
    let port = tcpServer.split(":")[1];
    let isConnected = false;
    // console.log(net);
    let sock =  net.Socket().connect(
        {
            port: port,
            host: server,
        },
        function () {
            localStorage.setItem(tcpServer, "true");
            mybus.emit("sendTcpLog", tcpServer + "connect success");
            isConnected = true;
        }
    );

    // 接收来自服务端的信息
    sock.on('data', function (data) {
        mybus.emit("sendTcpLog", tcpServer + "<", data.toString('utf-8'));
        console.log('接收到来自服务端的信息：', data.toString('utf-8'));
    });

    // 有错误发生调用的事件
    sock.on('error', function (e) {
        localStorage.removeItem(tcpServer);
        mybus.emit("sendTcpLog", tcpServer + " error.", e.toString('utf-8'));
        console.log('socket error', e);
    });

    // socket关闭的事件
    sock.on('close', function () {
        localStorage.removeItem(tcpServer);
        mybus.emit("sendTcpLog", tcpServer + " socket close.");
        console.log('socket close');
    });

    // 对方发送了关闭数据包过来的事件
    sock.on('end', function () {
        localStorage.removeItem(tcpServer);
        mybus.emit("sendTcpLog", tcpServer + " close connect");
        console.log('服务端关闭了连接');
    });
    if (isConnected) {
        return sock;
    }
}
