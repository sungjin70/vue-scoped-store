import Vue, { VNode } from 'vue';
import Dev from './serve.vue';
// To register individual components where they are used (serve.vue) instead of using the
// library as a whole, comment/remove this import and it's corresponding "Vue.use" call
import VueScopedStore from '@/entry.esm';
import VueRouter from 'vue-router';

import {index, page1, page2} from '../src/lib-components';

Vue.use(VueScopedStore);
Vue.use(VueRouter);

Vue.config.productionTip = false;

const routes = [
  { path: '/', component: index },
  { path: '/page1', component: page1 },
  { path: '/page2', component: page2 },
];

// 3. `routes` 옵션과 함께 router 인스턴스를 만드세요.
// 추가 옵션을 여기서 전달해야합니다.
// 지금은 간단하게 유지하겠습니다.
const router = new VueRouter({
  routes // `routes: routes`의 줄임
});

new Vue({
  render: (h): VNode => h(Dev),
  router,
}).$mount('#app');
