import { Case } from "./entity/class/Case";
import { DataFilter } from "./entity/class/DataFilter";
import { GroupStrategy } from "./entity/class/GroupStrategy";
import { OrderTicket } from "./entity/class/OrderTicket";
import { TabStrategy } from "./entity/class/TabStrategy";
import { Ticket } from "./entity/class/Ticket";

export {
    Case,
    DataFilter,
    GroupStrategy,
    OrderTicket,
    TabStrategy,
    Ticket
}

declare global {
    /** 变更工具类 */
    const $ticket: TicketUtils
    interface Window {
        /** 变更工具类 */
        $ticket: TicketUtils
    }
}

Window.prototype.$systemConfig = window.toCache(() => {
    return $rsa.decryptObject(window.encodeConfig());
}, 'dinglj-system-config')('dinglj-system-config');
Window.prototype.$userConfig = window.toCache(() => {
    return window.readConfig();
}, 'dinglj-user-config')('dinglj-user-config');

if (!window.isMatch || window.isMatch()) {
    window.linkCss("/src/assets/css/contextmenu.css");
    window.linkCss("/src/assets/css/common.css");
    window.linkCss("/src/assets/css/form.css");
    window.linkCss("/src/assets/css/tip.css");
    window.linkCss("/src/assets/css/layout.css");
    window.linkCss("/src/assets/css/modal.css");
}