const QueueUtils: DingljQueue = {
    eventPool: {},
    eventQueue: {},
    sendMsg(event: string, data: any, elementId: string = ''): void {
        let key = event;
        if (elementId) {
            key = `${ event }:${ elementId }`;
        }
        const events = window.$queue.eventPool[key];
        if (Array.isArray(events)) {
            if (events.length == 1) {
                return events[0](data);
            }
            let result = [];
            for (let fun of events) {
                result.push(fun(data));
            }
        } else {
            window.pushToArrayInObject(window.$queue.eventQueue, key, data);
        }
    },
    on(event: string, func: Function, elementId: string = ''): void {
        let key = event;
        if (elementId) {
            key = `${ event }:${ elementId }`;
        }
        window.pushToArrayInObject(window.$queue.eventPool, key, func);
        const events = window.$queue.eventQueue[key];
        if (Array.isArray(key)) {
            for (let data of events) {
                func(data);
            }
        }
    }
};

window.$queue = QueueUtils;

export default QueueUtils;