import { window } from "vscode";

export type MessageOptions = {
    messageId: string;
    messageText: string;
    buttonText: string;
    action: () => void;
};

// 导出一个默认的异步函数，用于显示消息
export default async function showMessage(
    // 传入一个MessageOptions类型的参数
    options: MessageOptions
): Promise<void> {
    // 等待window.showInformationMessage函数执行完毕
    await window
        .showInformationMessage(options.messageText, options.buttonText)
        // 如果用户点击了按钮，则执行options.action函数
        .then((selected) => {
            if (selected === options.buttonText) {
                options.action();
            }
        });
}
