<!--app.vue 最初に呼び出される-->
<script setup lang="ts"></script>

  <!--ここに他のコンポーネントやhtmlを表示-->
<template>
  <div class="root">
          <!--
    <header>
      <list>
        <li>home</li>
      </list>
    </header>
  -->
    <router-view />
    
    <!--
    <footer>
      White-Board -
      <a href="/">Top page</a>
    </footer>
    -->
  </div>
</template>

<!--css-->
<style scoped>
.root {
  height: 100%;
}
footer {
  background-color: dimgray;
  color: white;
  text-align: right;
  padding: 0 5px;
}
footer a {
  color: white;
}

</style>
