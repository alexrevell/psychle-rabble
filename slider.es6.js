/** @jsx hJSX */

import Cycle from '@cycle/core'
import {h, hJSX, makeDOMDriver} from '@cycle/dom'

let renderWeightSlider = (weight) =>
  <div>
    {`Weight: ${weight} kg` }
    <div>
      <input id='weight' type='range' min={40} max={140} value={weight} />
    </div>
  </div>

let renderHeightSlider = (height) =>
  <div>
    {`Height: ${height} cm`}
    <div>
      <input id='height' type='range' min={140} max={210} value={height} />
    </div>
  </div>

let calculateBMI = (weight, height) => {
  let heightMeters = height * 0.01;
  return Math.round(weight / (heightMeters * heightMeters))
}

function model({changeWeight$, changeHeight$}) {
  return Cycle.Rx.Observable.combineLatest(
    changeWeight$.startWith(70),
    changeHeight$.startWith(170),
    (weight, height) =>
      ({weight, height, bmi: calculateBMI(weight, height)})
  )
}

function view(state$) {
  return state$.map(({weight, height, bmi}) =>
    <div>
      <h1>BMI measuring tool</h1>
      { renderWeightSlider(weight) }
      { renderHeightSlider(height) }
      <h2>BMI is {bmi}</h2>
    </div>
  )
}

function intent(DOM) {
  return {
    changeWeight$: DOM.select('#weight').events('input')
    .map(ev => ev.target.value),
    changeHeight$: DOM.select('#height').events('input')
    .map(ev => ev.target.value)
  }
}

function main({DOM}) {
  return { DOM: view(model(intent(DOM))) }
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app-1')
})
