declare global {
    interface Window {
        /**
         *  周期性执行任务
         * @param fn 执行函数, 返回 true 时结束任务
         */
        timer<T>(fn: Function): void;
        /**
         *  周期性执行任务
         * @param fn 执行函数, 返回 true 时结束任务
         * @param time 每多少毫秒执行一次
         */
        timer<T>(fn: Function, time: number): void;
        /**
         *  周期性执行任务
         * @param fn 执行函数, 返回 true 时结束任务
         * @param object 执行的主体对象
         */
        timer<T>(fn: Function, object: T): void;
    }
}

Window.prototype.timer = function<T>(fn: Function, param?: number | T) {
    let time: number = 30;
    let object: T = null;
    if (param) {
        if (typeof param == 'number') {
            time = param;
        } else {
            object = param;
        }
    }
    time = time < 30 ? 30 : time;
    let timer = setInterval(() => {
        if (fn(object)) {
            clearInterval(timer);
        }
    }, time);
}

export {}