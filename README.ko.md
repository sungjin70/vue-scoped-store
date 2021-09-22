# ScopedStore

[English](README.md) | 한글

ScopedStore는 Vue어플리케이션에서 컴포넌트 및 페이지 사이에서 쉽게 상태관리를 할 수 있는 라이브러리입니다.
<br />
ScopedStore의 목표는 컴포넌트 또는 페이지 간에 상태를 공유하는 쉬운 방법을 제공하는 것입니다.
<br />
ScopedStore는 Vue의 data옵션에 선언된 변수들의 값을 여러 컴포넌트에서 동기화할 수 있는 단순한 방법을 제공합니다.
<br />
이 라이브러리를 [Vuex](https://vuex.vuejs.org)와 비슷하게 상태 공유 라이브러리라고 보면 이해하기쉽지만, Vuex를 사용하려면 알아야하는 다소 복잡한 패턴을 이해하지 않고 상태공유를 할 수 있도록 고안되었습니다.
ScopedStore가 Vuex의 모든 기능을 대체하지는 않지만 많은 시나리오에서 이 라이브러리로 데이터 상태공유문제를 해결 할 수 있습니다. 


### 설치

``` bash
npm install vue-store --save
```

``` ts
import Vue from 'vue'
import ScopedStore from "vue-store";

//ScopedStore 플러그인 설정
Vue.use(ScopedStore);
//콘솔 디버그 로그를 활성화 하려면 이 코드를 대신 사용
//Vue.use(ScopedStore, {debug:process.env.NODE_ENV == 'development'});
```


#### TypeScript

`tsconfig.json`
``` ts
    "types": [
      ...
      "node_modules/vue-store/vue-store.d.ts"
    ],
```

<br />
<br />

### 기본 사용방법

ScopedStore의 목적이 Vue개발자라면 누구나 쉽게 상태공유 기능을 사용 할 수 있도록 하는 것이기 때문에 이 라이브로리를 사용하기 위해 새로 이해해야할 개념이 많지 않습니다.
여러분은 단순한 예제코드만으로 이 라이브러리가 어떻게 동작하는지 이해 할 수 있습니다.


#### @GlobalStore 데코레이터로 어플리케이션 전역범위 공유

@GlobalStore 데코레이터를 이용해 변수값을 어플레케이션 전역에서 공유하는 예입니다.
<br />
다음 예에서 페이지 뷰(GlobalStore.vue)와 그 안에 포함된 컴포넌트(GlobalStore.vue)는 동일한 이름의 변수(hellowWorld)를 각각 소유하고 있습니다.
각 컴포넌트에 포함된 hellowWorld 변수의 값을 동기화 하는 방법이 얼마나 간단한지 확인 해 보십시요.

`GlobalStore.vue`

``` html
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
import { GlobalStore } from 'vue-store';

@Component({
  components: {
    HelloWorldGlobalStore,
  },
})
export default class Home extends Vue {
  // @GlobalStore를 변수에 달아주면 
  // 이 변수는 어플리케이션 전역에서 공유됩니다.
  @GlobalStore()
  private hellowWorld = '';  
}
</script>
```


`HelloWorldGlobalStore.vue`

``` html
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
import { GlobalStore } from 'vue-store';

@Component
export default class extends Vue {
  // 이 컴포넌트 안의 hellowWorld변수 값은
  // GlobalStore.vue의 hellowWorld변수값과 동기화 됩니다.
  @GlobalStore()
  private hellowWorld = '';
}
</script>
```

속성에 @GlobalStore를 달아주면, 서로다른 컴포넌트들에 포함된 동일한 이름의 모든 속성들은 동일한 값을 가지게됩니다.
@GlobalStore가 달린 속성 중 하나의 값이 변경되면 그 변경된 값은 이름이 같은 속성들 사이에서 공유됩니다.
이렇게 설정된 값은 화면 이동을 하더라도 속성 안에 보존됩니다.

> 기술적으로 정확한 표현은 아니지만 @GlobalStore가 달린 이름이 같은 속성들을
> 하나의 어플리케이션 전역변수처럼 생각하면 편합니다.

이 동영상을 통해 @GlobalStore를 변수에 데코레이팅되면 얼마나 쉽게 속성 값이 서로 다른 컴포넌트 간에 공유되는지 확인해보시기 바랍니다.

https://user-images.githubusercontent.com/86173989/131511985-44353feb-cb0d-487d-9f8a-7eb294eb7cd1.mp4

[CodeSandbox에서 대모 실행해보기](https://codesandbox.io/s/github/sungjin70/scoped-store-basic-demo)
<br />
이 영상에서 첫회면에서 설정한 값이 About.vue로 화면 이동한 후에도 보존되는 것을 발견하셨을 겁니다.
About.vue의 소스코드입니다.

`About.vue`
``` html
<template>
  <div class="about">
    <h2>This is an about page</h2>
    <p>
This is exactly what you input on the first page.
    </p>
    <h3 class="hello-world">{{ hellowWorld }}</h3>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { GlobalStore } from 'vue-store';

@Component
export default class Home extends Vue {
  // 이 컴포넌트 안의 hellowWorld변수 값은
  // GlobalStore.vue의 hellowWorld변수값과 동기화 됩니다.
  @GlobalStore()
  private hellowWorld = '';  

}
</script>
```

데모영상을 통해 @GlobalStore가 무슨일을 하는지 어느정도 이해가 되시겠지만, 아직 @PageStore가 뭔지 궁금하실 겁니다. 이제 화면범위 공유에 대해 알아야할 차례입니다.
<br />

#### 화면범위 공유

@PageStore 데코레이터 역시 @GlobalStore와 같이 변수의 값을 공유하도록 해줍니다.
@GlobalStore와 차이점은 사용자가 페이지 이동을 했을 때 변수들에 저장된 값이 사라진 다는 것입니다.
즉, @PageStore를 이용해 저장된 변수들의 수명은 페이지 컴포넌트의 수명과 같습니다.
페이지 이동 후 변수 값이 자동으로 초기화되는 @PageStore의 이런한 특징은 많은 웹 개발 시나리오에서 메모리 관리를 쉽게 해줍니다.
<br />
<br />

다음은 @PageStore를 사용하는 예입니다. 위에서 보여드린 @GlobalStore와 비교하면서 보시기 바랍니다.

`PageStore.vue`

``` html
<template>
  <div class="home">
    <h2>Welcome to the Scoped Store!</h2>
    <input v-model="hellowWorld" style="width:350px" />
    <br />
    <HelloWorldPageStore />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorldPageStore from '@/components/HelloWorldPageStore.vue'; // @ is an alias to /src
import { PageStore, AsPage } from 'vue-store';

@Component({
  components: {
    HelloWorldPageStore,
  },
})
export default class Home extends Vue {
  // @PageStore를 달아주면
  // 변수 값이 화면 범위에서 공유됩니다.
  @PageStore()
  private hellowWorld = '';

  // 페이지 컴포넌트에 @AsPage를 선언합니다.
  // 이 데코레이터가 있는 컴포넌트가 소멸될 때
  // 페이지 범위 변수들의 값도 같이 사라집니다.
  @AsPage()
  private isPage = true;

  created() : void {
    this.hellowWorld = 'Default message';
  }
}
</script>
```


`HelloWorldPageStore.vue`

``` html
<template>
  <div class="hello">
    <h3>HelloWorldPageStore.vue</h3>
    <p>
      The message that you see below is shared using a @PageStore decorator.
      <br />
      The message will not persist if you leave this page.
    </p>
    <h2>{{ hellowWorld }}</h2>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PageStore } from 'vue-store';

@Component
export default class extends Vue {
  // 이 컴포넌트 안의 hellowWorld변수 값은
  // PageStore.vue의 hellowWorld변수값과 동기화 됩니다.
  @PageStore()
  private hellowWorld = '';

  /*
  페이지 컴포넌트가 아니기 때문에
  여기는 @AsPage가 없습니다
  */
}
</script>
```

전역 범위의 변수 관리 때는 필요 없었던 @AsPage가 페이지 범위에는 필요합니다.
@AsPage가 있는 컴포넌트는 ScopedStore가 그 컴포넌트가 페이지임을 알게 해주고 컴포넌트가 소멸되는 시점에 공유된 변수들의 데이터도 함께 삭제합니다.



### 더 자세히 알아보기

지금까지는 ScopedStore의 아주 일부 기능을 보여 드렸습니다.
본 라이브러리는 개발자가 실무에서 사용 할 수 있도록 더 많은 API와 샘플코드를 제공합니다. 


#### ScopedStore Wiki

[ScopedStore Wiki](https://github.com/sungjin70/vue-scoped-store/wiki)


#### 예제 소스코드 

* [기초 데모](https://github.com/sungjin70/scoped-store-basic-demo)


* [전반적인 기능을 보여주는 데모](https://github.com/sungjin70/vue-scoped-store-demo)


* to-do 구현 예제
  - [to-do - TypeScript와 데코레이터 사용](https://github.com/sungjin70/scoped-store-todo-demo)
  - [to-do - TypeScript와 데코레이터 사용 않함](https://github.com/sungjin70/scoped-store-todo-demo-wod)


https://user-images.githubusercontent.com/86173989/133948747-fa784777-61f2-46d3-bc31-c768fc8d8900.mp4
