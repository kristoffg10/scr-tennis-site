<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Card Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title" placeholder="e.g. Card Title" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-if="isClient" v-model="formData.description" :modelValue="formData.description" :name="`description`"
                        :label="isDescriptionOptional ? 'Description (Optional)' : 'Description'"
                        :max="0" :placeholder="`Enter description`"/>
                </div>

                <template v-if="showImageUpload">
                    <hr class="h-[1px] w-full border-gray">
                    <ImageHandler label="Main Image" max="1" size="5" :dimension="{ width: 800, height: 600 }" :input_payload="{
                        identifier: 'main_image',
                        id: 'main_image_id',
                        category: 'main_image_category',
                        category_value: 'main_image',
                        alt: 'main_image_alt',
                    }" :existing_images="[]" 
                    @update:file="handleFileUpdate(`main_image`, $event)" />

                    <ImageHandler
                        v-if="hasMobileImageSection"
                    label="Mobile Image"
                    max="1"
                    size="5"
                    :dimension="{ width: 375, height: 508 }"
                    :input_payload="{
                        identifier: 'mobile_image',
                        id: 'mobile_image_id',
                        category: 'mobile_image_category',
                        category_value: 'mobile_image',
                        alt: 'mobile_image_alt',
                    }"
                    :existing_images="[]"
                    @update:file="handleFileUpdate(`mobile_image`, $event)"
                    />
                </template>
            </div>

            <div class="flex self-end gap-[16px]">
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Create
                    Card</button>
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

// Section card parents that should capture a separate Mobile Image
const SECTION_CARD_PARENTS_WITH_MOBILE_IMAGE = [
    '4f72ce5b-73f3-4206-bd68-c632b59b5ca4',
];
const hasMobileImageSection = computed(() =>
    SECTION_CARD_PARENTS_WITH_MOBILE_IMAGE.includes(parentId)
);

// Section (parent) IDs where description is optional and image upload is hidden (e.g. Requirement Checklist File)
const SECTION_CARD_PARENTS_DESCRIPTION_OPTIONAL = [
    'ce69a142-65f3-4c85-8633-53e72a978ad0',
    '6ccafa7f-bd80-4e2e-bf29-cff72b5e36cb',
    '8adde00d-a8e1-47a0-835b-88409fda7b72'
];
const isDescriptionOptional = computed(() =>
    SECTION_CARD_PARENTS_DESCRIPTION_OPTIONAL.includes(parentId)
);

const SECTION_CARD_PARENTS_HIDE_IMAGE_UPLOAD = [
    'ce69a142-65f3-4c85-8633-53e72a978ad0',
    '6ccafa7f-bd80-4e2e-bf29-cff72b5e36cb',
    '8adde00d-a8e1-47a0-835b-88409fda7b72'
];
const showImageUpload = computed(() =>
    !SECTION_CARD_PARENTS_HIDE_IMAGE_UPLOAD.includes(parentId)
);

const formData = reactive({
    title: '',
    description: '',
    sequence: 1,
    main_image: [],
    mobile_image: [],
})

onMounted(() => {
    isClient.value = true;
    pageTitle.setTitle(`Create Card`);
    pageTitle.setBreadcrumbs(['Section Cards', 'Create Card']);

    pageTitle.setPageFrom('Section Cards');
    pageTitle.setPageFromRoute(`/section-cards/${parentId}`);
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

    if (formData.mobile_image && formData.mobile_image.length > 0) {
        formData.mobile_image.forEach((file) => {
            form_data.append(`mobile_image[]`, file)
        });
    }

    form_data.set('description', formData.description || '');
    // API auto-assigns sequence on create; send a placeholder so any validation sees a value
    form_data.set('sequence', '1');

    try {
        await nuxtApp.$axios.post(`/cms/section-card/${parentId}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            nuxtApp.$toast.success('Card created successfully!');
            router.push(`/section-cards/${parentId}`);
        });

    } catch (error) {
        console.error('Error:', error);
        const backendErrors = error?.response?.data?.errors;
        if (backendErrors) {
            const firstErrorKey = Object.keys(backendErrors)[0];
            const firstMessage = backendErrors[firstErrorKey][0] || 'Validation error.';
            nuxtApp.$toast.error(firstMessage);
        } else {
            nuxtApp.$toast.error('Error creating card. Please try again.');
        }
    }
}

</script>
