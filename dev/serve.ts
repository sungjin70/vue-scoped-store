import Vue, { VNode } from 'vue';
import Dev from './serve.vue';
// To register individual components where they are used (serve.vue) instead of using the
// library as a whole, comment/remove this import and it's corresponding "Vue.use" call
import VueScopedStore from '@/entry.esm';
import VueRouter from 'vue-router';

import {index, page1, page2, page3, page4} from '../src/lib-components';

Vue.use(VueScopedStore);
Vue.use(VueRouter);

Vue.config.productionTip = false;

const routes = [
  { path: '/', component: index },
  { path: '/page1', component: page1 },
  { path: '/page2', component: page2 },
  { path: '/page3', component: page3 },
  { path: '/page4', component: page4 },
];

const router = new VueRouter({
  routes // `routes: routes`의 줄임
});

new Vue({
  render: (h): VNode => h(Dev),
  router,
}).$mount('#app');
