import { statApiHerf, surveyUrlCN, surveyUrlEN } from "../localconfig";
import * as vscode from "vscode";
import { localeCN } from "../locales/localeCN";
import { localeEN } from "../locales/localeEN";

export const extensionId = "aminer.codegeex";
export const extensionVersion = "1.1.2";
export const myScheme = "codegeex";

//api to do the statistics of data
export const apiHerf = statApiHerf;

//language accepted by the model
export const languageList = [
    "C++",
    "C",
    "C#",
    "Cuda",
    "Objective-C",
    "Objective-C++",
    "Python",
    "Java",
    "TeX",
    "HTML",
    "PHP",
    "JavaScript",
    "TypeScript",
    "Go",
    "Shell",
    "Rust",
    "CSS",
    "SQL",
    "R",
];

//const to replace specfic characters
// 导出一个常量，表示注释
export const comment = "<|comment|>";
// 导出一个常量，表示添加信号
export const addSignal = "<|add|>";
// 导出一个常量，表示与信号
export const andSignal = "<|and|>";
// 导出一个常量，表示哈希
export const hash = "<|hash|>";

//locale language
export const locale = vscode.env.language;

export const surveyUrl = locale === "zh-cn" ? surveyUrlCN : surveyUrlEN;
export const localeTag = locale === "zh-cn" ? localeCN : localeEN;
