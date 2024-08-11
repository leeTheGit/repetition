import { Context, APIGatewayProxyEvent } from "aws-lambda";

export class ValidationError extends Error {
    constructor(error:any, ...args:any) {
        super(error);
        if ("fieldErrors" in error) {
            let errorString = "";
            for (let field in error.fieldErrors) {
                errorString += `${field}: `;
                const ErrValues:any[] = [];
                for (let err of error.fieldErrors[field]) {
                    ErrValues.push(err);
                }
                errorString += ErrValues.join(", ") + ".  ";
            }
            this.message = errorString.trim();
        } else {
            this.message = error;
        }
    }
}

interface ExtendedContext extends Context {
    organisation: string;
}

export function handler(
  lambda: (evt: APIGatewayProxyEvent, context: ExtendedContext) => Promise<unknown>,
  requestMethod:string = "GET"
) {
    return async function (event: APIGatewayProxyEvent, context: ExtendedContext) {
        let body, statusCode;
        
        try {
            // Run the Lambda
            body = await lambda(event, context);
            // We may specify other values or metadata from the lambda other 
            // than the data, like links or pagination data.  In those cases,
            // we'll just spread the entire return value
            if (body && typeof body === "object" && "data" in body) {
                body = JSON.stringify({
                    "status": "success",
                    ...body 
                });
            } else {
                body = JSON.stringify({
                    "status": "success",
                    "data" : body
                });
            }
            statusCode = requestMethod === "POST" ? 201 : 200;
            
        } catch (error) {
            statusCode = 500;
            if (error instanceof ValidationError)  {
                body = JSON.stringify({
                    status: "error",
                    error: error.message
                });

            } else if (error instanceof Error) {
                body = JSON.stringify({
                    status: "error",
                    error: error.message
                });
            
            } else {
                body = {
                    error: error
                };
            }
        };
        

        // Return HTTP response
        return {
            body,
            statusCode,
            headers: {
                "Content-Type": "Application/json"
            }
        };
    };
}