declare global {
    /** RSA 密钥 */
    interface RSA {
        /** 公钥 */
        pub: string;
        /** 私钥 */
        pri: string;
    }
    /** 数据安全功能 */
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
        /** RSA 工具类 */
        $rsa: DingljSecure;
        /** RSA 密钥 */
        rsa: RSA;
    }
}

export {};