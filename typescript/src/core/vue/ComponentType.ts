enum ComponentType {
    ButtonX         = 'I-Button',
    InputX          = 'I-Input',
    SwitchX         = 'I-Switch',
    ComboX          = 'I-Combo',
    NavigatorX      = 'I-Navigator',
    ScrollerY       = 'I-Scroller-Y',
    TabPanelX       = 'I-Tab-Panel',
    ScrollerX       = 'I-Scroller-X',
    TableX          = 'I-Table',
    TabView         = 'I-Tab-View',
    NavigatorView   = 'I-Nav-View',
    ProgressX       = 'I-Progress',
    ModalX          = 'I-Modal',
    ContextMenuX    = 'I-Context-Menu',
}

declare global {
    interface Window {
        ComponentType: any;
    }
}

window.ComponentType = ComponentType;

export default ComponentType;