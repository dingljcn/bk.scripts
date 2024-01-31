enum RsaConst {
    flag_start = '$DINGLJ-ENCODE-START$',
    flag_end = '$DINGLJ-ENCODE-END$',
    flag_split = '$DINGLJ-SPLIT-FLAG$',
}

declare global {
    interface Window {
        RsaConst: any;
    }
}

window.RsaConst = RsaConst;

export default RsaConst;