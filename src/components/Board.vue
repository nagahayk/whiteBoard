<template>
  <div class="component-container">
    <div class="tools">
      <!--ボタン-->
      <div class="tool1">
      <button
       :selected="state.selectedMode === 'drawLine'"
        @click="state.selectedMode = 'drawLine'"
        title="pen"
      ></button>
      <button
        v-for="color in state.colorList"
        :key="color"
        :style="{ backgroundColor: color }"
        :selected="
          state.selectedMode === 'drawLine' && color === state.selectedColor
        "
        :title="color"
        @click="onClickDraw(color)"
      ></button>
      <!---<FontAwesomeIcon :icon="faPen" />        -->
      <!--ボタン 消しゴム-->
      <button
        :selected="state.selectedMode === 'erase'"
        @click="state.selectedMode = 'erase'"
        title="erase"
      ></button>
       <!-- <FontAwesomeIcon :icon="faEraser" /> -->
       <!--URLシェア-->
      <button @click="onClickShare" title="share">
       <!-- <FontAwesomeIcon :icon="faShareNodes" /> -->
        
  
      </button>


      </div>
       <!--カラーピッカー-->
      <div class="color-picker">
        <input type="color">
      </div>
        />
        <!--レイヤー選択ボタン-->
        <button class="l" @click="plusLayer"><h1>+</h1></button>
        <button class="layerList"
          v-for="layer in state.layerList"
          :key="layer"
          :title="layer"
          :selected="layer === state.selectedLayer"
          @click="onClickLayer(layer)"
          >{{ layer }}</button>
    
      
          

      </div>
    </div>

    <!--43
            :sucker-canvas="suckerCanvas"
        :sucker-area="suckerArea"
        @changeColor="changeColor"
        @openSucker="openSucker"
        :color="color"-->
    
    <!----------------ﾎﾞｰﾄﾞ------------------------------------------------>
    <!--svg線の表示-->
    <!--ref 特定の要素を取得して操作するために定義-->
    <!--id生成-->

    <div id="whiteLayer">
    <svg
      ref="svgElementRef" 
      id = "layer-c"
      class="canvas"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      @mousedown.prevent="dragStart"
      @mousemove.prevent="dragMove"
      @mouseup.prevent="dragEnd"
      @mouseleave="dragEnd"
      @touchstart.prevent="dragStart"
      @touchmove.prevent="dragMove"
      @touchend.prevent="dragEnd"
    >
    
      <polyline
        v-for="element in state.elements"
        :key="element.id"
        :element-id="element.id"
        fill="none"
        :stroke="element.color"
        stroke-linecap="round"
        stroke-width="5"
        :points="convertPointsToString(element.points)"
      />
      <polyline
        v-if="state.drawingElement"
        fill="none"
        :stroke="state.drawingElement.color"
        stroke-linecap="round"
        stroke-width="5"
        :points="convertPointsToString(state.drawingElement.points)"
      />
    </svg>
    </div>
    
</template>
<script setup lang="ts">

//ref()・reactive()は、基本的に単一の値（基本データ型やオブジェクトなど）をリアクティブな値として定義
import { onMounted, reactive, ref, defineComponent } from "vue";
//1105"type"を追加↓
import type { DrawElement, DrawPoint } from "../scripts/types";

//firestoreからデータベースについての情報をインポート
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
import { createUserWithEmailAndPassword, sendEmailVerification, 
  signOut, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
  import { getAuth } from "firebase/auth";
  const auth = getAuth();
  //ユーザー取得

/*
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPen,
  faEraser,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
*/


/*
const picker = new ColorPicker({
  name: "App",
  data() {
    return {
      color: "#59c7f9",
      suckerCanvas: null,
      suckerArea: [],
      isSucking: false,
    };
  },
  methods: {
    changeColor(color) {
      const { r, g, b, a } = color.rgba;
      this.color = `rgba(${r}, ${g}, ${b}, ${a})`;
    },
    openSucker(isOpen) {
      if (isOpen) {
        // ... canvas be created
        // this.suckerCanvas = canvas
        // this.suckerArea = [x1, y1, x2, y2]
      } else {
        // this.suckerCanvas && this.suckerCanvas.remove
      }
    },
  },
  
}
)
  */

//描画 //////////////////////////////////////////////////////////////////////////
//定義リアクティブ   ペン（モード）、カラー
const state = reactive({
  layerList: ["layerFirst"],
  selectedLayer: "layerFirst",
  //レイヤーごとの線
  elements: [] as DrawElement[],
  drawingElement: null as DrawElement | null,
  selectedMode: "drawLine" as "drawLine" | "erase",
  selectedColor: "black",
  colorList: ["black", "red", "blue", "green", "yellow", "purple", "cyan"],
});
//定義 SVG
const svgElementRef = ref<SVGElement>();

//定義 ドラッグ
let dragMoveHandler = null as ((event: Event) => void) | null;
let dragEndHandler = null as ((event: Event) => void) | null;
//////////////////////////////////////////////////////////////////////////////

//定義 firestoreからstoreの情報 コレクション読み込み
const store = getFirestore();

//パス定義 個別ID //defineProps 親コンポーネントから子コンポーネントに受け渡し？
const props = defineProps<{ 
  boardId: string,
  userId : string }>(); //vueの機能によりpropsをstringとして取得

//const uid = defineProps<{userId : string }>(); //vueの機能によりpropsをstringとして取得
//console.log(uid)
//let uid = {userId:"aaa"};
const admin = async () =>{
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
admin;
/*
const aaa = defineProps<{
   userId : string 
  }>(); //vueの機能によりpropsをstringとして取得
console.log(aaa.userId);
*/
const layersCollectionRef = collection(
  store,
  `users/${props.userId}/rooms/${props.boardId}/layers`
)

//このroomのelementsにrefを設定
let elementsCollectionRef = collection(
  store,`users/${props.userId}/rooms/${props.boardId}/layers/${state.selectedLayer}/elements`
);
onSna();
//変更を加えた時に呼び出されるonSnapshot
function onSna(){
onSnapshot(elementsCollectionRef, (querySnapshot) => {
  console.log("ons");
  state.elements = [];
  //データを取得し、state.elementsを変更して代入
  state.elements = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      color: data.color,
      points: data.points,
    };
  });
});
};

//一意の文字列
function getUniqueStr(myStrong?: number): string {
let strong = 1000;
if (myStrong) strong = myStrong;
return (
  new Date().getTime().toString(16) +
  Math.floor(strong * Math.random()).toString(16)
);
}

//レイヤー追加
const plusLayer = async() => {

  state.elements = [];
  //layer追加 何も書いてないlayerをコピーしていく 
  let layer_c = document.getElementById("whiteLayer") as HTMLElement;
  //let NewLayer = layer_c.cloneNode(false) as HTMLElement;;

  //Eventをつける
  /*
  NewLayer?.addEventListener('mousedown', dragStart);
  NewLayer?.addEventListener('mousemove', dragMove);
  NewLayer?.addEventListener('mouseup', dragEnd);
  NewLayer?.addEventListener('mouseleave', dragEnd);
  NewLayer?.addEventListener('touchstart', dragStart);
  NewLayer?.addEventListener('touchmove', dragMove);
  NewLayer?.addEventListener('touchend', dragEnd);
  */
  //注意preventついてない
  //document.body.appendChild(NewLayer);
  //console.log(NewLayer);
  //レイヤーを選ぶボタンを追加
  let layerButton = document.getElementById("layerButton") as HTMLElement;
  console.log(layerButton);
  let NewLayerButton = layerButton?.cloneNode(false);
  //表示
  let parent = document.getElementById("tool2");
 
  //一番上のレイヤーに表示（まだできてない）
   //css
   /*
   let changeCssLayer = document.querySelectorAll('#uniqueID,.canvas-2');
   changeCssLayer.style.Display = '';
   */
  
  
  //fireStoreに保存 
    //id自動生成
    const newLayerId = await addDoc(layersCollectionRef, {});
    state.selectedLayer = newLayerId.id;
    elementsCollectionRef = collection(
    store,
    `users/${props.userId}/rooms/${props.boardId}/layers/${state.selectedLayer}/elements`
    );
    //NewLayer?.setAttribute("id",newLayerId.id);
  //全レイヤーの配列にIDを追加
  state.layerList.unshift(newLayerId.id);
  console.log(state.layerList);

//変更を加えた時に呼び出されるonSnapshot
onSna();
};



//メソッド定義 ドラッグ///////////////////////////////////////////////////////////////////////////
//もし
const dragStart = () => {

  if (!svgElementRef.value) return;
  //ペンモードだったら
  if (state.selectedMode === "drawLine") {
    //★state.drawingElementというハッシュをつくる
    state.drawingElement = {
      id: "",
      points: [],
      color: state.selectedColor,
    };
    //rect 要素の座標を取得
    const rect = svgElementRef.value.getBoundingClientRect();
    //dragしたことを感知したらpointsに座標をpush
    dragMoveHandler = (event: Event) => {
      if (state.drawingElement) {
        if (event instanceof TouchEvent) {
          state.drawingElement.points.push({
            x: event.touches[0].clientX - rect.x,
            y: event.touches[0].clientY - rect.y,
          });
        } else if (event instanceof MouseEvent) {
          state.drawingElement.points.push({
            x: event.clientX - rect.x,
            y: event.clientY - rect.y,
          });
        }
      }
    };
    //ドラッグが終わったことを感知したらstate.drawingElementをfirestoreに保存
    dragEndHandler = () => {
      if (!state.drawingElement) return;
      if (state.drawingElement.points.length === 0) return;
      //変更なし
      addDoc(elementsCollectionRef, state.drawingElement);
      state.drawingElement = null;
    };
  //消しゴムモードだったら
  } else if (state.selectedMode === "erase") {
    dragMoveHandler = (event: Event) => {
      //タッチした座標を取得して、
      const target =
        event instanceof TouchEvent
          ? document.elementFromPoint(
              event.touches[0].clientX,
              event.touches[0].clientY
            )
          : event instanceof MouseEvent
          ? event.target
          : null;
      //SVGPolylineElementのidを取得して、
      if (target instanceof SVGPolylineElement) {
        const elementId = target.getAttribute("element-id");
        if (elementId) {
          //ストアからデータを削除
          deleteDoc(doc(store, `rooms/${props.boardId}/elements/${elementId}`));
        }
      }
    };
  }

};
const dragMove = (event: Event) => {
  if (dragMoveHandler) dragMoveHandler(event);
};
const dragEnd = (event: Event) => {
  if (dragEndHandler) dragEndHandler(event);
  dragMoveHandler = null;
  dragEndHandler = null;
};
//レイヤー選択まだできてない
const onClickLayer = async(layer: string) => {
  //選んだレイヤー
  let topLayer = document.getElementById(layer) as HTMLElement;
  //document.body.appendChild(topLayer);
  //let layerCollectionRef = collection(store,`rooms/${props.boardId}/layers/${layer}/elements`);
  state.selectedLayer = layer;
  elementsCollectionRef = collection(
  store,`users/${props.userId}/rooms/${props.boardId}/layers/${state.selectedLayer}/elements`
  );
  onSna();
}
//カラー選択
const onClickDraw = (color: string) => {
  state.selectedMode = "drawLine";
  state.selectedColor = color;
};
const onClickShare = async () => {
  if (!navigator.clipboard) return;
  await navigator.clipboard.writeText(location.href);
  alert("Copied the URL. Send it to your collaborators!");
};
const convertPointsToString = (points: DrawPoint[]) => {
  let attr = "";
  for (let point of points) {
    attr += `${point.x},${point.y} `;
  }
  return attr;
};
/*
const noScroll = (e: Event)=> {
   e.preventDefault();
}
*/


</script>
////////////////////////////////////////////////////////////////////////////////

<!--------------------------------- css --------------------------------------------->
<style scoped>

body{
  margin:0;
  height: 100%;
  background-color: azure;
  height: 100%;
}
.component-container {
  width: 100%;
  height: 100%;
  background-color:black;
}

#whiteLayer{
    /*画面いっぱい*/
    position:absolute;
  width: 100%;
  height: 100%;
  background-color: rgb(255, 255, 255);
  z-index:2;
  top:0;
}

.canvas{
      /*画面いっぱい*/
      position:absolute;
  width: 100%;
  height: 100%;
  background-color: rgb(255, 255, 255);
  z-index:2;
  top:0;
}




.tools{
  width: 20%;
  height:100%;
  background-color:rgb(202, 217, 216);
  display:flex; /*横並び*/
  /*右寄せ3行*/
  position: fixed;
  top:0;
  right:0;
  /* margin-left:auto;
  margin-right:0; */
  /*left: 100%;     /*非表示*/
  z-index:10;
}
.tool1 {
  width: 18%;
  height:100%;
  background-color: rgb(255, 252, 241);

  text-align:center; /*ボタンを真ん中にする*/   
  position: absolute; /*ボタンを押せるようにする*/
}
.tool1 > button {
  
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  color: white;
  background-color: gray;
  cursor: pointer;
  margin: 4px auto;
}
.tool2{
  width: 300px;
  height:100%;
  background-color: rgb(214, 228, 227);
}

.layerList {
  bottom:0;
  left:100px;
  width: 30px;
  height: 30px;
  color: white;
  background-color: gray;
  cursor: pointer;
  margin: 4px auto;
  display:flex;
}
.picker{
  margin: 10px auto;
  
}
.l{
  position:absolute;
  margin-top   : 30px; /*余白*/
  width        : 50px;
  height       : 50px;
  background   : rgb(255, 255, 255);
}
</style>

<script>
</script>