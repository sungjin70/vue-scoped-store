import { Subject } from './Subject';
import { Observer } from './types';
import { Subscription } from './Subscription';

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class SubjectSubscription<T> extends Subscription {
  closed: boolean = false;

  constructor(public subject: Subject<T>|null, public subscriber: Observer<T>) {
    super();
  }

  unsubscribe() {
    if (this.closed) {
      return;
    }

    this.closed = true;

    const subject = this.subject;
    // @ts-ignore: Object is possibly 'null'
    const observers = subject.observers;

    this.subject = null;

    // @ts-ignore: Object is possibly 'null'
    if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
      return;
    }

    const subscriberIndex = observers.indexOf(this.subscriber);

    if (subscriberIndex !== -1) {
      observers.splice(subscriberIndex, 1);
    }
  }
}
