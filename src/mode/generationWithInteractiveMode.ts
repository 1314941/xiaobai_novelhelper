import * as vscode from "vscode";
import { codegeexCodeGen } from "../utils/codegeexCodeGen";
import { updateStatusBarItem } from "../utils/updateStatusBarItem";

const addSignal = "<|add|>";
const andSignal = "<|and|>";
const hash = "<|hash|>";

// 导出一个默认的异步函数，用于在交互模式下生成代码
export default async function generationWithInteractiveMode(
    editor: vscode.TextEditor,
    myStatusBarItem: vscode.StatusBarItem,
    g_isLoading: boolean
) {
    // 获取当前编辑器的文档
    const document = editor.document;
    let selection: vscode.Selection;

    // 获取当前光标位置
    const cursorPosition = editor.selection.active;
    // 创建一个新的选择对象，从文档开头到光标位置
    selection = new vscode.Selection(
        0,
        0,
        cursorPosition.line,
        cursorPosition.character
    );
    // 获取当前选择区域的文本
    let code_block = document.getText(selection);
    // 如果光标在行首且代码块末尾没有换行符，则添加一个换行符
    if (
        cursorPosition.character === 0 &&
        code_block[code_block.length - 1] !== "\n"
    ) {
        code_block += "\n";
    }
    // 将代码块中的特定字符替换为特定的符号
    code_block = code_block
        .replaceAll("#", hash)
        .replaceAll("+", addSignal)
        .replaceAll("&", andSignal);
    // 更新状态栏项，显示加载状态
    updateStatusBarItem(myStatusBarItem, g_isLoading, true, "");
    // 调用codegeexCodeGen函数，传入代码块，并处理返回结果
    await codegeexCodeGen(code_block)
        .then(() =>
            // 如果成功，更新状态栏项，显示完成状态
            updateStatusBarItem(myStatusBarItem, g_isLoading, false, "Done")
        )
        .catch((err) => {
            // 如果失败，打印错误信息，并更新状态栏项，显示无建议状态
            console.log(err);
            updateStatusBarItem(
                myStatusBarItem,
                g_isLoading,
                false,
                "No Suggestion"
            );
        });
}
