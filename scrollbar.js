/**
 * Copyright 2019 Emil Stoyanov
 * Licence MIT
 */

import React from 'react'

export default class TinyScrollbarY extends React.Component {

  constructor(props) {
    super(props)
    this.sbRef = React.createRef()
    this.defaultOptions = {
      width: '6px',
      color: '#000000',
      opacity: 0.5,
      radius: '6px',
      autohide: false, 
      wheelSpeed: 1
    }
    this.opt = { ...this.defaultOptions, ...props }
    this.dragmode = false
    this.state = {    
      elHeight: 0,
      elScrollHeight: 0,
      sb_height: 0,
      sb_top: 0,
      sb_maxtop: 0,
      dif: 0,
    }
  }

  componentDidMount() {
    let self = this
    this.el = this.sbRef.current.parentNode
    this.SB = this.sbRef.current
    this.calculate()
    this.el.addEventListener("wheel", function(event) { self.mouseWheel(event) })
    this.el.addEventListener("mousemove", function(event) { self.mouseMove(event) })
    document.addEventListener('mouseup', function() { self.mouseUp() })
    if (this.opt.autohide) {
      this.el.addEventListener('mouseenter', function() { 
        self.SB.style.opacity = self.opt.opacity
      })
      this.el.addEventListener('mouseleave', function() { 
        self.SB.style.opacity = 0
      })
    }
  }

  calculate() {
    let elHeight = this.el.clientHeight,
        elScrollHeight = this.el.scrollHeight,
        dif = elHeight * 100 / elScrollHeight,
        sb_height = elHeight * dif / 100,
        factor = elScrollHeight / elHeight,
        sb_maxtop = elScrollHeight - sb_height,
        sb_top =  this.el.scrollTop + this.el.scrollTop/factor

    this.setState({
      ...this.state,
      elHeight: elHeight,
      elScrollHeight: elScrollHeight,
      dif: dif,
      sb_height: sb_height,
      sb_maxtop: sb_maxtop,
      sb_top: sb_top,
      factor: factor
    })
  }

  mouseDown = () => {
    this.dragmode = true;
    this.el.classList.add('noselect');
  }

  mouseUp = () => {
    this.dragmode = false;
    this.el.classList.remove('noselect');
  }

  mouseMove = (event) => {
    if (this.dragmode) {
      let pos = this.el.scrollTop + event.movementY*this.state.factor, sbPos = pos + pos/this.state.factor, newTop = 0
      this.el.scrollTop = pos
      if (event.movementY<0) { 
        newTop =  Math.max(0,sbPos)
      } else {
        newTop = Math.min(this.state.sb_maxtop,sbPos)
      }
      this.setState({
        ...this.state,
        sb_top: newTop
      })
    }
  }

  mouseWheel = (event) => {
    let pos = this.el.scrollTop + (this.opt.wheelSpeed*event.deltaY)*this.state.factor, sbPos = pos + pos/this.state.factor, newTop = 0
    this.el.scrollTop = pos
    if (event.deltaY<0) { 
      newTop =  Math.max(0,sbPos)
    } else {
      newTop = Math.min(this.state.sb_maxtop,sbPos)
    }
    this.setState({
      ...this.state,
      sb_top: newTop
    })
  }

  render () {
    let opacity = (!this.opt.autohide) ? this.opt.opacity : 0;
    return (
      <div 
        ref={this.sbRef}
        style={{
          position: 'absolute',
          right: 0,
          top: this.state.sb_top,
          height: this.state.sb_height,
          width:this.opt.width,
          background: this.opt.color,
          opacity: opacity,
          borderRadius: this.opt.radius      
        }}
        onMouseDown={this.mouseDown}
        onMouseUp={this.mouseUp}
        onMouseMove={this.mouseMove}            
      ></div>
    )
  }
}