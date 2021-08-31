# vue-scoped-store

[English](README.md) | 한글

vue-scoped-store는 Vue어플리케이션에서 컴포넌트 및 페이지 간에 쉽게 상태관리를 할 수 있도록 하는 라이브러리입니다.
이 라이브러리를 [Vuex](https://vuex.vuejs.org)처럼 상태를 공유하기위한 라이브러리라고 생각하면 되지만, Vuex를 사용하려면 알아야하는 다소 복잡한 패턴을 이해하지 않아도 되도록 고안되었습니다.
하지만 vue-scoped-store가 Vuex의 모든 기능을 대체하지는 않습니다. vue-scoped-store의 목표는 컴포넌트 또는 페이지 간에 상태를 공유하는 쉬운 방법을 제공하는 것입니다.
vue-scoped-store는 Vue의 data옵션에 선언된 변수들을 여러 컴포넌트에서 공유할 수 있도록 하는 방법을 제공합니다.


### Installation

``` bash
npm install vue-scoped-store --save
```

``` js
import Vue from 'vue'
import ScopedStore from "vue-scoped-store";

Vue.use(ScopedStore);
```


#### TypeScript

`tsconfig.json`
``` ts
    "types": [
      ...
      "node_modules/vue-scoped-store/vue-scoped-store.d.ts"
    ],
```


### 기본 사용방법

#### 웝어플리케이션 전역범위 공유

``` js
// provide Rx observables with the `subscriptions` option
new Vue({
  el: '#app',
  subscriptions: {
    msg: messageObservable
  }
})
```

``` html
<!-- bind to it normally in templates -->
<div>{{ msg }}</div>
```

The `subscriptions` options can also take a function so that you can return unique observables for each component instance:

``` js
import { Observable } from 'rxjs'

Vue.component('foo', {
  subscriptions: function () {
    return {
      msg: new Observable(...)
    }
  }
})
```



https://user-images.githubusercontent.com/86173989/131511985-44353feb-cb0d-487d-9f8a-7eb294eb7cd1.mp4




#### 화면범위 공유


