import { EventBridgeEvent, Context } from "aws-lambda"
import Repository from '@repetition/core/code/Repository'
import util from 'node:util'

const repository = new Repository

type TDetailType = string
type TDetail = {
  user_id: string,
  submission_id: string,
  user_code: string, 
  test_code:string
}

let myLogger:(string| Uint8Array)[] = []
// var console=(function(oldCons){
//   return {
//       log: function(args:any){
//           oldCons.log.apply(args)
//           myLogger.push(args);
//           // Your code
//       },
//       info: function (args:any) {
//           oldCons.info.apply(args)
//           // Your code
//       },
//       warn: function (args:any) {
//           oldCons.warn.apply(args)
//           // Your code
//       },
//       error: function (args:any) {
//           oldCons.error.apply(args)
//           // Your code
//       }
//   };
// }(console));


const handler = async  (event: EventBridgeEvent<TDetailType, TDetail>, context: Context) => {
  console.log('[RUNNER] handler')
  myLogger = []


  //@ts-ignore
  if (!process.stdout._orig_write) {
    //@ts-ignore
    process.stdout._orig_write = process.stdout.write;
  }
  process.stdout.write = (data, ...optionalParams) => {
    const print:any = [data]
    if (optionalParams.length > 0) {
      print.push(...optionalParams)
    }
    myLogger.push(JSON.stringify(util.format.apply(this, print)));
      //@ts-ignore
    return process.stdout._orig_write(util.format.apply(this, print) + '\n');
  }


  const input = event.detail;
  console.log("[RUNNER]", input)
  if (!input.user_id || !input.submission_id || !input.user_code || !input.test_code) {
      return {
          statusCode: 400,
          body: {
              error: "Missing correct params"
          }
      }
  }

  const userId = event.detail.user_id;
  const submissionId = event.detail.submission_id;
  const runCode = event.detail.user_code + ';' + event.detail.test_code
  let answer;
  try {
    answer = eval(runCode)
  } catch(e:any) {
    // myLogger.push(JSON.stringify(util.format.apply(this, print)));
    myLogger.push(JSON.stringify("[ERROR] " + e.message))
    answer = [{
        pass: 'false',
        expected: "Non erroring code",
        recieved: "Error in code"
      }]
  }

  const id = userId + "_" + submissionId
  const result = {
      id,
      answer: JSON.stringify(answer),
      submittedAt: Date.now(),
      logs: JSON.stringify(myLogger),
      globalTTL: Date.now() + 1000
  }

  if( process.env.NODE_ENV !== 'development') {
    const saved = await repository.create(result)
  }


  const response = {
      statusCode: 200,
      body: {
          result
      }
  };
  return response;
};

export { handler }
