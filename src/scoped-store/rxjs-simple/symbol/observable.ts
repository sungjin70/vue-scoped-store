declare global {
  interface SymbolConstructor {
    readonly observable: symbol
  }
}

// Lifted from https://github.com/ReactiveX/rxjs/blob/5.3.0/src/symbol/observable.ts
/** Symbol.observable or a string "@@observable". Used for interop */
export function getSymbolObservable(context: any) {
  let $$observable: any
  let Symbol = context.Symbol

  if (typeof Symbol === 'function') {
    if (Symbol.observable) {
      $$observable = Symbol.observable
    } else {
      $$observable = Symbol('observable')
      Symbol.observable = $$observable
    }
  } else {
    $$observable = '@@observable'
  }

  return $$observable
}

export const observable = getSymbolObservable(typeof window === 'undefined' ? {} : window)
