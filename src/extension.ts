process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import * as vscode from "vscode";
import { localeTag, myScheme } from "./param/constparams";
import { checkPrivacy } from "./utils/checkPrivacy";
import { getOpenExtensionData} from "./utils/statisticFunc";
import { updateStatusBarItem } from "./utils/updateStatusBarItem";
import { generateWithPromptMode } from "./mode/generationWithPrompMode";
import welcomePage from "./welcomePage";
import generationWithTranslationMode from "./mode/generationWithTranslationMode";
import { codelensProvider } from "./provider/codelensProvider";
import generationWithInteractiveMode from "./mode/generationWithInteractiveMode";
import chooseCandidate from "./utils/chooseCandidate";
import disableEnable from "./disableEnable";
import { textDocumentProvider } from "./provider/textDocumentProvider";
import inlineCompletionProvider from "./provider/inlineCompletionProvider";
import { enableExtension, onlyKeyControl } from "./param/configures";
import changeIconColor from "./utils/changeIconColor";
import { isCurrentLanguageDisable } from "./utils/isCurrentLanguageDisable";
import translationWebviewProvider from "./provider/translationWebviewProvider";
import inlineCompletionProviderWithCommand from "./provider/inlineCompletionProviderWithCommand";

let g_isLoading = false;
let originalColor: string | vscode.ThemeColor | undefined;
let myStatusBarItem: vscode.StatusBarItem;

// 导出一个异步函数，用于激活扩展
export async function activate(context: vscode.ExtensionContext) {
    // 打印欢迎信息
    console.log('Congratulations, your extension "CodeGeeX" is now active!');
    try {
        // 获取打开的扩展数据
        getOpenExtensionData();
    } catch (err) {
        // 打印错误信息
        console.error(err);
    }
    // 注册一个命令，用于打开欢迎页面
    context.subscriptions.push(
        vscode.commands.registerCommand("codegeex.welcome-page", async () => {
            // 调用欢迎页面函数
            await welcomePage(context);
        })
    );
    // 如果是新安装的扩展，则执行打开欢迎页面的命令
    if (vscode.env.isNewAppInstall) {
        vscode.commands.executeCommand("codegeex.welcome-page");
    }
    // 检查隐私设置
    checkPrivacy();
    // 调查问卷
    // 声明一个目标编辑器
    let targetEditor: vscode.TextEditor;

    // 定义状态栏命令ID
    const statusBarItemCommandId = "codegeex.disable-enable";
    // 将命令注册到上下文中
    context.subscriptions.push(
        vscode.commands.registerCommand("codegeex.disable-enable", () => {
            // 调用disableEnable函数，传入参数
            disableEnable(myStatusBarItem, g_isLoading, originalColor, context);
        })
    );
    // 如果启用扩展，则更新全局状态为true，否则为false
    if (enableExtension) {
        context.globalState.update("EnableExtension", true);
    } else {
        context.globalState.update("EnableExtension", false);
    }
    // create a new status bar item that we can now manage
    myStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    myStatusBarItem.command = statusBarItemCommandId;
    context.subscriptions.push(myStatusBarItem);
    //initialiser statusbar
    changeIconColor(
        enableExtension,
        myStatusBarItem,
        originalColor,
        isCurrentLanguageDisable()
    );
    updateStatusBarItem(myStatusBarItem, g_isLoading, false, "");
    //subscribe interactive-mode command
    // 将命令注册到上下文中
    context.subscriptions.push(
        // 注册命令
        vscode.commands.registerCommand(
            // 命令名称
            "codegeex.interactive-mode",
            // 命令执行函数
            async () => {
                // 获取当前活动编辑器
                const editor = vscode.window.activeTextEditor;
                // 如果没有活动编辑器
                if (!editor) {
                    // 显示信息消息
                    vscode.window.showInformationMessage(
                        // 信息消息内容
                        localeTag.noEditorInfo
                    );
                    // 返回
                    return;
                }
                // 将活动编辑器赋值给目标编辑器
                targetEditor = editor;
                // 调用生成函数，传入编辑器、状态栏项和加载状态
                generationWithInteractiveMode(
                    editor,
                    myStatusBarItem,
                    g_isLoading
                );
            }
        )
    );
    //subscribe translation-mode command
    context.subscriptions.push(
        vscode.commands.registerCommand("codegeex.translate-mode", async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage(localeTag.noEditorInfo);
                return;
            }
            targetEditor = editor;
            generationWithTranslationMode(
                myStatusBarItem,
                g_isLoading,
                targetEditor
            );
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("codegeex.prompt-mode", () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage(localeTag.noEditorInfo);
                return;
            }
            generateWithPromptMode(myStatusBarItem, g_isLoading, editor);
        })
    );
 // 注册文本文档内容提供者
    context.subscriptions.push(
        vscode.workspace.registerTextDocumentContentProvider(
            myScheme,
            textDocumentProvider(myStatusBarItem, g_isLoading)
        )
    );
 // 注册命令
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "CodeGeeX.chooseCandidate",
            (fn, mode, commandid) => {
                chooseCandidate(targetEditor, fn, mode, commandid);
            }
        )
    );

//注册代码提示提供者
    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            { scheme: myScheme },
            codelensProvider
        )
    );

    //command after insert a suggestion in stealth mode
  // 将命令"verifyInsertion"添加到上下文中
    context.subscriptions.push(
        // 注册命令"verifyInsertion"，当命令被调用时，执行以下函数
        vscode.commands.registerCommand(
            "verifyInsertion",
            async (id, completions, acceptItem) => {
             
            }
        )
    );

    let inlineProvider: vscode.InlineCompletionItemProvider;

    inlineProvider = inlineCompletionProvider(
        g_isLoading,
        myStatusBarItem,
        false,
        originalColor,
        context
    );

// 如果onlyKeyControl为真
    if (onlyKeyControl) {
        // 将DisableInlineCompletion设置为true
        context.globalState.update("DisableInlineCompletion", true);
    } else {
        // 否则，将DisableInlineCompletion设置为false
        context.globalState.update("DisableInlineCompletion", false);
        // 将inlineProvider注册为全局的行内补全项提供者
        context.subscriptions.push(
            vscode.languages.registerInlineCompletionItemProvider(
                { pattern: "**" },
                inlineProvider
            )
        );
    }

    let provider2 = inlineCompletionProviderWithCommand(
        g_isLoading,
        myStatusBarItem,
        originalColor,
        context
    );
  // 定义一个一次性可销毁对象
    let oneTimeDispo: vscode.Disposable;
  // 注册一个命令，当执行该命令时，执行以下操作
    vscode.commands.registerCommand("codegeex.new-completions", () => {
      // 如果已经存在一次性可销毁对象，则销毁它
        if (oneTimeDispo) {
            oneTimeDispo.dispose();
        }
      // 更新全局状态，将isOneCommand设置为true
        context.globalState.update("isOneCommand", true);
      // 更新全局状态，将DisableInlineCompletion设置为true
        context.globalState.update("DisableInlineCompletion", true);
      // 注册一个内联补全项提供者，匹配所有文件，使用provider2提供补全项
        oneTimeDispo = vscode.languages.registerInlineCompletionItemProvider(
            { pattern: "**" },
            provider2
        );
    });
  // 将vscode窗口活动文本编辑器的改变事件添加到订阅中
    context.subscriptions.push(
        // 监听vscode窗口活动文本编辑器的改变事件
        vscode.window.onDidChangeActiveTextEditor(async (e) => {
            // 获取当前活动文本编辑器
            const editor = vscode.window.activeTextEditor;
            // 获取全局状态中的EnableExtension值
            const enableExtension = await context.globalState.get(
                "EnableExtension"
            );
            // 如果存在活动文本编辑器
            if (editor) {
                
                // 调用changeIconColor函数，改变状态栏图标颜色
                changeIconColor(
                    //@ts-ignore
                    enableExtension,
                    myStatusBarItem,
                    originalColor,
                    isCurrentLanguageDisable(),
                    true
                );
            }
        })
    );
    // 创建一个翻译视图提供者
    const tranlationProvider = new translationWebviewProvider(
        context.extensionUri
    );
    // 注册一个翻译视图提供者
    const translationViewDisposable = vscode.window.registerWebviewViewProvider(
        "codegeex-translate",
        tranlationProvider
    );

    // 将视图提供者添加到订阅中
    context.subscriptions.push(translationViewDisposable);
}
export function deactivate() {}
