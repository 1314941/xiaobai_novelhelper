// 导出一个默认函数，用于获取文档的语言ID
export default function getDocumentLangId(lang: string) {
    // 声明一个变量id
    let id;
    // 将lang中的"++"替换为"pp"，将"#"替换为"sharp"
    lang = lang.replace("++", "pp").replace("#", "sharp");
    // 根据lang的值，给id赋值
    switch (lang) {
        case "Cuda":
            id = "cuda-cpp";
            break;
        case "Shell":
            id = "shellscript";
            break;
        default:
            id = lang.toLowerCase();
    }
    // 返回id
    return id;
}
