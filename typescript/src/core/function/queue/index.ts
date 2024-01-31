window.$queue = {
    eventPool: {},
    eventQueue: {},
} as any;

$queue.sendMsg = function(event: string, data: any, elementId: string = ''): void {
    let key = event;
    if (elementId) {
        key = `${ event }:${ elementId }`;
    }
    const events = $queue.eventPool[key];
    if (Array.isArray(events)) {
        if (events.length == 1) {
            return events[0](data);
        }
        let result = [];
        for (let fun of events) {
            result.push(fun(data));
        }
    } else {
        window.pushToArrayInObject($queue.eventQueue, key, data);
    }
}

$queue.on = function(event: string, func: Function, elementId: string = ''): void {
    let key = event;
    if (elementId) {
        key = `${ event }:${ elementId }`;
    }
    window.pushToArrayInObject($queue.eventPool, key, func);
    const events = $queue.eventQueue[key];
    if (Array.isArray(key)) {
        for (let data of events) {
            func(data);
        }
    }
}
