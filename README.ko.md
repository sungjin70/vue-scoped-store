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

@GlobalStore 데코레이터를 이용해 변수값을 어플레케이션 전역에서 공유하는 예입니다.
<br />
다음 예에서 페이지 뷰(page1.vue)와 그 안에 포합된 컴포넌트(page1.vue)는 동일한 이름의 변수(hellowWorld)를 각각 가기고 있습니다.

`page1.vue`

``` js
<template>
  <div class="home">
    <h2>Welcome to the Scoped Store!</h2>
    <!-- 
    사용자의 입력에 의해 hellowWorld값이 변경될 때
    다른 페이지나 컴포넌트의 같은 이름의 모든 변수 값이 
    함께 변경됩니다.
    -->
    <input v-model="hellowWorld" style="width:350px" />
    <br />
    <HelloWorldGlobalStore />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorldGlobalStore from '@/components/HelloWorldGlobalStore.vue';
import { GlobalStore } from 'vue-scoped-store';

@Component({
  components: {
    HelloWorldGlobalStore,
  },
})
export default class Home extends Vue {
  // @GlobalStore를 적용하면 
  // hellowWorld 변수는 어플리케이션 전역에서 공유됩니다.
  @GlobalStore()
  private hellowWorld = '';  
}
</script>
```


`HelloWorldGlobalStore.vue`

``` js
<template>
  <div class="hello">
    <h3>HelloWorldGlobalStore.vue</h3>
    <p>
      The message that you see below is shared using a @GlobalStore decorator.
      <br />
      The message will persist even if you navigate other pages around.
    </p>
    <h2>{{ hellowWorld }}</h2>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { GlobalStore } from 'vue-scoped-store';

@Component
export default class extends Vue {
  // 이 컴포넌트 안의 hellowWorld변수 값은
  // page1.vue의 hellowWorld변수값과 동기화 됩니다.
  @GlobalStore()
  private hellowWorld = '';
}
</script>
```

단지 @GlobalStore 데코레이션을 변수에 적용했습니다.
이 동영상을 통해 @GlobalStore를 변수에 적용하면 어떤 효과가 나타나는지 확인해보시기 바랍니다.

https://user-images.githubusercontent.com/86173989/131511985-44353feb-cb0d-487d-9f8a-7eb294eb7cd1.mp4




#### 화면범위 공유


