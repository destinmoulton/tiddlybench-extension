// ENV is defined by webpack
// See webpack.config.js DefinePlugin for definition
// ENV is set via NODE_ENV variable
declare var ENV: any;

class Logger {
    _output = false;
    constructor(env: string) {
        if (env) {
            if (env !== "production") {
                this._output = true;
            }
        }
    }

    log(...args: any) {
        if (this._output) {
            console.log(...args);
        }
    }

    error(...args: any) {
        if (this._output) {
            console.error(...args);
        }
    }
}

export default new Logger(ENV);
