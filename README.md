# ScopedStore

English | [한글](README.ko.md)


ScopedStore is a library for Vue application that gives the ways that manage state. The goal of ScopedStore is to provide an easy way to share state, especially between components or pages.
<br />
ScopedStore provides simple and easy ways to synchronize the values of variables declared in Vue's data option property across multiple components.
<br />
You can think of this library as [Vuex](https://vuex.vuejs.org) in some ways to make it easier to understand the concept. 
<br />
However, this library is designed to help you share states without understanding the somewhat complex patterns that you have to know when you use Vuex.
<br />
This library, of course, does not replace all parts of Vuex, but in many scenarios, this library can solve the state sharing problem.
<br />


### Installation

``` bash
npm install vue-store --save
```

``` ts
import Vue from 'vue'
import ScopedStore from "vue-store";

//Install ScopedStore plugins by calling the Vue.use() global method. 
Vue.use(ScopedStore);
//If you want to see console logs you can use this code instead
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

### Basic Usage

As the purpose of ScopedStore is to make it easy for Vue developers to use state-sharing, there are not many new concepts to learn to use this library.
<br />
With only a few simple example codes, You can understand how this library works and how to use it.


#### Sharing across global scope using @GlobalStore

This is an example of using the @GlobalStore decorator to share values of variable in component's data property across components.
<br />
`GlobalStore.vue`, which is a component that functions as a page view, and a component contained in it, which is called `HelloWorldGlobalStore.vue`, each have a variable with the same name that called helloWorld.
<br />
See how simple it is to synchronize the values of the helloWorld variables included in each component.

`GlobalStore.vue`

``` html
<template>
  <div class="home">
    <h2>Welcome to the Scoped Store!</h2>
    <!-- 
    Whenever the helloWorld value is changed by the user's input, 
    all variables with the same name on other pages or components 
    will be changed at the same time.
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
  // If you attach @GlobalStore to a variable, 
  // the value of the variable is shared across components
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
  // The value of the helloWorld variable in this component is synchronized 
  // with the value of the helloWorld variable in the GlobalStore.vue.
  @GlobalStore()
  private hellowWorld = '';
}
</script>
```

Once a property is decorated with @GlobalStore, all properties named the same name in different components are synchronized to have the same value.
If one of the properties with @GlobalStore changes, the change will be populated to the other properties that have the same name.
These values are preserved within properties even if you navigate to another page.

> Although this is technically inaccurate, with @GlobalStore, all properties which have the same name can be 
> thought of as only one global variable. All of these properties have the same values at any moment like a global variable does.

Please watch this video to see how easy it is to synchronize variable values using @GlobalStore.

https://user-images.githubusercontent.com/86173989/131511985-44353feb-cb0d-487d-9f8a-7eb294eb7cd1.mp4

[Running this demo in CodeSandbox](https://codesandbox.io/s/github/sungjin70/scoped-store-basic-demo)
<br />

In this video, you may have noticed that the value set on the first page is preserved after moving to About.vue.
Here is the source code for About.vue.

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
  // The value of the helloWorld variable in this component is synchronized 
  // with the value of the helloWorld variable in the GlobalStore.vue.
  @GlobalStore()
  private hellowWorld = '';  

}
</script>
```

Now, you understand what @GlobalStore is doing through the demo video and the source codes that you've seen, but you may still be wondering what @PageStore is. 
<br />
It's time to talk about what the page scope is.
<br />

#### Sharing across page scope using @PageStore

The @PageStore decorator also allows you to share any value of properties as the @GlobalStore does.
<br />
But the difference from @GlobalStore is that the values stored in properties vanish when the user moves from one page to another.
<br />
In other words, the lifetime of a property value with @PageStore is equal to the lifetime of a page component.
<br />
This way, variable values that managed by ScopedStore are automatically initialized after page movement, making memory management easier in many development scenarios.
<br />
Here's an example of using @PageStore. Please compare it to the @GlobalStore shown above.

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
import { PageStore, Page } from 'vue-store';


// @Page is something that let ScopedStore know that this component is a page. 
// so that ScopedStore can destroy all variables which belong to this page 
// when the page is about to destroy.
@Page
@Component({
  components: {
    HelloWorldPageStore,
  },
})
export default class Home extends Vue {
  // If you decorate a variable with @PageStore, 
  // the value of the variable is shared across components.
  // However, in contrast to 'GlobalStore', 
  // this variable will only last while the page appears on the screen.
  @PageStore()
  private hellowWorld = '';

  created() : void {
    this.hellowWorld = 'Default message';
  }
}
</script>
```


`HelloWorldPageStore.vue`

``` js
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

/*
There's no @Page here 
since this component is not a page.
*/
@Component
export default class extends Vue {
  // The value of the helloWorld variable in this component is synchronized 
  // with the value of the helloWorld variable in the PageStore.vue.
  // this variable will only last while the page appears on the screen.
  @PageStore()
  private hellowWorld = '';

}
</script>
```

@Page, which was not required in @GlobalStore, is required to manage page scope variables.
<br />
If you declare @Page in a component, then ScopedStore knows that this component is a page and deletes the value of the shared variables when the component is destroyed.

#### ScopedStore Wiki

What we've discussed so far is part of the ScopedStore.
<br />
Please consult [Wiki](https://github.com/sungjin70/vue-scoped-store/wiki) to learn ScopedStore further.



### More information on ScopedStore

What we've discussed so far is part of the ScopedStore.
This library provides more APIs and sample codes for developers to use in practice.
You can consult the following resources.


#### ScopedStore Wiki

[Go to Wiki](https://github.com/sungjin70/vue-scoped-store/wiki)


#### ScopedStore examples 

* [Basic demo](https://github.com/sungjin70/scoped-store-basic-demo)


* [API demo that shows the overall functionalities](https://github.com/sungjin70/vue-scoped-store-demo)


* A to-do implementation using ScopedStore
  - [to-do : With TypeScript and decorators](https://github.com/sungjin70/scoped-store-todo-demo)
  - [to-do : Without TypeScript and decorators](https://github.com/sungjin70/scoped-store-todo-demo-wod)

https://user-images.githubusercontent.com/86173989/133948747-fa784777-61f2-46d3-bc31-c768fc8d8900.mp4
