declare global {
    interface Window {
        $queue: DingljQueue,
        $tip: DingljTip,
        $rsa: DingljSecure,
        $menu: DingljContextMenu,
    }
}

export {}