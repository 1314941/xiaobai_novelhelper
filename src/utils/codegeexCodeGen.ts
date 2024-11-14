import * as vscode from "vscode";
import { myScheme } from "../param/constparams";
import { navUri } from "./navUri";

//generate uri for interactive mode
// 导出一个异步函数，用于生成代码
export const codegeexCodeGen = async (code_block: string) => {
    // 创建一个Uri对象，用于加载CodeGeeX
    let loading = vscode.Uri.parse(
        `${myScheme}:CodeGeeX?loading=true&mode=gen&code_block=${code_block}`,
        true
    );
    // 调用navUri函数，加载CodeGeeX
    await navUri(loading, "python", "CodeGeeX");
    // 创建一个Uri对象，用于生成代码
    let uri = vscode.Uri.parse(
        `${myScheme}:CodeGeeX?loading=false&mode=gen&code_block=${code_block}`,
        true
    );
    // 调用navUri函数，生成代码
    await navUri(uri, "python", "CodeGeeX");
};
