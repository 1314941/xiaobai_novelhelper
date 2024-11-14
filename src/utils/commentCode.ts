const comment = "<|comment|>";

//function to comment code for different language
// 导出一个默认函数，用于注释代码
export default function commentCode(
    // 输入的代码字符串
    input: string,
    // 代码语言
    lang: string,
    // 注释模式，可选参数
    mode?: string
) {
    // 如果输入的代码字符串为空，则直接返回
    if (input.trim() === "") {
        return input;
    }
    // 获取注释符号
    const commentSignal = getCommentSignal(lang);
    // 如果注释模式为block，并且有左右注释符号，则返回左右注释符号包裹的代码
    if (
        mode === "block" &&
        commentSignal.blockLeft &&
        commentSignal.blockRight
    ) {
        return commentSignal.blockLeft + input + commentSignal.blockRight;
    }
    // 如果注释模式为line，并且有行注释符号，则返回行注释符号包裹的代码
    if (mode === "line" && commentSignal.line) {
        return comment + input.replaceAll("\n", "\n" + comment);
    }
    // 如果有左右注释符号，则返回左右注释符号包裹的代码
    if (commentSignal.blockLeft && commentSignal.blockRight) {
        return commentSignal.blockLeft + input + commentSignal.blockRight;
    }
    // 如果有行注释符号，则返回行注释符号包裹的代码
    if (commentSignal.line) {
        return comment + input.replaceAll("\n", "\n" + comment);
    }
    // 否则返回原始代码
    return input;
}

//不同语言的注释符号
// 导出一个函数，用于获取不同语言的注释符号
export function getCommentSignal(lang: string) {
    let commentSignal;
    switch (lang) {
        case "javascript":
        case "javascriptreact":
        case "typescriptreact":
        case "typescript":
        case "java":
        case "c":
        case "csharp":
        case "cpp":
        case "cuda-cpp":
        case "objective-c":
        case "objective-cpp":
        case "rust":
        case "go":
            commentSignal = {
                blockLeft: "/*",
                blockRight: "*/",
                line: "//",
            };
            break;
        case "css":
        case "less":
        case "sass":
        case "scss":
            commentSignal = {
                blockLeft: "/*",
                blockRight: "*/",
                line: null,
            };
            break;
        case "python":
            commentSignal = {
                blockLeft: '"""',
                blockRight: '"""',
                line: "#",
            };
            break;
        case "tex":
            commentSignal = {
                blockLeft: null,
                blockRight: null,
                line: "%",
            };
            break;
        case "shellscript":
        case "r":
            commentSignal = {
                blockLeft: null,
                blockRight: null,
                line: "#",
            };
            break;
        case "sql":
            commentSignal = {
                blockLeft: "/*",
                blockRight: "*/",
                line: "--",
            };
            break;
        case "html":
        case "php":
            commentSignal = {
                blockLeft: "<!--",
                blockRight: "-->",
                line: null,
            };
            break;
        default:
            commentSignal = {
                blockLeft: null,
                blockRight: null,
                line: null,
            };
    }
    return commentSignal;
}
