declare global {
    interface Window {
        /** 获取图片路径 */
        imgUrl(relativePath: string): string,
        /** 拼接路径, 默认相对于 dinglj_home */
        mergePath(relativePath: string): string,
        /** 拼接路径 */
        mergePath(parentPath: string, relativePath: string): string,
    }

}

export {}