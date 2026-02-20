<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Card Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title" placeholder="e.g. Card Title"
                        :rules="'required|max:255'" optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-if="isClient" v-model="formData.description" :modelValue="formData.description"
                        :name="`description`" :label="`Description`" :max="0" :placeholder="`Enter description`" />
                </div>
                <div class="grid grid-cols-2 gap-[16px]">
                    <SelectField label="Type" name="type" :options="typeOptions" v-model="formData.type"/>
                </div>

                <hr class="h-[1px] w-full border-gray">
                <ImageHandler label="Main Image" max="1" size="5" :dimension="{ width: 800, height: 600 }"
                    :input_payload="{
                        identifier: 'main_image',
                        id: 'main_image_id',
                        category: 'main_image_category',
                        category_value: 'main_image',
                        alt: 'main_image_alt',
                    }" :existing_images="[]" @update:file="handleFileUpdate(`main_image`, $event)" />
            </div>

            <div class="flex self-end gap-[16px]">
                <button type="submit"
                    class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Create
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

const formData = reactive({
    title: '',
    description: '',
    sequence: 0,
    type: 'agent',
    main_image: []
})

const typeOptions = [
    { value: 'agent', label: 'Agent' },
    { value: 'medical', label: 'Medical' },
];

onMounted(() => {
    isClient.value = true;
    pageTitle.setTitle(`Create Card`);
    pageTitle.setBreadcrumbs(['Section Cards', 'Create Card']);

    pageTitle.setPageFrom('Section Cards');
    pageTitle.setPageFromRoute(`/section-benefits/${parentId}`);
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

    form_data.set('description', formData.description || '');
    // API auto-assigns sequence on create; send placeholder so validation accepts request
    form_data.set('sequence', '1');

    try {
        const response = await nuxtApp.$axios.post(`/cms/section-benefit/${parentId}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            nuxtApp.$toast.success('Card created successfully!');
            router.push(`/section-benefits/${parentId}`);
        });

    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error creating card. Please try again.');
    }
}

</script>
