<template>
    <div class="component-container">
        <div class="container">
        <div class="formSlide">
        <form id="form">
            <div>
            <label for="username">mail:</label>
            <input type="text" id="username" name="username" required>
            </div>
            <div>
            <label for="password">pass:</label>
            <input type="password" id="password" name="password" required>
            </div>
        </form>
        
        <div class="buttons">
            <button @click="login" variant="primary">
                確認
            </button>
        </div>
        </div>
    </div>
    </div>
    
</template>
    
  
<script setup>
import { defineComponent, ref } from "vue";


//user管理import///////////////////////////////////////////////////////////////////////
import router from "../router/router";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  getDocs,
  query,
} from "firebase/firestore";
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

//定義 過去ルームリストページに飛ぶ
const enterListPage = async () => {
let uid = auth.currentUser.uid;

console.log(uid);
router.push({ path: `list/${uid}` }); //画面遷移 board.vue/生成されたid
};



/*
//ログイン状態確認
const admin = async () =>{
    enterListPage;
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // login state
            //userIDを取り出す↓
            console.log(user);
        } else {
            // ログインしてない
        }
    })
};
*/
//ログインボタン押す
const login = async () =>{
    console.log("s")
    let form = document.querySelector('form');
    let username = form.elements.namedItem('username').value;
    let password = form.elements.namedItem('password').value;
    //ログイン
    signInWithEmailAndPassword(auth, username, password)
            .then(cred => {
                // ログイン成功
                console.log(cred);
            })
    //過去のルームリストページに飛ぶ
    enterListPage();
}

//const app = Vue.createApp({})


  
  
  //セキュリティあとで？
  
  
  
  
  
  
  
  /*
  const analytics = getAnalytics(app);
  const db = getFirestore(app);
  const au= async () =>{
  
        }
  */
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
  