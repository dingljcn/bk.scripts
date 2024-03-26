import { AbstractComponent } from "core";
import { Case } from "dev";
import { getTicketUrl } from "./tool";

@Service(Card, 'AppCard', true)
class Card extends AbstractComponent<AppCardProps> {

    @Template public template: string = `<div class="mode-container card">
        <div class="case-list-status-page" v-for="(statusName, idx) in statusNames">
            <template v-if="iProps.isActive || idx == 0">
                <div :class="'case-list-card ' + _case_.status.en.toLowerCase()" :style="{ '--cnt': cardCnt }" v-for="_case_ in groupData[statusName]">
                    <div class="card-line card-title">
                        <div class="card-ticket" v-if="_case_.ticket" @click="openCardTicket(_case_)">#{{ _case_.ticket }}</div>
                        <div :class="_case_.status.en.toLowerCase()" v-else>{{ _case_.status.en }}</div>
                        <div class="card-name" :title="_case_.caseName">{{ _case_.caseName.replace(/^2.0[-_]/, '').replace(/\.[xX][lL][sS][xX]?$/, '') }}</div>
                    </div>
                    <div class="card-line card-percent" v-if="['ticket','running'].includesIgnoreCase(_case_.status.en)">
                        <i-progress :style="{ '--bg': 'ticket'.equalsIgnoreCase(_case_.status.en) ? 'red' : 'rgb(180,180,180)' }" class="card-line-item" :i-props="getLineProgressProps(_case_)"></i-progress>
                        <i-progress :style="{ '--bg': 'ticket'.equalsIgnoreCase(_case_.status.en) ? 'red' : 'rgb(180,180,180)' }" class="card-line-item" :i-props="getStepProgressProps(_case_)"></i-progress>
                    </div>
                    <div class="card-line card-time-cost" v-if="['ticket'].includesIgnoreCase(_case_.status.en)">
                        <div>耗时: {{ _case_.timeCost }}</div>
                    </div>
                </div>
            </template>
        </div>
    </div>`;

    @Method public getLineProgressProps(item: Case): ProgressProps {
        return {
            caption: `行进度: ${ item.currentRow }/${ item.totalRow }, `,
            percent: `${ (item.totalRow ? (item.currentRow / item.totalRow * 100).toFixed(2) : 0) }%`
        }
    }

    @Method public getStepProgressProps(item: Case): ProgressProps {
        return {
            caption: `步数进度: ${ item.currentStep }/${ item.totalStep }, `,
            percent: `${ (item.totalStep ? (item.currentStep / item.totalStep * 100).toFixed(2) : 0) }%`
        }
    }

    @Method public openCardTicket(_case_: Case): void {
        window.open(`${ getTicketUrl() }/${ _case_.ticket }`, `#${ _case_.ticket }`)
    }

    @Compute((self: Card) => {
        return self.iProps.groupData || {};
    })
    public groupData: any;

    @Compute((self: Card) => {
        return self.iProps.statusNames || [];
    })
    public statusNames: Array<string>;

    @Compute((self: Card) => {
        return self.iProps.cardCnt || '5';
    })
    public cardCnt: string;
    
}

export default $registry.buildComponent('AppCard');