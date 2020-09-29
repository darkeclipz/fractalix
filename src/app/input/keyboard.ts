export class KeyboardEventHandler {
    private handlers = { };
    private keys = { };

    constructor() {
        for(let i = 0; i < 255; i++) {
            this.keys[i] = false;
        }
    }

    public bindKey(keyCode: number, fn: Function) {
        this.handlers[keyCode] = fn;
    }

    public invokeKeyDown(keyCode) {
        if(this.handlers[keyCode]) {
            this.handlers[keyCode]();
        }
    }

    public onKeyDown(keyCode) {
        this.keys[keyCode] = true;
    }

    public onKeyUp(keyCode) {
        this.keys[keyCode] = false;
    }

    public isKeyDown(keyCode) {
        return this.keys[keyCode];
    }
}

export class Key {
    static W = 87;
    static S = 83;
}