
import mybus from "./bus.js";
// import net from 'net';
const net = window.require("net");

/**
 * 字符文本转换为对应16进制数组 如“78 78” 转换为 [0x78,0x78]
 * @param {string} text  字符
 */
const encodeHex = (text) => {
    if (text) {
        let strArray = text.split(" ");
        const buffer = Buffer.alloc(strArray.length);
        strArray.forEach((element, index) => {
            buffer[index] = parseInt(eval("0x" + element).toString(10));
        });
        return buffer;
    }
}

/**
 * crc16校验
 */
const crc16 = () => {


}


/**
 * 发送登录包
 * @param {*} imei 
 */
const encodeLogin = (imei) => {
    let instruct = "";
    let imeiCode = "";
    // 将imei 例如 202304031535301 -> 02 02 30 40 31 53 53 01
    if (imei.length % 2 == 1) {
        imeiCode = "0" + imei;
    }
    for (var i = 1; i <= imeiCode.length / 2; i++) {
        instruct = instruct + " " + imeiCode.substring((i - 1) * 2, (i - 1) * 2 + 2)
    }
    return instruct;
}

/**
 * 发送心跳包
 * @param {*} imei 
 */
const encodeHB = (imei) => {

}


/**
 * 发送GPS定位包
 * @param {*} imei 
 */
const encodeGPS = (imei) => {

}



/**
 * 初始化tcp连接
 * @param {*} tcpServer 
 * @returns 
 */
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
