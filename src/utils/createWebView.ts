import { ExtensionContext, ViewColumn, WebviewPanel, window } from "vscode";

let panel: WebviewPanel | undefined = undefined;

//To create web view in vscode
export default async function createWebView(
    context: ExtensionContext,
    content?: string,
    view?: string
) {
    //获取当前活动文本编辑器的列
    const columnToShowIn = window.activeTextEditor
        ? window.activeTextEditor.viewColumn
        : undefined;

    //如果panel存在，则显示panel
    if (panel) {
        panel.reveal(columnToShowIn);
    } else {
        //创建一个新的panel
        panel = window.createWebviewPanel(
            "CodeGeeX.keys",
            "CodeGeeX Guide",
            { viewColumn: ViewColumn.Active, preserveFocus: false },
            {
                retainContextWhenHidden: true,
                enableFindWidget: true,
                enableCommandUris: true,
                enableScripts: true,
            }
        );

        //设置panel的html内容
        panel.webview.html = `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; min-width: 100%; min-height: 100%">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CodeGeeX Guide</title>
    </head>
    <body style="margin: 0; padding: 0; width: 100%; height: 100%">
        <div>
            <div>${content}</div>
        </div>
    </body>
</html>`;
        //当panel被销毁时，将panel设置为undefined
        panel.onDidDispose(
            () => {
                panel = undefined;
            },
            null,
            context.subscriptions
        );
    }
}
