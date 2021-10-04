"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var Fetcher = function (_a) {
    var _b = _a.url, url = _b === void 0 ? "/" : _b, def = _a.default, _c = _a.config, config = _c === void 0 ? { method: "GET", headers: {}, body: {} } : _c, Children = _a.children, _d = _a.onError, onError = _d === void 0 ? function () { } : _d, _e = _a.onResolve, onResolve = _e === void 0 ? function () { } : _e, _f = _a.refresh, refresh = _f === void 0 ? 0 : _f;
    var _g = (0, react_1.useState)(def), data = _g[0], setData = _g[1];
    var _h = (0, react_1.useState)(null), error = _h[0], setError = _h[1];
    var _j = (0, react_1.useState)(true), loading = _j[0], setLoading = _j[1];
    function fetchData() {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var json, _data, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch(url, {
                                method: config.method,
                                headers: __assign({ "Content-Type": "application/json" }, config.headers),
                                body: ((_a = config.method) === null || _a === void 0 ? void 0 : _a.match(/(POST|PUT|DELETE)/))
                                    ? JSON.stringify(config.body)
                                    : undefined,
                            })];
                    case 1:
                        json = _b.sent();
                        return [4 /*yield*/, json.json()];
                    case 2:
                        _data = _b.sent();
                        setData(_data);
                        setError(null);
                        setLoading(false);
                        onResolve(_data);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        setData(undefined);
                        setError(new Error(err_1));
                        setLoading(false);
                        onError(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    (0, react_1.useEffect)(function () {
        setLoading(true);
        fetchData();
        var refreshInterval = refresh > 0
            ? setInterval(function () {
                fetchData();
            }, refresh * 1000)
            : null;
        return function () { return clearInterval(refreshInterval); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, refresh, config]);
    if (typeof Children !== "undefined") {
        return React.createElement(Children, { data: data, error: error, loading: loading });
    }
    else {
        return null;
    }
};
exports.default = Fetcher;
//# sourceMappingURL=index.js.map