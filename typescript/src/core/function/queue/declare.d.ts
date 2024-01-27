declare global {
    interface DingljQueue {
        /** 已注册的事件 */
        eventPool: any,
        /** 待执行的队列 */
        eventQueue: any,
        /** 发送一条消息给事件 */
        sendMsg(event: string, data: any): void,
        /** 发送一条消息给事件 */
        sendMsg(event: string, data: any, elementId: string): void,
        /** 注册一个事件 */
        on(event: string, func: Function): void,
        /** 注册一个事件 */
        on(event: string, func: Function, elementId: string): void,
    }
}

export {};