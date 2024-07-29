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
  // console.log(event);
  // console.log('[RUNNER] Will read from ', process.env.TABLE_NAME || 'dynamo')
  myLogger = []


  //@ts-ignore
  if (!process.stdout._orig_write) {
    //@ts-ignore
    process.stdout._orig_write = process.stdout.write;
  }
  process.stdout.write = (data) => {
    myLogger.push(JSON.stringify(data));
      //@ts-ignore
    return process.stdout._orig_write(util.format.apply(this, [data]) + '\n');
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
  const answer = eval(runCode)
  const id = userId + "_" + submissionId
  const result = {
      id,
      answer: JSON.stringify(answer),
      submittedAt: Date.now(),
      logs: JSON.stringify(myLogger),
      GlobalTTL: Date.now()
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
