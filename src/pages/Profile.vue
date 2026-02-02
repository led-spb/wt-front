<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { useUsersStore } from '@/stores';
    import { usersApi } from '@/api/users';
    import { NotificationManager } from '@/lib/Notification';
    import { useToast } from 'vuestic-ui';

    const userStore = useUsersStore()
    const toastManager = useToast()

    const userData = ref({
        name: undefined,
        dailyGoal: undefined,
    })

    const isLoading = ref(false)
    const notifyState = ref(false)

    onMounted(() => {
        NotificationManager.hasSubscription().then( (v) => notifyState.value = v)
        userStore.loadUserInfo()
    })

    const userName = computed({
        get: () => userData.value.name || userStore.user?.name,
        set: (value: any) => userData.value.name = value,
    })
    const userGoal = computed({
        get: () => userData.value.dailyGoal || userStore.user?.dailyGoal,
        set: (value :any) => userData.value.dailyGoal = value,
    })

    const updateUserInfo = () => {

        usersApi.updateUserInfo(
            userData.value.name || userStore.user.name,
            userData.value.dailyGoal || userStore.user.dailyGoal
        ).then( (data) => {
            userData.value.name = undefined;
            userData.value.dailyGoal = undefined;

            userStore.loadUserInfo()
        })
    }

    const manageNotifications = computed({
        get: () => {
            return notifyState.value
        },
        set: async (value: any) => {
            isLoading.value = true
            try{
                if( value ){
                    if( await waitForNotifyPermissions() ){
                        const publicKey = await usersApi.getSubscriptionKey()

                        console.log('start subscription')
                        const subscription = await NotificationManager.subscribe(publicKey)
                        console.log(subscription.toJSON())

                        await usersApi.setUserNotifyInfo(JSON.stringify(subscription.toJSON()))
                        notifyState.value = !!subscription
                    }else{
                        toastManager.notify({
                            message: 'Не выданы разрешения на отображение уведомлений',
                            color: 'warning'
                        })
                    }
                }else{
                    const subscription = await NotificationManager.getSubscription()
                    await subscription?.unsubscribe()
                    notifyState.value = await NotificationManager.hasSubscription()

                    await usersApi.setUserNotifyInfo(null)
                }
            }catch(e){
                console.error(e)
                toastManager.notify({
                    message: 'Не удалось включть нотификацию',
                    color: 'warning'
                })
            }finally{
                isLoading.value = false
            }
        }
    })
    const notifyIsSuppoted = computed( () => NotificationManager.isSupported() )
    const notifyPermissions = computed( () => Notification.permission )

    const waitForNotifyPermissions = async (): Promise<boolean> => {
        if( Notification.permission === 'default' ){
            const permission = await Notification.requestPermission();
            return permission === 'granted'
        }
        return Notification.permission === 'granted'
    }

</script>

<template>
    <va-card class="item" v-if="userStore.user">
        <va-inner-loading :loading="isLoading">
            <va-card-title><va-icon name="person" class="card-icon"/>Информация</va-card-title>
            <va-card-content>
                <va-input class="row input" label="Отображаемое имя" :model-value="userName"></va-input>
                <va-button preset="primary" border-color="primary">Сменить пароль</va-button>
                <va-divider/>
            </va-card-content>
            <va-card-title><va-icon name="star" class="card-icon"/>Мои цели</va-card-title>
            <va-card-content>
                <va-slider label="Изучить слов в день" pins track-label-visible :min="20" :max="100" :step="10" class="row iput" v-model="userGoal"></va-slider>
                <va-divider/>
            </va-card-content>
            <va-card-title><va-icon name="notifications_active" class="card-icon"/>Оповещения</va-card-title>
            <va-card-content>
                <va-alert v-if="notifyIsSuppoted && notifyPermissions == 'denied'" color="danger">Нотификации запрещены настройками</va-alert>
                <va-checkbox :disabled="!notifyIsSuppoted"
                    label="Напоминать о задании на день"
                    size="small"
                    v-model="manageNotifications"
                    v-else
                ></va-checkbox>
                <va-divider/>
            </va-card-content>
            <va-card-actions align="right">
                <va-button color="secondary" @click="userName=undefined, userGoal=undefined">Отмена</va-button>
                <va-button color="primary" @click="updateUserInfo()">Сохранить</va-button>
            </va-card-actions>
        </va-inner-loading>
    </va-card>
</template>

<style>
    .input {
        margin-bottom: 0.5rem;
    }
</style>