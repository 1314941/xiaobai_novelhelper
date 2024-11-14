import axios from "axios";
import * as https from "https";
import * as request from "request";
import * as vscode from "vscode";
import { apiHref, apiKey, apiSecret } from "../localconfig";
import { temp, topk, topp } from "../param/configures";
export type GetCodeTranslation = {
    translation: Array<string>;
};
export function getCodeTranslation(
    prompt: string,
    src_lang: string,
    dst_lang: string
): Promise<GetCodeTranslation> {
    // const API_URL = `https://tianqi.aminer.cn/api/v2/multilingual_code_translate`;
    const API_URL = apiHref;

    return new Promise((resolve, reject) => {
        let payload = {};
        payload = {
            prompt: prompt,
            n: 1,
            src_lang: src_lang,
            dst_lang: dst_lang,
            stop: [],
            userid: "",
            apikey: apiKey,
            apisecret: apiSecret,
            temperature: temp,
            top_p: topp,
            top_k: topk,
        };
        payload = {
            msg: prompt, 
            generatorLength: 256,
            chunkLength: 256
        };
        const agent = new https.Agent({
            rejectUnauthorized: false,
        });
        const options = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {"Content-Type": "application/json"}
        };

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
                    // 返回结果
                    // resolve({ completions});
                    resolve({ translation: completions });
                    
                } else {
                    return;
                }
            }
            })
    });
}
