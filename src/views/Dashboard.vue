<!--dashboard僅顯示-->
<script setup>
  import { computed, ref, onMounted } from 'vue';
  import axios from 'axios'
  import { useStore } from 'vuex';
  import { getCurrentInstance } from 'vue';
  import Swal from 'sweetalert2';
  import LoaderElement from '@/components/LoaderElement.vue';

  const store = useStore();
  const user = computed(() => store.getters.getUser);
  const { proxy } = getCurrentInstance();

  //data存放帳戶資訊
  const data = ref(null);

  //types存放帳戶類別
  const types = ref(null);

  //取出帳戶資料
  const fetchData = async()=>{
    try{
      const response = await axios.get(proxy.$accountsApi);
      data.value = response.data;
      console.log(response.data)
    }catch(error){
      console.log(error)
    }
  }

  //取出帳戶類別資料
  const getAccountTypes = async() =>{
    try{
      const response = await axios.get(proxy.$accountTypesApi);
      types.value = response.data;
      console.log(response.data);
    }catch(error){
      console.log(error)
    }
  }

  //新增帳戶表單
  const formData = {
    name:'',
    type:'',
    money:'',
  }

  //針對輸入金額進行過濾(僅能為正整數)
  const handelInput = () =>{
    formData.money = formData.money.replace(/\D/g, '');
  }

  //檢查表單資料
  const checkForm = () =>{
    if(formData.name == ''){
      Swal.fire({
          title: '請填寫帳戶名稱',
          icon: 'info',
          confirmButtonText: '確定'
      });
    }else if(formData.money == ''){
      Swal.fire({
        title:'請填寫金額',
        icon:'info',
        confirmButtonText:'確定',
      });
    }else if(formData.type == ''){
      Swal.fire({
        title:'請選擇類別',
        icon:'info',
        confirmButtonText:'確定',
      });
    }else{
      addAccount();
    }
  }

  //新增帳戶
  const addAccount = async() =>{
    try{
      const response = await axios.post(proxy.$accountsApi, JSON.stringify(formData), {
        headers:{
          'Content-Type': 'application/json',
        }
      });

      //如果新增成功，關閉modal並重新取資料
      if(response.status === 200){
        fetchData();
        const myModalEl = document.getElementById('addAccount');
        const modal = bootstrap.Modal.getInstance(myModalEl);                  
        modal.hide();
      }
    }catch(error){
      console.log(error);
    }
  }

  //刪除帳號
  const delAc = async(id) => {
    const result = await
    Swal.fire({
      title: "確定刪除此帳戶?",
      showCancelButton: true,
      confirmButtonText: "刪除",
      cancelButtonText:"取消",
      confirmButtonColor:"green",
    });
    if(result.isConfirmed){
      try{
          const response =  await axios.delete(proxy.$accountsApi+'/'+id);
          if(response.status === 200 || response.status === 204){
            fetchData();
            //location.reload();
          }
        }catch(error){
          console.log(error);
        }
    }  
  }

  //渲染完畢後，發API取資料
  onMounted(()=>{
        fetchData();
        getAccountTypes();
  });
</script>

<!-- Dashboard.vue -->
<template>
  <div class="container mt-5 " v-if="data">
    <h1 class="text-center fw-bold">總餘額:{{ data.totalMoney }}元</h1>

    <!--新增帳戶按鈕-->
    <div class="d-flex justify-content-center mt-4">
      <button type="button" class="btn btn-success " data-bs-toggle="modal" data-bs-target="#addAccount">
        新增帳戶 <i class="bi bi-plus"></i>
      </button>
    </div>
    
    <!--帳戶區塊-->
    <div class="row mx-auto mt-4">
      <div class="col-sm-4 " v-for="ac in data.accountInfos">
        <div class="card mb-3 acitem">
          <div class=" card-header bg-success p-2 text-white bg-opacity-75 d-flex justify-content-between">
              <div class="d-inline">
                <i class="bi bi-wallet2"></i> &nbsp; {{ ac.name }}  
              </div>
              <div class=" d-inline">
                <span class="delete-btn " @click="delAc(ac.id)"><i class="bi bi-trash"></i>刪除</span>
              </div> 
          </div>
          <div class="card-body bg-success-subtle">
              <blockquote class="blockquote mb-0">
                <p>餘額:{{ ac.money }}元</p>
                <footer class="">類型:{{ ac.typeName }}</footer>
              </blockquote>
            </div>
          </div>
        </div>
    </div>
  </div>
  
  <div  v-else>
    <LoaderElement/>
  </div>
  
  <!-- Modal -->
  <div class="modal fade" id="addAccount" tabindex="-1" aria-labelledby="addAccountModel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 fw-bold" id="addAccountModel">新增帳戶</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <label>帳戶名稱</label>
          <input type="text" class="form-control" placeholder="請輸入帳戶名稱" v-model="formData.name"><br>
          <label>初始金額</label>
          <input type="number" class="form-control" placeholder="請輸入金額(僅限正整數)" v-model="formData.money" @input="handelInput()"><br>
          <label>帳戶類別</label>
          <select class="form-select" v-model="formData.type">
            <option disabled selected value="">請選擇類別</option>
            <option v-for="t in types" :value="t.id">{{ t.name }}</option>
          </select>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-success" @click="checkForm()">新增</button>
        </div>
      </div>
    </div>
  </div>

</template>

<style>
  .acitem{
    transition: background-color 0.5s ease, transform 0.7s ease; /* 設置背景顏色和變換效果的持續時間 */
  }
  .acitem:hover{
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translate(0px, -10px);
  }
  .delete-btn{
    cursor:pointer;
  }

  
</style>  

  