import {SchedulerLike} from './types'
import {Observable} from './Observable'
import {Subscriber} from './Subscriber'

/**
 * Creates an Observable that emits no items to the Observer and immediately
 * emits an error notification.
 *
 * <span class="informal">Just emits 'error', and nothing else.
 * </span>
 *
 * ![](throw.png)
 *
 * This static operator is useful for creating a simple Observable that only
 * emits the error notification. It can be used for composing with other
 * Observables, such as in a {@link mergeMap}.
 *
 * ## Examples
 * ### Emit the number 7, then emit an error
 * ```javascript
 * import { throwError, concat, of } from 'rxjs';
 *
 * const result = concat(of(7), throwError(new Error('oops!')));
 * result.subscribe(x => console.log(x), e => console.error(e));
 * ```javascript
 *
 * ### Map and flatten numbers to the sequence 'a', 'b', 'c', but throw an error for 13
 * ```javascript
 * import { throwError, interval, of } from 'rxjs';
 * import { mergeMap } from 'rxjs/operators';
 *
 * interval(1000).pipe(
 *   mergeMap(x => x === 13
 *     ? throwError('Thirteens are bad')
 *     : of('a', 'b', 'c')
 *   ),
 * ).subscribe(x => console.log(x), e => console.error(e));
 * ```
 * @see {@link Observable}
 * @see {@link empty}
 * @see {@link never}
 * @see {@link of}
 *
 * @param {any} error The particular Error to pass to the error notification.
 * @param {SchedulerLike} [scheduler] A {@link SchedulerLike} to use for scheduling
 * the emission of the error notification.
 * @return {Observable} An error Observable: emits only the error notification
 * using the given error argument.
 * @static true
 * @name throw
 * @owner Observable
 */
export function throwError(
  error: any,
  scheduler?: SchedulerLike
): Observable<never> {
  if (!scheduler) {
    return new Observable(subscriber => subscriber.error(error))
  } else {
    return new Observable(subscriber =>
      scheduler.schedule(dispatch as any, 0, {error, subscriber})
    )
  }
}

interface DispatchArg {
  error: any
  subscriber: Subscriber<any>
}

function dispatch({error, subscriber}: DispatchArg) {
  subscriber.error(error)
}
