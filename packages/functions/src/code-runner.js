

self.onmessage = function(e) {
    // console.log(e.data)


    const testCode = (typeof e.data.test_code !== "undefined") ? e.data.test_code : '';
    const userId = e.data.user_id;
    const submissionId = e.data.submission_id;
    const runCode = e.data.user_code + ';' + testCode
    let answer = []
    try {
        console.log('running code')
        answer = eval(runCode)
        console.log(answer)
    } catch(e) {
        console.log('in the catch', e)
        myLogger.push(JSON.stringify("[ERROR] " + e.message))
        answer = [{
            pass: 'false',
            expected: "Non erroring code",
            recieved: "Erroring code"
        }]
    }

    if (typeof answer === 'undefined') {
        myLogger.push(JSON.stringify("[ERROR] Tests not run"))
        answer = [{
            pass: 'false',
            expected: "Passing test",
            recieved: "No response from test"
        }]
    }
    console.log(answer)

    console.log('Message received from main script');
    console.log('Posting message back to main script');
    self.postMessage(answer);
}


