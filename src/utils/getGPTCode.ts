import { codelensProvider } from "../provider/codelensProvider";
import { updateStatusBarItem } from "./updateStatusBarItem";
import { StatusBarItem } from "vscode";

// 导出一个函数，用于获取GPT代码
export const getGPTCode = (
    candidateList: Array<string>, // 候选代码列表
    commandid: string, // 命令id
    myStatusBarItem: StatusBarItem, // 状态栏项
    g_isLoading: boolean // 是否正在加载
) => {
    // 清空代码提示
    codelensProvider.clearEls();
    let content = "";
    //let content = `/* ${localeTag.candidateList} */\n`;
    // 如果候选代码列表为空，则更新状态栏，并返回空字符串
    if (candidateList.length === 0) {
        updateStatusBarItem(
            myStatusBarItem,
            g_isLoading,
            false,
            " No Suggestion"
        );
        return content;
    }
    let allCandidates = [];
    // 将候选代码列表中的每一项添加到allCandidates数组中
    for (let i = 0; i < candidateList.length; i++) {
        allCandidates.push([candidateList[i], "CodeGeeX"]);
    }

    // 按照候选代码的长度进行排序
    allCandidates.sort(function (a, b) {
        return b[0].length - a[0].length;
    });

    // 遍历allCandidates数组，将每一项添加到content字符串中
    for (let i = 0; i < allCandidates.length; i++) {
        content += `\n/* Generate by ${allCandidates[i][1]} */\n`;
        const lineNum = content.split("\n").length;
        // 添加代码提示
        codelensProvider.addEl(
            lineNum,
            allCandidates[i][0],
            allCandidates[i][1] === "CodeGeeX" ? commandid : ""
        );

        // 如果候选代码以换行符开头，则直接添加到content字符串中
        if (allCandidates[i][0][0] === "\n") {
            content += allCandidates[i][0];
        } else {
            // 否则，在候选代码前添加一个换行符，再添加到content字符串中
            content += "\n" + allCandidates[i][0];
        }
        // 如果不是最后一项，则在候选代码后添加分隔符
        if (
            i <
            allCandidates.length - 1 /*&& candidateList[i].slice(-1) != '\n'*/
        ) {
            content += "\n";
            content += "###########################";
        }
    }
    // 更新状态栏
    updateStatusBarItem(myStatusBarItem, g_isLoading, false, " Done");
    // 返回content字符串
    return content;
};
