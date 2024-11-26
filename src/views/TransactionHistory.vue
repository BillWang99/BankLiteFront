<script setup>
    import axios from 'axios';
    import { computed, ref, onMounted } from 'vue';
    import { getCurrentInstance } from 'vue';
    import Swal from 'sweetalert2'; 
    import LoaderElement from '@/components/LoaderElement.vue';

    const {proxy} = getCurrentInstance();

    //帳戶資料
    const acData = ref(null);

    //表單資料
    const data = ({
        startDate:'',
        endDate:'',
        accountId:0,
        methodId:0
    });

    //交易紀錄
    const historyData = ref(null);

    //取得資料
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

    //送出表單
    const sendForm = async()=>{
        console.log(data)
        try{
            const response = await axios.post(proxy.$transactionsApi+'/history', JSON.stringify(data), {
                headers:{
                    'Content-Type':'application/json',
                }
            });
            if(response.status === 200){
                historyData.value = response.data;
                console.log(historyData.value);
            }
        }catch(error){
            console.log(error);
        }
    }

    //交易明細資料
    const historyInfo = ref(null);
    const modalLoading = ref(true);

    //查詢明細
    const gethistoryInfo = async(id)=>{
        try{
            const response = await axios.get(proxy.$transactionsApi+'/'+id);
            if(response.status === 200){
                historyInfo.value = response.data;
                modalLoading.value = false;
            }
        }catch(error){
            console.log(error);
        }
    }

    //預覽圖片(預設否)
    const isPreviewOpen = ref(false);

    //
    const imageSrc = ref('');

    // 開啟預覽
     const openPreview = (path) => { 
        imageSrc.value=path;
        isPreviewOpen.value = true; 
    }; 

    // 關閉預覽 
    const closePreview = () => { 
        isPreviewOpen.value = false; 
    };

    onMounted(()=>{
        fetchData();
    });

</script>

<template>
    <div class="container" v-if="acData">
        <h3 class="text-center mt-5 fw-bold">查詢交易紀錄</h3>
        <div class="row w-75 mx-auto" >
            <div class="col-sm-6 mb-3">
                <label>起始時間</label>
                <input type="date" class="form-control" v-model="data.startDate">
            </div>
            <div class="col-sm-6 mb-3">
                <label>截止時間</label>
                <input type="date" class="form-control" v-model="data.endDate">
            </div>
            <div class="col-sm-6 mb-3">
                <label>帳戶</label>
                <select class="form-select" v-model="data.accountId">
                    <option :value="0">全部帳戶</option>
                    <option v-for="ac in acData" :key="ac.id" :value="ac.id">{{ ac.name }}</option>
                </select>
            </div>
            <div class="col-sm-6 mb-3">
                <label>交易類型</label>
                <select class="form-select" v-model="data.methodId">
                    <option :value="0">全部類型</option>
                    <option :value="2">支出</option>
                    <option :value="1">收入</option>
                    <option :value="3">轉帳</option>
                </select>
            </div>
            <div class="col-sm-12">
                <button class="btn btn-success d-block w-100" @click="sendForm()">查詢</button>
            </div>
        </div>

        <!--交易紀錄-->
        <table class="table table-hover w-75 mx-auto mt-5" v-if="historyData">
            <thead>
                <tr>
                    <th class="min-hide">日期</th>
                    <th class="min-hide">帳戶</th>
                    <th class="min-hide">交易方式</th>
                    <th>事件</th>
                    <th class="min-hide">金額</th>
                    <th><i class="bi bi-search"></i></th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="h in historyData" :key="h.Id">
                    <td class="min-hide">{{ h.createTime }}</td>
                    <td class="min-hide">{{ h.accountName }}</td>
                    <td class="min-hide">{{ h.methodName}}</td>
                    <td>{{ h.event }}</td>
                    <td class="min-hide">{{ h.money }}</td>
                    <td>
                        <button class="btn btn-outline-success" 
                         data-bs-toggle="modal" 
                         data-bs-target="#transactionInfo"
                         @click="gethistoryInfo(h.id)" 
                        >
                            <i class="bi bi-send"></i><span class="min-hide">查看</span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!--交易明細-->
        <div class="modal fade" id="transactionInfo" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">交易明細</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" v-if="historyInfo">
                    <label>帳戶</label>
                    <input type="text" class="form-control" v-model="historyInfo.accountName" readonly>
                    <label>事件</label>
                    <input type="text" class="form-control" v-model="historyInfo.event" readonly>
                    <label>交易類型</label>
                    <input type="text" class="form-control" v-model="historyInfo.methodName" readonly>
                    <label>金額</label>
                    <input type="text" class="form-control" v-model="historyInfo.money" readonly>
                    <label>備註</label>
                    <textarea class="form-control" v-model="historyInfo.note" readonly></textarea>
                    <div class="row mt-3">
                        <div class="col-sm-4" v-for="p in historyInfo.filesPath">
                            <img :src="p" class="img-fluid" @click="openPreview(p)">
                        </div>
                    </div>
                </div>
                <div class="modal-body" v-else>
                    <LoaderElement/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else>
        <LoaderElement/>
    </div>

    <div v-if="isPreviewOpen" class="overlay" @click="closePreview"> 
        <img :src="imageSrc" class="preview-image" alt="Preview"/> 
    </div>

</template>

<style>
    @media only screen and (max-width:700px){
        .min-hide{
            display: none;
        }
    } 
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%; 
        background: rgba(0, 0, 0, 0.8);
        /* 半透明背景 */ 
        display: flex; 
        align-items: center; 
        justify-content: center;
        cursor: pointer;
        z-index: 100000;
    } 
    .preview-image { 
        max-width: 90%; 
        max-height: 90%; 
    }
</style>