declare global {
    interface Window {
        readLines(): Array<string>,
        readSteps(line: string): Array<string>,
        altDown: boolean,
    }
    interface ScrollProp {
        size?: number,
        current?: number,
        direction?: -1 | 0 | 1,
        height?: number,
        qty?: number,
        toStep?: boolean,
        toLastStep?: boolean,
        lineChanged?: boolean,
        limit?: number,
    }
    interface LineChangeProp {
        line: string,
        expect: -1 | 0,
        toStep: boolean
    }
}

export {};