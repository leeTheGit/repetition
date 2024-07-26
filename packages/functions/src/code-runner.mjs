import { DynamoDBClient, PutItemCommand, BatchWriteItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-2" });

const handler = async (event) => {
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
        chicken: "bagahwwk!"
    }


    const saveData = {
        TableName: process.env.TABLE_NAME,
        Item: {
            id: {
                S: id,
            },
            answer: {
                S: JSON.stringify(answer)
            },
            chicken: {
                S: "whoodoo!"
            }

        }
    }
    
    const saveCommand = new PutItemCommand(saveData)

    try {
        const save = await client.send( saveCommand )
        console.log("saved to dynamo", save)


    } catch (e) {
        console.log('[ERROR]', e)
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

