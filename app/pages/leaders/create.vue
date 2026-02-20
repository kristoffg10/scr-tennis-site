<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Leader Information</h2>
                <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="Name" name="name" placeholder="e.g. Juan Dela Cruz" :rules="'required|max:255'" optionalMessage="Max 255 characters" />
                    <TextField label="Position" name="position" placeholder="e.g. Chief Executive Officer" :rules="'required|max:255'" optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-2 gap-[16px]">
                    <SelectField label="Type" name="type" :options="typeOptions" :rules="'required'" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-model="formData.biography" :modelValue="formData.biography" name="biography" label="Biography" :max="0" placeholder="Enter biography" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <h3 class="font-medium text-base">Profile Image</h3>
                    <ImageHandler label="Profile Image" :data="[]" max="1" size="5"
                        :dimension="{ width: 400, height: 400 }"
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
const SelectField = defineAsyncComponent(() => import('@/components/SelectField.vue'));
const Quill = defineAsyncComponent(() => import('@/components/form-fields/Quill.vue'));
const ImageHandler = defineAsyncComponent(() => import('@/components/form-fields/ImageHandler.vue'));

const nuxtApp = useNuxtApp();
const pageTitle = usePageTitleStore();

const typeOptions = [
    { value: 'director', label: 'Director' },
    { value: 'management', label: 'Management' },
    { value: 'others', label: 'Others' },
];

const formData = reactive({
    biography: '',
    // Will be populated by ImageHandler via @update:file with an array of File objects
    main_image: []
});

onMounted(() => {
    pageTitle.setTitle('Add Leader');
    pageTitle.setBreadcrumbs(['Leaders', 'Leaders List', 'Add Leader']);
    pageTitle.setPageFrom('Leaders List');
    pageTitle.setPageFromRoute('/leaders');
});

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    form_data.append('biography', formData.biography || '');

    // ImageHandler emits an array of File objects via @update:file
    const mainImages = Array.isArray(formData.main_image)
        ? formData.main_image
        : (formData.main_image ? [formData.main_image] : []);

    mainImages.forEach((file) => {
        if (file instanceof File) {
            // Use [] so Laravel treats this as an array: $request->main_image
            form_data.append('main_image[]', file);
        }
    });

    try {
        const response = await nuxtApp.$axios.post('/cms/leaders', form_data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        const record = response.data.record;
        nuxtApp.$toast.success('Leader created successfully!');
        useRouter().push(`/leaders/${record.id}`);
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error creating leader. Please try again.');
    }
};
</script>
