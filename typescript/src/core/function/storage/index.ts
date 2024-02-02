declare global {
    interface StorageUtils {
        /** 获取本地缓存 */
        getStorage<T>(key: string): T;
        getStorage<T>(key: string, _default: T): T;
        /** 设置本地缓存 */
        setStorage(key: string, value: any): void;
        setStorage(key: string, value: any, timeout: number): void;
    }
    /** 本地缓存工具 */
    const $store: StorageUtils;
    interface Window {
        /** 本地缓存工具 */
        $store: StorageUtils;
    }
    interface StorageStruct {
        /** 保存时间 */
        savetime: number,
        /** 有效期, 单位: ms */
        timeout: number,
        /** 数据 */
        data: any
    }
}

export {}

window.$store = {} as any;

window.$store.getStorage = function(key: string, _default: any = undefined) {
    let json = localStorage.getItem(key);
    if (json) {
        const result: StorageStruct = JSON.parse(json);
        if (result.timeout > 0 && (Date.now() - result.savetime > result.timeout)) {
            `本地缓存${ key }已过期`.warn();
            return _default;
        }
        return result.data;
    }
    return _default;
}

window.$store.setStorage = function(key: string, value: any, timeout: number = -1) {
    let obj: StorageStruct = {
        savetime: Date.now(),
        timeout: timeout,
        data: value,
    }
    localStorage.setItem(key, JSON.stringify(obj));
}
