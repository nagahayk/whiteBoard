<template>
  <div class="component-container">
    <!--過去のルーム一覧-->
    <div class="s">
      <button class="plusRoom" @click="plusRoom"><h1>+</h1></button>
    </div>
    <button @click="enterEntrance" variant="primary">
                ←
        </button>

    <div class="past">

    <button class="pastList"
        v-for="room in state.roomList"
        :key="room"
        :title="room"
        :selected="room === selectedRoom"
        @click="enterRoom(room)"
      >{{ room }}</button>

      <div class="pastTime"
      v-for="time in state.times"
        :key="time"
        :title="time"
      >{{ time }}</div>
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
  firestore,
  Timestamp,
} from "firebase/firestore";
import router from "../router/router";
import { onMounted, reactive, ref, defineComponent } from "vue";
const store = getFirestore();

//timestamp
//console.log(Timestamp.now());
//今の時間
//const time = Timestamp.now();
//経過日数
//console.log(Timestamp.fromDate(new Date("December 10, 2024")));
//表示
//console.log(time.toDate());
const enterEntrance = async () => {
router.push({ path: `/` }); //画面遷移 board.vue/生成されたid
};
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
  const timeSt = Timestamp.now();
  const collectionRef = collection(store, `users/${uid.userId}/rooms`); 
  const result = await addDoc(collectionRef, {timestamp: timeSt});
  //router.push({ path: `/board/${result.id}` });
  onSna();
  console.log(state.roomList)
  //timeStampを追加
  
  };

//uidから過去のルーム一覧のid取得
const roomsCollectionRef = collection(store, `users/${uid.userId}/rooms`)
const state = reactive({
  roomList:[] as string[],
  times : [] as num[],
});
//roomListと時間を取得
console.log("a");
function onSna(){
onSnapshot(roomsCollectionRef, (querySnapshot) => {
  state.roomList = [];
  state.times = [];
  console.log("ons");
  //データを取得
  querySnapshot.docs.map((doc) => {
    const data = doc.data();
    const roomId = doc.id;
    state.roomList.unshift(roomId);
    const time = data.timestamp
    state.times.unshift(time);
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
