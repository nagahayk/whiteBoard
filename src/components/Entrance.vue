<script setup lang="ts">

import router from "../router/router";

import { getFirestore, collection, addDoc } from "firebase/firestore";
/*
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
*/
const store = getFirestore();

//room create URLを作成して飛ぶ
const enterNewBoard = async () => {
  const collectionRef = collection(store, "rooms"); //コレクションのrefを設定
  console.log(collectionRef);
  const result = await addDoc(collectionRef, {}); //ドキュメント(id)をroomに追加
  console.log(result);
  router.push({ path: `/board/${result.id}` }); //画面遷移 board.vue/生成されたid
};

</script>

<template>
  <div class="component-container">
    <div class="title">Share your Image.</div>
    <div class="buttons">
      
      <button @click="enterNewBoard" variant="primary">
        <!--
        <FontAwesomeIcon :icon="faPlus" /> Create new board
        -->
      </button>
    
    </div>
  </div>
</template>

<style scoped>
.component-container {
  width: 100%;
  height: 100%;
  background-image: url(/entrance.jpg);
  background-size: cover;
  background-position: center;
  display: grid;
  grid-template-rows: 4fr 1fr;
}
.title {
  height: fit-content;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  align-self: center;
  font-size: 24px;
  padding: 5px 0;
}
.buttons {
  place-self: center;
}
button {
  border: none;
  border-radius: 2px;
  padding: 10px;
  color: white;
  background-color: blue;
  cursor: pointer;
}
button:hover {
  opacity: 0.5;
}
</style>
