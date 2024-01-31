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