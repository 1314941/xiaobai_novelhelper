import { workspace } from "vscode";

// 获取Codegeex插件的配置
const configuration = workspace.getConfiguration("Codegeex", undefined);

// 导出生成偏好设置
export const generationPreference = configuration.get("GenerationPreference");
// 导出禁用设置
export const disabledFor = configuration.get("DisabledFor", new Object());

// 获取禁用语言
export const disabledLangs = () => {
    // 获取禁用设置
    const disabledFor = configuration.get("DisabledFor", new Object());
    // 初始化禁用语言数组
    let disabledLangs = [];
    // 获取禁用设置中的键
    const keys = Object.keys(disabledFor);
    // 遍历键
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        // 如果键对应的值为true或"true"，则将键添加到禁用语言数组中
        if (
            (disabledFor as any)[key] === true ||
            (disabledFor as any)[key] === "true"
        ) {
            disabledLangs.push(key);
        }
    }
    // 返回禁用语言数组
    return disabledLangs;
};

// 定义默认配置
const defaultConfig = {
    temp: 0.8,
    topp: 0.95,
    topk: 0,
};
// 获取模型配置
const modelConfig = configuration.get("DecodingStrategies", defaultConfig);
// 导出温度参数
export const temp = modelConfig.temp;
// 导出topk参数
export const topk = modelConfig.topk;
// 导出topp参数
export const topp = modelConfig.topp;
//get number of candidates
const candidateNum_str = String(configuration.get("CandidateNum", "1"));
// 将字符串类型的candidateNum_str转换为整数类型
export const candidateNum = parseInt(candidateNum_str);
// 获取配置文件中的NeedGuide参数
export const needGuide = configuration.get("NeedGuide");
// 获取配置文件中的Translation参数
export const translationInsertMode = configuration.get("Translation");
// 获取配置文件中的EnableExtension参数，默认值为true
export const enableExtension = configuration.get("EnableExtension", true);
// 获取配置文件中的Survey参数，默认值为null
export const acceptedsurvey = configuration.get("Survey", null);
// 获取配置文件中的CompletionDelay参数，默认值为0.5
export const completionDelay = configuration.get("CompletionDelay", 0.5);
// 获取配置文件中的PromptTemplates(Experimental)参数，默认值为空对象
export const templates = configuration.get("PromptTemplates(Experimental)", {});
// 获取配置文件中的OnlyKeyControl参数
export const onlyKeyControl = configuration.get("OnlyKeyControl");
export const controls = {
    interactiveMode: {
        mac: "Control + Enter",
        win: "Ctrl + Enter",
    },
    promptMode: {
        mac: "Option + T",
        win: "Ctrl + T",
    },
    translationMode: {
        mac: "Option + Control + T",
        win: "Alt + Ctrl + T",
    },
    nextSuggestion: {
        mac: "Option + ]",
        win: "Alt + ]",
    },
    previousSuggestion: {
        mac: "Option + [",
        win: "Alt + [",
    },
    newSuggestion: {
        mac: "Option + N",
        win: "Alt + N",
    },
};
