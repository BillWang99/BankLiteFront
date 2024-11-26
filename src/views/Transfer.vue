<script setup>
    import axios from 'axios';
    import { computed, ref, onMounted } from 'vue';
    import { getCurrentInstance } from 'vue';
    import { useStore } from 'vuex';
    import Swal from 'sweetalert2'; 
    import LoaderElement from '@/components/LoaderElement.vue';

    const { proxy } = getCurrentInstance();

    //取得使用者資料
    const store = useStore();
    const userId = computed(() => store.getters.getUserId);

    //帳戶列表
    const acData = ref(null);

    //表單資料
    const data = ({
        originId:0,
        targetId:0,
        money:'',
        userId:userId.value,
    });

    //取出帳戶資料
    const fetchData = async()=>{
        try{
            const response = await axios.get(proxy.$accountsApi);
            if(response.status === 200){
                acData.value = response.data.accountInfos;
            }
        }catch(error){
            console.log(error);
        }
    }

    //
    const outPutId = ref(0);

    //紀錄已選的轉出帳戶
    const handelSelect = ()=>{
        outPutId.value = data.originId;
        if(data.originId == data.targetId){
            Swal.fire({
                title:'轉入帳戶不可與轉出帳戶相同',
                icon:'error',
                confirmButtonColor:'green',
                confirmButtonText:'確定',
            });
            data.targetId = 0;
        }
    }

    //檢查表單
    const checkForm = ()=>{
        if(data.originId == 0){
            Swal.fire({
                title:'請選擇轉出帳戶',
                icon:'info',
                confirmButtonColor:'green',
                confirmButtonText:'確定',
            });
        }else if(data.targetId == 0){
            Swal.fire({
                title:'請選擇轉入帳戶',
                icon:'info',
                confirmButtonColor:'green',
                confirmButtonText:'確定',
            });
        }else if(data.money == 0){
            Swal.fire({
                title:'請輸入轉帳金額',
                text:'金額不可為0',
                icon:'info',
                confirmButtonColor:'green',
                confirmButtonText:'確定',
            });
        }else{
            addTransfer();
        }
    }

    //送出表單
    const addTransfer = async() =>{
        try{
            const response = await axios.post(proxy.$transferApi, JSON.stringify(data), {
                headers:{
                    'Content-Type':'application/json',
                }
            });
            if(response.status === 200){
                Swal.fire({
                    title:'轉帳成功',
                    icon:'success',
                    confirmButtonColor:'green',
                    confirmButtonText:'確定'
                }).then((result)=>{
                    if(result.isConfirmed){
                        location.reload();
                    }
                });
            }
        }catch(error){
            console.log(error);
        }
    }

    onMounted(()=>{
        fetchData();
    });

</script>

<template>
    <div class="container" v-if="acData">
        <h3 class="text-center fw-bold mt-5">轉&nbsp; &nbsp;帳</h3>
        <form class="row" @submit.prevent="checkForm()">
            <div class="col-sm-6 mb-3">
                <label>轉出帳戶</label>
                <select class="form-control" @change="handelSelect()" v-model="data.originId">
                    <option disabled selected :value="0">請選擇..</option>
                    <option v-for="ac in acData" :key="ac.id" :value="ac.id" >{{ ac.name }}</option>
                </select>
            </div>
            <div class="col-sm-6 mb-3">
                <label>轉入帳戶</label>
                <select class="form-control" v-model="data.targetId">
                    <option disabled selected :value="0">請選擇...</option>
                    <option v-for="ac in acData" :value="ac.id" :key="ac.id" :disabled="ac.id == outPutId">{{ ac.name }}</option>
                </select>
            </div>
            <div class="col-sm-12 mb-3">
                <label>轉帳金額</label>
                <input type="number" class="form-control" v-model="data.money">
            </div>
            <div class="col-sm-12 mb-4">
                <button class="btn btn-success d-block w-100">轉帳</button>
            </div>
        </form>
    </div>

    <div v-else>
        <LoaderElement/>
    </div>

</template>