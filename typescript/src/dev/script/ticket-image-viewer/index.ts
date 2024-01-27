import { AbstractComponent, Mounted, Field, Method, Compute, Registry, Component, EmitPara, RightMenu } from 'core';
import './encode-config';
import { ivline } from './line';
import { ivstep } from './step';
import { ivhistory } from './history';
import NavType from './NavType';
import { isMatch } from './tool';

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
            <i-input :placeholder="'输入行数进行跳转' + getHotKey('line')" @on-over="jumpLine" @mounted="emit => ids.lineInput = emit.vid"></i-input>
            <i-input :placeholder="'输入步数进行跳转' + getHotKey('step')" @on-over="jumpStep" @mounted="emit => ids.stepInput = emit.vid"></i-input>
        </div>
        <div id="iv-under-toolbar">
            <ivline :arrow="arrow"></ivline>
            <ivstep :arrow="arrow" :tab-panel-id="ids.tabPanelView"></ivstep>
            <div class="content-view dinglj-v-flex">
                <i-tab-view :list="tabNames" @mounted="tabPanelViewMounted">
                    <div v-for="(src, idx) of images" style="width: 100%; height: 100%; position: relative">
                        <img class="display-img" :id="getImageId(src, idx)" :src="src"/>
                    </div>
                </i-tab-view>
            </div>
            <ivhistory :arrow="arrow" @on-clicked="data => { display = data; }" :list="history" :tab-panel-id="ids.tabPanelView"></ivhistory>
        </div>
    </div>`;
}

export class App extends AbstractComponent {

    @Component({
        ivline, ivstep, ivhistory
    })
    @Mounted(App, 'App')
    public mounted(): any {
        const _this = this;
        window.displayData = function() {
            return _this;
        }
        /** 快捷键快捷键切换面板 */
        window.$queue.on('change-panel', (direction: -1 | 0 | 1) => {
            this.changePanel(direction);
        });
        /** 快捷键添加关注图片 */
        window.$queue.on('add-star', () => {
            this.addStar(this.display);
        });
        /** 快捷键清空关注图片 */
        window.$queue.on('clean-star', () => {
            this.stars.length = 0;
        });
        /** 快捷键清空历史记录 */
        window.$queue.on('clean-history', () => {
            this.history.length = 0;
        });
        /** 切换活动面板 */
        window.$queue.on('change-active-panel', (data: NavType) => {
            this.arrow = data;
        });
        /** 快捷键聚焦行输入框 */
        window.$queue.on('focus-line', () => {
            window.$queue.sendMsg('dinglj-v-input-text::focus', null, this.ids.lineInput);
        });
        /** 快捷键聚焦步输入框 */
        window.$queue.on('focus-step', () => {
            window.$queue.sendMsg('dinglj-v-input-text::focus', null, this.ids.stepInput);
        });
        /** 快捷键更新图片路径 */
        window.$queue.on('change-img', (img: string) => {
            this.history.pushNew(img);
            this.display = img;
        });
    }

    @Field
    public ids = {
        lineInput: '',
        stepInput: '',
        tabPanelView: '',
    }

    @Field
    public arrow: NavType = NavType.Step;

    @Field
    public display: string = '';

    @Field
    public stars: Array<string> = [];

    @Field
    public history: Array<string> = [];

    @Field
    public imageIds: any = {};

    @Field
    public init = {
        tabPanelView: true,
    }

    @Method
    public openUrl(url: string) {
        window.open(url);
    }
    
    /** Tab面板加载事件, 为其绑定 Tab 键切换 Tab 页事件 */
    @Method
    public tabPanelViewMounted(emit: EmitPara) {
        this.ids.tabPanelView = emit.vid;
        if (this.init.tabPanelView) {
            this.init.tabPanelView = false;
            window.addEventListener('keydown', e => {
                if (e.code == 'Tab') {
                    e.preventDefault();
                    window.$queue.sendMsg('tab-view:next', null, emit.vid);
                }
            });
        }
    }

    /** 获取图片ID, 并为其绑定右键菜单 */
    @Method
    public getImageId(src: string, idx: number) {
        let id = src;
        if (idx == 0) {
            id = 'main-image';
        }
        const _this = this;
        window.timer(() => {
            const target = window.byId(id);
            if (target != undefined) {
                window.$menu.registRightClick(target, id, {
                    items: [
                        id == 'main-image'
                            ?  new RightMenu('关注', () => {
                                _this.addStar(src);
                            })
                            : undefined,
                        id == 'main-image'
                            ? undefined
                            : new RightMenu('取消关注', () => {
                                if (_this.stars.remove(src)) {
                                    '图片已取消关注'.info();
                                } else {
                                    '未找到需要取消关注的图片'.warn();
                                }
                            }),
                    ]
                });
                return true;
            }
            return false;
        });
        return id;
    }

    /** 切换面板 */
    @Method
    public changePanel(direction: -1 | 0 | 1) {
        const panels = window.getConfigOrDefault(this.config, this.defaultConfig, 'panels', []);
        const index = panels.indexOfIgnoreCase(this.arrow);
        const target = (index + panels.length + direction) % panels.length;
        this.arrow = panels[target];
    }

    @Method
    public addStar(src: string) {
        if (this.stars.includesIgnoreCase(src)) {
            '无需重复关注'.warn();
        } else {
            this.stars.push(src);
        }
    }

    @Method
    public getHotKey(key: string): string {
        const hotKey: any = window.getConfigOrDefault(this.config, this.defaultConfig, 'hotKey', {});
        return `(${ hotKey[key] })`;
    }

    @Method
    /** 跳转至指定行 */
    public jumpLine(data: EmitPara) {
        window.$queue.sendMsg('jumpToLine', data.value);
        window.$queue.sendMsg('dinglj-v-input-text::clear', null, data.vid);
    }

    /** 跳转至指定步骤 */
    @Method
    public jumpStep(data: EmitPara) {
        window.$queue.sendMsg('jumpToStep', data.value);
        window.$queue.sendMsg('dinglj-v-input-text::clear', null, data.vid);
    }
    
    /** 获取用户配置 */
    @Compute(function() {
        return window.readConfig();
    })
    public config: any;

    /** 获取脚本设置的默认配置 */
    @Compute(function() {
        return window.defaultConfig();
    })
    public defaultConfig: any;

    @Compute(function() {
        const result = [];
        if (this.display) {
            result.push(this.display);
        }
        result.push(...this.stars);
        return result;
    })
    public images: Array<string>;

    @Compute(function() {
        let result = ['当前图片'];
        for (let i = 1; i < this.images.length; i++) {
            result.push(this.images[i].replace(/1\/(\d+)\/(.*)(\.png)/, '第$1行: $2'));
        }
        return result;
    })
    public tabNames: Array<string>;

}

window.createVue(Registry.getComponent('App').build(), '#dinglj-main');