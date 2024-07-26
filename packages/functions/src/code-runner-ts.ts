import { EventBridgeEvent, Context } from "aws-lambda"
import Repository from '@repetition/core/code/Repository'

import { DynamoDBClient, BatchWriteItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const repository = new Repository

type TDetailType = string
type TDetail = {
  user_id: string,
  submission_id: string,
  user_code: string, 
  test_code:string
}

const handler = async  (event: EventBridgeEvent<TDetailType, TDetail>, context: Context) => {
  console.log('Will read from ', process.env.TABLE_NAME)
  let myLogger:(string| Uint8Array)[] = []

  if (!process.stdout._orig_write) process.stdout._orig_write = process.stdout.write;
  process.stdout.write = (data) => {
    myLogger.push(data);
    process.stdout._orig_write(data);
  }

  const input = event.detail;
  console.log(input)
  if (!input.user_id || !input.submission_id || !input.user_code || !input.test_code) {
      console.log('returning due to stuppid')
      return {
          statusCode: 400,
          body: {
              error: "Missing correct params"
          }
      }
  }

  // const req = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  // const body = await req.json()
  // console.log(body)

  const userId = event.detail.user_id;
  const submissionId = event.detail.submission_id;
  const runCode = event.detail.user_code + ';' + event.detail.test_code
  const answer = eval(runCode)
  console.log("answer", answer)
  const id = userId + "_" + submissionId
  const result = {
      id,
      answer,
      chicken: "bagahwwk!",
      foobar: myLogger
  }

  const saved = repository.create(result)


  const response = {
      statusCode: 200,
      body: {
          result
      }
  };

  return response;
};

export { handler }
