<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Tab Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title" placeholder="e.g. Tab Title" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div v-if="showContentFields" class="grid grid-cols-1 gap-[16px]">
                    <Quill v-if="isClient" v-model="formData.content_1" :modelValue="formData.content_1" :name="`content_1`" :label="`Content 1`" 
                        :max="0" :placeholder="`Enter content 1`"/>
                </div>
                <div v-if="showContentFields" class="grid grid-cols-1 gap-[16px]">
                    <Quill v-if="isClient" v-model="formData.content_2" :modelValue="formData.content_2" :name="`content_2`" :label="`Content 2`" 
                        :max="0" :placeholder="`Enter content 2`"/>
                </div>

                <hr v-if="showMainImageUpload" class="h-[1px] w-full border-gray">
                <ImageHandler
                    v-if="showMainImageUpload"
                    label="Main Image"
                    max="1"
                    size="5"
                    :dimension="{ width: 800, height: 600 }"
                    :input_payload="{
                        identifier: 'main_image',
                        id: 'main_image_id',
                        category: 'main_image_category',
                        category_value: 'main_image',
                        alt: 'main_image_alt',
                    }"
                    :existing_images="[]"
                    @update:file="handleFileUpdate(`main_image`, $event)"
                />
            </div>

            <!-- PDF upload for Corporate Governance sidebar section tabs -->
            <div
                v-if="isCorporateGovernanceSidebarSection"
                class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full"
            >
                <h2 class="font-semibold text-xl text-start w-full">PDF Files</h2>
                <p class="text-sm text-black/60">
                    Upload a PDF file for this tab.
                </p>
                <ImageHandler
                    label="PDF Files"
                    max="1"
                    size="10"
                    :fileAlt="true"
                    acceptedFormats="application/pdf"
                    :allowMultiple="false"
                    :showTitle="false"
                    :input_payload="{
                        identifier: 'pdf',
                        id: 'pdf_id',
                        category: 'pdf_category',
                        category_value: 'pdf',
                        alt: 'pdf_alt',
                        title: 'pdf_title'
                    }"
                    :existing_images="[]"
                    @update:file="handleFileUpdate('pdf', $event)"
                />
            </div>

            <div class="flex self-end gap-[16px]">
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Create
                    Tab</button>
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

const ImageHandler = defineAsyncComponent(() => {
    return import('@/components/form-fields/ImageHandler.vue')
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
    content_1: '',
    content_2: '',
    // Default to 1 for UX, but backend will still
    // auto-assign the actual sequence value on create.
    sequence: 1,
    main_image: [],
    pdf: []
})

const isCorporateGovernanceSidebarSection = computed(
    () => parentId === '563152e1-6744-4ad8-a525-83061fb2076c'
);

const hideMainImageForParentIds = [
    '515a7602-82ed-47dc-8236-4e0e9ab3e57f',
    '8e9c9978-ce11-4e33-8ad6-fadbaa9b8995',
    '1f458320-4ebb-4200-aecc-f7547e798948',
    '544f0ae5-920b-43b1-912f-5955795e844c',
];
const showMainImageUpload = computed(
    () => !isCorporateGovernanceSidebarSection.value && !hideMainImageForParentIds.includes(route.params.parent_id)
);

const hideContentForParentIds = ['544f0ae5-920b-43b1-912f-5955795e844c'];
const showContentFields = computed(
    () => !isCorporateGovernanceSidebarSection.value && !hideContentForParentIds.includes(route.params.parent_id)
);

onMounted(() => {
    isClient.value = true;
    pageTitle.setTitle(`Create Tab`);
    pageTitle.setBreadcrumbs(['Section Tabs', 'Create Tab']);
    pageTitle.setPageFrom('Section Tabs');
    pageTitle.setPageFromRoute(`/section-tabs/${parentId}`);
});

const handleFileUpdate = (field, file) => {
    formData[field] = file;
};

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    
    if (formData.main_image && formData.main_image.length > 0) {
        formData.main_image.forEach((file) => {
            form_data.append(`main_image[]`, file)
        });
    }

    // Append PDF file(s) for Corporate Governance sidebar section tabs
    if (formData.pdf && formData.pdf.length > 0) {
        formData.pdf.forEach((file) => {
            form_data.append(`pdf[]`, file)
        });
    }

    form_data.set('content_1', formData.content_1 || '');
    form_data.set('content_2', formData.content_2 || '');

    // API auto-assigns sequence on create; send placeholder so validation accepts request
    form_data.set('sequence', '1');

    try {
        await nuxtApp.$axios.post(`/cms/section-tab/${parentId}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            nuxtApp.$toast.success('Tab created successfully!');
            router.push(`/section-tabs/${parentId}`);
        });
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error creating tab. Please try again.');
    }
}
</script>
