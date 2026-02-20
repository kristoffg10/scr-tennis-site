<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form v-if="recordData" id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">FAQ Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Question" name="title" v-model="formData.title" placeholder="e.g. What is covered under this plan?" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-if="isClient" v-model="formData.answer" :modelValue="formData.answer"
                        name="answer" label="Answer" :max="0"
                        placeholder="e.g. This plan covers..." />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Sequence" name="sequence" v-model="formData.sequence" type="number" placeholder="e.g. 1" :rules="'required|numeric'"
                        optionalMessage="Display order" />
                </div>
            </div>

            <div class="flex self-end gap-[16px]">
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Save Changes</button>
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

const Quill = defineAsyncComponent(() => {
    return import('@/components/form-fields/Quill.vue')
})

const nuxtApp = useNuxtApp();
const route = useRoute();
const pageTitle = usePageTitleStore();
const planId = route.params.planId;
const id = route.params.id;

const formData = reactive({
    title: '',
    answer: '',
    sequence: 0
})

const recordData = ref(null);
const isClient = ref(false);

onMounted(() => {
    pageTitle.setTitle(`Edit FAQ`);
    pageTitle.setBreadcrumbs(['Plans', 'FAQs', 'Edit FAQ']);
    pageTitle.setPageFrom('FAQs');
    pageTitle.setPageFromRoute('/plans/faqs');
    isClient.value = true;
    fetchRecords();
});

const fetchRecords = async () => {
    try {
        const response = await nuxtApp.$axios.get(`/cms/plan-faq/${planId}/${id}`);
        recordData.value = response.data.record;
        populateData(recordData.value);
    } catch (error) {
        console.error('Error:', error);
    }
};

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    form_data.set('answer', formData.answer || '');
    form_data.append('_method', 'PATCH');

    try {
        const response = await nuxtApp.$axios.post(`/cms/plan-faq/${planId}/${id}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const record = response.data.record;
            populateData(record);
            nuxtApp.$toast.success('FAQ updated successfully!');
        });

    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error updating FAQ. Please try again.');
    }
}

const populateData = (data) => {
    formData.title = data.title || '';
    formData.answer = data.answer || '';
    formData.sequence = data.sequence || 0;
}
</script>
