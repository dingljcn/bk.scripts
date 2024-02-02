import { AbstractComponent } from "core";

@Service(AppStep, 'AppStep')
export class AppStep extends AbstractComponent<any> {
    
    @Mounted public mounted(): void {
        /** 行加载完后会调用这里, 进行初始化 */
        $queue.on('init-steps', (line: string) => {
            this.line = line;
            window.timer<AppStep>((self: AppStep) => {
                if (self.steps.length > 0) {
                    self.setIdx(self.steps.length - 1);
                    return true;
                }
                return false;
            }, this);
        });
        /** 行切换事件 */
        $queue.on('line-changed', (data: LineChangeProp) => {
            this.lastSteps = this.steps;
            this.line = data.line;
            window.timer<AppStep>((self: AppStep) => {
                if (self.lastSteps != self.steps) {
                    if (data.expect) { // 指定了下标
                        if (data.expect > 0 && data.expect < self.steps.length) {
                            self.setIdx(data.expect, true); // 下标在范围内, 按指定下标跳转
                        } else {
                            self.setIdx(self.steps.length - 1, true); // 不在范围内, 跳到最后一个
                        }
                    } else {
                        self.setIdx(0, true); // 默认到第一个
                    }
                    if (!data.toStep) {
                        $queue.sendMsg<NavType>('change-active-panel', 'Line'); // 焦点还给行
                    }
                    return true;
                }
                return false;
            }, this);
        })
        /** 方向键绑定 */
        $queue.on('update-step', (prop: ScrollProp) => {
            this.doScroll(prop);
        });
        /** 跳转到指定步骤 */
        $queue.on('jumpToStep', (stepNumber: string) => {
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
        <div :class="containerClass">
            <div :title="stepNumber" :class="itemClass(idx)" v-for="(stepNumber, idx) of steps" @click="setIdx(idx)">
                {{ stepNumber.replace(/\.png/, '') }}
            </div>
        </div>
    </div>`;

    @Compute((self: AppStep) => {
        return {
            step: true,
            arrow: true,
            active: self.arrow == 'Step',
        }
    })
    public containerClass: any;

    @Method itemClass(idx: number) {
        return {
            'step-number': true,
            'active': this.current == idx,
            'last': this.last == idx
        }
    }

    @Field public map: any = {};

    @Field public current: number = -1;

    @Field public last: number = -1;

    @Field public line: string = '';

    @Field public lastSteps: Array<string> = [];

    @Method public setIdx(i: number, lineChanged = false) {
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

    @Method public doScroll(prop: ScrollProp) {
        const next = prop.current + prop.direction;
        if (!prop.lineChanged && this.current == next) {
            return;
        } else if (next < 0) {
            $queue.sendMsg('toPrevLine', {});
        } else if (next >= this.steps.length) {
            $queue.sendMsg('toNextLine', {});
        } else {
            window.byId('step-container').scrollTo(0, prop.height * prop.qty);
            this.last = this.current;
            this.current = next;
            $queue.sendMsg('change-img', `1/${ this.line }/${ this.steps[next] }`);
        }
        if (prop.lineChanged) {
            this.last = -1;
        }
        $queue.sendMsg('tab-view:to', '当前图片', this.tabPanelId);
        $queue.sendMsg<NavType>('change-active-panel', 'Step');
    }

    @Compute((self: AppStep) => {
        if (self.line.trim() == '') {
            return [];
        }
        if (self.map[self.line]) {
            return self.map[self.line];
        }
        if (window.readSteps) {
            const result = window.readSteps(self.line);
            self.map[self.line] = result;
            return result;
        }
        const regExp = /.*\.png">(.*.png)<\/a>.*/;
        const response = $net.get<string>(`${ window.location.href }1/${ self.line }`);
        const stepNumbers = response.split('\n');
        const result = stepNumbers.map(step =>  regExp.test(step) ? regExp.exec(step)[1] : '')
            .filter(href => href != '')
            .map(href => href.replace(/\/$/, ''));
        self.map[self.line] = result;
        return result;
    })
    public steps: Array<string>;

    @Prop(String, 'Step', true)
    public arrow: NavType;

    @Prop(String, '')
    public tabPanelId: string;

}

export default $registry.buildComponent('AppStep');