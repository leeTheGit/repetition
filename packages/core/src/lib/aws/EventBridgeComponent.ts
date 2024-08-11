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
        
        // console.log("[EVENT BRIDGE] params", params)

        // Send the event
        try {
            const put = await eventBridge.putEvents(params);
            return put;
        } catch(e) {
            console.log("[EVENT BRIDGE]", e)
            
        }

        return false
    }
}