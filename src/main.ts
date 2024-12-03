//新しいインスタンスを作る vueをインポート
import { createApp } from "vue";

import "./style.css";
import App from "./App.vue";
import router from "./router/router";


import firebase from "firebase/compat/app";
import firebaseConfig from "./firebaseConfig";
firebase.initializeApp(firebaseConfig);

//vueアプリを作成し、appコンポーネントを画面に表示
const app = createApp(App);
app.use(router);
app.mount("#app");


