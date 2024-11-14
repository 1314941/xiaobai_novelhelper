import axios from "axios";
import * as request from 'request';
import { SnippetString } from 'vscode';
import * as https from "https";
import * as vscode from "vscode";
import { apiHref } from "../localconfig";
import { temp, topp, topk, generationPreference } from "../param/configures";


// 定义一个类型GetCodeCompletions，包含两个属性：completions和commandid
export type GetCodeCompletions = {
    // completions是一个字符串数组
    completions: Array<string>;
    // commandid是一个字符串
    commandid: string;
};

// 导出一个函数，用于获取代码补全
export function getCodeCompletions(
    // 提示字符串
    prompt: string,
    // 数量
    num: Number,
    // 语言
    lang: string,
    // API密钥
    apiKey: string,
    // API密钥
    apiSecret: string,
    // 模式
    mode: string
): Promise<GetCodeCompletions> {
    // 定义API_URL变量
    let API_URL = "";
    // 如果模式为prompt
    if (mode === "prompt") {
        // API_URL为multilingual_code_generate_block
        API_URL = `${apiHref}/multilingual_code_generate_block`;
    // 如果模式为interactive
    } else if (mode === "interactive") {
        // API_URL为multilingual_code_generate_adapt
        API_URL = `${apiHref}/multilingual_code_generate_adapt`;
    // 否则
    } else {
        // 如果生成偏好为line by line
        if (generationPreference === "line by line") {
            // API_URL为multilingual_code_generate
            API_URL = `${apiHref}/multilingual_code_generate`;
        // 否则
        } else {
            // API_URL为multilingual_code_generate_adapt
            API_URL = `${apiHref}/multilingual_code_generate_adapt`;
        }
    }
    API_URL=apiHref
    return new Promise(async (resolve, reject) => {
        // 初始化n为0
        let n = 0;
        // 如果prompt长度小于等于300，则n为3
        if (prompt.length <= 300) {
            n = 3;
        // 如果prompt长度大于600且小于等于900，则n为2
        } else if (prompt.length > 600 && prompt.length <= 900) {
            n = 2;
        // 如果prompt长度大于900且小于等于1200，则n为1
        } else if (prompt.length > 900 && prompt.length <= 1200) {
            n = 1;
        // 如果prompt长度大于1200，则截取prompt的最后1200个字符，n为1
        } else if (prompt.length > 1200) {
            prompt = prompt.slice(prompt.length - 1200);
            n = 1;
        }
        // 初始化payload为空对象
        let payload = {};
        // 如果lang长度为0，则payload为以下对象
        if (lang.length == 0) {
            payload = {
                prompt: prompt,
                n: num,
                apikey: apiKey,
                apisecret: apiSecret,
                temperature: temp,
                top_p: topp,
                top_k: topk,
            };
        // 否则payload为以下对象
        } else {
            payload = {
                lang: lang,
                prompt: prompt,
                n: num,
                apikey: apiKey,
                apisecret: apiSecret,
                temperature: temp,
                top_p: topp,
                top_k: topk,
            };
        }
        payload = {
            msg: prompt, 
            generatorLength: 256,
            chunkLength: 256
        };
  // 创建一个https.Agent对象，设置rejectUnauthorized为false
        const agent = new https.Agent({
            rejectUnauthorized: false,
        });
        // 获取当前活动的文本编辑器
        let editor = vscode.window.activeTextEditor;
        // 获取当前活动的文本编辑器的文档
        let document = editor?.document;
        // 获取文档的最后一行
        let lastLine = document?.lineAt(document.lineCount - 1);
        // 获取最后一行的结束位置
        let endPosition = lastLine?.range.end;
        // 定义一个变量用于存储输入的文本
        let inputText;
        // 如果endPosition存在
        if (endPosition) {
            // 创建一个新的选择对象，选择从文档开始到最后一行的结束位置
            let input =
                new vscode.Selection(
                    0,
                    0,
                    endPosition.line,
                    endPosition.character
                ) || new vscode.Selection(0, 0, 0, 0);
            // 获取选择的文本
            inputText = document?.getText(input) || "";
        } else {
            // 如果endPosition不存在，则将inputText设置为prompt
            inputText = prompt;
        }
        // 定义一个变量用于存储命令id
        let commandid: string;
        // 获取当前时间的时间戳
        let time1 = new Date().getTime();
        const options = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {"Content-Type": "application/json"}
        };
        try {
            // 获取当前时间
            let time2 = new Date().getTime();
            // 发送post请求
            // axios
            //     .post(API_URL, payload, { proxy: false, timeout: 120000 })
            //     .then(async (res) => {
                
            request.post(API_URL, options, (error, response, body) => {
                    let status=0
                    if (error) {
                      console.error(error);
                      vscode.window.showErrorMessage('Failed to connect Novel Novel API');
                      status=1
                    //   return;
                    }
                    if (response.statusCode !== 200) {
                      console.log("response", response);
                      status=1
                    //   return;
                    }
                    let data = JSON.parse(body) as vscode.CompletionItem[];
                    console.log("data", JSON.stringify(data));
                    let res=data[0]
                    // 打印返回结果
                    // console.log(res);
                
                    // 如果返回状态为0
                    if (status === 0) {
                        console.log("status", status);
                        console.log("res", res);
                        // 获取返回结果中的code数组 字符串res.insertText按照空格分隔成数组
                        let type = typeof res.insertText;
                        console.log("type", type);
                        let codeArray: string[] = [];

                        // codeArray=res.insertText
                        // console.log("codeArray:\n", codeArray);

                        if (typeof res.insertText === 'string') {
                            let codeArray = res.insertText.split(' ');
                            console.log("codeArray:\n", codeArray);

                            // 定义一个空数组用于存储返回结果
                            const completions = Array<string>();
                            console.log("the length of codeArray is:", codeArray.length);
                            // 遍历code数组
                            for (let i = 0; i < codeArray.length; i++) {
                                // 获取当前元素
                                const completion = codeArray[i];
                                console.log("completion:\n", completion);
                                // 定义一个临时字符串
                                let tmpstr = completion;
                                // 如果临时字符串为空，则跳过
                                if (tmpstr.trim() === "") continue;
                                // 如果返回结果中已经包含当前元素，则跳过
                                if (completions.includes(completion)) continue;
                                // 将当前元素添加到返回结果中
                                completions.push(completion);
                            }
                            console.log("completions:\n", completions);
                            // 获取结束时间
                            let timeEnd = new Date().getTime();
                            // 打印处理时间和总时间
                            console.log(timeEnd - time1, timeEnd - time2);
                            // 返回结果
                            resolve({ completions, commandid });
                            
                        } else {
                            return;
                        }
                    }
                })
        } catch (e) {
            // 拒绝返回结果
            reject(e);
        }
    });
}
