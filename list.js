import React from "react";

const List = props => {
  
  const {items, timerState, taskControl, removeTask, activeTask} = props; 
  const ulClass = items.length === 0 ? 'empty' : '';
  
  return (
    <ul className={ulClass}>
      {
        items.map(item => {
          const {id, name, sessionLen, breakLen, cycles} = item;
          const activeTsk = parseInt(activeTask)===id;
          const iconClass = activeTsk ? 'fa-stop' : 'fa-play';
          const liClass   = activeTsk ? 'active-task' : '';
          const disabledPlay = timerState==='stopped' ? activeTsk : !activeTsk
          const disabledRemove = timerState==='stopped' 
            ? activeTsk 
            : !activeTsk ? timerState==='running' : true
                      
          return (
              <li key={id} className={`task ${liClass}`}>
                <span className='name-task'>{name}</span>
                <span className='session-task'>{sessionLen}</span>
                <span className='break-task'>{breakLen}</span>
                <span className='cycles-task'>{cycles}</span>
                <button 
                  className='play_stop-task'
                  data-id={id}
                  data-info={`${sessionLen}-${breakLen}-${cycles}`}
                  onClick={e => taskControl(e)}
                  disabled={disabledPlay}>
                  <i className={`fa ${iconClass}`} />
                </button>
                <button 
                  className='remove-task' 
                  data-id={id}
                  onClick={e => removeTask(e)}
                  disabled={disabledRemove}>
                  <i className="fa fa-times"></i>
                </button>
              </li>
          )
        })
      }
    </ul>
  )
}

export default List;
