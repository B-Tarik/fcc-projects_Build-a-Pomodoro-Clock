import React, { Component } from "react";
import TimerControls from "./timerControls";
import Timer from "./timer";
import SetDefault from "./setDefault";
import TaskTimer from "./taskTimer";

import './app.scss';

class App extends Component { 
  state = {
    sessionLength: 25,
    breakLength: 5,
    timerLabel: 'Session',
    timer: 1500,
    timerState: 'stopped',
    intervalId: '',
    progress: 0, 
    cycles: 4,
    currentCycle: 1,
    defaultSession: 25,
    defaultBreak: 5,
    defaultCycles: 4,
    activeTask: ''
  }


  timeLeft = () => {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return minutes + ':' + seconds;
  }
  
  
  setBreakLength = e => {
    let {breakLength, timerLabel} = this.state;
    breakLength = this.getLength(breakLength, e.currentTarget.value)
    if(breakLength === null) return null;
    if(timerLabel === 'Break') this.setState({breakLength, timer: breakLength*60})
    else this.setState({breakLength})
  }
  
  
  setSessionLength = e => {
    let {sessionLength, timerLabel} = this.state;
    sessionLength = this.getLength(sessionLength, e.currentTarget.value)
    if(sessionLength === null) return null;
    timerLabel === 'Session' 
      ? this.setState({sessionLength, timer: sessionLength*60})
      : this.setState({sessionLength})
  }
  
  
  getLength = (timeLength, val) => {
    const {timerState} = this.state;
    timeLength = val === '-' ? timeLength - 1 : timeLength + 1;
    if(!this.valideTime(timeLength) || timerState === 'running') return null;
    return timeLength
  }
  
  
  valideTime = time => {
    return time>0 && time<61
  }
  

  validateTime = time => {
    if(time<1) return 1
    if(time>60) return 60
    return time
  }
  
  
  validateCycle = cycle => {
    if(cycle<1) return 1
    if(cycle>20) return 20
    return cycle
  }
  
  
  timerControl = () => {
    const {timerState} = this.state;
    timerState === 'running'
      ? this.stopTimer()
      : this.startTimer()
  }
  
  
  startTimer = () => {
    this.setState({
      intervalId: setInterval(() => {
        this.decTimer()
        this.phaseControl()
        this.animateCircle();
      }, 1000),
      timerState: 'running'
    })
  }
  
  
  stopTimer = () => {
    const {intervalId} = this.state;
    clearInterval(intervalId);
    this.setState({timerState: 'stopped'})
  }
  

  decTimer = () => {
    this.setState({timer: this.state.timer-1})
  }
  
  
  phaseControl = () => {
    const {timer, timerLabel, intervalId, breakLength, sessionLength} = this.state;
    timer === 0 && this.buzzer(timer);
    if(timer >= 0) return 
    intervalId && clearInterval(intervalId);
    timerLabel === 'Session'
      ? this.switchTimer(breakLength * 60, 'Break')
      : (this.switchTimer(sessionLength * 60, 'Session'), this.updateCycle())
  }
  
  
  buzzer = timer => {
    this.audioBeep.currentTime = 0;
    this.audioBeep.play();
  }
  
  
  switchTimer = (num, str) => { 
    this.setState({
      timer: num,
      timerLabel: str,
      timerState: 'stopped'
    }, () => this.timerControl())
  }
  
  
  handleSessionChange = e => {
    const {timerState} = this.state;
    if(timerState === 'running') return
    this.setState({sessionLength: e.target.value})
  }
  
  
  handleBreakChange = e => {
    const {timerState} = this.state;
    if(timerState === 'running') return
    this.setState({ breakLength: e.target.value})
  }
  
  
  handleSessionSubmit = e => {
    e.preventDefault();
    let {sessionLength, timerLabel, timerState} = this.state;
    if(timerState === 'running') return
    sessionLength = this.validateTime(sessionLength)
    timerLabel === 'Session'
      ? this.setState({sessionLength, timer: sessionLength*60})
      : this.setState({sessionLength})
  }
  
  
  handleBreakSubmit = e => {
    e.preventDefault();
    const {breakLength, timerLabel, timerState} = this.state;
    if(timerState === 'running') return
    breakLength = this.validateTime(breakLength)
    timerLabel === 'Break'
      ? this.setState({breakLength, timer: breakLength*60})
      : this.setState({breakLength})
  }
  
  
  animateCircle = () => {
    const {timer, timerLabel, breakLength, sessionLength} = this.state;
    let progress = 0;

    // circle stroke-dasharray = 307px
    timerLabel === 'Session'
      ? progress = timer*307/(sessionLength*60)-307
      : progress = timer*307/(breakLength*60)-307
    this.setState({progress})
  } 
  
  
  reset = () => {
    const {intervalId, defaultSession, defaultBreak, defaultCycles} = this.state;
    intervalId && clearInterval(intervalId);
    this.setState({
      sessionLength: defaultSession,
      breakLength: defaultBreak,
      timerLabel: 'Session',
      timer: defaultSession*60,
      timerState: 'stopped',
      intervalId: '',
      progress: 0,
      cycles: defaultCycles,
      currentCycle: 1,
      activeTask: ''
    });
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }
  
  
  skip = () => {
    const {timerLabel} = this.state;
    this.audioSkip.pause();
    this.audioSkip.currentTime = 0;
    this.audioSkip.play()
    this.setState({timer: 0});
  }
  
  
  updateCycle = () => {
    const {currentCycle, cycles} = this.state;
    cycles < currentCycle+1
      ? this.reset()
      : this.setState({currentCycle: currentCycle+1});
  }
  
  
  handleSubmitDefault = (s, b, c) => {
    const {timerState} = this.state;
    if(timerState==='running') return
    s = this.validateTime(s);
    b = this.validateTime(b);
    c = this.validateCycle(c);
    this.setState({
      defaultSession: s,
      defaultBreak: b,
      defaultCycles: c
    }, () => this.reset());
  }
  
  
  playTask = (s, b, c, id) => {
    const {intervalId} = this.state;
    intervalId && clearInterval(intervalId);
    this.setState({
      sessionLength: s,
      breakLength: b,
      timerLabel: 'Session',
      timer: s*60,
      timerState: 'stopped',
      intervalId: '',
      progress: 0,
      cycles: c,
      currentCycle: 1,
      activeTask: id
    }, () => this.timerControl());
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }
  
  
  render() {
    const {breakLength, sessionLength, timerLabel, timerState, progress, currentCycle, cycles, defaultSession, defaultBreak, defaultCycles, activeTask} = this.state; 
    
    return (
      <div className="app">
        <div className="timer-controls">
          <TimerControls
            titleId="break-label"   
            decId="break-decrement"
            incId="break-increment" 
            lengthId="break-length"
            title="Break Length"    
            handleClick={this.setBreakLength}
            handleChange={this.handleBreakChange}
            handleSubmit={this.handleBreakSubmit}
            length={breakLength}
            timerState={timerState}/>
          
          <TimerControls
            titleId="session-label"   
            decId="session-decrement"
            incId="session-increment" 
            lengthId="session-length"
            title="Session Length"    
            handleClick={this.setSessionLength}
            handleChange={this.handleSessionChange}
            handleSubmit={this.handleSessionSubmit}
            length={sessionLength}
            timerState={timerState}/>
        </div>
        
        <Timer 
          timerLabel={timerLabel}
          timeLeft={this.timeLeft()}
          currentCycle={currentCycle}
          cycles={cycles}
          timerState={timerState}
          timerControl={this.timerControl}
          reset={this.reset}
          skip={this.skip}
          progress={progress}/>
        
        <SetDefault 
          defaultSession={defaultSession}
          defaultBreak={defaultBreak} 
          defaultCycles={defaultCycles} 
          timerState={timerState} 
          handleSubmit={this.handleSubmitDefault}/> 
        
        <TaskTimer 
          timerState={timerState}
          validateTime={this.validateTime}
          validateCycle={this.validateCycle}
          playTask={this.playTask}
          reset={this.reset}
          activeTask={activeTask}/>

        <audio id="beep" preload="auto" 
          src="https://vocaroo.com/media_command.php?media=s03nBPdhMX1g&command=download_mp3"
          ref={(audio) => { this.audioBeep = audio; }} />
        <audio preload="auto" 
          src="https://vocaroo.com/media_command.php?media=s0tGCLQdMxev&command=download_mp3"
          ref={(audioSkip) => { this.audioSkip = audioSkip; }} />
        
      </div> 
    )
  }
}

export default App;
