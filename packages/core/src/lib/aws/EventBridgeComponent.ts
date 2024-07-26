import { EventBridge } from '@aws-sdk/client-eventbridge'

const eventBridge = new EventBridge();

export default class EventBridgeComponent {


    async send<T>(detail: T) {
        const params = {
            Entries: [
            {
                Source: 'my.source',
                DetailType: 'myDetailType',
                Detail: JSON.stringify(detail), // Event detail payload
                EventBusName: 'CodeRunnerBus', // The name of your event bus
            },
            ],
        };
        
        console.log("Event bridge params", params)

        // Send the event
        const put = await eventBridge.putEvents(params, (err:any, data:any) => {
            console.log(err, data)
            if (err) {
                console.log('Error:', err);
            } else {
                console.log('Success:', data);
            }
        });


        console.log('the put', put)
        return put;
    }
}