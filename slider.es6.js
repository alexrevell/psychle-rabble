import Cycle from '@cycle/core'
import {h, makeDOMDriver} from '@cycle/dom'

function renderWeightSlider(weight) {
  return h('div', [
    'Weight ' + weight + 'kg', h('div', [
      h('input#weight', {type: 'range', min: 40, max: 140, value: weight})
    ])
  ])
}

function renderHeightSlider(height) {
  return h('div', [
    'Height ' + height + 'cm', h('div', [
      h('input#height', {type: 'range', min: 140, max: 210, value: height})
    ])
  ]);
}

function calculateBMI(weight, height) {
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
    h('div', [
      renderWeightSlider(weight),
      renderHeightSlider(height),
      h('h2', 'BMI is ' + bmi)
    ])
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
