/** @jsx hJSX */
import Rx from 'rx'
import { hJSX, makeDOMDriver } from '@cycle/dom'
import Cycle from '@cycle/core'

function main(drivers) {
  let changeWeight$ = drivers.DOM.select('#weight').events('change').map(ev => ev.target.value)
  let changeHeight$ = drivers.DOM.select('#height').events('change').map(ev => ev.target.value)
  let state$ = Rx.Observable.combineLatest(changeWeight$.startWith(70), changeHeight$.startWith(170), (weight, height) => {
    let heightMeters = height * 0.01
    let bmi = Math.round(weight / (heightMeters * heightMeters))
    return { weight, height, bmi }
  })
  let state = state$.map(({weight, height, bmi}) => {weight, height, bmi} )

  return {
    DOM: state$.map(({weight, height, bmi}) =>
      <div>
        <div>
          Weight is {weight} kg
        </div>
        <div>
          <input id="weight" type="range" min="40" max="140" />
        </div>
        <div>
          Height is {height} cm
        </div>
        <div>
          <input id='height' type='range' min="140" max="210" />
        </div>
        <div>
        <h2> BMI is {bmi}</h2>
        </div>
      </div>
      )
  }
}

let drivers = {
  DOM: makeDOMDriver('#app-1')
}

Cycle.run(main, drivers)

