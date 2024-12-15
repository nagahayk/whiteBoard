<template>
  <div class="component-container">
    <!--過去のルーム一覧-->
    <div class="s">
      <button class="plusRoom" @click="plusRoom"><h1>+</h1></button>
    </div>
    <div class="past">
    <button class="pastList"
      v-for="room in state.roomList"
      :key="room"
      :title="room"
      :selected="room === selectedRoom"
      @click="enterRoom(room)"
    >{{ room }}</button>
     </div>
  
   <!-- ユーザーネーム登録初回のみ表示-->
  </div>
     
  </template>
  
<script setup lang="ts">
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  getDocs,
  query,
} from "firebase/firestore";
import router from "../router/router";
import { onMounted, reactive, ref, defineComponent } from "vue";
const store = getFirestore();
 
//ユーザー取得
const uid = defineProps<{
   userId : string 
  }>(); //vueの機能によりpropsをstringとして取得
console.log(uid.userId);

let selectedRoom = "";
//onclickRoom
//選択したルームに飛ぶ
const enterRoom = async (room: string) => {
  selectedRoom = room;
  router.push({ path: `/board/${selectedRoom}` }); //画面遷移 board.vue/生成されたid
};
//新しいルームを作って飛ぶ


const plusRoom = async () => {
  const collectionRef = collection(store, `users/${uid.userId}/rooms`); //コレクションのrefを設定
  const result = await addDoc(collectionRef, {}); //ドキュメント(id)をroomに追加
  //router.push({ path: `/board/${result.id}` }); //画面遷移 board.vue/生成されたid
  };

//uidから過去のルーム一覧のid取得
const roomsCollectionRef = collection(store, `users/${uid.userId}/rooms`)
const state = reactive({
  roomList:[] as string[],
});
//onclickRoomの飛ぶパスに埋め込む
function onSna(){
onSnapshot(roomsCollectionRef, (querySnapshot) => {
  console.log("ons");
  state.roomList = [];
  //データを取得
  querySnapshot.docs.map((doc) => {
    const roomId = doc.id;
    state.roomList.unshift(roomId);
  });
});
};
onSna();
</script>
<style scoped>
.component-container{
  width:100;
  height:100vh;
}

button{
  width:26%;
  margin: 2%;
  height:80px;
}
</style>
