import { handler } from "../src/code-runner.mjs";

console.log('reswting')
handler({
    detail : {
        user_id: "202039",
        submission_id: "abc",
        user_code: `class Solution {
                hasCycle(a, b) {
                    return a + b
                }
            }`,
        test_code: `
            (function() {
                const results = []; 
                let response;
                const test0 = new Solution();
                const answer0 = test0.hasCycle(5,12);
                const correctAnswer0 = 17;
                response = {
                    pass: 'false',
                    expected: correctAnswer0,
                    recieved: answer0
                };
                if (answer0 === correctAnswer0) {
                    response.pass = 'true';
                } 
                results.push(response);

                const test1 = new Solution();
                const answer1 = test1.hasCycle(4,2,1);
                const correctAnswer1 = 7;
                response = {
                    pass: 'false',
                    expected: correctAnswer1,
                    recieved: answer1
                };
                if (answer1 === correctAnswer1) {
                    response.pass = 'true';
                } 
                results.push(response);
                
                return results
            })()
        `
    }
})




