import ComponentType from "./ComponentType";
import BasicProperty from "./BasicProperty";

abstract class AbstractComponent<Prop> extends BasicProperty<Prop> {
    /** 组件类型 */
    public type: ComponentType;

}

declare global {
    interface Window {
        AbstractComponent: any;
    }
}

window.AbstractComponent = AbstractComponent;

export default AbstractComponent;