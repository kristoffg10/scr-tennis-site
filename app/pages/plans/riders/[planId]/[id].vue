<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form v-if="recordData" id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Rider Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title" placeholder="e.g. Additional Coverage Rider" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-if="isClient" v-model="formData.description" :modelValue="formData.description"
                        name="description" label="Description" :max="0"
                        placeholder="e.g. Description of the rider" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Sequence" name="sequence" v-model="formData.sequence" type="number" placeholder="e.g. 1" :rules="'required|numeric'"
                        optionalMessage="Display order" />
                </div>

                <hr class="h-[1px] w-full border-gray">
                <ImageHandler label="Main Image" max="1" size="5" :dimension="{ width: 800, height: 600 }" :input_payload="{
                    identifier: 'main_image',
                    id: 'main_image_id',
                    category: 'main_image_category',
                    category_value: 'main_image',
                    alt: 'main_image_alt',
                }" :existing_images="recordData.images?.filter(img => img.category === 'main_image')" 
                @update:file="handleFileUpdate(`main_image`, $event)" />
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

const ImageHandler = defineAsyncComponent(() => {
    return import('@/components/form-fields/ImageHandler.vue')
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
    description: '',
    sequence: 0,
    main_image: []
})

const recordData = ref(null);
const isClient = ref(false);

onMounted(() => {
    pageTitle.setTitle(`Edit Rider`);
    pageTitle.setBreadcrumbs(['Plans', 'Riders', 'Edit Rider']);
    pageTitle.setPageFrom('Riders');
    pageTitle.setPageFromRoute('/plans/riders');
    isClient.value = true;
    fetchRecords();
});

const fetchRecords = async () => {
    try {
        const response = await nuxtApp.$axios.get(`/cms/plan-rider/${planId}/${id}`);
        recordData.value = response.data.record;
        populateData(recordData.value);
    } catch (error) {
        console.error('Error:', error);
    }
};

const handleFileUpdate = (field, file) => {
    const idx = parseInt(field.match(/\d+$/), 10);
    const fieldName = field.replace(/\d+$/, "");

    if (!Number.isNaN(idx)) {
        formData[fieldName][idx] = file;
    } else {
        formData[fieldName] = file;
    }
};

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    form_data.set('description', formData.description || '');

    if (formData.main_image && formData.main_image.length > 0) {
        formData.main_image.forEach((file) => {
            form_data.append(`main_image[]`, file)
        });
    }

    form_data.append('_method', 'PATCH');

    try {
        const response = await nuxtApp.$axios.post(`/cms/plan-rider/${planId}/${id}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const record = response.data.record;
            populateData(record);
            nuxtApp.$toast.success('Rider updated successfully!');
        });

    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error updating rider. Please try again.');
    }
}

const populateData = (data) => {
    formData.title = data.title || '';
    formData.description = data.description || '';
    formData.sequence = data.sequence || 0;
}
</script>
