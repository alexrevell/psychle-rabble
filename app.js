
import Cycle from "@cycle/core"
import { h, makeDOMDriver } from "@cycle/dom"
import { makeHTTPDriver } from "@cycle/http"

function main(responses) {

  const USERS_URL = "http://jsonplaceholder.typicode.com/users/"

  let getRandomUser$ = responses.DOM.get(".get-random", "click").map(() => {
    let randomNum = Math.round(Math.random()*9)+1
    return {
      url: USERS_URL + randomNum.toString(),
      method: "GET"
    }
  })

  let user$ = responses.HTTP
    .filter( res$ => res$.request.url.indexOf(USERS_URL) === 0)
    .mergeAll()
    .map( res => res.body )
    .startWith(null)

  let vtree$ = user$.map( user =>
    h("div.users", [
      h("button.get-random", "Get random youzer"),
      user === null ? null : h("div.user-details", [
        h("h1.user-name", user.name),
        h("h2.user-email", user.email),
        h("a.user-website", { href: user.website }, user.website)
      ])
    ])
  )

  // DOM.get('input', 'change').map(ev => ev.target.value).filter(val => val.trim().length)
  let requests = {
    DOM: responses.DOM.get("input", "change")
      .map( ev => ev.target.checked )
      .startWith(false)
      .map(toggled =>
        h("div.sweet-toggledog", [
          h("input", {type: "checkbox"}), toggled ? "Chur! sweet!" : "toggle me again bro!",
          h("p", toggled ? "ON" : "OFF, bro! turn me on!")
        ])
      )
  }
  return {
    DOM: vtree$,
    HTTP: getRandomUser$
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver("#app"),
  HTTP: makeHTTPDriver()
})

