import {
  OperatorFunction,
  PartialObserver,
  Subscribable,
  TeardownLogic
} from './types'
import {Operator} from './Operator'
import {Subscriber} from './Subscriber'
import {Subscription} from './Subscription'
import {observable as Symbol_observable} from './symbol/observable'
import {pipeFromArray} from './util/pipe'
import {toSubscriber} from './util/toSubscriber'

/**
 * A representation of any set of values over any amount of time. This is the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
export class Observable<T> implements Subscribable<T> {
  /** Internal implementation detail, do not use directly. */
  public _isScalar: boolean = false

  /** @deprecated This is an internal implementation detail, do not use. */
  source!: Observable<any>

  /** @deprecated This is an internal implementation detail, do not use. */
  operator!: Operator<any, T>

  /**
   * @constructor
   * @param {Function} subscribe the function that is called when the Observable is
   * initially subscribed to. This function is given a Subscriber, to which new values
   * can be `next`ed, or an `error` method can be called to raise an error, or
   * `complete` can be called to notify of a successful completion.
   */
  constructor(
    subscribe?: (
      this: Observable<T>,
      subscriber: Subscriber<T>
    ) => TeardownLogic
  ) {
    if (subscribe) {
      this._subscribe = subscribe
    }
  }

  /**
   * Creates a new Observable, with this Observable as the source, and the passed
   * operator defined as the new observable's operator.
   * @method lift
   * @param {Operator} operator the operator defining the operation to take on the observable
   * @return {Observable} a new observable with the Operator applied
   */
  lift<R>(operator: Operator<T, R>): Observable<R> {
    const observable = new Observable<R>()
    observable.source = this
    observable.operator = operator
    return observable
  }

  subscribe(observer?: PartialObserver<T>): Subscription
  subscribe(
    next?: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription
  subscribe(
    observerOrNext?: PartialObserver<T> | ((value: T) => void),
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    const {operator} = this
    const sink = toSubscriber(observerOrNext, error, complete)

    if (operator) {
      operator.call(sink, this.source)
    } else {
      sink.add((this.source as any) || this._trySubscribe(sink))
    }

    return sink
  }

  /** @deprecated This is an internal implementation detail, do not use. */
  _trySubscribe(sink: Subscriber<T>): TeardownLogic {
    try {
      return this._subscribe(sink)
    } catch (err) {
      sink.error(err)
    }
  }

  /**
   * @method forEach
   * @param {Function} next a handler for each value emitted by the observable
   * @param {PromiseConstructor} [promiseCtor] a constructor function used to instantiate the Promise
   * @return {Promise} a promise that either resolves on observable completion or
   *  rejects with the handled error
   */
  forEach(
    next: (value: T) => void,
    promiseCtor?: PromiseConstructorLike
  ): Promise<void> {
    promiseCtor = getPromiseCtor(promiseCtor)

    return new promiseCtor<void>((resolve, reject) => {
      // Must be declared in a separate statement to avoid a RefernceError when
      // accessing subscription below in the closure due to Temporal Dead Zone.
      let subscription: Subscription
      subscription = this.subscribe(
        value => {
          try {
            next(value)
          } catch (err) {
            reject(err)
            if (subscription) {
              subscription.unsubscribe()
            }
          }
        },
        reject,
        resolve
      )
    }) as Promise<void>
  }

  /** @deprecated This is an internal implementation detail, do not use. */
  _subscribe(subscriber: Subscriber<any>): TeardownLogic {
    const {source} = this
    return source && source.subscribe(subscriber)
  }

  /**
   * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
   * @method Symbol.observable
   * @return {Observable} this instance of the observable
   */
  [Symbol_observable]() {
    return this
  }

  pipe(): Observable<T>
  pipe<A>(op1: OperatorFunction<T, A>): Observable<A>
  pipe<A, B>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>
  ): Observable<B>
  pipe<A, B, C>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>
  ): Observable<C>
  pipe<A, B, C, D>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>
  ): Observable<D>
  pipe<A, B, C, D, E>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>
  ): Observable<E>
  pipe<A, B, C, D, E, F>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>
  ): Observable<F>
  pipe<A, B, C, D, E, F, G>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>
  ): Observable<G>
  pipe<A, B, C, D, E, F, G, H>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>,
    op8: OperatorFunction<G, H>
  ): Observable<H>
  pipe<A, B, C, D, E, F, G, H, I>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>,
    op8: OperatorFunction<G, H>,
    op9: OperatorFunction<H, I>
  ): Observable<I>
  pipe<A, B, C, D, E, F, G, H, I>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>,
    op8: OperatorFunction<G, H>,
    op9: OperatorFunction<H, I>,
    ...operations: OperatorFunction<any, any>[]
  ): Observable<{}>

  /**
   * Used to stitch together functional operators into a chain.
   * @method pipe
   * @return {Observable} the Observable result of all of the operators having
   * been called in the order they were passed in.
   *
   * ### Example
   * ```javascript
   * import { map, filter, scan } from 'rxjs/operators';
   *
   * Rx.Observable.interval(1000)
   *   .pipe(
   *     filter(x => x % 2 === 0),
   *     map(x => x + x),
   *     scan((acc, x) => acc + x)
   *   )
   *   .subscribe(x => console.log(x))
   * ```
   */
  pipe(...operations: OperatorFunction<any, any>[]): Observable<any> {
    if (operations.length === 0) {
      return this as any
    }

    return pipeFromArray(operations)(this as any) as any
  }

  toPromise<T>(this: Observable<T>): Promise<T>
  toPromise<T>(this: Observable<T>, PromiseCtor: typeof Promise): Promise<T>
  toPromise<T>(
    this: Observable<T>,
    PromiseCtor: PromiseConstructorLike
  ): Promise<T>

  toPromise(promiseCtor?: PromiseConstructorLike): Promise<T> {
    promiseCtor = getPromiseCtor(promiseCtor)

    return new promiseCtor((resolve, reject) => {
      let value: any
      this.subscribe(
        (x: T) => (value = x),
        (err: any) => reject(err),
        () => resolve(value)
      )
    }) as Promise<T>
  }
}

/**
 * Decides between a passed promise constructor from consuming code,
 * A default configured promise constructor, and the native promise
 * constructor and returns it. If nothing can be found, it will throw
 * an error.
 * @param promiseCtor The optional promise constructor to passed by consuming code
 */
function getPromiseCtor(promiseCtor: PromiseConstructorLike | undefined) {
  if (!promiseCtor) {
    promiseCtor = Promise
  }

  if (!promiseCtor) {
    throw new Error('no Promise impl found')
  }

  return promiseCtor
}
