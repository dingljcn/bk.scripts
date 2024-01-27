import { RightMenu } from "core";

declare global {
    interface DingljContextMenu {
        registRightClick(target: HTMLElement, name: string, config: ContextMenuProp): void,
    }
    interface ContextMenuProp {
        items: Array<RightMenu>
    }
}

export {};