import React from "react";

const TimerControls = props => {

  const {titleId, title, decId, handleClick, handleChange, handleSubmit, lengthId, length, incId, timerState} = props;

  return (
    <div className="length-control">
      <div id={titleId}>{title}</div>
      <div className="controls">
        <button 
          id={decId}
          className={timerState==='stopped'?'':'transform-btn'} 
          value="-" 
          onClick={handleClick}>
          <i className="fa fa-minus-circle"/>
        </button>
        <div id={lengthId} className="number">{length}</div>
        <form onSubmit={e => handleSubmit(e, lengthId)}>
          <input 
            type="number" 
            name={lengthId}
            value={length}
            min="1"
            max="60"
            required
            onChange={e => handleChange(e, lengthId)}
            onBlur={e => handleSubmit(e, lengthId)}
            disabled={timerState==='running'}/>
        </form>
        <button 
          id={incId}
          className={timerState==='stopped'?'':'transform-btn'} 
          value="+" 
          onClick={handleClick}>
          <i className="fa fa-plus-circle"/>
        </button>
      </div>
    </div>
  )
};

export default TimerControls;
