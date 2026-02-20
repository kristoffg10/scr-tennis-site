<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">FAQ Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title" placeholder="e.g. What is this?" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-if="isClient" v-model="formData.answer" :modelValue="formData.answer" :name="`answer`" :label="`Answer`" 
                        :max="0" :placeholder="`Enter answer`"/>
                </div>
            </div>

            <div class="flex self-end gap-[16px]">
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Create
                    FAQ</button>
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

const Quill = defineAsyncComponent(() => {
    return import('@/components/form-fields/Quill.vue')
})

const nuxtApp = useNuxtApp();
const isClient = ref(false);
const route = useRoute();
const router = useRouter();
const pageTitle = usePageTitleStore();
const parentId = route.params.parent_id;

const formData = reactive({
    title: '',
    answer: '',
    sequence: 0
})

onMounted(() => {
    isClient.value = true;
    pageTitle.setTitle(`Create FAQ`);
    pageTitle.setBreadcrumbs(['Section FAQs', 'Create FAQ']);
    pageTitle.setPageFrom('Section FAQs');
    pageTitle.setPageFromRoute(`/section-faqs/${parentId}`);
});

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    form_data.set('answer', formData.answer || '');
    // API auto-assigns sequence on create; send placeholder so validation accepts request
    form_data.set('sequence', '1');

    try {
        await nuxtApp.$axios.post(`/cms/section-faq/${parentId}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            nuxtApp.$toast.success('FAQ created successfully!');
            router.push(`/section-faqs/${parentId}`);
        });
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error creating FAQ. Please try again.');
    }
}
</script>
