<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <div class="flex items-center justify-between w-full gap-4">
                    <h2 class="font-semibold text-xl text-start">Annual Report Information</h2>
                    <div class="flex items-center gap-[12px] shrink-0">
                        <label class="text-base font-medium text-black/70">Featured</label>
                        <button
                            type="button"
                            @click="formData.featured = !formData.featured"
                            class="w-10 h-6 rounded-xl flex items-center p-0.5 transition-colors shrink-0"
                            :class="formData.featured ? 'bg-ui-color justify-end' : 'bg-light-gray justify-start'">
                            <div class="w-5 h-5 bg-white rounded-full shadow-sm"></div>
                        </button>
                        <span class="text-sm text-black/60">{{ formData.featured ? 'On' : 'Off' }}</span>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="Title" name="title" placeholder="e.g. Annual Report 2024" :rules="'required|max:255'" optionalMessage="Max 255 characters" />
                    <TextField label="Subtitle" name="subtitle" placeholder="e.g. Year in Review" :rules="'max:255'" optionalMessage="Optional" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-model="formData.description" :modelValue="formData.description" name="description" label="Description" :max="0" placeholder="Enter description" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <h3 class="font-medium text-base">Main Image</h3>
                    <ImageHandler label="Main Image" :data="[]" max="1" size="5"
                        :dimension="{ width: 1200, height: 630 }"
                        :input_payload="{
                            identifier: 'main_image',
                            id: 'main_image_id',
                            category: 'main_image_category',
                            category_value: 'main_image',
                            alt: 'main_image_alt',
                        }"
                        ref="imageHandlerRef"
                        v-model="formData.main_image"
                        @update:file="(file) => { formData.main_image = file; }" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <h3 class="font-medium text-base">PDF File</h3>
                    <p class="text-sm text-black/60">Upload the annual report PDF file.</p>
                    <ImageHandler label="PDF File" :data="[]" max="1" size="10"
                        acceptedFormats="application/pdf"
                        :input_payload="{
                            identifier: 'pdf',
                            id: 'pdf_id',
                            category: 'pdf_category',
                            category_value: 'pdf',
                            alt: 'pdf_alt',
                        }"
                        ref="pdfHandlerRef"
                        v-model="formData.pdf"
                        @update:file="(file) => { formData.pdf = file; }" />
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

definePageMeta({
    middleware: 'authenticator'
})

const TextField = defineAsyncComponent(() => import('@/components/TextField.vue'));
const Quill = defineAsyncComponent(() => import('@/components/form-fields/Quill.vue'));
const ImageHandler = defineAsyncComponent(() => import('@/components/form-fields/ImageHandler.vue'));
const nuxtApp = useNuxtApp();
const pageTitle = usePageTitleStore();

const formData = reactive({
    description: '',
    featured: false,
    main_image: null,
    pdf: []
});

onMounted(() => {
    pageTitle.setTitle('Add Annual Report');
    pageTitle.setBreadcrumbs(['Annual Reports', 'Annual Reports List', 'Add Annual Report']);
    pageTitle.setPageFrom('Annual Reports List');
    pageTitle.setPageFromRoute('/annual-reports');
});

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    form_data.append('description', formData.description || '');
    form_data.append('featured', formData.featured ? '1' : '0');
    
    if (formData.main_image && formData.main_image.length > 0) {
        formData.main_image.forEach((file) => {
            form_data.append('main_image[]', file);
        });
    } else if (formData.main_image && formData.main_image instanceof File) {
        form_data.append('main_image[]', formData.main_image);
    }
    
    if (formData.pdf && Array.isArray(formData.pdf)) {
        formData.pdf.forEach((file) => {
            if (file instanceof File) {
                form_data.append('pdf[]', file);
            }
        });
    } else if (formData.pdf && formData.pdf instanceof File) {
        form_data.append('pdf[]', formData.pdf);
    }

    try {
        const response = await nuxtApp.$axios.post('/cms/annual-reports', form_data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        const record = response.data.record;
        nuxtApp.$toast.success('Annual report created successfully!');
        useRouter().push(`/annual-reports/${record.id}`);
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error(error?.response?.data?.message || 'Error creating annual report. Please try again.');
    }
};
</script>
