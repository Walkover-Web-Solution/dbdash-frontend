import WebSocketClient from 'rtlayer-client'
var client,id, handleChange;
import  {store}  from '.././.././../store';
import { resetColumnHeaders } from '../../../store/table/tableThunk';
export function initConn(_id, _handleChange) {
    id = _id;
    handleChange = _handleChange;
    if(client){
        subscribe();
        return;
    }
    client = new WebSocketClient(process.env.REACT_APP_RTLAYER_OID, process.env.REACT_APP_RTLAYER_SID);
    client.on('open', subscribe)
    client.on('message', handleMessage)
}
export function resetConn(id){
    client.unsubscribe(id);
}
const subscribe = () => {
    client.subscribe(id);
}
const handleMessage = async (message) => {
    let response = JSON.parse(message);
    const sessionId = response.sessionId;
    if (!sessionId || sessionId === sessionStorage.getItem('sessionId')) return;
    const operation = response.operation;
    switch (response.operation) {
        case 'row/insert': {
            handleChange("table/addMultipleRows/fulfilled", response.data);
            break;
        }
        case 'row/file/add':
        case 'row/update': {
            handleChange( "table/updateCells/fulfilled", {
                indexIdMapping: response.meta,
                newData: response.data,
                dataTypes : operation === 'row/file/add' ? 'file' : undefined,
            });
            break;
        }
        case 'row/delete': {
            handleChange( "table/deleteRows/fulfilled", response.meta)
            break;
        }
        case 'field/add': {
            const {_id: dbId, tables, org_id : orgId} = response.data.data;
            handleChange("tables/setAllTablesData", {dbId, tables, orgId}, true);
            break;
        }
        case 'field/update':{
            const {_id: dbId, tables, org_id : orgId} = response.data;
            const {tableId} = response.meta;
            const fields = tables?.[tableId]?.fields;
            handleChange("tables/setAllTablesData", {dbId, tables, orgId});
            store.dispatch(resetColumnHeaders({dbId, tableId, fields}))
            break;
        }
        case 'field/delete':{
            const {_id: dbId, tables, org_id : orgId} = response.data.data;
            handleChange("tables/setAllTablesData", {dbId, tables, orgId}, true);
            break;
        }
    }
}