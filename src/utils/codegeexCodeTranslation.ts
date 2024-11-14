import getDocumentLangId from "./getDocumentLangId";
import { Uri } from "vscode";
import { navUri } from "./navUri";
import { addSignal, andSignal, myScheme } from "../param/constparams";

//generate uri for translation mode
// 导出一个异步函数，用于CodeGeeX代码翻译
export const codegeexCodeTranslation = async (
    dstLang: string, // 目标语言
    translationRes: string, // 翻译结果
    commandid: string // 命令id
) => {
    let documentLangId; // 文档语言id
    documentLangId = getDocumentLangId(dstLang); // 获取文档语言id
    let uri = Uri.parse(
        `${myScheme}:CodeGeeX_translation?loading=false&mode=translation&commandid=${commandid}&translation_res=${translationRes
            .replaceAll("+", addSignal)
            .replaceAll("&", andSignal)}`,
        true
    ); // 解析uri

    await navUri(uri, documentLangId, "CodeGeeX_translation"); // 导航到uri
};
