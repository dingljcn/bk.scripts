declare global {
    interface ButtonEvent {
        btnName: string;
        func: Function;
    }
    interface Window {
        $Transform(buttonName: string, username: string, password: string): ButtonEvent;
    }
}

export {};