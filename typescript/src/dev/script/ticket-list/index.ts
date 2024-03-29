import './encode-config';
import { AbstractComponent, LangItem } from 'core';
import { Ticket } from 'dev';
import 'dev/util/ticket'
import tifilter from './filter';
import ticketModal from '../../util/ticket/ticket-detail-modal';

const mainElement = window.byId('main');

if (mainElement) {
    window.linkCss('/src/script/ticket-list/index.css');
    window.byId('footer') && window.byId('footer').remove()
    for (let element of mainElement.children) {
        element.style.display = 'none';
    };
    mainElement.innerHTML += `<div id="dinglj-main">
        <i-nav-view :i-props="{ list: groupNames }">
            <template v-slot:before>
                <tifilter :data="originData" @on-change="emit => filter = emit.value"></tifilter>
            </template>
            <template class="result-view" #content="{ active }">
                <i-tab-view v-for="groupName in groupNames" :i-props="genTabViewProps(groupName)">
                    <template v-for="(tabName, idx) in tabNames(groupName)">
                        <div style="width: 100%; overflow: hidden">
                            <i-table v-if="active == groupName || idx == 0" :i-props="genTableProps(groupName, tabName)"></i-table>
                        </div>
                    </template>
                </i-tab-view>
                <ticket-modal :i-props="modalProps"></ticket-modal>
            </template>
            <template v-slot:after></template>
        </i-nav-view>
    </div>`;
}

@Service(App, 'App')
export class App extends AbstractComponent<any> implements TicketApp {

    @Component({
        tifilter, ticketModal
    })
    @Mounted public mounted(): any {
        const _this = this;
        window.displayData = function() {
            return _this;
        }
        $ticket.getTops(this);
        let list = $ticket.getNewTickets(this);
        if (list.length > 0) {
            let msg = `你有 ${ list.length } 个新变更, 注意查收<div style="margin-top: 10px; display: flex">
            <div style="flex: 1"></div>
                <div style="margin-left: 5px; font-weight: bold; color: var(--theme-color); cursor: pointer" onclick="${
                    list.map(t => `$ticket.openTicket(window.displayData(), '${ t }');`).join('')
                }">全部打开</div>
                <div style="margin-left: 10px; font-weight: bold; color: var(--theme-color); cursor: pointer" onclick="${
                    (list.map(t => `$ticket.setOpended(window.displayData(), '${ t }');`).join('')) + "'已全部标记'.info()"
                }">全部标记为已读</div>
            </div>`;
            msg.info(5000);
        }
    }

    @Field public sort: TicketSortColumn = {
        columnKey: null,
        type: 'ASC',
    }

    @Field public tableIdList: Array<string> = [];

    @Field public filter: any = {};

    @Field public tops: Array<string> = null;
    
    @Field public newTickets: Array<string> = null;
    
    @Field public myTickets: Array<string> = null;
    
    @Field public localStorage: TicketStorageInfo = null;

    @Field public modal: TicketModal = {
        ticket: null,
        display: false,
    };
    
    @Field public constant = {
        storage: 'dinglj-v-ticket-list-storage',
    }

    @Method genTableProps(groupName: string, tableName: string): TableProps<Ticket, LangItem> {
        const self: App = this;
        return {
            list: self.tabData(groupName)[tableName],
            columns: self.columnsToDisplay(groupName, tableName),
            flexColumns: [ 'summary' ],
            getCell: self.getCellValue,
            getColumnKey: (col) => col.en,
            getColumnLabel: (col) => col.zh,
            rowMenus: $ticket.lineMenu(self),
            bodyMenus: $ticket.bodyMenus(self),
            titleColumnMenus: $ticket.titleColMenu(self),
            title: `${ groupName }-${ tableName }`,
            loaded: self.tableLoaded
        }
    }
    
    @Method genTabViewProps(groupName: string): TabViewProps<string> {
        const self: App = this;
        return {
            list: self.tabNames(groupName),
            getLabel: function(label: string) {
                return `${ label } (${ self.tabData(groupName)[label].length })`;
            }
        }
    }

    @Method public getCellValue(ticket: Ticket, col: LangItem | string): string {
        return $ticket.getCellValue<any>(this, ticket, col);
    }

    @Method public tableLoaded(args: EmitArgs<HTMLElement>): void {
        $ticket.afterTableLoad(this, args.vid);
    }

    @Method public tabData(groupName: string): any {
        return $ticket.tabData(this, groupName);
    }

    @Method public tabNames(groupName: string): any {
        return Object.keys(this.tabData(groupName));
    }

    @Method public columnsToDisplay(groupName: string, tabName: string): Array<LangItem> {
        return $ticket.columnsToDisplay(this, groupName, tabName);
    }

    @Compute((self: App): TicketDtlProps => {
        return {
            ticketModal: self.modal,
            app: self,
            saveCache(notes) {
                self.modal.ticket.set('dinglj_note', notes);
                const id = self.modal.ticket.get('id');
                const cache = $store.getStorage<any>('dinglj-v-ticket-cache', {});
                if (cache && !cache[id]) {
                    cache[id] = {};
                }
                cache[id]['dinglj_note'] = notes;
                $store.setStorage('dinglj-v-ticket-cache', cache);
                console.log(cache);
            },
            closeWindow(): void {
                self.modal.display = false;
            },
        }
    })
    public modalProps: TicketDtlProps;

    @Compute((self: App) => {
        let regExp = /[?&]group=([a-zA-Z0-9]+)[?&]?/;
        let defaultValue = '';
        if(regExp.test(window.location.href)) {
            defaultValue = (regExp.exec(window.location.href))[1]; // url 参数
        }
        if (!defaultValue) {
            regExp = /[?&]groupby=([a-zA-Z0-9]+)[?&]?/
            if(regExp.test(window.location.href)) {
                defaultValue = (regExp.exec(window.location.href))[1]; // url 参数
            }
        }
        const defaultColumns = ['component', 'owner', 'status']; // 如果既没有配置, 也没有 url 参数, 则从这里面选一个存在的
        let firstLevel = window.getConfigOrDefault('groupBy', defaultValue, true);
        if (defaultColumns.includesIgnoreCase(firstLevel)) {
            defaultColumns.remove(firstLevel);
        }
        defaultColumns.unshift(firstLevel);
        for (let tmp of defaultColumns) {
            if (Object.keys(self.originData[0]).includesIgnoreCase(tmp)) {
                return tmp;
            }
        }
    })
    public groupColumn: string;

    @Compute($ticket.readTicket)
    public originData: Array<Ticket>;

    @Compute((self: App) => {
        if (self.originData.length == 0) {
            return [];
        }
        let result: Array<Ticket> = self.originData;
        let column: any;
        for (column of Object.keys(self.originData[0])) {
            if (self.filter[column]) {
                result = result.filter(i => i.get(column) == self.filter[column]);
            }
        }
        result = result.filter(i => self.filter.keyword ? (i.get('summary').includesIgnoreCase(self.filter.keyword) || i.get('id').includesIgnoreCase(self.filter.keyword)) : true);
        return result;
    })
    public filterData: Ticket[];

    @Compute((self: App) => $ticket.groupData(self))
    public groupData: any;

    @Compute((self: App) => $ticket.groupNames(self))
    public groupNames: any;

    @Compute((self: App) =>  window.getConfigOrDefault('urls.ticket', ''))
    public ticketURL: string;

}

window.createVue($registry.buildComponent('App'), '#dinglj-main');