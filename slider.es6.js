import Rx from 'rx'
import Cycle from '@cycle/core'
import {h, makeDOMDriver} from '@cycle/dom'

function main({DOM}) {
  let changeWeight$ = DOM.select('#weight').events('input')
    .map(ev => ev.target.value);
  let changeHeight$ = DOM.select('#height').events('input')
    .map(ev => ev.target.value);
  let bmi$ = Rx.Observable.combineLatest(
    changeWeight$.startWith(70),
    changeHeight$.startWith(170),
    (weight, height) => {
      let heightMeters = height * 0.01;
      return Math.round(weight / (heightMeters * heightMeters));
    }
  );

  return {
    DOM: bmi$.map(bmi =>
      h('div', [
        h('div', [
          'Weight ___kg',
          h('input#weight', {type: 'range', min: 40, max: 140})
        ]),
        h('div', [
          'Height ___cm',
          h('input#height', {type: 'range', min: 140, max: 210})
        ]),
        h('h2', 'BMI is ' + bmi)
      ])
    )
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app.1')
});
