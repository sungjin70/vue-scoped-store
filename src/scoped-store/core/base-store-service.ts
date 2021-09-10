import { BehaviorSubject, Subject, Observable } from '../rxjs-simple';
import { distinctUntilChanged, map } from '../rxjs-simple/operators';

export const isPrimitive = (value: any): boolean => {
  const type = typeof value;
  return value == null || (type !== "object" && type !== "function");
}

export class BaseStoreService<ST, CT> {
  private state$: BehaviorSubject<ST>;
  private commandMapper$: Subject<CT>;

  protected get state(): ST {
    return this.state$.getValue();
  }

  constructor(initialState: ST) {
    this.state$ = new BehaviorSubject<ST>(initialState);
    this.commandMapper$ = new Subject<CT>();
  }

  protected select<K>(mapFn: (state: ST) => K): Observable<K> {
    // return this.state$.asObservable().pipe(
    return this.state$.pipe(
      map((state: ST) => mapFn(state)),
      distinctUntilChanged()
    );
  }

  protected selectCommand<K>(mapFn: (state: CT) => K): Observable<K> {
    // return this.commandMapper$.asObservable().pipe(
      return this.commandMapper$.pipe(
      map((state: CT) => mapFn(state))
    );
  }

  protected setState(newState: Partial<ST>) {
    this.state$.next({
      ...this.state,
      ...newState,
    });
  }

  protected setCommand(newCommand: CT) {
    this.commandMapper$.next(newCommand);
  }

  public stop() {
    this.state$.complete();
    this.commandMapper$.complete();
  }
}
