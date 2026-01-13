<script setup lang="ts">
    import { useAuthStore, useUsersStore } from '@/stores';
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useModal } from 'vuestic-ui';

    const router = useRouter()

    onMounted(() => {
        const { confirm } = useModal();

        confirm("Выйти из системы?")
            .then((ok) => {
                if( ok ){
                    useAuthStore().setAccessToken("")
                    useUsersStore().currentUser = undefined
                    router.push({name: 'login'})
                }else{
                    router.back()
                }
            })
    })

</script>

<template>

</template>