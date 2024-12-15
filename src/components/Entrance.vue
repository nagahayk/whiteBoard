<script setup lang="ts">

import router from "../router/router";

import { getFirestore, collection, addDoc } from "firebase/firestore";
/*
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
*/
const store = getFirestore();

//ユーザー取得
const uid = defineProps<{
   userId : string 
  }>(); //vueの機能によりpropsをstringとして取得
  console.log(uid);
console.log(uid.userId);

//ユーザー取得できれば（ログインできれば）右上表示
if (uid.userId){
  const userId = uid.userId
}

//room create URLを作成して飛ぶ
const enterNewBoard = async () => {
  const collectionRef = collection(store, `users/${uid}/rooms`); //コレクションのrefを設定
  const result = await addDoc(collectionRef, {}); //ドキュメント(id)をroomに追加
  router.push({ path: `/board/${result.id}` }); //画面遷移 board.vue/生成されたid
};
const submit = async () => {
  router.push({ path: `/user` }); //画面遷移 board.vue/生成されたid
};
const login = async () => {
  router.push({ path: `/login` }); //画面遷移 board.vue/生成されたid
};


</script>

<template>
  <div class="component-container">
    <div class="title-component">
    <p class="subTitle">
      オンライン会議を快適に
    </p>

    <h1 class="title">
      MEEDRAW
    </h1>
    
  </div>
    <div class="selectButton">
      <div class="buttons">
      <button class="sub" @click="submit" variant="primary">
        すぐにはじめる
      </button>
      <button class="log" @click="login" variant="primary">
        ログイン
      </button>
      </div>
    </div>
  <!--もしログインしなくても継続されるなら、
  ログイン状態を確認してニューボードかルーム画面か選ぶようにしたい-->
<!--
    <div class="buttons">
      
      <button @click="enterNewBoard" variant="primary"></button>
      <button @click="login" variant="primary"></button>
  
    </div>
  -->   
  </div>
</template>

<style scoped>
.component-container {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-color: rgb(247, 247, 247);
}
.title-component{
  background-color:rgb(33, 130, 67);
  height: 50%;
  width: 100%;
  text-align:center;
  border-bottom-left-radius: 1400px 200px;
  border-bottom-right-radius: 1400px 200px;
  box-shadow:5px 5px 10px rgba(33, 130, 67, 0.648);
}
h1 p {
  font-weight: normal;
}
h1{
  font-size:50px;
  color: rgb(255, 255, 255);
}
p{
  font-size:20px;
  color: rgb(255, 255, 255);
}
.title{
  position:relative;
  top:120px;
  display: inline-block;
}

.subTitle{
  position:relative;
  top:100px;
}
.selectButton{
  height: 50%;
  width: 100%;
  text-align:center;
}
.buttons {
  display: inline-block;
  margin-top:30px;
  width:300px;
  height:200px;
}
button {
  border: none;
  border-radius: 2px;
  padding: 10px;
  color: white;
  background-color: rgb(0, 0, 0);
  cursor: pointer;
  margin-top:30px;
}
.sub{
  width:300px;
  height:60px;
}
.log{
  width:100px;
  height:40px;
}
button:hover {
  opacity: 0.5;
}
</style>
