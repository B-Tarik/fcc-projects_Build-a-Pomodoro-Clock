import React, { Component } from "react";
import List from "./list";

class TaskTimer extends Component {
  state = {
    name: '',
    sessionLen: '10',
    breakLen: '10',
    cycles: '5',
    id: localStorage.getItem("pomodoroId")*1 || 0,
    items: JSON.parse(localStorage.getItem("pomodoroTasks")) || []
  };

  
  addTask = e => {
    e.preventDefault();
    let {name, sessionLen, breakLen, cycles, id, items} = this.state;
    const {validateTime, validateCycle, timerState} = this.props;
    const reg = /^[\w+ ]+$/;
    if(!(reg.test(name) && timerState==='stopped')) return
    sessionLen = validateTime(sessionLen)
    breakLen = validateTime(breakLen)
    cycles = validateCycle(cycles)
    const tmp = [...items, {name, sessionLen, breakLen, cycles, id}];
    this.setState({
      name: '',
      sessionLen: '10',
      breakLen: '10',
      cycles: '5',
      id: id+1,
      items: tmp
    });
    localStorage.setItem("pomodoroTasks", JSON.stringify(tmp));
    localStorage.setItem("pomodoroId", id+1);
  }
  
  
  removeTask = e => {
    const {items} = this.state;
    const id = e.currentTarget.dataset.id*1;
    const tmp = items.filter(elm => elm.id !== id)
    this.setState({items: tmp})
    localStorage.setItem("pomodoroTasks", JSON.stringify(tmp));
    tmp.length === 0 && 
      (localStorage.removeItem('pomodoroTasks'),
       localStorage.removeItem('pomodoroId'))
  }
  
  
  taskControl = e => {
    e.currentTarget.parentNode.classList.contains('active-task')
      ? this.stopTask(e)
      : this.playTask(e)
  }
  
  
  playTask = e => {
    const {timerState, playTask} = this.props;
    if(timerState==='running') return
    const t = e.currentTarget.dataset
    const [s, b, c] = t.info.split`-`;
    const id = t.id;
    playTask(s, b, c, id)
  }
  
  
  stopTask = e => {
    const {timerState, reset} = this.props;
    if(timerState==='stopped') return
    reset();
  }
  

  render() {
    const {name, sessionLen, breakLen, cycles, items, reset} = this.state;
    const {timerState, activeTask} = this.props;
    return (
      <div className='task-timer'>

        <List 
          items={items} 
          timerState={timerState} 
          taskControl={this.taskControl}
          removeTask={this.removeTask}
          reset={reset}
          activeTask={activeTask}/>

        <form onSubmit={this.addTask}>
          <label className='name'>Add Task
            <input 
              type="text"
              name='name'
              value={name}
              placeholder='Task name'
              minLength='1'
              maxLength='50'
              pattern='^[\w+ ]+$'
              title="Use only numbers letters underscores"
              required
              onChange={e => this.setState({[e.target.name]: e.target.value})}
              disabled={timerState==='running'} />
          </label>
          <label>Session
            <input 
              type="number" 
              name='sessionLen'
              value={sessionLen}
              min="1"
              max="60"
              required
              onChange={e => this.setState({[e.target.name]: e.target.value})}
              disabled={timerState==='running'}/>
          </label>
          <label>Break
            <input 
              type="number" 
              name='breakLen'
              value={breakLen}
              min="1"
              max="60"
              required
              onChange={e => this.setState({[e.target.name]: e.target.value})}
              disabled={timerState==='running'}/>
          </label>
          <label>Cycles
            <input 
              type="number" 
              name='cycles'
              value={cycles}
              min="1"
              max="20"
              required
              onChange={e => this.setState({[e.target.name]: e.target.value})}
              disabled={timerState==='running'}/>
          </label>
          <input 
            type="submit" 
            value="Add"
            disabled={timerState==='running'}
            />
        </form>
        
      </div>
    );
  }
}

export default TaskTimer;
