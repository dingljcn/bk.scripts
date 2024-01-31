class RightMenu {
    id: string;
    label: string;
    event: Function;
    isDisplay: Function;
    constructor(label: string, event = function(data: any, element: HTMLElement) {}, isDisplay = function(data: any, element: HTMLElement): boolean { return true }) {
        this.id = window.uuid('right-click-item');
        this.label = label;
        this.event = event;
        this.isDisplay = isDisplay;
    }
}

declare global {
    interface Window {
        RightMenu: any;
    }
}

window.RightMenu = RightMenu;

export default RightMenu;