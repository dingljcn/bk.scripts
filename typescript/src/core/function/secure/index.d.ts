declare global {
    interface DingljSecure {
        /** 默认公钥加密 */
        encrypt(data: string): string,
        /** 指定公钥加密 */
        encrypt(data: string, publicKey: string): string,
        /** 默认私钥解密 */
        decrypt(data: string): string,
        /** 指定私钥解密 */
        decrypt(data: string, privateKey: string): string,
        /** 默认私钥解密 */
        decryptObject(data: object): object,
        /** 指定私钥解密 */
        decryptObject(data: object, privateKey: string): object,
    }
    /** rsa 工具类 */
    const $rsa: DingljSecure;
    interface Window {
        /** rsa 工具类 */
        $rsa: DingljSecure;
    }
}

export {};