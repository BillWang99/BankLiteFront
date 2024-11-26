<script setup>
    import axios from 'axios';
    import { computed, ref, onMounted } from 'vue';
    import { getCurrentInstance } from 'vue';
    import Swal from 'sweetalert2'; 
    import LoaderElement from '@/components/LoaderElement.vue';

    const { proxy } = getCurrentInstance();

    //存放類別資料
    const data = ref(null);

    //類別名稱input
    const typeName = ref('');

    //存放選擇的類別
    const acType = ref(null);

    //取類別資料
    const fetchData = async()=>{
        try{
            const response = await axios.get(proxy.$accountTypesApi);
            if(response.status === 200){
                data.value = response.data;
            }
        }catch(error){
            console.log(error);
        }
    }

    //取特定id的類別資料
    const getTypeById = async(id)=>{
        try{
            const response = await axios.get(proxy.$accountTypesApi+'/'+id);
            if(response.status === 200){
                acType.value = response.data;
            }
        }catch(error){
            console.log(error);
        }
    }

    //紀錄編輯狀態與正在操作的id
    const isEditing =ref(false);
    const editingId = ref();

    //開啟類別名稱編輯欄位
    const enableEdit = (id)=>{
        if(isEditing.value == false){
            const inputLabel = document.getElementById(id);
            inputLabel.removeAttribute('readonly');
            inputLabel.classList.add('border-danger');
            inputLabel.classList.add('bg-success-subtle');
            isEditing.value = true;
            editingId.value = id;
        }else{
            Swal.fire({
                title:'請先儲存目前編輯項目',
                icon:'info',
                confirmButtonColor:'green',
                confirmButtonText:'確定',
            })
        }
    }

    //編輯名稱
    const updateType = async(id)=>{
        typeName.value = document.getElementById(id).value;
        try{
            const response = await axios.put(proxy.$accountTypesApi+'/'+id, JSON.stringify(typeName.value), {
                headers:{
                    'Content-Type': 'application/json',
                }
            });
            if(response.status === 200){
                fetchData();
                cancelEdit(id);
            }
        }catch(error){
            console.log();
        }
    }

    //取消編輯
    const cancelEdit = (id)=>{
        const inputLabel = document.getElementById(id);
        inputLabel.setAttribute('readonly','');
        inputLabel.classList.remove('border-danger');
        inputLabel.classList.remove('bg-success-subtle');
        isEditing.value = false;
        editingId.value = '';
    }

    //新增類別時檢查名稱是否空白
    const checkForm = ()=>{
        if(typeName.value == '' || typeName.value == null){
            Swal.fire({
                title:'請輸入類別名稱',
                icon:'info',
                confirmButtonText:'確定',
            });
        }else{
            addType(typeName.value);
        }
    }

    //新增類別
    const addType = async(typename)=>{
        try{
            const response = await axios.post(proxy.$accountTypesApi, JSON.stringify(typename), {
                headers:{
                    'Content-Type': 'application/json',
                }
            });

            if(response.status === 200){
                fetchData();
                const myModalEl = document.getElementById('addType');
                const modal = bootstrap.Modal.getInstance(myModalEl);                  
                modal.hide();
            }
        }catch(error){
            console.log(error);
        }
    }

    //刪除類別
    const delType = async(id)=>{
        const result = await Swal.fire({
            'title':'確定刪除此分類?',
            'icon':'info',
            showCancelButton:true,
            confirmButtonColor:'green',
            confirmButtonText:'確定',
            cancelButtonText:'取消',
        });
        if(result.isConfirmed){
            try{
                const response = await axios.delete(proxy.$accountTypesApi+'/'+id);

                if(response.status === 200 || response.status === 204){
                    Swal.fire({
                        'title':response.data,
                        'icon':'info',
                        confirmButtonColor:'green',
                        confirmButtonText:'確定',
                    });
                    fetchData();
                }
            }catch(error){
                console.log(error);
            }
        }
        
    }

    onMounted(()=>{
        fetchData();
    });
</script>

<template>
    <div class="container mt-5" v-if="data">
        <h3 class="text-center fw-bold">帳戶類別</h3>
        <!--新增帳戶類別按鈕-->
        <div class="d-flex justify-content-center mt-4">
            <button type="button" class="btn btn-success " data-bs-toggle="modal" data-bs-target="#addType">
                新增類別 <i class="bi bi-plus"></i>
            </button>
        </div>

        <!--帳戶類別區塊-->
        <div class="row mx-auto mt-4">
            <div class="col-sm-4 " v-for="typ in data">
                <div class="card mb-3 acitem bg-success bg-opacity-75 text-white">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div class="d-inline-block">
                            <input type="text" class="form-control bg-secondary-subtle" :id="typ.id" :value="typ.name" readonly>
                        </div>

                        <div class="d-inline text-end option" v-if="isEditing && typ.id == editingId">
                            <span class="option-btn" @click="updateType(typ.id)">
                                <i class="bi bi-floppy2"></i>
                                <span class="btn-text">儲存</span>
                            </span>
                            &nbsp; &nbsp;
                            <span class="option-btn" @click="cancelEdit(typ.id)">
                                <i class="bi bi-arrow-return-left"></i>
                                <span class="btn-text" >取消</span>
                            </span>
                        </div>

                        <div class="d-inline text-end option" v-else>
                            <span class="option-btn" @click="enableEdit(typ.id)">
                                <i class="bi bi-pen" ></i>
                                <span class="btn-text">編輯</span>
                            </span>
                            &nbsp; &nbsp;
                            <span class="option-btn" @click="delType(typ.id)">
                                <i class="bi bi-trash"></i>
                                <span class="btn-text">刪除</span>
                            </span>
                        </div>

                        
                        
                    </div>
                </div>
            </div>
        </div>
    </div>

     <!--loading動畫-->
     <div v-else>
        <LoaderElement/>
    </div>

    <!--新增類別modal-->
    <div class="modal fade" id="addType" tabindex="-1" aria-labelledby="addAccountModel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5 fw-bold" id="addAccountModel">新增類別</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input class="form-control" placeholder="請輸入類別名稱" v-model="typeName">
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
    .option-btn{
        cursor: pointer;
    }

    .card{
        width:100%;
    }

    .card input{
        width:80%;
    }

    .card .option{
        width:200px;
    }


    @media (max-width:1024px){
        .btn-text{
            display: none;
        }
    }
</style>