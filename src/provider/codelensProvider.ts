import * as vscode from "vscode";
import { localeTag } from "../param/constparams";

// 导出一个codelensProvider对象
export const codelensProvider = new (class {
    // 定义一个codelenses数组，用于存储CodeLens对象
    codelenses: vscode.CodeLens[];
    // 构造函数，初始化codelenses数组
    constructor() {
        this.codelenses = [];
    }
    // 添加一个CodeLens对象
    addEl(lineNum: number, text: string, commandid: string, mode?: string) {
        // 定义一个range对象，用于指定CodeLens的位置
        let range;
        range = new vscode.Range(lineNum, 0, lineNum, 0);

        // 将CodeLens对象添加到codelenses数组中
        this.codelenses.push(
            new vscode.CodeLens(range, {
                // 设置CodeLens的标题
                title: localeTag.useCode,
                // 设置CodeLens的命令
                command: "CodeGeeX.chooseCandidate",
                // 设置CodeLens的参数
                arguments: [text, mode, commandid],
                // 设置CodeLens的提示信息
                tooltip: localeTag.chooseThisSnippet,
            })
        );
    }
    // 清空codelenses数组
    clearEls() {
        this.codelenses = [];
    }

    // 返回codelenses数组
    provideCodeLenses() {
        return this.codelenses;
    }
})();
