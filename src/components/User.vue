<template>
  <div class="component-container">
    <div class="container">
    <div class="formSlide">
    <form id="form">
      <div class="l">
        <label for="username">mail:</label>
        <input type="text" id="username" name="username" required>
      </div>
      <div class="l">
        <label for="password">pass:</label>
        <input type="password" id="password" name="password" required>
      </div>
    </form>
    <div class="buttons">
      <button @click="sub" variant="primary">
      登録
      </button>
    </div>
  </div>
  </div>
  </div>
  </template>
  

<script setup>
import { defineComponent, ref } from "vue";
/*
export default defineComponent({
  setup() {
    
  }
});
*/
//firestoreからデータベースについての情報をインポート/////////////////////////////
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
//user管理import///////////////////////////////////////////////////////////////////////
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword, sendEmailVerification, 
  signOut, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
/////////////////////////////////////////////////////////////////////////////////
const firebaseConfig = {
  apiKey: "AIzaSyCvbpyWEaMwYSviVYoMFc-ExdKEA6txjCo",
  authDomain: "whiteonline1028.firebaseapp.com",
  projectId: "whiteonline1028",
  storageBucket: "whiteonline1028.firebasestorage.app",
  messagingSenderId: "228597986213",
  appId: "1:228597986213:web:23d21ab534198eb46c2e4c",
  measurementId: "G-B6NWJNXSLS"
};
////////////////////////////////////////
const auth = getAuth();
const store = getFirestore();

const enterNewBoard = async () => {
  //ユーザーをデータに追加
  let uid = auth.currentUser.uid;
  console.log(uid);
  //firestoreパス users
  const usersCollectionRef = collection(store, "users");
  await addDoc(usersCollectionRef, {uid: uid });

//firestoreパス rooms
  const collectionRef = collection(store, `users/${uid}/rooms`);
  const result = await addDoc(collectionRef, {}); //ドキュメント(id)をroomに追加
  router.push({ path: `/board/${result.id}` }); //画面遷移 board.vue/生成されたid
};
//登録ボタン
const sub = async () =>{
  console.log("s")
let form = document.querySelector('form');
let username = form.elements.namedItem('username').value;
let password = form.elements.namedItem('password').value;
//ユーザー作成
  createUserWithEmailAndPassword(auth, username, password)
        .then(cred => {
            // 登録成功
            console.log(cred.uid);
            //新しいboardページに飛ぶ
            enterNewBoard();
        })
}
/*
const admin = async () =>{
//ログイン状態確認
onAuthStateChanged(auth, (user) => {
    if (user) {
        // login state
        //userIDを取り出す↓
        let uid = auth.currentUser.uid;
        console.log(user);
        console.log(uid);
    } else {
        // ログインしてない
    }
})
};
*/
const app = initializeApp(firebaseConfig);



//セキュリティあとで？








const analytics = getAnalytics(app);
const db = getFirestore(app);
const au= async () =>{

      }

/*
const registerUser = async (email: string, password: string, displayName: string) => {
  try {
    // Firebase Authenticationへのユーザー登録とuidの取得
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUid = userCredential.user.uid;
    

    // 登録確認メールの送信
    await sendEmailVerification(userCredential.user);
    window.alert("メールアドレスに確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。")

    // backend-api(統合先)へのユーザー登録
    await axios.post('https://your-backend-api.com/signup', {
      firebaseUid: firebaseUid,
      email: email,
      name: displayName || "Unknown", 
    });

    console.log('User registered and data sent to backend');
  } catch (error) {
    console.error('Error during registration:', error);
  }
};
*/
//var ui = new auth.AuthUI(auth());
//export default { analytics, db, auth };
/*
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = HTMLから取り出す
    const password = HTMLから取り出す

    // Userを作成する
    auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
            // 登録成功
            console.log(cred);
        })
})

*/
</script>
<style scoped>
.container{
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform : translate(-50%,-50%);
  transform : translate(-50%,-50%);
  text-align: center;/*一応BOX内の文字も中央寄せ*/
}
.formSlide{
  background-color:rgb(33, 130, 67);
  height:300px;
  width:500px;
  border-radius: 15px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow:5px 5px 10px rgba(33, 130, 67, 0.648);
}
.l{
  padding:20px;
}
.buttons{
  position:absolute;
  bottom :10px;
  right:40px;
}
button{
  width:60px;
  margin-left: 20px;
}
</style>
