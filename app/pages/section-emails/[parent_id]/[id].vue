<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form v-if="emailData" id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
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
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Sequence" name="sequence" v-model="formData.sequence" type="number" placeholder="e.g. 1" :rules="'required|numeric'"
                        optionalMessage="Display order" />
                </div>
            </div>

            <div class="flex self-end gap-[16px]">
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Save
                    Changes</button>
            </div>
        </Form>
    </div>
</template>

<script setup>
import { usePageTitleStore } from '~/stores/pageTitle';
import { Form } from 'vee-validate';
import { useRoute } from 'vue-router';

definePageMeta({
    middleware: 'authenticator'
})

const nuxtApp = useNuxtApp();
const route = useRoute();
const pageTitle = usePageTitleStore();
const id = route.params.id;
const parentId = route.params.parent_id;

const formData = reactive({
    title: '',
    email: '',
    sequence: 0
})

const emailData = ref(null);

onMounted(() => {
    pageTitle.setTitle(`Edit Email`);
    pageTitle.setBreadcrumbs(['Section Emails', 'Edit Email']);
    pageTitle.setPageFrom('Section Emails');
    pageTitle.setPageFromRoute(`/section-emails/${parentId}`);
    fetchRecords();
});

const fetchRecords = async () => {
    try {
        const email_response = await nuxtApp.$axios.get(`/cms/section-email/${parentId}/${id}`);
        emailData.value = email_response.data.record;
        populateData(emailData.value);
    } catch (error) {
        console.error('Error:', error);
    }
};

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    form_data.set('sequence', formData.sequence);
    form_data.append('_method', 'PATCH');

    try {
        await nuxtApp.$axios.post(`/cms/section-email/${parentId}/${id}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const record = response.data.record;
            populateData(record);
            nuxtApp.$toast.success('Email updated successfully!');
        });
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error updating email. Please try again.');
    }
}

const populateData = (data) => {
    formData.title = data.title || '';
    formData.email = data.email || '';
    formData.sequence = data.sequence || 0;
}
</script>
