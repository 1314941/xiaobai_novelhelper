import * as vscode from "vscode";
import { disabledFor, enableExtension } from "./param/configures";
import { localeTag } from "./param/constparams";
import changeIconColor from "./utils/changeIconColor";
import { updateStatusBarItem } from "./utils/updateStatusBarItem";

let g_isEnable = enableExtension;
// 导出一个默认的异步函数，用于禁用或启用状态栏项
export default async function disableEnable(
    myStatusBarItem: vscode.StatusBarItem, // 状态栏项
    g_isLoading: boolean, // 是否正在加载
    originalColor: string | vscode.ThemeColor | undefined, // 原始颜色
    context: vscode.ExtensionContext // 扩展上下文
) {
    // 获取当前活动文本编辑器的语言ID
    const lang = vscode.window.activeTextEditor?.document.languageId || "";
    // 如果扩展已启用
    if (g_isEnable) {
        // 如果当前语言被禁用
        if (
            (disabledFor as any)[lang] ||
            (disabledFor as any)[lang] === "true"
        ) {
            // 弹出信息框，询问是否禁用当前语言或全局禁用
            const answer = await vscode.window.showInformationMessage(
                localeTag.disableInfo,
                localeTag.disableGlobally,
                `${localeTag.enable} ${lang}`
            );
            // 如果选择全局禁用
            if (answer === localeTag.disableGlobally) {
                // Run function
                changeIconColor(false, myStatusBarItem, originalColor);
                g_isEnable = false;
                const configuration = vscode.workspace.getConfiguration(
                    "Codegeex",
                    undefined
                );
                configuration.update("EnableExtension", false);
                await context.globalState.update("EnableExtension", false);
            }
            if (answer === `${localeTag.enable} ${lang}`) {
                // Run function
                const configuration = vscode.workspace.getConfiguration(
                    "Codegeex",
                    undefined
                );
                // 将disabledFor对象中的lang属性设置为false
                (disabledFor as any)[lang] = false;
                // 更新配置文件中的DisabledFor属性
                configuration.update("DisabledFor", disabledFor);
                // 改变状态栏图标颜色
                changeIconColor(true, myStatusBarItem, originalColor);
            }
        } else {
            // 显示信息消息，询问用户是否全局禁用
            const answer = await vscode.window.showInformationMessage(
                localeTag.disableInfo,
                localeTag.disableGlobally,
                `${localeTag.disable} ${lang}`
            );

            if (answer === localeTag.disableGlobally) {
                // Run function
                changeIconColor(false, myStatusBarItem, originalColor);
                const configuration = vscode.workspace.getConfiguration(
                    "Codegeex",
                    undefined
                );
                g_isEnable = false;
                configuration.update("EnableExtension", false);
                await context.globalState.update("EnableExtension", false);
            }
            if (answer === `${localeTag.disable} ${lang}`) {
                // Run function
                const configuration = vscode.workspace.getConfiguration(
                    "Codegeex",
                    undefined
                );
                (disabledFor as any)[lang] = true;
                configuration.update("DisabledFor", disabledFor);
                updateStatusBarItem(myStatusBarItem, g_isLoading, false, "");
                changeIconColor(true, myStatusBarItem, originalColor, true);
            }
        }
    } else {
        const answer = await vscode.window.showInformationMessage(
            localeTag.enableInfo,
            localeTag.enableGlobally
        );
        if (answer === localeTag.enableGlobally) {
            // Run function
            if (
                (disabledFor as any)[lang] ||
                (disabledFor as any)[lang] === "true"
            ) {
                changeIconColor(true, myStatusBarItem, originalColor, true);
            } else {
                changeIconColor(true, myStatusBarItem, originalColor);
            }
            const configuration = vscode.workspace.getConfiguration(
                "Codegeex",
                undefined
            );
            g_isEnable = true;
            configuration.update("EnableExtension", true);
            await context.globalState.update("EnableExtension", true);
        }
    }
}
