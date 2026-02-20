<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Testimonial Information</h2>
                <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="Name" name="name" v-model="formData.name" placeholder="e.g. John Doe" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                    <TextField label="Position" name="position" v-model="formData.position" placeholder="e.g. CEO" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Company" name="company" v-model="formData.company" placeholder="e.g. ABC Corporation" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill
                        v-if="isClient"
                        v-model="formData.content"
                        :modelValue="formData.content"
                        :name="`content`"
                        :label="`Content`"
                        :max="150"
                        :placeholder="`Enter testimonial content`"
                    />
                </div>

                <hr class="h-[1px] w-full border-gray">
                <ImageHandler label="Main Image" max="1" size="5" :dimension="{ width: 200, height: 200 }" :input_payload="{
                    identifier: 'main_image',
                    id: 'main_image_id',
                    category: 'main_image_category',
                    category_value: 'main_image',
                    alt: 'main_image_alt',
                }" :existing_images="[]" 
                @update:file="handleFileUpdate(`main_image`, $event)" />
            </div>

            <div class="flex self-end gap-[16px]">
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Create
                    Testimonial</button>
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
    name: '',
    position: '',
    company: '',
    content: '',
    sequence: 1,
    main_image: []
})

onMounted(() => {
    isClient.value = true;
    pageTitle.setTitle(`Create Testimonial`);
    pageTitle.setBreadcrumbs(['Section Testimonials', 'Create Testimonial']);
    pageTitle.setPageFrom('Section Testimonials');
    pageTitle.setPageFromRoute(`/section-testimonials/${parentId}`);
});

const handleFileUpdate = (field, file) => {
    formData[field] = file;
};

const submit = async () => {
    const formElement = document.getElementById('form');

    // Frontend validation: main image required
    if (!formData.main_image || formData.main_image.length === 0) {
        nuxtApp.$toast.error('Main image is required.');
        return;
    }

    // Frontend validation: content max 150 characters (plain text)
    if (formData.content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formData.content;
        const plainTextLength = tempDiv.innerText.trim().length;
        if (plainTextLength > 150) {
            nuxtApp.$toast.error('Content may not be greater than 150 characters.');
            return;
        }
    }

    const form_data = new FormData(formElement);
    
    if (formData.main_image && formData.main_image.length > 0) {
        formData.main_image.forEach((file) => {
            form_data.append(`main_image[]`, file)
        });
    }

    form_data.set('content', formData.content || '');
    // API auto-assigns sequence on create; send placeholder so validation accepts request
    form_data.set('sequence', '1');

    try {
        await nuxtApp.$axios.post(`/cms/section-testimonial/${parentId}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            nuxtApp.$toast.success('Testimonial created successfully!');
            router.push(`/section-testimonials/${parentId}`);
        });
    } catch (error) {
        console.error('Error:', error);
        const backendErrors = error?.response?.data?.errors;
        if (backendErrors) {
            const firstErrorKey = Object.keys(backendErrors)[0];
            const firstMessage = backendErrors[firstErrorKey][0] || 'Validation error.';
            nuxtApp.$toast.error(firstMessage);
        } else {
            nuxtApp.$toast.error('Error creating testimonial. Please try again.');
        }
    }
}
</script>
