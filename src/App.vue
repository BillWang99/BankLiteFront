<script setup>
  import { onMounted, onBeforeUnmount } from 'vue';
  import { RouterView, useRouter } from 'vue-router'
  import { useStore } from 'vuex';
  const router = useRouter();
  const store = useStore();

  //登出
  const logout = ()=>{
    store.dispatch('logout');
    location.reload();
  };

  //監聽視窗
  //  const handleBeforeUnload = () => { 
  //    store.dispatch('logout'); 
  //  }; 
  
  // onMounted(() => { 
  //   window.addEventListener('beforeunload', handleBeforeUnload); 
  // }); 
  
  //  onBeforeUnmount(() => { 
  //    window.removeEventListener('beforeunload', handleBeforeUnload); 
  //  });
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg " data-bs-theme="dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/"><i class="bi bi-bank"></i>&nbsp;BankLite</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/">帳戶總覽</a>
            </li>  

            <li class="nav-item">
              <a class="nav-link" aria-current="page" href="/transaction">收支交易</a>
            </li> 

            <li class="nav-item">
              <a class="nav-link" aria-current="page" href="/transfer">轉帳交易</a>
            </li> 

            <li class="nav-item">
              <a class="nav-link" aria-current="page" href="/accounttypes">帳戶類別</a>
            </li>

            <li class="nav-item">
              <a class="nav-link" aria-current="page" href="/transactionhistory">交易紀錄</a>
            </li>

            <li class="nav-item" v-if="store.getters.isAuthenticated">
              <button class="nav-link" aria-current="page" @click="logout()">登出</button>
            </li> 
          </ul>
        </div>
      </div>
    </nav>
  </header>
  
  <main class="bg-success p-2 text-dark bg-opacity-10">
    <RouterView />
  </main>
  
  <footer>
    <p>BankLite-簡易記帳</p>
  </footer>
</template>

<style scoped>
  header { 
    background-color: #107d64;
    
  } 

  main { 
    flex: 1;
    padding: 10px;
  } 

  footer { 
    background-color: #494949;
    padding: 10px;
    text-align: center;
    color:white;
  }

</style>
