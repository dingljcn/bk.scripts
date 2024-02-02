import { LangItem, RightMenu } from "core";
import { Ticket } from "dev";

window.$ticket = {} as any;

$ticket.whoami = function(): any {
    return window.getVal($userConfig, 'whoami.zh', '', true);
}

const cacheString = function(fn: Function): Function {
    const cache: any = {};
    return function(str: string): any {
        return cache[str] || (cache[str] = fn(str));
    }
}

$ticket.urlArgs = (cacheString((str: string) => {
    const result: any = {};
    const arrayifys = ['user', 'status', 'column'];
    const startIdx = window.location.href.indexOf('?');
    const search = window.location.href.substring(startIdx + 1);
    for (const kv of search.split('&')) {
        if (!kv.trim()) {
            continue;
        }
        const splitIdx = kv.indexOf('=');
        if (splitIdx >= 0) {
            const key = kv.substring(0, splitIdx);
            const value = kv.substring(splitIdx + 1);
            result[key] = arrayifys.includes(key.toLowerCase()) ? value.split(',') : value;
        }
    }
    return result;
}))('url-args');

$ticket.queryTicket = function() {
    if (window.isDev()) {
        return window.readData();
    }
    const flag = window.getVal($systemConfig, 'specialUrl.flag', '');
    if (flag && window.location.href.includes(flag)) {
        if (!$ticket.urlArgs.user) {
            '请至少指定一个用户'.err();
            return;
        }
        let status = '';
        if ($ticket.urlArgs.status) {
            status = $ticket.urlArgs.status.map(s => `status=${ s }`).join('&');
        }
        const considerFields = ['owner', 'reporter', 'cc'];
        let urlParam = considerFields.map(f => {
            let fields = $ticket.urlArgs.user.map(o => `${ f }=${ o }`).join('&');
            return status ? `${ fields }&${ status }` : fields;
        }).join('&or&');
        if ($ticket.urlArgs.groupby) {
            urlParam += `&group=${ $ticket.urlArgs.groupby }`;
        }
        if ($ticket.urlArgs.max) {
            urlParam += `&max=${ $ticket.urlArgs.max }`;
        } else {
            urlParam += `&max=10000`;
        }
        if ($ticket.urlArgs.column) {
            if ($ticket.urlArgs.column[0] == 'all') {
                urlParam += '&' + window.getVal($systemConfig, 'specialUrl.columns', '').split(',').map(c => `col=${ c }`).join('&');
            } else {
                urlParam += '&' + $ticket.urlArgs.column.map(c => `col=${ c }`).join('&');
            }
        } else {
            urlParam += '&' + window.getVal($systemConfig, 'specialUrl.columns', '').split(',').map(c => `col=${ c }`).join('&');
        }
        const queryUrl = window.getVal($systemConfig, 'specialUrl.query', '');
        if (queryUrl) {
            return $net.get(`${ queryUrl }?${ urlParam }`);
        }
    }
    return '';
}

$ticket.readTicket = function(): Array<Ticket> {
    const htmlData = $ticket.queryTicket();
    const result: Array<Ticket> = [];
    let _document = window.document;
    if (htmlData.trim()) {
        _document = new DOMParser().parseFromString(htmlData, 'text/html');
    }
    const ticketClass = ['prio1', 'prio2', 'prio3'];
    for (let className of ticketClass) {
        for (let element of window.byClass(className, _document)) {
            result.push(new Ticket(element));
        }
    }
    return result;
}

$ticket.getCellValue = function(vue: TicketApp, ticket: Ticket, col: LangItem | string): any {
    let columnKey: any;
    if (typeof col == 'string') {
        columnKey = col;
    } else {
        columnKey = col.en;
    }
    if ('summary'.equalsIgnoreCase(columnKey)) {
        return $ticket.getSummary(vue, ticket); // 概述单元格特殊处理
    }
    return ticket.get(columnKey);
}

$ticket.getSummary = function(vue: TicketApp, ticket: Ticket): string {
    let html = '';
    if ($ticket.getNewTickets(vue).includes(ticket.get('id'))) {
        html += '<span class="ticket-list-new-ticket">new</span>';
    }
    if ($ticket.getTops(vue).includes(ticket.get('id'))) {
        html += '<span class="ticket-list-top-ticket">top</span>';
    }
    html += `<span title="${ ticket.get('summary') }">${ ticket.get('summary') }</span>`;
    return html;
}

$ticket.getTops = function(vue: TicketApp): Array<string> {
    if (vue.tops) {
        return vue.tops;
    }
    vue.tops = $ticket.getLocalStorage(vue).topTickets || [];
    return vue.tops;
}

$ticket.getNewTickets = function(vue: TicketApp): Array<string> {
    if (vue.newTickets) {
        return vue.newTickets;
    }
    const myTickets = $ticket.getMyTickets(vue);
    vue.newTickets = vue.originData.filter((i: Ticket) => {
        return i.get('owner') == $ticket.whoami() && !myTickets.includesIgnoreCase(i.get('id'));
    }).map((i: Ticket) => {
        return i.get('id');
    });
    return vue.newTickets;
}

$ticket.getMyTickets = function(vue: TicketApp): Array<string> {
    if (vue.myTickets) {
        return vue.myTickets;
    }
    vue.myTickets = $ticket.getLocalStorage(vue).myTickets || [];
    return vue.myTickets;
}

$ticket.getLocalStorage = function(vue: TicketApp): TicketStorageInfo {
    if (vue.localStorage) {
        return vue.localStorage;
    }
    vue.localStorage = $store.getStorage<TicketStorageInfo>(vue.constant.storage, {
        topTickets: [],
        myTickets: [],
    });
    return vue.localStorage;
}

$ticket.parseTicketTime = function(ticket: Ticket, field: TicketFields = 'changetime'): number {
    const target = ticket.get(field);
    if (target == '刚刚') {
        return 0;
    }
    if (/^\d+分钟 ago$/.test(target)) {
        return parseInt(target) * 60; // 转为秒
    }
    if (/^\d+小时 ago$/.test(target)) {
        return parseInt(target) * 60 * 60; // 转为秒
    }
    if (/^\d+天 ago$/.test(target)) {
        return parseInt(target) *24 * 60 * 60; // 转为秒
    }
    if (/^\d+周 ago$/.test(target)) {
        return parseInt(target) * 7 * 24 * 60 * 60; // 转为秒
    }
    if (/^\d+个月 ago$/.test(target)) {
        return parseInt(target) * 30 * 24 * 60 * 60; // 转为秒
    }
    if (/^\d+年 ago$/.test(target)) {
        return parseInt(target)  * 365 * 24 * 60 * 60; // 转为秒
    }
}

$ticket.parseTime = function(target: string): string {
    let date = new Date();
    if (target == '刚刚') {
        return date.$format();
    }
    let num = parseInt(target) * -1;
    if (/^\d+分钟 ago$/.test(target)) {
        date.$setMinute(num);
    }
    if (/^\d+小时 ago$/.test(target)) {
        date.$setHour(num);
    }
    if (/^\d+天 ago$/.test(target)) {
        date.$setDate(num);
    }
    if (/^\d+周 ago$/.test(target)) {
        date.$setDate(num * 7);
    }
    if (/^\d+个月 ago$/.test(target)) {
        date.$setMonth(num);
    }
    if (/^\d+年 ago$/.test(target)) {
        date.$setYear(num);
    }
    return date.$format();
}

$ticket.sortByTime = function(ticket1: Ticket, ticket2: Ticket): number {
    const firstCompare = $ticket.parseTicketTime(ticket1) - $ticket.parseTicketTime(ticket2);
    if (firstCompare == 0) {
        if (ticket1.get('id') > ticket2.get('id')) {
            return -1;
        } else if (ticket1.get('id') < ticket2.get('id')) {
            return 1;
        } else {
            return 0;
        }
    }
    return firstCompare;
}

$ticket.toTicketId = function(target: string | HTMLElement): string {
    if (target == undefined || target == null) {
        return '';
    }
    let str: string = '';
    if (typeof target == 'string') {
        str = target;
    } else {
        str = target.innerText;
    }
    if (str) {
        str = str.replace(/\n/g, '').trim();
    }
    if (/.*#(\d+).*/.test(str)) {
        return /.*#(\d+).*/.exec(str)[1];
    }
    if (/^\d+$/.test(str)) {
        return str;
    }
    return '';
}

$ticket.openTicket = function(vue: TicketApp, target: string | HTMLElement): void {
    const ticketId = $ticket.toTicketId(target);
    for (let element of window.byClass(`ticket-${ ticketId }`)) {
        const selectField = element.findChildrenByClass('dinglj-v-table-select');
        if (selectField && selectField.length) {
            let checkBox: HTMLInputElement = selectField[0].children[0] as any;
            checkBox.checked = true;
        }
    }
    $ticket.setOpended(vue, ticketId);
    let baseUrl = window.getConfigOrDefault('urls.ticket', '', false);
    if (!baseUrl.endsWith('/')) {
        baseUrl += '/';
    }
    window.open(baseUrl + ticketId);
}

$ticket.setOpended = function(vue: TicketApp, target: string): boolean {
    const ticketId = $ticket.toTicketId(target);
    const ticket = $ticket.getTicketById(vue, ticketId);
    if (ticket.get('owner') == $ticket.whoami() && $ticket.getNewTickets(vue).includes(`#${ ticketId }`)) {
        $ticket.getNewTickets(vue).remove(`#${ ticketId }`); // 移除元素
        $ticket.updateSummary(vue, ticket); // 更新页面
        // 更新本地缓存
        vue.localStorage.myTickets.pushNew(`#${ ticketId }`);
        $store.setStorage(vue.constant.storage, vue.localStorage);
        return true;
    }
    return false;
}

$ticket.setUnOpen = function(vue: TicketApp, target: string): boolean {
    const ticketId = $ticket.toTicketId(target);
    const ticket = $ticket.getTicketById(vue, ticketId);
    if (ticket.get('owner') == $ticket.whoami() && !$ticket.getNewTickets(vue).includes(`#${ ticketId }`)) {
        $ticket.getNewTickets(vue).pushNew(`#${ ticketId }`); // 添加元素
        $ticket.updateSummary(vue, ticket); // 更新页面
        // 更新本地缓存
        vue.localStorage.myTickets.remove(`#${ ticketId }`);
        $store.setStorage(vue.constant.storage, vue.localStorage);
        return true;
    }
    return false;
}

$ticket.getTicketById = function(vue: TicketApp, target: string): Ticket {
    const ticketId = $ticket.toTicketId(target);
    const result = vue.originData.getIfExistByKey('id', `#${ ticketId }`);
    return result && result.length ? result[0] : null;
}

$ticket.updateSummary = function(vue: TicketApp, ticket: Ticket): void {
    window.byClass('dinglj-v-cell id').filter(e => e.innerText == ticket.get('id')).forEach(e => {
        let summary = e.findBroByClass('summary')[0];
        if (summary) {
            summary.innerHTML = $ticket.getSummary(vue, ticket);
        }
    });
};

$ticket.afterTableLoad = function(vue: TicketApp, tableId: string): void {
    window.timer(function() {
        const list = window.query(`#${ tableId } .dinglj-v-tbody .dinglj-v-cell.id`);
        if (list.length == 0) {
            return false;
        }
        list.forEach(element => {
            (element.parentNode as any).classList.add(`ticket-${ $ticket.toTicketId(element) }`);
            element.addEventListener('click', e => {
                e.stopPropagation();
                $ticket.openTicket(vue, element);
            });
        });
        return true;
    }, 100);
}

$ticket.isTop = function(vue: TicketApp, obj: string | Ticket): boolean {
    if (typeof obj == 'string') {
        return $ticket.getTops(vue).includesIgnoreCase(obj);
    } else {
        return $ticket.getTops(vue).includesIgnoreCase(obj.get('id'));
    }
}

$ticket.lineMenu = function(vue: TicketApp): Array<RightMenu> {
    return [
        new RightMenu('打开变更', function(ticket: Ticket, element: HTMLElement) {
            $ticket.openTicket(vue, ticket.get('id'));
        }),
        new RightMenu('复制描述', function(ticket: Ticket, element: HTMLElement) {
            window.copyTxt(ticket.get('summary'));
        }),
        new RightMenu('置顶', function(ticket: Ticket, element: HTMLElement) {
            $ticket.toTop(vue, ticket.get('id'));
            `${ ticket.get('id') } 已置顶`.info();
        }, function(ticket: Ticket, element: HTMLElement) {
            return !$ticket.isTop(vue, ticket.get('id'));
        }),
        new RightMenu('取消置顶', function(ticket: Ticket, element: HTMLElement) {
            $ticket.cancelTop(vue, ticket.get('id'));
            `${ ticket.get('id') } 已取消置顶`.info();
        }, function(ticket: Ticket, element: HTMLElement) {
            return $ticket.isTop(vue, ticket.get('id'));
        }),
        new RightMenu('标记为已读', function(ticket: Ticket, element: HTMLElement) {
            if ($ticket.setOpended(vue, element.innerText)) {
                `${ ticket.get('id') } 已标记为已读`.info();
            }
        }, function(ticket: Ticket, element: HTMLElement) {
            return $ticket.getNewTickets(vue).includes(ticket.get('id'));
        }),
        new RightMenu('标记为未读', function(ticket: Ticket, element: HTMLElement) {
            if ($ticket.setUnOpen(vue, element.innerText)) {
                `${ ticket.get('id') } 已取消已读标记`.info();
            }
        }, function(ticket: Ticket, element: HTMLElement) {
            return !$ticket.getNewTickets(vue).includes(ticket.get('id'));
        }),
        new RightMenu('显示更多信息', function(ticket: Ticket, element: HTMLElement) {
            vue.modal.ticket = ticket;
            vue.modal.display = true;
        }),
    ]
}

$ticket.bodyMenus = function(vue: TicketApp): Array<RightMenu> {
    return [
        new RightMenu('导出', function(list: Array<Ticket>, element: HTMLElement): void {
            exportToExcel(list, element.parentElement);
        }),
        new RightMenu('清除排序', function(data: TableColumn<Ticket>, element: HTMLElement): void {
            vue.sort.columnKey = null;
        }),
    ]
}

$ticket.titleColMenu = function(vue: TicketApp): Array<RightMenu> {
    return [
        new RightMenu('按照此列升序', function(data: TableColumn<Ticket>, element: HTMLElement): void {
            vue.sort.columnKey = data.columnKey;
            vue.sort.type = 'ASC';
        }),
        new RightMenu('按照此列降序', function(data: TableColumn<Ticket>, element: HTMLElement): void {
            vue.sort.columnKey = data.columnKey;
            vue.sort.type = 'DESC';
        }),
        new RightMenu('清除排序', function(data: TableColumn<Ticket>, element: HTMLElement): void {
            vue.sort.columnKey = null;
        }),
        new RightMenu('导出', function(data: TableColumn<Ticket>, element: HTMLElement): void {
            exportToExcel(data.list, element.parentElement.parentElement);
        }),
    ]
}

function exportToExcel(list: Array<Ticket>, element: HTMLElement): void {
    let exportKeys: Array<TicketFields> = [];
    let data: Array<any> = [];
    let headLine: Array<any> = [];
    for (let cell of element.children[0].children) {
        if (cell.classList.contains('dinglj-v-table-select') || cell.classList.contains('dinglj-v-table-sequence')) {
            continue;
        }
        let columnKey: TicketFields = cell.getAttribute('data-key') as any;
        exportKeys.push(columnKey);
        headLine.push(Ticket.fields[columnKey]);
    }
    data.push(headLine);
    for (let ticket of list) {
        let dataLine: Array<any> = [];
        for (let key of exportKeys) {
            let data = ticket.get(key);
            if (key == 'time' || key == 'changetime') {
                data = $ticket.parseTime(data);
            }
            dataLine.push(data);
        }
        data.push(dataLine);
    }
    $excel.export(`${ element.getAttribute('data-title') || element.id } ${ (new Date()).$format().replace(/:/g, '') }.xlsx`, data);
}

$ticket.toTop = function(vue: TicketApp, target: string): void {
    const ticketId = $ticket.toTicketId(target);
    vue.localStorage.topTickets.pushNew(`#${ ticketId }`);
    vue.tops = vue.localStorage.topTickets;
    $store.setStorage(vue.constant.storage, vue.localStorage);
}

$ticket.cancelTop = function(vue: TicketApp, target: string): void {
    const ticketId = $ticket.toTicketId(target);
    vue.localStorage.topTickets.remove(`#${ ticketId }`);
    vue.tops = vue.localStorage.topTickets;
    $store.setStorage(vue.constant.storage, vue.localStorage);
}

$ticket.groupData = function(vue: TicketApp): any {
    if (vue.filterData.length <= 0) {
        return {};
    }
    let result: any = {};
    if (vue.groupColumn) {
        result = window.groupBy(vue.filterData, vue.groupColumn);
    } else {
        '未找到任何用于分组的配置'.err();
    }
    const strategyList = window.getConfigOrDefault('strategy.groupBy', []);
    for (let ticket of vue.filterData) {
        for (let fieldKey of Ticket.fieldNames) {
            for (let idx = strategyList.length - 1; idx >= 0; idx--) {
                let groupName = strategyList[idx].exec(ticket, fieldKey);
                if (groupName) {
                    if (!result[groupName] || !result[groupName].includes(ticket)) {
                        unshiftToArray(result, groupName, ticket);
                    }
                }
            }
        }
    }
    return result;
}

$ticket.groupNames = function(vue: TicketApp): Array<string> {
    if (vue.groupData.length <= 0) {
        return [];
    }
    const result = Object.keys(vue.groupData); // 所有分组名
    const order = window.getConfigOrDefault('strategy.order.group', {}, false); // 获取排序规则
    result.sort((o1, o2) => {
        return $get<Array<string>>(order, vue.groupColumn).compareBy(o1, o2);
    })
    return result;
}

$ticket.tabData = function(vue: TicketApp, groupName: string): any {
    // 没有数据, 直接返回
    const groupData = vue.groupData[groupName];
    const result: any = {};
    if (!groupData || groupData.length == 0) {
        return result;
    }
    const tabStrategys = window.getConfigOrDefault('strategy.tabBy', []);
    const rowFilters = window.getConfigOrDefault('strategy.rowFilter', []);
    // 遍历每一个 Tab 页策略
    for (let tabStrategy of tabStrategys) {
        // 根据规则, 将所有符合规则的变更找出来
        for (let ticket of groupData) {
            let tmpName = tabStrategy.exec(groupName, ticket);
            if (tmpName) {
                // 根据行过滤器进行二次判断
                let ignore = false;
                for (let filter of rowFilters) {
                    if (filter.exec(groupName, tmpName, groupData, ticket)) {
                        ignore = true;
                        break
                    }
                }
                if (!ignore) {
                    pushToArray(result, tmpName, ticket, true);
                }
            }
        }
    }
    // 这样就得到了该 tab 页下所有的变更, 然后对变更进行排序
    const orderStrategys = window.getConfigOrDefault('strategy.order.ticket', []);
    for (let tabName of Object.keys(result)) {
        result[tabName].sort((t1: Ticket, t2: Ticket) => {
            let isTop1 = $ticket.isTop(vue, t1.get('id'));
            let isTop2 = $ticket.isTop(vue, t2.get('id'));
            if (isTop1 !=  isTop2) {
                if (isTop1) {
                    return -1;
                } else if (isTop2) {
                    return 1;
                }
            }
            if (vue.sort.columnKey == null) {
                for (let orderStrategy of orderStrategys) {
                    let flag = orderStrategy.exec(groupName, tabName, t1, t2);
                    if (flag != 0) {
                        return flag;
                    }
                }
                return $ticket.sortByTime(t1, t2); // 默认按照时间排序
            } else {
                let val1: any = t1.get(vue.sort.columnKey);
                let val2: any = t2.get(vue.sort.columnKey);
                if (vue.sort.columnKey == 'changetime') {
                    val1 = $ticket.parseTicketTime(t1, 'changetime');
                    val2 = $ticket.parseTicketTime(t2, 'changetime');
                } else if (vue.sort.columnKey == 'time') {
                    val1 = $ticket.parseTicketTime(t1, 'time');
                    val2 = $ticket.parseTicketTime(t2, 'time');
                }
                if (val1 < val2) {
                    return vue.sort.type == 'ASC' ? -1 : 1;
                } else if (val1 > val2) {
                    return vue.sort.type == 'ASC' ? 1 : -1;
                } else {
                    for (let orderStrategy of orderStrategys) {
                        let flag = orderStrategy.exec(groupName, tabName, t1, t2);
                        if (flag != 0) {
                            return flag;
                        }
                    }
                    return $ticket.sortByTime(t1, t2); // 默认按照时间排序
                }
            }
        })
    }
    return result;
}

$ticket.columnsToDisplay = function(vue: TicketApp, groupName: string, tabName: string): Array<LangItem> {
    const tabDatas = $ticket.tabData(vue, groupName);
    if (!tabDatas) {
        return [];
    }
    const everyTab = tabDatas[tabName];
    if (!everyTab || everyTab.length == 0) {
        return [];
    }
    let columnKeys = [];
    const filters = window.getConfigOrDefault('strategy.colFilter', []);
    // 根据列的过滤策略进行过滤
    for (let column of Ticket.fieldNames) {
        let ignore = false;
        for (const filter of filters) {
            if (filter.exec(groupName, tabName, everyTab, null, column)) {
                ignore = true;
                break;
            }
        }
        if (!ignore) {
            columnKeys.push(column);
        }
    }
    return columnKeys.map(i => {
        return {
            zh: Ticket.getCaption(i),
            en: i,
        }
    })
}

export default TicketUtils;