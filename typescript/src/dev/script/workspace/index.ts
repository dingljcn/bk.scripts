import './encode-config';
import { AbstractComponent } from 'core';
import './module-transform';
import 'dev';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);
window.linkCss('/src/script/workspace/index.css');
mainElement.innerHTML += `<div id="dinglj-tool-box">Tool</div>
<div id="dinglj-main">
    <div class="dinglj-tool-row" v-for="row in userConfig.layout">
        <i-button v-for="item in row">
            {{ item.btnName }}
        </i-button>
    </div>
</div>`;

@Service(App, 'App')
export class App extends AbstractComponent<any> {

    @Mounted mounted() {
        console.log(this.userConfig);
    }

    @Compute(window.readConfig)
    userConfig: any;

}

window.createVue($registry.buildComponent('App'), '#dinglj-main');