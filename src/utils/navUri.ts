import * as vscode from "vscode";

// 导出一个异步函数navUri，用于打开指定uri的文档
export const navUri = async (
    uri: vscode.Uri, // uri参数，类型为vscode.Uri
    language: string, // language参数，类型为字符串
    mode: string // mode参数，类型为字符串
) => {
    // 使用vscode.workspace.openTextDocument打开指定uri的文档
    const doc = await vscode.workspace.openTextDocument(uri);

    // 使用vscode.window.showTextDocument显示文档
    await vscode.window.showTextDocument(doc, {
        viewColumn: vscode.ViewColumn.Beside, // 在当前视图旁边显示文档
        preview: true, // 以预览模式显示文档
        preserveFocus: true, // 保留焦点
    });
    // 使用vscode.languages.setTextDocumentLanguage设置文档的语言
    vscode.languages.setTextDocumentLanguage(doc, language);
};
