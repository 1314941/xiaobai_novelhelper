import { window } from "vscode";

// 导出一个异步函数，用于显示快速选择框
export async function showQuickPick(list: Array<string>, description: string) {
    // 调用window对象的showQuickPick方法，传入列表和描述
    const result = await window.showQuickPick(list, {
        // 设置快速选择框的占位符
        placeHolder: description,
        // 设置快速选择框的选中项回调函数
        onDidSelectItem: (item) => {},
    });
    // 返回快速选择框的结果
    return result;
}
