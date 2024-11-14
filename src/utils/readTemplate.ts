import * as vscode from "vscode";
// 导出一个异步函数，用于读取模板文件
export default async function readTemplate(path: string) {
    // 使用vscode.workspace.fs.readFile方法读取文件
    const readData = await vscode.workspace.fs.readFile(vscode.Uri.parse(path));
    // 将读取的数据转换为utf8编码的字符串
    return Buffer.from(readData).toString("utf8");
}
