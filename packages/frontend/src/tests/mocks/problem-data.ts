export const problems = {
    "status": "success",
    "data": [
        {
            "id": 233,
            "uuid": "054fb4fc-3c2e-4622-95e6-c631c5f50548",
            "name": "Valid Palindrome",
            "slug": "valid-palindrome",
            "difficulty": 1,
            "starterCode": "class Solution {\n    /**\n     * @param {string} s\n     * @return {boolean}\n     */\n    isPalindrome(s) {}\n}\n",
            "answerCode": null,
            "grade": [],
            "testCode": "(function() {\n\n    // Update the inputs and expexted answers below\n    let inputs = [\n        \"Was it a car or a cat I saw?\", // input for test 1\n        \"tab a cat\", // input for test 2\n    ]\n\n    let answers = [\n        true,   // answer for test 1\n        false,  // answer for test 2\n    ]\n\n    const results = [];\n\n    for (let i=0; i<inputs.length; i++) {\n        const solution = new Solution();\n        const answer = solution.isPalindrome(inputs[i]);\n        results.push({\n            pass: checkAnswer(answer, answers[i]),\n            expected: answers[i],\n            recieved: answer\n        });\n    }\n    return results\n\n\n    function checkAnswer(recieved, expected) {\n        return recieved === expected ? 'true' : 'false'\n    }\n\n    function arraysEqual(a, b) {\n        if (a === b) return true;\n        if (a == null || b == null) return false;\n        if (a.length !== b.length) return false;\n\n        for (var i = 0; i < a.length; ++i) {\n            if (a[i] !== b[i]) return false;\n        }\n        return true;\n    }\n\n})()",
            "status": "draft",
            "history": [],
            "link": "",
            "type": "code",
            "tags": "",
            "submissionCount": 0,
            "lastSubmitted": "",
            "description": "<p>Given a string&nbsp;<code class=\"hljs language-ebnf\">s</code>, return&nbsp;<code class=\"hljs language-java\"><span class=\"token boolean\">true</span></code>&nbsp;if it is a&nbsp;<strong>palindrome</strong>, otherwise return&nbsp;<code class=\"hljs language-java\"><span class=\"token boolean\">false</span></code>.</p>\n<p>A&nbsp;<strong>palindrome</strong>&nbsp;is a string that reads the same forward and backward. It is also case-insensitive and ignores all non-alphanumeric characters.</p>\n<p><strong>Example 1:</strong></p>\n<div class=\"code-toolbar\">\n<pre class=\"language-java\" tabindex=\"0\"><code class=\"hljs language-java\"><span class=\"token class-name\">Input</span><span class=\"token operator\">:</span> s <span class=\"token operator\">=</span> <span class=\"token string\">\"Was it a car or a cat I saw?\"</span>\n\n<span class=\"token class-name\">Output</span><span class=\"token operator\">:</span> <span class=\"token boolean\">true</span>\n</code></pre>\n<div class=\"toolbar\">\n<div class=\"toolbar-item\"><button class=\"copy-to-clipboard-button\" type=\"button\" data-copy-state=\"copy\">Copy</button></div>\n</div>\n</div>\n<p>Explanation: After considering only alphanumerical characters we have \"wasitacaroracatisaw\", which is a palindrome.</p>\n<p><strong>Example 2:</strong></p>\n<div class=\"code-toolbar\">\n<pre class=\"language-java\" tabindex=\"0\"><code class=\"hljs language-java\"><span class=\"token class-name\">Input</span><span class=\"token operator\">:</span> s <span class=\"token operator\">=</span> <span class=\"token string\">\"tab a cat\"</span>\n\n<span class=\"token class-name\">Output</span><span class=\"token operator\">:</span> <span class=\"token boolean\">false</span>\n</code></pre>\n<div class=\"toolbar\">\n<div class=\"toolbar-item\"><button class=\"copy-to-clipboard-button\" type=\"button\" data-copy-state=\"copy\">Copy</button></div>\n</div>\n</div>\n<p>Explanation: \"tabacat\" is not a palindrome.</p>\n<pre>&nbsp;</pre>",
            "category": "Two Pointers",
            "categoryUuid": "3d0c2837-443d-44e2-aa6d-ebcd4128bf61",
            "createdAt": "2024-08-24T20:46:14.016Z"
        },
        {
            "id": 208,
            "uuid": "0d2c4cc2-94e7-4579-8832-631053456b71",
            "name": "Number of Islands",
            "slug": "number-of-islands",
            "difficulty": 2,
            "starterCode": "class Solution {\n    /**\n     * @param {character[][]} grid\n     * @return {number}\n     */\n    numIslands(grid) {}\n}\n",
            "answerCode": null,
            "grade": [],
            "testCode": "(function() {\n\n    // Update the inputs and expexted answers below\n\n    let inputs = [\n        [[3,4,5,6], 7], // input for test 1\n        [[4,5,6], 10], // input for test 2\n        [[5,5], 10]   // input for test 3\n    ]\n\n    let answers = [\n        [0, 1],   // answer for test 1\n        [0, 2],  // answer for test 2\n        [0, 1], // answer for test 3\n    ]\n\n    const results = [];\n\n    for (let i=0; i<inputs.length; i++) {\n        const solution = new Solution();\n        const answer = solution.twoSum(...inputs[i]);\n        results.push({\n            pass: checkAnswer(answer, answers[i]),\n            expected: answers[i],\n            recieved: answer\n        });\n    }\n    return results\n\n\n    function checkAnswer(recieved, expected) {\n        if(Object.prototype.toString.call(expected) === '[object Array]') {\n            return arraysEqual(recieved, expected) ? 'true' : 'false'\n        }\n\n        return recieved === expected ? 'true' : 'false'\n    }\n\n    function arraysEqual(a, b) {\n        if (a === b) return true;\n        if (a == null || b == null) return false;\n        if (a.length !== b.length) return false;\n\n        for (var i = 0; i < a.length; ++i) {\n            if (a[i] !== b[i]) return false;\n        }\n        return true;\n    }\n\n})()",
            "status": "draft",
            "history": [],
            "link": "https://neetcode.io/problems/count-number-of-islands",
            "type": "code",
            "tags": "",
            "submissionCount": 0,
            "lastSubmitted": "",
            "description": "<p>Given a 2D grid&nbsp;<code class=\"hljs language-css\">grid</code>&nbsp;where&nbsp;<code class=\"hljs language-scheme\">'1'</code>&nbsp;represents land and&nbsp;<code class=\"hljs language-scheme\">'0'</code>&nbsp;represents water, count and return the number of islands.</p>\n<p>An&nbsp;<strong>island</strong> is formed by connecting adjacent lands horizontally or vertically and is surrounded by water. You may assume water is surrounding the grid (i.e., all the edges are water).</p>\n<p>&nbsp;</p>\n<p><strong>Example 1:</strong></p>\n<div class=\"code-toolbar\">\n<pre class=\"language-java\" tabindex=\"0\"><code class=\"hljs language-java\"><span class=\"token class-name\">Input</span><span class=\"token operator\">:</span> grid <span class=\"token operator\">=</span> <span class=\"token punctuation\">[</span>\n    <span class=\"token punctuation\">[</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">,</span>\n    <span class=\"token punctuation\">[</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">,</span>\n    <span class=\"token punctuation\">[</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">,</span>\n    <span class=\"token punctuation\">[</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">]</span>\n  <span class=\"token punctuation\">]</span>\n<span class=\"token class-name\">Output</span><span class=\"token operator\">:</span> <span class=\"token number\">1</span>\n</code></pre>\n<div class=\"toolbar\">\n<div class=\"toolbar-item\"><button class=\"copy-to-clipboard-button\" type=\"button\" data-copy-state=\"copy\">Copy</button></div>\n</div>\n</div>\n<p><strong>Example 2:</strong></p>\n<div class=\"code-toolbar\">\n<pre class=\"language-java\" tabindex=\"0\"><code class=\"hljs language-java\"><span class=\"token class-name\">Input</span><span class=\"token operator\">:</span> grid <span class=\"token operator\">=</span> <span class=\"token punctuation\">[</span>\n    <span class=\"token punctuation\">[</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">,</span>\n    <span class=\"token punctuation\">[</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">,</span>\n    <span class=\"token punctuation\">[</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">,</span>\n    <span class=\"token punctuation\">[</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"0\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"1\"</span><span class=\"token punctuation\">]</span>\n  <span class=\"token punctuation\">]</span>\n<span class=\"token class-name\">Output</span><span class=\"token operator\">:</span> <span class=\"token number\">4</span></code></pre>\n</div>",
            "category": "Graphs",
            "categoryUuid": "33c80e8d-3d87-48d0-bcb5-a4ffa3d03abf",
            "createdAt": "2024-08-24T20:46:14.016Z"
        },
        {
            "id": 251,
            "uuid": "10156e7a-3f04-46e5-956a-247121309e85",
            "name": "Invert Binary Tree",
            "slug": "invert-binary-tree",
            "difficulty": 1,
            "starterCode": "",
            "answerCode": null,
            "grade": [],
            "testCode": "(function() {\n\n    // Update the inputs and expexted answers below\n\n    let inputs = [\n        [[3,4,5,6], 7], // input for test 1\n        [[4,5,6], 10], // input for test 2\n        [[5,5], 10]   // input for test 3\n    ]\n\n    let answers = [\n        [0, 1],   // answer for test 1\n        [0, 2],  // answer for test 2\n        [0, 1], // answer for test 3\n    ]\n\n    const results = [];\n\n    for (let i=0; i<inputs.length; i++) {\n        const solution = new Solution();\n        const answer = solution.twoSum(...inputs[i]);\n        results.push({\n            pass: checkAnswer(answer, answers[i]),\n            expected: answers[i],\n            recieved: answer\n        });\n    }\n    return results\n\n\n    function checkAnswer(recieved, expected) {\n        if(Object.prototype.toString.call(expected) === '[object Array]') {\n            return arraysEqual(recieved, expected) ? 'true' : 'false'\n        }\n\n        return recieved === expected ? 'true' : 'false'\n    }\n\n    function arraysEqual(a, b) {\n        if (a === b) return true;\n        if (a == null || b == null) return false;\n        if (a.length !== b.length) return false;\n\n        for (var i = 0; i < a.length; ++i) {\n            if (a[i] !== b[i]) return false;\n        }\n        return true;\n    }\n\n})()",
            "status": "draft",
            "history": [],
            "link": "",
            "type": "code",
            "tags": "",
            "submissionCount": 0,
            "lastSubmitted": "",
            "description": "",
            "category": "Trees",
            "categoryUuid": "8ae97c7d-3ef0-40da-9a0a-93f4843e2e5a",
            "createdAt": "2024-08-24T20:46:14.016Z"
        },
        {
            "id": 218,
            "uuid": "1508dd42-344e-479c-b722-39374adde115",
            "name": "String Encode and Decode",
            "slug": "string-encode-and-decode",
            "difficulty": 2,
            "starterCode": "\nclass Solution {\n    /**\n     * @param {ListNode} head\n     * @return {number}\n     */\n\n    encode(strs) {}\n\n    /**\n     * @param {string} str\n     * @returns {string[]}\n     */\n    decode(str) {}\n\n}\n",
            "answerCode": null,
            "grade": [],
            "testCode": "(function() {\n\n    // Update the inputs and expexted answers below\n\n    let inputs = [\n        [\"we\", \"always-say\", \":\", \"yes\"], // input for test 1\n    ]\n\n    let answers = [\n        [\"we\", \"always-say\", \":\", \"yes\"],   // answer for test 1\n    ]\n\n    const results = [];\n\n    for (let i=0; i<inputs.length; i++) {\n        const solution = new Solution();\n        const encoded = solution.encode([...inputs[i]])\n        const answer = solution.decode(encoded);\n        results.push({\n            pass: checkAnswer(answer, answers[i]),\n            expected: answers[i],\n            recieved: answer\n        });\n    }\n    return results\n\n\n    function checkAnswer(recieved, expected) {\n        if(Object.prototype.toString.call(expected) === '[object Array]') {\n            return arraysEqual(recieved, expected) ? 'true' : 'false'\n        }\n\n        return recieved === expected ? 'true' : 'false'\n    }\n\n    function arraysEqual(a, b) {\n        if (a === b) return true;\n        if (a == null || b == null) return false;\n        if (a.length !== b.length) return false;\n\n        for (var i = 0; i < a.length; ++i) {\n            if (a[i] !== b[i]) return false;\n        }\n        return true;\n    }\n\n})()",
            "status": "draft",
            "history": [],
            "link": "https://neetcode.io/problems/string-encode-and-decode",
            "type": "code",
            "tags": "",
            "submissionCount": 0,
            "lastSubmitted": "",
            "description": "<p>Design an algorithm to encode a list of strings to a single string. The encoded string is then decoded back to the original list of strings.</p>\n<p>Please implement&nbsp;<code class=\"hljs language-ebnf\">encode</code>&nbsp;and&nbsp;<code class=\"hljs language-arcade\">decode</code></p>\n<p><strong>Example 1:</strong></p>\n<div class=\"code-toolbar\">\n<pre class=\"language-java\" tabindex=\"0\"><code class=\"hljs language-java\"><span class=\"token class-name\">Input</span><span class=\"token operator\">:</span> <span class=\"token punctuation\">[</span><span class=\"token string\">\"neet\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"code\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"love\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"you\"</span><span class=\"token punctuation\">]</span>\n\n<span class=\"token class-name\">Output</span><span class=\"token operator\">:</span><span class=\"token punctuation\">[</span><span class=\"token string\">\"neet\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"code\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"love\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"you\"</span><span class=\"token punctuation\">]</span>\n</code></pre>\n<div class=\"toolbar\">\n<div class=\"toolbar-item\"><button class=\"copy-to-clipboard-button\" type=\"button\" data-copy-state=\"copy\">Copy</button></div>\n</div>\n</div>\n<p><strong>Example 2:</strong></p>\n<div class=\"code-toolbar\">\n<pre class=\"language-java\" tabindex=\"0\"><code class=\"hljs language-java\"><span class=\"token class-name\">Input</span><span class=\"token operator\">:</span> <span class=\"token punctuation\">[</span><span class=\"token string\">\"we\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"say\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\":\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"yes\"</span><span class=\"token punctuation\">]</span>\n\n<span class=\"token class-name\">Output</span><span class=\"token operator\">:</span> <span class=\"token punctuation\">[</span><span class=\"token string\">\"we\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"say\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\":\"</span><span class=\"token punctuation\">,</span><span class=\"token string\">\"yes\"</span><span class=\"token punctuation\">]</span>\n</code></pre>\n<div class=\"toolbar\">\n<div class=\"toolbar-item\"><button class=\"copy-to-clipboard-button\" type=\"button\" data-copy-state=\"copy\">Copy</button></div>\n</div>\n</div>",
            "category": "Arrays and Hashing",
            "categoryUuid": "96cb5822-c4f5-4a1e-9929-be74f52c4092",
            "createdAt": "2024-08-24T20:46:14.016Z"
        }
    ]
}