import { Uri, Webview } from "vscode";

/**
 * A helper function which will get the webview URI of a given file or resource.
 *
 * @remarks This URI can be used within a webview's HTML as a link to the
 * given file/resource.
 *
 * @param webview A reference to the extension webview
 * @param extensionUri The URI of the directory containing the extension
 * @param pathList An array of strings representing the path to a file/resource
 * @returns A URI pointing to the file/resource
 */
// 导出一个默认函数，用于获取webview的uri
export default function getUri(
    // webview对象
    webview: Webview,
    // 扩展的uri
    extensionUri: Uri,
    // 路径列表
    pathList: string[]
) {
    // 返回webview的uri，使用Uri.joinPath方法将扩展的uri和路径列表拼接起来
    return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}
