"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinKeyServer = void 0;
const child_process_1 = require("child_process");
const WinGlobalKeyLookup_1 = require("./_data/WinGlobalKeyLookup");
const path_1 = __importDefault(require("path"));
const isSpawnEventSupported_1 = require("./isSpawnEventSupported");
const sPath = "../../bin/WinKeyServer.exe";
/** Use this class to listen to key events on Windows OS */
class WinKeyServer {
    /**
     * Creates a new key server for windows
     * @param listener The callback to report key events to
     * @param windowsConfig The optional windows configuration
     */
    constructor(listener, config = {}) {
        this.listener = listener;
        this.config = config;
    }
    /** Start the Key server and listen for keypresses */
    async start() {
        var _a, _b;
        const serverPath = this.config.serverPath || path_1.default.join(__dirname, sPath);
        this.proc = child_process_1.execFile(serverPath, { maxBuffer: Infinity, shell: false, windowsHide: true });
        if (this.config.onInfo)
            (_a = this.proc.stderr) === null || _a === void 0 ? void 0 : _a.on("data", data => { var _a, _b; return (_b = (_a = this.config).onInfo) === null || _b === void 0 ? void 0 : _b.call(_a, data.toString()); });
        if (this.config.onError)
            this.proc.on("close", this.config.onError);
        (_b = this.proc.stdout) === null || _b === void 0 ? void 0 : _b.on("data", data => {
            var _a;
            const events = this._getEventData(data);
            for (let { event, eventId } of events) {
                const stopPropagation = !!this.listener(event);
                (_a = this.proc.stdin) === null || _a === void 0 ? void 0 : _a.write(`${stopPropagation ? "1" : "0"},${eventId}\n`);
            }
        });
        return new Promise((res, err) => {
            this.proc.on("error", err);
            if (isSpawnEventSupported_1.isSpawnEventSupported())
                this.proc.on("spawn", res);
            // A timed fallback if the spawn event is not supported
            else
                setTimeout(res, 200);
        });
    }
    /** Stop the Key server */
    stop() {
        var _a;
        (_a = this.proc.stdout) === null || _a === void 0 ? void 0 : _a.pause();
        this.proc.kill();
    }
    /**
     * Obtains a IGlobalKeyEvent from stdout buffer data
     * @param data Data from stdout
     * @returns The standardized key event data
     */
    _getEventData(data) {
        const sData = data.toString();
        const lines = sData.trim().split(/\n/);
        return lines.map(line => {
            const lineData = line.replace(/\s+/, "");
            const [_mouseKeyboard, downUp, sKeyCode, sScanCode, sLocationX, sLocationY, eventId,] = lineData.split(",");
            const isDown = downUp === 'DOWN';
            const keyCode = Number.parseInt(sKeyCode, 10);
            const scanCode = Number.parseInt(sScanCode, 10);
            const locationX = Number.parseFloat(sLocationX);
            const locationY = Number.parseFloat(sLocationY);
            const key = WinGlobalKeyLookup_1.WinGlobalKeyLookup[keyCode];
            return {
                event: {
                    vKey: keyCode,
                    rawKey: key,
                    name: key === null || key === void 0 ? void 0 : key.standardName,
                    state: isDown ? "DOWN" : "UP",
                    scanCode: scanCode,
                    location: [locationX, locationY],
                    _raw: sData,
                },
                eventId,
            };
        });
    }
}
exports.WinKeyServer = WinKeyServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2luS2V5U2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RzL1dpbktleVNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxpREFBcUQ7QUFHckQsbUVBQThEO0FBQzlELGdEQUF3QjtBQUV4QixtRUFBOEQ7QUFDOUQsTUFBTSxLQUFLLEdBQUcsNEJBQTRCLENBQUM7QUFFM0MsMkRBQTJEO0FBQzNELE1BQWEsWUFBWTtJQU1yQjs7OztPQUlHO0lBQ0gsWUFBbUIsUUFBK0IsRUFBRSxTQUF5QixFQUFFO1FBQzNFLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxxREFBcUQ7SUFDOUMsS0FBSyxDQUFDLEtBQUs7O1FBQ2QsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLElBQUksR0FBRyx3QkFBUSxDQUFDLFVBQVUsRUFBRSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMzRixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtZQUNsQixNQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSwwQ0FBRSxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLGVBQUMsT0FBQSxNQUFBLE1BQUEsSUFBSSxDQUFDLE1BQU0sRUFBQyxNQUFNLG1EQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBLEVBQUEsQ0FBQyxDQUFDO1FBQ2hGLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO1lBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFcEUsTUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sMENBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTs7WUFDaEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxLQUFLLElBQUksRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLElBQUksTUFBTSxFQUFFO2dCQUNqQyxNQUFNLGVBQWUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFL0MsTUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssMENBQUUsS0FBSyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDO2FBQ3pFO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksT0FBTyxDQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUUzQixJQUFJLDZDQUFxQixFQUFFO2dCQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN4RCx1REFBdUQ7O2dCQUNsRCxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDBCQUEwQjtJQUNuQixJQUFJOztRQUNQLE1BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLDBDQUFFLEtBQUssRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyxhQUFhLENBQUMsSUFBUztRQUM3QixNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdEMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDcEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFekMsTUFBTSxDQUNGLGNBQWMsRUFDZCxNQUFNLEVBQ04sUUFBUSxFQUNSLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLE9BQU8sRUFDVixHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFeEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxLQUFLLE1BQU0sQ0FBQztZQUVqQyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5QyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVoRCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2hELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFaEQsTUFBTSxHQUFHLEdBQUcsdUNBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFeEMsT0FBTztnQkFDSCxLQUFLLEVBQUU7b0JBQ0gsSUFBSSxFQUFFLE9BQU87b0JBQ2IsTUFBTSxFQUFFLEdBQUc7b0JBQ1gsSUFBSSxFQUFFLEdBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxZQUFZO29CQUN2QixLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUk7b0JBQzdCLFFBQVEsRUFBRSxRQUFRO29CQUNsQixRQUFRLEVBQUUsQ0FBRSxTQUFTLEVBQUUsU0FBUyxDQUFFO29CQUNsQyxJQUFJLEVBQUUsS0FBSztpQkFDZDtnQkFDRCxPQUFPO2FBQ1YsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBN0ZELG9DQTZGQyJ9