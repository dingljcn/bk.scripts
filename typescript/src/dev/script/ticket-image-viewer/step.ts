import { AbstractComponent, Compute, Field, Method, Mounted, Prop, Registry, Template } from "core";
import NavType from "./NavType";
import { $tool } from "./tool";

export class TIV_Step extends AbstractComponent {
    
    @Mounted(TIV_Step, 'iv-step')
    public mounted(): void {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
        /** 行加载完后会调用这里, 进行初始化 */
        window.$queue.on('init-steps', (line: string) => {
            this.line = line;
            window.timer(() => {
                if (this.steps.length > 0) {
                    this.setIdx(this.steps.length - 1);
                    return true;
                }
                return false;
            });
        });
        /** 行切换事件 */
        window.$queue.on('line-changed', (data: LineChangeProp) => {
            this.lastSteps = this.steps;
            this.line = data.line;
            window.timer(() => {
                if (this.lastSteps != this.steps) {
                    if (data.expect) { // 指定了下标
                        if (data.expect > 0 && data.expect < this.steps.length) {
                            this.setIdx(data.expect, true); // 下标在范围内, 按指定下标跳转
                        } else {
                            this.setIdx(this.steps.length - 1, true); // 不在范围内, 跳到最后一个
                        }
                    } else {
                        this.setIdx(0, true); // 默认到第一个
                    }
                    if (!data.toStep) {
                        window.$queue.sendMsg('change-active-panel', NavType.Line); // 焦点还给行
                    }
                    return true;
                }
                return false;
            });
        })
        /** 方向键绑定 */
        window.$queue.on('update-step', (prop: ScrollProp) => {
            this.doScroll(prop);
        });
        /** 跳转到指定步骤 */
        window.$queue.on('jumpToStep', (stepNumber: string) => {
            let idx = -1;
            for (let i = 0; i < this.steps.length; i++) {
                if (this.steps[i].startsWith(`${ stepNumber }_`)) {
                    idx = i;
                    break;
                }
            }
            if (idx != -1) {
                this.setIdx(idx);
            }
        });
    }

    @Template
    public template: string = `<div id="step-container">
        <div :class="{ 'step': true, 'arrow': true, 'active': arrow == 'step' }">
            <div :title="stepNumber" :class="{ 'step-number': true, 'active': current == idx, 'last': last == idx }" v-for="(stepNumber, idx) of steps" @click="setIdx(idx)">
                {{ stepNumber.replace(/\.png/, '') }}
            </div>
        </div>
    </div>`;

    @Field
    public map: any = {};

    @Field
    public current: number = -1;

    @Field
    public last: number = -1;

    @Field
    public line: string = '';

    @Field
    public lastSteps: Array<string> = [];

    @Method
    public setIdx(i: number, lineChanged = false) {
        const stepContainer = window.byClass('step arrow')[0];
        if (stepContainer) {
            const limit = $tool.getLimit(stepContainer);
            this.doScroll({
                size: this.steps.length,
                current: i,
                direction: 0,
                height: $tool.getOneHeight(stepContainer),
                qty: $tool.getScrollQty(i, limit, 0),
                lineChanged: lineChanged,
            });
        }
    }

    @Method
    public doScroll(prop: ScrollProp) {
        const next = prop.current + prop.direction;
        if (!prop.lineChanged && this.current == next) {
            return;
        } else if (next < 0) {
            window.$queue.sendMsg('toPrevLine', {});
        } else if (next >= this.steps.length) {
            window.$queue.sendMsg('toNextLine', {});
        } else {
            window.byId('step-container').scrollTo(0, prop.height * prop.qty);
            this.last = this.current;
            this.current = next;
            window.$queue.sendMsg('change-img', `1/${ this.line }/${ this.steps[next] }`);
        }
        if (prop.lineChanged) {
            this.last = -1;
        }
        window.$queue.sendMsg('tab-view:to', '当前图片', this.tabPanelId);
        window.$queue.sendMsg('change-active-panel', 'step');
    }

    @Compute(function() {
        if (this.line.trim() == '') {
            return [];
        }
        if (this.map[this.line]) {
            return this.map[this.line];
        }
        if (window.readSteps) {
            const result = window.readSteps(this.line);
            this.map[this.line] = result;
            return result;
        }
        const regExp = /.*\.png">(.*.png)<\/a>.*/;
        const response = window.get<string>(`${ window.location.href }1/${ this.line }`);
        const stepNumbers = response.split('\n');
        const result = stepNumbers.map(step =>  regExp.test(step) ? regExp.exec(step)[1] : '')
            .filter(href => href != '')
            .map(href => href.replace(/\/$/, ''));
        this.map[this.line] = result;
        return result;
    })
    public steps: Array<string>;

    @Prop(String, NavType.Step, true)
    public arrow: NavType;

    @Prop(String, '')
    public tabPanelId: string;

}

export const ivstep = Registry.getComponent('iv-step').build();