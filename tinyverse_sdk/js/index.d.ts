declare module 'lib/main.js' {
    class TvsWasm{
        constructor();
        async initWasm(): Promise<void>;
        createAccount(parameters: string): void;
    }
    export { TvsWasm }
}
