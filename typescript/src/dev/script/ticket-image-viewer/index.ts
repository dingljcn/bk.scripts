import './encode-config';
import { AbstractComponent, RightMenu } from 'core';
import { isMatch } from './tool';
import ivline from './line';
import ivstep from './step';
import ivhistory from './history';

if (isMatch()) {
    window.linkCss('/src/script/ticket-image-viewer/index.css');
    window.document.body.innerHTML = `<div id="dinglj-main">
        <div id="iv-toolbar">
            <div id="iv-options">
                <div @click="openUrl('..')">返回上一层{{ getHotKey('back') }}</div>
                <div @click="addStar(display)">添加关注{{ getHotKey('addStar') }}</div>
                <div @click="stars.length = 0">清空关注{{ getHotKey('cleanStar') }}</div>
                <div @click="history.length = 0">清空历史{{ getHotKey('cleanHistory') }}</div>
                <div @click="openUrl('test.xls')">下载用例{{ getHotKey('downloadCase') }}</div>
                <div @click="openUrl('默认步骤')">默认步骤{{ getHotKey('defaultStep') }}</div>
                <div @click="openUrl('erpLog')">ERP日志{{ getHotKey('erpLog') }}</div>
                <div @click="openUrl('logs')">工具日志{{ getHotKey('logs') }}</div>
            </div>
            <div class="dinglj-v-flex"></div>
            <i-input :i-props="lineProps" @mounted="emit => ids.lineInput = emit.vid"></i-input>
            <i-input :i-props="stepProps" @mounted="emit => ids.stepInput = emit.vid"></i-input>
        </div>
        <div id="iv-under-toolbar">
            <ivline :arrow="arrow"></ivline>
            <ivstep :arrow="arrow" :tab-panel-id="ids.tabPanelView"></ivstep>
            <div class="content-view dinglj-v-flex">
                <i-tab-view :i-props="tabViewProps" @mounted="tabPanelViewMounted">
                    <div v-for="(src, idx) of images" style="width: 100%; height: 100%; position: relative">
                        <img class="display-img" :id="getImageId(src, idx)" :src="src"/>
                        <i-context-menu :i-props="getImgContextMenu(src, idx)"></i-context-menu>
                    </div>
                </i-tab-view>
            </div>
            <ivhistory :arrow="arrow" @on-clicked="data => { display = data; }" :list="history" :tab-panel-id="ids.tabPanelView"></ivhistory>
        </div>
    </div>`;
}

@Service(App, 'App')
export class App extends AbstractComponent<any> {

    @Component({
        ivline, ivstep, ivhistory
    })
    @Mounted public mounted(): any {
        const _this = this;
        window.displayData = function() {
            return _this;
        }
        /** 快捷键快捷键切换面板 */
        $queue.on('change-panel', (direction: MoveDirection) => {
            this.changePanel(direction);
        });
        /** 快捷键添加关注图片 */
        $queue.on('add-star', () => {
            this.addStar(this.display);
        });
        /** 快捷键清空关注图片 */
        $queue.on('clean-star', () => {
            this.stars.length = 0;
        });
        /** 快捷键清空历史记录 */
        $queue.on('clean-history', () => {
            this.history.length = 0;
        });
        /** 切换活动面板 */
        $queue.on('change-active-panel', (data: NavType) => {
            this.arrow = data;
        });
        /** 快捷键聚焦行输入框 */
        $queue.on('focus-line', () => {
            $queue.sendMsg('dinglj-v-input-text::focus', null, this.ids.lineInput);
        });
        /** 快捷键聚焦步输入框 */
        $queue.on('focus-step', () => {
            $queue.sendMsg('dinglj-v-input-text::focus', null, this.ids.stepInput);
        });
        /** 快捷键更新图片路径 */
        $queue.on('change-img', (img: string) => {
            this.history.pushNew(img);
            this.display = img;
        });
    }

    @Field public ids = {
        lineInput: '',
        stepInput: '',
        tabPanelView: '',
    }

    @Field public arrow: NavType = 'Step';

    @Field public display: string = '';

    @Field public stars: Array<string> = [];

    @Field public history: Array<string> = [];

    @Field public imageIds: any = {};

    @Field public init = {
        tabPanelView: true,
    }

    @Method public openUrl(url: string) {
        window.open(url);
    }
    
    /** Tab面板加载事件, 为其绑定 Tab 键切换 Tab 页事件 */
    @Method public tabPanelViewMounted(emit: EmitArgs<any>) {
        this.ids.tabPanelView = emit.vid;
        if (this.init.tabPanelView) {
            this.init.tabPanelView = false;
            window.addEventListener('keydown', e => {
                if (e.code == 'Tab') {
                    e.preventDefault();
                    $queue.sendMsg('tab-view:next', null, emit.vid);
                }
            });
        }
    }

    /** 获取图片ID, 并为其绑定右键菜单 */
    @Method public getImageId(src: string, idx: number): string {
        return idx == 0 ? 'main-image' : src;
    }

    @Method getImgContextMenu(src: string, idx: number): ContextMenuProps<string> {
        const self: App = this;
        const id = this.getImageId(src, idx);
        return {
            data: src,
            bindId: id,
            list: [
                new RightMenu('关注', data => self.addStar(data), data => id == 'main-image'),
                new RightMenu('取消关注', data => self.stars.remove(data), data => id != 'main-image'),
            ]
        }
    }

    /** 切换面板 */
    @Method public changePanel(direction: MoveDirection) {
        const panels = window.getConfigOrDefault(this.config, this.defaultConfig, 'panels', []);
        const index = panels.indexOfIgnoreCase(this.arrow);
        const target = (index + panels.length + direction) % panels.length;
        this.arrow = panels[target];
    }

    @Method public addStar(src: string) {
        if (this.stars.includesIgnoreCase(src)) {
            '无需重复关注'.warn();
        } else {
            this.stars.push(src);
        }
    }

    @Method public getHotKey(key: HotKeyType): string {
        const hotKey: any = window.getConfigOrDefault(this.config, this.defaultConfig, 'hotKey', {});
        return `(${ hotKey[key] })`;
    }

    @Compute((self: App): InputProps => {
        return {
            caption: '',
            placeholder: `请输入行数进行跳转${ self.getHotKey('line') }`,
            onOver: data => {
                $queue.sendMsg('jumpToLine', data.value);
                $queue.sendMsg('dinglj-v-input-text::clear', null, data.vid);
            },
        }
    })
    public lineProps: InputProps;

    @Compute((self: App): InputProps => {
        return {
            caption: '',
            placeholder: `请输入步数进行跳转${ self.getHotKey('step') }`,
            onOver: data => {
                $queue.sendMsg('jumpToStep', data.value);
                $queue.sendMsg('dinglj-v-input-text::clear', null, data.vid);
            },
        }
    })
    public stepProps: InputProps;

    @Compute((self: App): TabViewProps<string> => {
        return {
            list: self.tabNames
        }
    })
    public tabViewProps: TabPanelProps<string>;
    
    /** 获取用户配置 */
    @Compute(window.readConfig)
    public config: any;

    /** 获取脚本设置的默认配置 */
    @Compute(window.defaultConfig)
    public defaultConfig: any;

    @Compute((self: App) => {
        const result = [];
        if (self.display) {
            result.push(self.display);
        }
        result.push(...self.stars);
        return result;
    })
    public images: Array<string>;

    @Compute((self: App) => {
        let result = ['当前图片'];
        for (let i = 1; i < self.images.length; i++) {
            result.push(self.images[i].replace(/1\/(\d+)\/(.*)(\.png)/, '第$1行: $2'));
        }
        return result;
    })
    public tabNames: Array<string>;

}

window.createVue($registry.buildComponent('App'), '#dinglj-main');