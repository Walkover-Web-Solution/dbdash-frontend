import React, { useEffect} from 'react';
import { useDrop, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import ItemTypes from "../ItemTypes";
import PropTypes from 'prop-types';
import  debounce  from 'lodash.debounce';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateColumnHeaders } from '../../store/table/tableThunk';
export default function DraggableHeader({ columns,index, reoder, key}){
  // const resize = columns?.isResizing ? columns : null
 const params = useParams();
 const dispatch = useDispatch();

  const resizeWidth = debounce(async()=>{
    dispatch(updateColumnHeaders({
        dbId:params?.dbId,
        tableName:params?.tableName,
        fieldName:columns?.id,
        columnId : columns?.id,
        // label:columns?.label,
        // fieldType:columns?.dataType,
        metaData:{width:columns?.width}
    }));
    
  },1000)

  useEffect(()=>{
    if(columns?.label != "check" && columns?.label != "+"){
      if(!columns.isResizing && !( columns?.width == "150")){
        resizeWidth();
      }
    }

  },[columns?.isResizing])

    const dropRef = React.useRef(null)
    const dragRef = React.useRef(null)
    const { id, label } = columns;
    const Header = label
    const [, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    drop: (monitor) => (
        reoder(monitor, index)
    )
  })
  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.COLUMN},
    begin: () => {
      return {
        id,
        index,
        header: Header
      };
    },

    collect: (monitor) => ({   
      isDragging: monitor.isDragging()
    })
  });
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  preview(drop(dropRef))
  drag(dragRef)

  return (

    <div className='td bg-white border-radius-md' key={key} {...columns.getHeaderProps()} ref={typeof columns.id !== 'number' ? dropRef : null} >
    {typeof columns.id !== 'number' && (<div style={{ cursor: 'move' }} ref={dragRef} id="resizable-width">
        {columns.render('Header')}
      </div>)
    }
    {typeof columns.id === 'number' && (<div style={{ cursor: 'move' }}>
        {columns.render('Header')}
      </div>)
    }
    {typeof columns.id !== 'number' && <div {...columns.getResizerProps()} className='resizer' />}
  </div>
);
}

DraggableHeader.propTypes = {
  columns: PropTypes.any,
  index: PropTypes.number,
  reoder: PropTypes.func,
  key: PropTypes.number,
}