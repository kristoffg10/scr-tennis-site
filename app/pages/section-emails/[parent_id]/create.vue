<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Email Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title" placeholder="e.g. General Inquiry" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Email" name="email" v-model="formData.email" type="email" placeholder="e.g. info@example.com" :rules="'required|email|max:255'"
                        optionalMessage="Valid email address" />
                </div>
            </div>

            <div class="flex self-end gap-[16px]">
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Create
                    Email</button>
            </div>
        </Form>
    </div>
</template>

<script setup>
import { usePageTitleStore } from '~/stores/pageTitle';
import { Form } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';

definePageMeta({
    middleware: 'authenticator'
})

const nuxtApp = useNuxtApp();
const route = useRoute();
const router = useRouter();
const pageTitle = usePageTitleStore();
const parentId = route.params.parent_id;

const formData = reactive({
    title: '',
    email: '',
    sequence: 0
})

onMounted(() => {
    pageTitle.setTitle(`Create Email`);
    pageTitle.setBreadcrumbs(['Section Emails', 'Create Email']);
    pageTitle.setPageFrom('Section Emails');
    pageTitle.setPageFromRoute(`/section-emails/${parentId}`);
});

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    // API auto-assigns sequence on create; send placeholder so validation accepts request
    form_data.set('sequence', '1');

    try {
        await nuxtApp.$axios.post(`/cms/section-email/${parentId}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            nuxtApp.$toast.success('Email created successfully!');
            router.push(`/section-emails/${parentId}`);
        });
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error creating email. Please try again.');
    }
}
</script>
