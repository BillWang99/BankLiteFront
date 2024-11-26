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

    //儲存帳戶資料
    const acData = ref(null);

    //儲存表單資料
    const data = ({
        accountId:0,
        event:'',
        method:0,
        note:'',
        money:'',
        fileId:0,
        userId:userId.value,
    });


    //取得帳戶資料
    const fetchData = async() =>{
        try{
            const response = await axios.get(proxy.$accountsApi);
            if(response.status === 200){
                acData.value = response.data;
            }
        }catch(error){
            console.log(error);
        }
    }

    //計算檔案數量
    const files = ref([]); 
    const fileCount = ref(0);

    //檢查附件資料
    const handleFileChange = (event)=>{
        files.value = Array.from(event.target.files);
        fileCount.value = files.value.length;
    }

    //上傳檔案
    const fileUpload = async()=>{
        //檔案集合
        const fileData = new FormData();
        files.value.forEach(file => { 
            fileData.append('files', file); 
        });

        try{
            const response = await axios.post(proxy.$filesApi, fileData, {
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response.status === 200){
                data.fileId = response.data;
                addTransaction();
            }
        }catch(error){
            console.log(error)
        }
    }

    //檢查表單
    const checkForm = ()=>{
        if(data.accountId == ''){
            Swal.fire({
                title:'請選擇帳戶',
                icon:'info',
                confirmButtonColor:'green',
                confirmButtonText:'確定'
            });
        }else if(data.event == ''){
            Swal.fire({
                title:'請輸入交易事件名稱',
                icon:'info',
                confirmButtonColor:'green',
                confirmButtonText:'確定'
            });
        }else if(data.method == ''){
            Swal.fire({
                title:'請選擇交易類型',
                icon:'info',
                confirmButtonColor:'green',
                confirmButtonText:'確定'
            });
        }else if(data.money == ''){
            Swal.fire({
                title:'請輸入交易金額',
                icon:'info',
                confirmButtonColor:'green',
                confirmButtonText:'確定'
            });
        }else{
            if(fileCount.value>0){
                fileUpload();
            }else{
                addTransaction();
            }

        }
    }

    //送出資料
    const addTransaction = async()=>{
        try{
            const response = await axios.post(proxy.$transactionsApi, JSON.stringify(data),{
                headers:{
                    'Content-Type': 'application/json',
                }
            });
            if(response.status === 200){
                Swal.fire({
                    title:'新增成功',
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
            console.log(error)
        }
    }

    onMounted(()=>{
        fetchData();
    })

</script>

<template>
    <div class="container" v-if="acData">
        <h3 class="mt-5 mx-auto text-center fw-bold">新增交易事件</h3>
        <form class="w-75 mx-auto mb-5" @submit.prevent="checkForm()">
            <label>交易事件</label>
            <input type="text" class="form-control" v-model="data.event">
            <br>
            <label>交易金額</label>
            <input type="number" class="form-control" v-model="data.money">
            <br>
            <label>交易類別</label>
            <select class="form-select" v-model="data.method">
                <option disabled selected :value="0">請選擇...</option>
                <option :value="2">支出</option>
                <option :value="1">收入</option>
            </select>
            <br>
            <label>選擇帳戶</label>
            <select class="form-select" v-model="data.accountId">
                <option disabled selected value="">請選擇...</option>
                <option v-for="ac in acData.accountInfos" :value="ac.id">{{ ac.name }}</option>
            </select>
            <br>
            <label>備註</label>
            <textarea class="form-control" v-model="data.note"></textarea>
            <br>
            <label>附件檔</label>
            <input type="file" class="form-control" id="fileInput" @change="handleFileChange" multiple>
            <br>
            <button class="btn btn-success d-block w-100" >新增</button>
        </form>
    </div>

    <!--loader-->
    <div v-else>
        <LoaderElement />
    </div>
</template>