const config = {
    END_WORD: "$",
    PERMS_MIN_LEN: 2,
};

export class Trie {
    /**
     *
     *
     * @internal
     * @type {*}
     * @memberOf Trie
     */
    private _trie: any;

    constructor(input?: string[]) {
        this._trie = Trie._create(input);
    }

    public getIndex() {
        return this._trie;
    }

    public setIndex(trie: any) {
        this._trie = trie;
    }

    // 添加单词
    public addWord(word: string) {
        // 定义一个reducer函数，用于将单词添加到Trie中
        const reducer = (
            previousValue: any,
            currentValue: string,
            currentIndex: number,
            array: string[]
        ) => {
            // 调用Trie的_append方法，将单词添加到Trie中
            return Trie._append(
                previousValue,
                currentValue,
                currentIndex,
                array
            );
        };

        // 将单词转换为字符串数组
        const input: string[] = word /*.toLowerCase()*/
            .split("");
        // 使用reduce方法，将单词添加到Trie中
        input.reduce(reducer, this._trie);
        // 返回当前对象
        return this;
    }

    public removeWord(word: string) {
        const { prefixFound, prefixNode } = Trie._checkPrefix(this._trie, word);

        if (prefixFound) {
            delete prefixNode[config.END_WORD];
        }

        return this;
    }

 // 获取单词
    public getWords() {
        // 递归获取前缀
        return Trie._recursePrefix(this._trie, "");
    }

    public getPrefix(strPrefix: string) {
        // 将strPrefix转换为小写
        // strPrefix = strPrefix.toLowerCase();
        // 检查strPrefix是否为前缀
        if (!this._isPrefix(strPrefix)) {
            return [];
        }

        // 检查前缀节点
        const { prefixNode } = Trie._checkPrefix(this._trie, strPrefix);

        // 递归获取前缀
        return Trie._recursePrefix(prefixNode, strPrefix);
    }

    /**
     *
     *
     * @internal
     * @param {any} prefix
     * @returns
     *
     * @memberOf Trie
     */
    private _isPrefix(prefix: any) {
        const { prefixFound } = Trie._checkPrefix(this._trie, prefix);

        return prefixFound;
    }

    /**
     *
     *
     * @internal
     * @static
     * @param {any} trie
     * @param {any} letter
     * @param {any} index
     * @param {any} array
     * @returns
     *
     * @memberOf Trie
     */
 // 私有静态方法，用于向字典树中添加字母
    private static _append(trie: any, letter: any, index: any, array: any) {
        // 如果字典树中不存在该字母，则创建一个空对象
        trie[letter] = trie[letter] || {};
        // 将字典树指向该字母对应的对象
        trie = trie[letter];

        // 如果当前字母是最后一个字母，则将该字母对应的对象中的END_WORD属性设置为1
        if (index === array.length - 1) {
            trie[config.END_WORD] = 1;
        }

        // 返回字典树
        return trie;
    }

    /**
     *
     *
     * @internal
     * @static
     * @param {any} prefixNode
     * @param {string} prefix
     * @returns
     *
     * @memberOf Trie
     */
// 检查前缀
    private static _checkPrefix(prefixNode: any, prefix: string) {
        // 将前缀字符串转换为字符数组
        const input: string[] = prefix /*.toLowerCase()*/
            .split("");
        // 遍历字符数组，检查前缀是否存在于前缀树中
        const prefixFound = input.every((letter, index) => {
            // 如果前缀树中不存在当前字符，则返回false
            if (!prefixNode[letter]) {
                return false;
            }
            // 如果存在，则将前缀树节点指向下一个节点
            return (prefixNode = prefixNode[letter]);
        });

        // 返回前缀是否存在于前缀树中以及前缀树节点
        return {
            prefixFound,
            prefixNode,
        };
    }

    /**
     *
     *
     * @internal
     * @static
     * @param {any} input
     * @returns
     *
     * @memberOf Trie
     */
    private static _create(input: any) {
        // 创建一个空对象，用于存储前缀树
        const trie = (input || []).reduce((accumulator: any, item: any) => {
            // 将每个单词转换为小写，并拆分为字符数组
            item
                /*.toLowerCase()*/
                .split("")
                // 将字符数组中的每个字符添加到前缀树中
                .reduce(Trie._append, accumulator);

            // 返回前缀树
            return accumulator;
        }, {});

        // 返回前缀树
        return trie;
    }

    /**
     *
     *
     * @internal
     * @static
     * @param {any} node
     * @param {any} prefix
     * @param {string[]} [prefixes=[]]
     * @returns
     *
     * @memberOf Trie
     */
    private static _recursePrefix(
        node: any, // 节点
        prefix: any, // 前缀
        prefixes: string[] = [] // 前缀数组
    ) {
        let word = prefix; // 将前缀赋值给word

        for (const branch in node) { // 遍历节点
            if (branch === config.END_WORD) { // 如果节点为结束节点
                prefixes.push(word); // 将word添加到前缀数组中
                word = ""; // 将word置空
            }
            Trie._recursePrefix(node[branch], prefix + branch, prefixes); // 递归调用
        }

        return prefixes.sort(); // 返回排序后的前缀数组
    }
}
