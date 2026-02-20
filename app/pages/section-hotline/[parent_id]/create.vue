<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Hotline Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title" placeholder="e.g. Landline" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Primary Number" name="primary_number" v-model="formData.primary_number" placeholder="e.g. +63283730002" :rules="'required|max:50'"
                        optionalMessage="Primary contact number" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Secondary Number" name="secondary_number" v-model="formData.secondary_number" placeholder="e.g. +639612345678 (optional)" :rules="'max:50'"
                        optionalMessage="Optional secondary number" />
                </div>
            </div>

            <div class="flex self-end gap-[16px]">
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Create
                    Hotline</button>
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
    type: 'landline',
    primary_number: '',
    secondary_number: '',
    sequence: 1,
})

onMounted(() => {
    pageTitle.setTitle(`Create Hotline`);
    pageTitle.setBreadcrumbs(['Section Hotlines', 'Create Hotline']);
    pageTitle.setPageFrom('Section Hotlines');
    pageTitle.setPageFromRoute(`/section-hotline/${parentId}`);
});

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    // API auto-assigns sequence on create; send placeholder so validation accepts request
    form_data.set('sequence', '1');
    form_data.set('type', formData.type);

    try {
        await nuxtApp.$axios.post(`/cms/section-hotline/${parentId}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            nuxtApp.$toast.success('Hotline created successfully!');
            router.push(`/section-hotline/${parentId}`);
        });
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error creating hotline. Please try again.');
    }
}
</script>
