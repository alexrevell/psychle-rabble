import Rx from 'rx'
import Cycle from '@cycle/core'
import {h, makeDOMDriver} from '@cycle/dom'
import React from 'react'

class Slider extends React.Component {
  constructor (){
    super()
  }

  render () {
    let changeWeight$ = Rx.Observable.fromEvent('#weight', 'change').map(ev => ev.target.value)
    let changeHeight$ = Rx.Observable.fromEvent('#height', 'change').map(ev => ev.target.value)
    let state$ = Rx.Observable.combineLatest(changeWeight$.startWith(70), changeHeight$.startWith(170), (weight, height) => {
      let heightMeters = height * 0.01
      let bmi = Math.round(weight / (heightMeters * heightMeters))
      return { weight, height, bmi }
    })
    let state = state$.map(({weight, height, bmi}) => {weight, height, bmi} )

    return <div>
      <div>
        Weight is {state.weight} kg
      </div>
      <div>
        <input id="weight" type="range" min="40" max="140" />
      </div>
      <div>
        Height is {state.height} cm
      </div>
      <div>
        <input id='height' type='range' min="140" max="210" />
      </div>
      <div>
      <h2> BMI is {state.bmi}</h2>
      </div>
    </div>
  }
}
React.render(<Slider />, document.getElementById('app-1'))
