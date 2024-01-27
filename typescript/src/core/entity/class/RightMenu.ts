class RightMenu {
    id: string;
    label: string;
    event: Function;
    isDisplay: Function;
    constructor(label: string, event: Function, isDisplay = () => true) {
        this.id = window.uuid('right-click-item');
        this.label = label;
        this.event = event;
        this.isDisplay = isDisplay;
    }
}

window.RightMenu = RightMenu;

export default RightMenu;