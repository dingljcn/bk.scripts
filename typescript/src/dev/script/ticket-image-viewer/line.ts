import { AbstractComponent, Compute, Field, Method, Mounted, Prop, Registry, Template } from "core";
import NavType from "./NavType";
import { $tool } from "./tool";

export class TIV_Line extends AbstractComponent {
    
    @Mounted(TIV_Line, 'iv-line')
    public mounted(): void {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
        // 周期性检查行是否加载完成
        window.timer(() => {
            if (this.lines.length > 0) {
                this.setIdx(this.lines.length - 1, true, true);
                return true;
            }
            return false;
        });
        /** 方向键绑定 */
        window.$queue.on('update-line', (data: ScrollProp) => {
            this.doScroll(data);
        });
        /** 上一行 */
        window.$queue.on('toPrevLine', () => {
            this.setIdx(this.current - 1, true, true);
        });
        /** 下一行 */
        window.$queue.on('toNextLine', () => {
            this.setIdx(this.current + 1, true, false);
        });
        /** 跳转到指定行 */
        window.$queue.on('jumpToLine', (lineNumber: string) => {
            let idx = this.lines.indexOf(lineNumber);
            if (idx != -1) {
                this.setIdx(idx);
            }
        });
    }

    @Template
    public template: string = `<div id="line-container">
        <div :class="{ 'line': true, 'arrow': true, 'active': arrow == 'line' }">
            <div :title="lineNumber" :class="{ 'line-number': true, 'active': current == idx, 'last': last == idx }" v-for="(lineNumber, idx) of lines" @click="setIdx(idx)">
                {{ lineNumber }}
            </div>
        </div>
    </div>`;

    @Field
    public current: number = -1;

    @Field
    public last: number = -1;

    @Method
    public setIdx(i: number, toStep = false, toLastStep = false): void {
        const lineContainer = window.byClass('line arrow')[0];
        if (lineContainer) {
            const limit = $tool.getLimit(lineContainer);
            this.doScroll({
                size: this.lines.length,
                current: i,
                direction: 0,
                height: $tool.getOneHeight(lineContainer),
                qty: $tool.getScrollQty(i, limit, 0),
                toStep: toStep,
                toLastStep: toLastStep,
            });
        }
    }

    @Method
    public doScroll(prop: ScrollProp): void {
        const next = prop.current + prop.direction;
        if (next < 0) {
            '已经到第一行了'.info();
            return;
        } else if (next >= prop.size) {
            '已经到最后一行了'.info();
            return;
        } else if (this.current == next) {
            return;
        }
        window.byId('line-container').scrollTo(0, prop.height * prop.qty);
        this.last = this.current;
        this.current = next;
        window.$queue.sendMsg('line-changed', {
            line: this.lines[next],
            expect: !!prop.toLastStep ? -1 : 0,
            toStep: !!prop.toStep
        });
        window.$queue.sendMsg('change-active-panel', NavType.Line);
    }

    @Compute(function() {
        const readLineRegExp = /.*<a href="([0-9]+\/)".*/;
        if (window.readLines) {
            return window.readLines();
        }
        const response = window.get<string>(`${ window.location.href }1`);
        const lineNumbers = response.split('\n');
        return lineNumbers.map((line: string) =>  readLineRegExp.test(line) ? readLineRegExp.exec(line)[1] : '')
            .filter((href: string) => href != '')
            .map((href: string) => href.replace(/\/$/, ''));
    })
    public lines: Array<string>;

    @Prop(String, NavType.Step, true)
    public arrow: NavType;

}

export const ivline = Registry.getComponent('iv-line').build();