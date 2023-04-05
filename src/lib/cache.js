import MD5 from './tool.js'
/**
 * 应用缓存Key
 *  网关地址列表
 *  
 * */
const GATE_CACHE_KEY = "GATE_ARRAY";
const CURRENT_GATE_CACHE_KEY = "CURRENT_GATE_URL";
const IMEI_CACHE_KEY = "IMEIS_";
const SELECT_IMEI = "SELECTED_IME";

/**
 * 设置当前网关地址
 * @param  gateUrl 
 */
export const setGateUrl = (gateUrl) => {
    localStorage.setItem(CURRENT_GATE_CACHE_KEY, gateUrl)
}

/**
 * 获取当前选中的网关地址
 * @returns 
 */
export const getGateUrl = () => {
    if (localStorage.getItem(CURRENT_GATE_CACHE_KEY)) {
        return localStorage.getItem(CURRENT_GATE_CACHE_KEY);
    } else {
        return "";
    }

}

/**
 * 设置网关地址列表
 * @param {} array 
 */
export const setGateUrlArray = (array) => {
    if (array) {
        localStorage.setItem(GATE_CACHE_KEY, JSON.stringify(array))
    }
}

/**
 * 获取网关地址列表
 * @returns 
 */
export const getGateUrlArray = () => {
    if (localStorage.getItem(GATE_CACHE_KEY)) {
        return JSON.parse(localStorage.getItem(GATE_CACHE_KEY))
    } else {
        let gateurlArray = new Array();
        localStorage.setItem(GATE_CACHE_KEY, gateurlArray)
        return gateurlArray;
    }
}

/**
 * 设置分组imei
 * @param {}  
 */
export const setImeiArray = (imeis) => {
    let gateUrl = getGateUrl();
    if (gateUrl) {
        let key = IMEI_CACHE_KEY + MD5.hex_md5(gateUrl);
        localStorage.setItem(key, imeis)
    }
}

/**
 * 获取分组imei
 * @param {} gate 
 */
export const getImeiArray = () => {
    let gateUrl = getGateUrl();
    if (gateUrl) {
        let key = IMEI_CACHE_KEY + MD5.hex_md5(gateUrl);
        if (localStorage.getItem(key)) {
            try {
                return localStorage.getItem(key).split(",");
            } catch (err) {
                console.log(err);
                return new Array();
            }
        }
    }
    return new Array();
}


export const setSelectedImei = (imei) => {
    localStorage.setItem(SELECT_IMEI, imei);
}

export const getSelectedImei = () => {
    return localStorage.getItem(SELECT_IMEI);
} 
