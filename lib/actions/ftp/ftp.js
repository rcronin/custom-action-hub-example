"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hub = require("looker-action-hub/lib/hub");
const Path = require("path");
const Client = require("promise-ftp");
const URL = require("url");
class FTPAction extends Hub.Action {
    constructor() {
        super(...arguments);
        this.name = "ftp";
        this.label = "FTP";
        this.iconName = "ftp/ftp.png";
        this.description = "Send data files to an FTP server.";
        this.supportedActionTypes = [Hub.ActionType.Query];
        this.params = [];
    }
    execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.attachment || !request.attachment.dataBuffer) {
                throw new Error("Couldn't get data from attachment.");
            }
            if (!request.formParams.address) {
                throw new Error("Needs a valid FTP address.");
            }
            const client = yield this.ftpClientFromRequest(request);
            const parsedUrl = URL.parse(request.formParams.address);
            if (!parsedUrl.pathname) {
                throw new Error("Needs a valid FTP address.");
            }
            const data = request.attachment.dataBuffer;
            const fileName = request.formParams.filename || request.suggestedFilename();
            const remotePath = Path.join(parsedUrl.pathname, fileName);
            let response;
            try {
                yield client.put(data, remotePath);
                response = { success: true };
            }
            catch (err) {
                response = { success: false, message: err.message };
            }
            finally {
                yield client.end();
            }
            return new Hub.ActionResponse(response);
        });
    }
    form() {
        return __awaiter(this, void 0, void 0, function* () {
            const form = new Hub.ActionForm();
            form.fields = [{
                    name: "address",
                    label: "Address",
                    description: "e.g. ftp://host/path/",
                    type: "string",
                    required: true,
                }, {
                    name: "username",
                    label: "Username",
                    type: "string",
                    required: true,
                }, {
                    name: "password",
                    label: "Password",
                    type: "string",
                    required: true,
                }, {
                    label: "Filename",
                    name: "filename",
                    type: "string",
                }];
            return form;
        });
    }
    ftpClientFromRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new Client();
            const parsedUrl = URL.parse(request.formParams.address);
            if (!parsedUrl.hostname) {
                throw new Error("Needs a valid FTP address.");
            }
            try {
                yield client.connect({
                    host: parsedUrl.hostname,
                    user: request.formParams.username,
                    password: request.formParams.password,
                    port: +(parsedUrl.port ? parsedUrl.port : 21),
                });
            }
            catch (e) {
                throw e;
            }
            return client;
        });
    }
}
exports.FTPAction = FTPAction;
Hub.addAction(new FTPAction());
