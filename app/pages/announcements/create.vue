<template>
    <div class="min-h-screen w-full relative bg-offwhite overflow-y-auto overflow-x-hidden pt-[220px] px-[16px] pb-16">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Announcement Information</h2>
                <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title" placeholder="e.g. Club closure notice" :rules="'required|max:255'" optionalMessage="Announcement title" />
                    <DateField label="Date" name="date" v-model="formData.date" placeholder="Select date" :rules="'required'" optionalMessage="Announcement date" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-model="formData.content" :modelValue="formData.content" name="content" label="Content" :max="0" placeholder="Enter announcement content" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <h3 class="font-normal text-base text-black/70">Enabled</h3>
                    <div class="pr-[16px] py-[12px] justify-start gap-[8px] flex">
                        <div @click="formData.enabled = !formData.enabled" class="cursor-pointer w-[40px] h-[24px] rounded-[12px] flex items-center hover:border hover:border-black p-[3px]" :class="{'bg-ui-color justify-end' : formData.enabled, 'bg-light-gray justify-start' : !formData.enabled}">
                            <div class="w-[20px] h-[20px] bg-white rounded-full"></div>
                        </div>
                        {{ formData.enabled ? 'Yes' : 'No' }}
                    </div>
                </div>
            </div>

            <div class="flex self-end gap-[16px]">
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Save Announcement</button>
            </div>
        </Form>
    </div>
</template>

<script setup>
import { usePageTitleStore } from '~/stores/pageTitle';
import { Form } from 'vee-validate';

definePageMeta({
    middleware: 'authenticator'
})

const TextField = defineAsyncComponent(() => import('@/components/TextField.vue'));
const DateField = defineAsyncComponent(() => import('@/components/DateField.vue'));
const Quill = defineAsyncComponent(() => import('@/components/form-fields/Quill.vue'));

const nuxtApp = useNuxtApp();
const pageTitle = usePageTitleStore();

const formData = reactive({
    title: '',
    content: '',
    date: '',
    enabled: true,
});

onMounted(() => {
    pageTitle.setTitle('Add Announcement');
    pageTitle.setBreadcrumbs(['Announcements', 'Announcements List', 'Add Announcement']);
    pageTitle.setPageFrom('Announcements List');
    pageTitle.setPageFromRoute('/announcements');
});

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    form_data.append('content', formData.content || '');
    // date comes from the form's date input (name="date") - don't overwrite with formData.date
    form_data.append('enabled', formData.enabled ? '1' : '0');

    try {
        const response = await nuxtApp.$axios.post('/cms/announcements', form_data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        const record = response.data.record;
        nuxtApp.$toast.success('Announcement created successfully!');
        useRouter().push(`/announcements/${record.id}`);
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error(error?.response?.data?.message || 'Error creating announcement. Please try again.');
    }
};
</script>
