import { Operator } from './Operator'
import { Observable } from './Observable'
import { Subscriber } from './Subscriber'
import { Subscription } from './Subscription'
import { Observer, SubscriptionLike, TeardownLogic } from './types'
import { ObjectUnsubscribedError } from './util/ObjectUnsubscribedError'
import { SubjectSubscription } from './SubjectSubscription'
import { rxSubscriber as rxSubscriberSymbol } from './symbol/rxSubscriber'

/**
 * @class SubjectSubscriber<T>
 */
export class SubjectSubscriber<T> extends Subscriber<T> {
  constructor(protected destination: Subject<T>) {
    super(destination);
  }
}

/**
 * @class Subject<T>
 */
export class Subject<T> extends Observable<T> implements SubscriptionLike {

  [rxSubscriberSymbol]() {
    return new SubjectSubscriber(this);
  }

  observers: Observer<T>[] | null = [];

  closed = false;

  isStopped = false;

  hasError = false;

  thrownError: any = null;

  constructor() {
    super();
  }

  /**@nocollapse */
  static create: Function = <T>(destination: Observer<T>, source: Observable<T>): AnonymousSubject<T> => {
    return new AnonymousSubject<T>(destination, source);
  }

  lift<R>(operator: Operator<T, R>): Observable<R> {
    const subject = new AnonymousSubject(this, this);
    subject.operator = <any>operator;
    return <any>subject;
  }

  next(value?: T) {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
    if (!this.isStopped) {
      const { observers } = this;
      const len = observers.length;
      const copy = observers.slice();
      for (let i = 0; i < len; i++) {
        copy[i].next(value);
      }
    }
  }

  error(err: any) {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
    this.hasError = true;
    this.thrownError = err;
    this.isStopped = true;
    const { observers } = this;
    const len = observers.length;

    const copy = observers.slice();
    for (let i = 0; i < len; i++) {
      copy[i].error(err);
    }
    this.observers.length = 0;
  }

  complete() {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
    this.isStopped = true;
    const { observers } = this;
    const len = observers.length;
    const copy = observers.slice();
    for (let i = 0; i < len; i++) {
      copy[i].complete();
    }
    this.observers.length = 0;
  }

  unsubscribe() {
    this.isStopped = true;
    this.closed = true;
    this.observers = null;
  }

  /** @deprecated This is an internal implementation detail, do not use. */
  _trySubscribe(subscriber: Subscriber<T>): TeardownLogic {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    } else {
      return super._trySubscribe(subscriber);
    }
  }

  /** @deprecated This is an internal implementation detail, do not use. */
  _subscribe(subscriber: Subscriber<T>): Subscription {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    } else if (this.hasError) {
      subscriber.error(this.thrownError);
      return Subscription.EMPTY;
    } else if (this.isStopped) {
      subscriber.complete();
      return Subscription.EMPTY;
    } else {
      this.observers.push(subscriber);
      return new SubjectSubscription(this, subscriber);
    }
  }

  asObservable(): Observable<T> {
    const observable = new Observable<T>();
    (<any>observable).source = this;
    return observable;
  }
}

/**
 * @class AnonymousSubject<T>
 */
export class AnonymousSubject<T> extends Subject<T> {
  constructor(protected destination?: Observer<T>, source?: Observable<T>) {
    super();
    // @ts-ignore: Object is possibly 'null'.
    this.source = source;
  }

  next(value: T) {
    const { destination } = this;
    if (destination && destination.next) {
      destination.next(value);
    }
  }

  error(err: any) {
    const { destination } = this;
    if (destination && destination.error) {
      // @ts-ignore: Object is possibly 'null'.
      this.destination.error(err);
    }
  }

  complete() {
    const { destination } = this;
    if (destination && destination.complete) {
      // @ts-ignore: Object is possibly 'null'.
      this.destination.complete();
    }
  }

  /** @deprecated This is an internal implementation detail, do not use. */
  _subscribe(subscriber: Subscriber<T>): Subscription {
    const { source } = this;
    if (source) {
      return this.source.subscribe(subscriber);
    } else {
      return Subscription.EMPTY;
    }
  }
}
