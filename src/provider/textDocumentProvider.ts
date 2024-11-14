import * as vscode from "vscode";
import * as https from "https";

import { codelensProvider } from "./codelensProvider";
import { candidateNum } from "../param/configures";
import {
    addSignal,
    andSignal,
    comment,
    hash,
    localeTag,
} from "../param/constparams";
import { getCommentSignal } from "../utils/commentCode";
import getDocumentLanguage from "../utils/getDocumentLanguage";
import { getGPTCode } from "../utils/getGPTCode";
import { getCodeCompletions } from "../utils/getCodeCompletions";
import { apiKey, apiSecret } from "../localconfig";

// 导出一个函数，用于提供文本文档内容
export function textDocumentProvider(
    myStatusBarItem: vscode.StatusBarItem,
    g_isLoading: boolean
) {
    // 创建一个类，用于提供文本文档内容
    const textDocumentProvider = new (class {
        // 异步提供文本文档内容
        async provideTextDocumentContent(uri: vscode.Uri) {
            // 获取URL参数
            const params = new URLSearchParams(uri.query);
            // 如果参数中包含loading且为true，则返回生成中的提示
            if (params.get("loading") === "true") {
                return `/* ${localeTag.generating} */\n`;
            }
            // 获取mode参数
            const mode = params.get("mode");

            // 如果mode为translation，则进行翻译
            if (mode === "translation") {
                // 获取翻译结果
                let transResult = params.get("translation_res") || "";
                // 替换特殊字符
                transResult = transResult
                    .replaceAll(addSignal, "+")
                    .replaceAll(andSignal, "&");
                // 获取当前活动编辑器
                const editor = vscode.window.activeTextEditor;
                // 如果没有活动编辑器，则显示提示信息
                if (!editor) {
                    vscode.window.showInformationMessage(
                        localeTag.noEditorInfo
                    );
                    return;
                }
                // 清空代码提示
                codelensProvider.clearEls();
                // 获取命令id
                let commandid = params.get("commandid") || "";
                // 获取注释符号
                let commentSignal = getCommentSignal(
                    editor.document.languageId
                );
                // 替换特殊字符
                transResult = transResult
                    .replaceAll(hash, "#")
                    .replaceAll(comment, commentSignal.line || "#");
                // 添加代码提示
                codelensProvider.addEl(
                    0,
                    transResult,
                    commandid,
                    "translation"
                );
                return transResult;
            } else {
                // 获取代码块
                let code_block = params.get("code_block") ?? "";

                try {
                    // 替换特殊字符
                    code_block = code_block
                        .replaceAll(hash, "#")
                        .replaceAll(addSignal, "+")
                        .replaceAll(andSignal, "&");
                    // 'lang': 'Python',
  // 如果代码块长度大于1200，则截取最后1200个字符
                    if (code_block.length > 1200) {
                        code_block = code_block.slice(code_block.length - 1200);
                    }
                    // 获取当前活动文本编辑器
                    const editor = vscode.window.activeTextEditor;
                    // 如果没有活动文本编辑器，则显示信息并返回
                    if (!editor) {
                        vscode.window.showInformationMessage(
                            localeTag.noEditorInfo
                        );
                        return;
                    }
                    // 初始化payload对象
                    let payload = {};
                    // 获取候选数量
                    const num = candidateNum;
                    // 获取文档语言
                    let lang = getDocumentLanguage(editor);
                    // 如果文档语言为空，则设置payload对象
                    if (lang.length == 0) {
                        payload = {
                            prompt: code_block,
                            n: num,
                            apikey: apiKey,
                            apisecret: apiSecret,
                        };
                    // 否则，设置payload对象，包含文档语言
                    } else {
                        payload = {
                            lang: lang,
                            prompt: code_block,
                            n: num,
                            apikey: apiKey,
                            apisecret: apiSecret,
                        };
                    }
                    // }
                    // 创建https代理
                    const agent = new https.Agent({
                        rejectUnauthorized: false,
                    });
                    // 获取代码补全
                    const { commandid, completions } = await getCodeCompletions(
                        code_block,
                        num,
                        lang,
                        apiKey,
                        apiSecret,
                        "interactive"
                    );
                    // 如果有补全结果，则返回GPT代码
                    if (completions.length > 0) {
                        return getGPTCode(
                            completions,
                            commandid,
                            myStatusBarItem,
                            g_isLoading
                        );
                    // 否则，返回无结果信息
                    } else {
                        return localeTag.noResult;
                    }
                } catch (err) {
                    // 如果发送请求出错，则打印错误信息并返回错误信息
                    console.log("Error sending request", err);
                    return `${localeTag.sendingRequestErr}\n` + err;
                }
            }
        }
    })();
    // 返回文本文档提供者
    return textDocumentProvider;
}
