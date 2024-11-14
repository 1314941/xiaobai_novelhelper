import * as vscode from "vscode";
import axios from "axios";
import * as os from "os";
import { apiHerf, extensionId, extensionVersion } from "../param/constparams";

const privacy = vscode.workspace.getConfiguration("Codegeex").get("Privacy");

export function getOpenExtensionData(): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(
                    `${apiHerf}/tracking/insertVscodeStartRecord`,
                    {
                        vscodeMachineId: vscode.env.machineId,
                        vscodeSessionId: vscode.env.sessionId,
                        platformVersion: os.release(),
                        systemOs: os.type(),
                        extensionId: extensionId,
                        extensionVersion: extensionVersion,
                        nodeArch: os.arch(),
                        isNewAppInstall: vscode.env.isNewAppInstall,
                        vscodeVersion: vscode.version,
                        product: vscode.env.appHost,
                        uikind: vscode.env.uiKind,
                        remoteName: vscode.env.remoteName,
                    },
                    { proxy: false }
                )
                .then((res) => {
                    console.log("写入开机信息", res);
                    resolve(res.data.msg);
                })
                .catch((err) => {
                    reject("error");
                });
        } catch (e) {
            reject("error");
        }
    });
}
