import { AbstractComponent } from "core";
import { Ticket } from "dev/entity/class/Ticket";

@Service(TicketDtl, 'TicketDtl', true)
export class TicketDtl extends AbstractComponent<TicketDtlProps> {

    @Template template: string = `<i-modal :i-props="modalProps">
        <template v-slot:title>
            <div>
                <span class="ticket-modal-id" @click="openTicketByModal()">
                    {{ iProps.ticketModal.ticket.get('id') }}
                </span>
                <span>{{ iProps.ticketModal.ticket.get('summary') }}</span>
            </div>
        </template>
        <template v-slot:content>
            <div class="ticket-modal-content-grid-container">
                <div :class="{
                    'dinglj-v-auto-hidden': true,
                    'ticket-modal-content-grid-item': true,
                    'active': !!iProps.ticketModal.ticket.get(item)
                }" v-for="item in columns">
                    <div class="dinglj-v-auto-hidden" :title="getFieldCaption(item)">
                        {{ getFieldCaption(item) }}
                    </div>
                    <div class="dinglj-v-auto-hidden" :title="iProps.ticketModal.ticket.get(item) || 'null'">
                        {{ iProps.ticketModal.ticket.get(item) || 'null' }}
                    </div>
                </div>
            </div>
            <i-text-area :i-props="noteProps"></i-text-area>
        </template>
    </i-modal>`;

    @Field notes: string;

    @Compute((self: TicketDtl): Array<TicketFields> => {
        const result: Array<TicketFields> = [];
        const ignore: Array<TicketFields> = ['id', 'summary', 'dinglj_note'];
        for (let key of Ticket.fieldNames) {
            if (ignore.includes(key)) {
                continue;
            }
            result.push(key);
        }
        return result;
    })
    columns: Array<TicketFields>;

    @Method public openTicketByModal() {
        $ticket.openTicket(this.iProps.app, this.iProps.ticketModal.ticket.get('id'));
    }

    @Method public getFieldCaption(key: TicketFields) {
        return Ticket.getCaption(key);
    }

    @Compute((self: TicketDtl): ModalProps => {
        return {
            display: self.iProps.ticketModal.display,
            width: 700,
            height: 400,
            ok(): void {
                self.iProps.saveCache(self.notes);
                self.iProps.closeWindow();
            },
            onClose: function(): void {
                self.iProps.closeWindow();
            }
        }
    })
    public modalProps: ModalProps;

    @Compute((self: TicketDtl): TextAreaProps => {
        return {
            caption: '备注',
            height: 130,
            defaultValue: window.getVal(self.iProps, 'ticketModal.ticket.dinglj_note', ''),
            placeholder: '在此填写备注',
            onOver(data) {
                self.notes = data.value;
            },
        }
    })
    noteProps: TextAreaProps;

}

export default $registry.buildComponent('TicketDtl');