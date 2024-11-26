<script setup>
    import {ref} from 'vue';
    import axios from 'axios';
    import {useStore} from 'vuex';
    import { useRouter } from 'vue-router';
    import Swal from 'sweetalert2';
    import { getCurrentInstance } from 'vue';
 
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    
    //LoginForm
    const loginForm = {
        account:'',
        password:'',
    };
    
    //密碼檢驗狀態
    const isPasswordValid = ref(false);


    const checkPassword = () =>{
        if(loginForm.password.length >= 8){
            isPasswordValid.value = true;
        }else{
            isPasswordValid.value = false;
        }
    }



    //送出登入表單
    const submitForm = async() => {
        //檢查密碼長度
        if(isPasswordValid.value){
            try{
                const response = await axios.post(proxy.$loginApi, JSON.stringify(loginForm), {
                    headers:{
                        'Content-Type': 'application/json',
                    }
                });
                const data = response.data;
                
                //儲存資料
                await store.dispatch('login', data);
                router.push('/');
            }catch(error){
                Swal.fire({
                    title: error.response.data,
                    icon: 'error',
                    confirmButtonText: '確定'
                });
                console.log(error);
            }
        }else{
            alert('密碼最少須8個字元');
        }  
    }

</script>

<template>
    <div class="container">
        <div class="mx-auto 
        border 
        rounded  
        bg-success-subtle 
        shadow p-3 mb-5 
        position-absolute top-50 start-50 
        translate-middle">
            <h3 class="text-center fw-bold">登入</h3>
            <form @submit.prevent="submitForm">
                <label class="fw-bold"><i class="bi bi-person-fill"></i>帳號</label>
                <input type="text" v-model="loginForm.account" class="form-control"/>
                <br>
                <label class="fw-bold"><i class="bi bi-lock-fill"></i>密碼</label>
                <input type="password" v-model="loginForm.password" class="form-control" 
                   @input="checkPassword()" />
                <br>
                <button type="submit" class="btn btn-success d-block w-100">送出</button>
            </form>
        </div> 
    </div>
</template>

<style>
    .container{
        height:100%;
    }
</style>