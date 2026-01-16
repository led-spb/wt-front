<script setup lang="ts">
    import { useAuthStore, useUsersStore } from '@/stores';
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useModal } from 'vuestic-ui';

    const router = useRouter()

    onMounted(async () => {
        const { confirm } = useModal();

        const result = await confirm({
            message: "Выйти из системы?",
            noDismiss: true,
            maxWidth: "360px",
        });
        if( result ){
            useAuthStore().setAccessToken("")
            useUsersStore().currentUser = undefined
            router.push({name: 'login'})
        }else{
            router.back()
        }
    })

</script>

<template>

</template>