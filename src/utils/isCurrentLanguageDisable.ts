import * as vscode from "vscode";
import { disabledFor } from "../param/configures";

// 导出一个函数，用于判断当前语言是否被禁用
export const isCurrentLanguageDisable = () => {
    // 获取当前活动文本编辑器
    let editor = vscode.window.activeTextEditor;
    // 如果没有活动文本编辑器，则返回false
    if (!editor) {
        return false;
    } else {
        // 获取当前文档的语言ID
        const languageId = editor.document.languageId;
        // 如果当前语言ID在disabledFor中为true或"true"，则返回true，否则返回false
        if (
            (disabledFor as any)[languageId] === true ||
            (disabledFor as any)[languageId] === "true"
        ) {
            return true;
        } else {
            return false;
        }
    }
};
