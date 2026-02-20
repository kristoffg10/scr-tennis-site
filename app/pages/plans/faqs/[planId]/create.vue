<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">FAQ Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Question" name="title" placeholder="e.g. What is covered under this plan?" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-if="isClient" v-model="formData.answer" :modelValue="formData.answer"
                        name="answer" label="Answer" :max="0"
                        placeholder="e.g. This plan covers..." />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Sequence" name="sequence" type="number" placeholder="e.g. 1" :rules="'required|numeric'"
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
const isClient = ref(false);

const formData = reactive({
    answer: ''
});

onMounted(() => {
    pageTitle.setTitle(`Add FAQ`);
    pageTitle.setBreadcrumbs(['Plans', 'FAQs', 'Add FAQ']);
    pageTitle.setPageFrom('FAQs');
    pageTitle.setPageFromRoute('/plans/faqs');
    isClient.value = true;
});

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    form_data.set('answer', formData.answer || '');

    // Ensure backend validation has the plan context
    form_data.append('plan_id', planId);

    try {
        const response = await nuxtApp.$axios.post(`/cms/plan-faq/${planId}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const record = response.data.record;
            nuxtApp.$toast.success('FAQ created successfully!');
            useRouter().push(`/plans/faqs`);
        });

    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error creating FAQ. Please try again.');
    }
}
</script>
