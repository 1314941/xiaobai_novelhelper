// 从 webview 上下文中获取 VS Code API 的访问权限
const vscode = acquireVsCodeApi();
// 和普通的网页一样，我们需要等待 webview DOM 加载完成
// 然后才能引用任何 HTML 元素或工具包组件
window.addEventListener("load", main);

// 一旦 webview DOM 加载完成，就会执行的主要函数
function main() {
    // 获取翻译按钮元素
    const translateButton = document.getElementById("translate-button");
    // 为翻译按钮添加点击事件监听器
    translateButton.addEventListener("click", () => {
        // 获取原始文本输入的值
        const original = document.getElementById("original").value;
        // 检查原始文本输入的值是否不为空
        if (original.length > 0) {
            // 获取源语言和目标语言值
            const srcLang = document.getElementById("srcLang").value;
            const dstLang = document.getElementById("dstLang").value;
            // 禁用翻译按钮
            const translateButton = document.getElementById("translate-button");
            translateButton.disabled = true;
            // 向扩展上下文传递消息，包含要搜索的位置和应返回的温度单位（F 或 C）
            vscode.postMessage({
                command: "code.translate",
                original: original,
                srcLang: srcLang,
                dstLang: dstLang,
            });
        } else {
            // 如果原始文本输入的值为空，向扩展上下文发送错误消息
            vscode.postMessage({
                command: "code.translate.inputError",
            });
        }
    });
    // 获取插入按钮元素
    const insertButton = document.getElementById("insert-button");
    // 为插入按钮添加点击事件监听器
    insertButton.addEventListener("click", () => {
        // 获取结果元素
        const result = document.getElementById("test");
        // 向扩展上下文发送消息，包含结果文本
        vscode.postMessage({
            command: "code.insert",
            result: result.innerText,
        });
    });
    // 获取原始文本输入元素
    const original = document.getElementById("original");
    // const dstLangOption = document.getElementById("dstLang");
    // dstLangOption.addEventListener("change", () => {
    //     const dstLang = dstLangOption.value;
    //     displayData('', dstLang)
    // })
    // 设置 VS Code API 的消息监听器
    setVSCodeMessageListener();
}


// 定义一个函数，用于翻译
function tranlate() {
    // 获取原始文本框的值
    const original = document.getElementById("original").value;
    // 如果原始文本框的值不为空
    if (original.length > 0) {
        // 获取源语言和目标语言的值
        const srcLang = document.getElementById("srcLang").value;
        const dstLang = document.getElementById("dstLang").value;
        // 获取翻译按钮
        const translateButton = document.getElementById("translate-button");
        // 禁用翻译按钮
        translateButton.disabled = true;
        // 向vscode发送消息，包含命令、原始文本、源语言和目标语言
        vscode.postMessage({
            command: "code.translate",
            original: original,
            srcLang: srcLang,
            dstLang: dstLang,
        });
    } else {
        // 如果原始文本框的值为空，向vscode发送消息，包含命令
        vscode.postMessage({
            command: "code.translate.inputError",
        });
    }
}

// 定义一个函数insert
function insert() {
    // 获取id为original的元素的值
    const original = document.getElementById("original").value;
    // 向vscode发送消息，命令为code.insert，original为original的值
    vscode.postMessage({
        command: "code.insert",
        original: original,
    });
}

// Sets up an event listener to listen for messages passed from the extension context
// and executes code based on the message that is recieved
// 定义一个函数，用于设置VSCode的消息监听器
function setVSCodeMessageListener() {
    // 监听window对象上的message事件
    window.addEventListener("message", (event) => {
        // 获取事件中的command属性
        const command = event.data.command;

        // 根据command属性的不同，执行不同的操作
        switch (command) {
            // 如果command属性为"code.translate"，则执行以下操作
            case "code.translate":
                // 获取事件中的payload属性和lang属性
                const data = event.data.payload;
                const lang = event.data.lang;
                // 调用displayData函数，传入payload属性和lang属性
                displayData(data, lang);
                break;
            // 如果command属性为"code.changeDstLang"，则执行以下操作
            case "code.changeDstLang":
                // 获取id为"dstLang"的元素
                const dstLang = document.getElementById("dstLang");
                // 如果元素的value属性不等于事件中的dstLang属性，则执行以下操作
                if (dstLang.value !== event.data.dstLang) {
                    // 将元素的value属性设置为事件中的dstLang属性
                    dstLang.value = event.data.dstLang;
                    // 调用displayData函数，传入空字符串和dstLang属性
                    //displayData('',dstLang);
                }
        }
    });
}

// 定义一个函数，用于显示数据
function displayData(data, lang) {
    // 获取id为test的元素
    const summary = document.getElementById("test");
    // 将元素的class设置为传入的lang参数
    summary.className = lang;

    // 如果summary有子节点
    if (summary.childNodes) {
        // 获取summary的子节点数量
        let len = summary.childNodes.length;
        // 遍历子节点
        for (let i = 0; i < len; i++) {
            // 移除summary的第一个子节点
            summary.removeChild(summary.childNodes[0]);
        }
    }
    // 在summary中添加一个换行符
    summary.append("\n");
    // 在summary中添加传入的data参数
    summary.append(data);
    // 调用highlight函数
    highlight();
    // 获取id为translate-button的元素
    const translateButton = document.getElementById("translate-button");
    // 将translateButton的disabled属性设置为false
    translateButton.disabled = false;
}
