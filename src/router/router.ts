//routerとコンポーネントをインポート
import { createRouter, createWebHashHistory } from "vue-router";
import Entrance from "../components/Entrance.vue";
import Board from "../components/Board.vue";

//定義 routes
    //パス/にアクセスすると、
    //<router-view>の中身が
    //Entranceコンポーネントとして置換される。
const routes = [
  {
    path: "/",
    component: Entrance,
  },
  {
    path: "/board/:boardId",
    component: Board,
    props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

/*routesの定義とexportは以下のようにも書ける
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})
  */