import WebSocketClient from 'rtlayer-client'
var client,id, handleChange;

export function initConn(_id, _handleChange) {
    client = new WebSocketClient(process.env.REACT_APP_RTLAYER_OID, process.env.REACT_APP_RTLAYER_SID);
    id = _id;
    handleChange = _handleChange;
    client.on('open', subscribe)
    client.on('message', handleMessage)
}
export function resetConn(id){
    client.unsubscribe(id);
}
const subscribe = () => {
    client.subscribe(id);
}
const handleMessage = (message) => {
    let response = JSON.parse(message);
    if (response.sessionId === sessionStorage.getItem('sessionId')) return;
    switch (response.operation) {
        case 'row/insert': {
            handleChange("table/addMultipleRows/fulfilled", response.data);
            break;
        }
        case 'row/update': {
            handleChange( "table/updateCells/fulfilled", {
                indexIdMapping: response.meta,
                newData: response.data,
            });
            break;
        }
        case 'row/delete': {
            handleChange( "table/deleteRows/fulfilled", response.meta)
            break;
        }
        // not fully implemented
        case 'field/insert': {
            handleChange("table/addColumsToLeft/fulfilled",
                response.data
            );
            break;
        }
        case 'field/update': {
            handleChange( "table/updateColumnHeaders/fulfilled", {
                indexIdMapping: response.meta,
                newData: response.data,
            });
            break;
        }
        case 'field/delete': {
            handleChange( "table/deleteColumns/fulfilled", response.meta)
            break;
        }
    }
}