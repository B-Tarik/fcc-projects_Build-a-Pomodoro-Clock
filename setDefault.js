import React, { Component } from "react";

class SetDefault extends Component {
  state = {
    sessionLen: this.props.defaultSession,
    breakLen: this.props.defaultBreak,
    cycles: this.props.defaultCycles
  }


  handleSubmit = e => {
    const {sessionLen, breakLen, cycles} = this.state;
    this.props.handleSubmit(sessionLen, breakLen, cycles)
    e.preventDefault()
  }  
  

  render() {
    const {sessionLen, breakLen, cycles} = this.state;
    const {timerState} = this.props;
    const disabled = timerState==='running';

    return (
      <div className='set-default'>
        <p>Set default</p>
        <form onSubmit={e => this.handleSubmit(e)}>
          <label>Session
            <input 
              type="number" 
              name='sessionLen'
              value={sessionLen}
              min="1"
              max="60"
              required
              onChange={e => this.setState({[e.target.name]: e.target.value})}
              disabled={disabled}/>
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
              disabled={disabled}/>
          </label>
          <label>Cycles
            <input 
              type="number" 
              name='cycles'
              value={cycles}
              min="1"
              max="10"
              required
              onChange={e => this.setState({[e.target.name]: e.target.value})}
              disabled={disabled}/>
          </label>
          <input 
            type="submit" 
            value="Save"
            disabled={disabled}/>
        </form>
      </div>
    )
  }
}

export default SetDefault;
