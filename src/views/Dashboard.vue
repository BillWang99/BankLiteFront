<script setup>
  import { computed, ref, onMounted } from 'vue';
  import axios from 'axios'
  import { useStore } from 'vuex';

  const store = useStore();
  const user = computed(() => store.getters.getUser);

  //取出帳戶
  const data = ref(null);
  const fetchData = async()=>{
    try{
      const response = await axios.get('http://banklite.com.tw/api/accounts');
      data.value = response.data;
      console.log(response.data)
    }catch(error){
      console.log(error)
    }
  }

  onMounted(()=>{
        fetchData();
  });
</script>

<!-- Dashboard.vue -->
<template>
  <div class="container" v-if="data">
    <h1 class="text-center">餘額:{{ data.totalMoney }}</h1>
    <div class="row mx-auto">
      <div class="col-sm-6 " v-for="ac in data.accountInfos">
        <div class="card mb-3">
          <div class=" card-header bg-success p-2 text-white bg-opacity-75">
            {{ ac.name }}
          </div>
          <div class="card-body bg-success-subtle">
              <blockquote class="blockquote mb-0">
                <p>餘額:{{ ac.money }}</p>
                <footer class="">類型:{{ ac.typeName }}</footer>
              </blockquote>
            </div>
          </div>
        </div>
    </div>
  </div>
  <p v-else>讀取中</p>
</template>
  

  