import * as vscode from "vscode";
var statusbartimer: NodeJS.Timeout;

// 导出一个异步函数，用于更新状态栏项
export async function updateStatusBarItem(
    // 状态栏项
    myStatusBarItem: vscode.StatusBarItem,
    // 全局加载状态
    g_isLoading: boolean,
    // 当前加载状态
    isLoading: boolean,
    // 信息
    info: string
): Promise<void> {
    // 显示状态栏项
    myStatusBarItem.show();
    // 如果存在状态栏定时器，清除定时器
    if (statusbartimer) {
        clearTimeout(statusbartimer);
    }
    // 如果当前加载状态为true
    if (isLoading) {
        // 设置全局加载状态为true
        g_isLoading = true;
        // 设置状态栏项的文本为加载图标和info
        myStatusBarItem.text = `$(loading~spin)` + info;
    } else {
        // 设置全局加载状态为false
        g_isLoading = false;
        // 设置状态栏项的文本为codegeex图标和info
        myStatusBarItem.text = `$(codegeex-dark)` + info;
        // 设置状态栏定时器，30秒后清除状态栏项的文本
        statusbartimer = setTimeout(() => {
            myStatusBarItem.text = `$(codegeex-dark)`;
        }, 30000);
    }
}
