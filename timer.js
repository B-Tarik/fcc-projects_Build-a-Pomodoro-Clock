import React from "react";

const Timer = props => {
  
  const {timerLabel, timeLeft, currentCycle, cycles, timerState, timerControl, reset, skip, progress} = props;
  const circleClass = timerLabel === 'Session' ? 'session-pie' : 'break-pie';
  const state = timerState==='stopped';
  
  return (
    <div className="timer">
      <div className="timer-wrapper">
        <div id='timer-label'>{timerLabel}</div>
        <div id='time-left'>{timeLeft}</div>
        <div id="cycle">{currentCycle}/{cycles}</div>
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="49" 
            id="circle" 
            className={`circle ${circleClass}`}
            style={{strokeDashoffset: progress}}/>
        </svg>
        <button id="start_stop" onClick={timerControl}>
          <i className={state ? 'fa fa-play' : 'fa fa-pause'} />
        </button>
        <div 
          className="pulse1"
          style={{animationPlayState: state ? 'paused' : 'running'}}>
        </div>
        <div className="pulse2"></div>
        <div className='gooey-wrapper'>
          <button 
            id="reset" 
            onClick={reset}
            style={{transform: state ? 'scale(1)' : 'translate(-35px, -55px) scale(0.2)'}}>
            <i className="fa fa-stop"/>
          </button>
          <button 
            id="skip" 
            onClick={skip}
            style={{transform: state ? 'translate(21px, -37px) scale(0.2)' : 'scale(1)'}}>
            <i className="fa fa-play"/>
            <i className="fa fa-play"/>
          </button>
          <div 
            className='gooey-bg'
            style={{transform: state ? 'scale(0.85)' : 'scale(0.94)'}}>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timer;
