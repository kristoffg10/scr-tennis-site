<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Highlight Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Title" name="title" placeholder="e.g. Comprehensive Coverage"
                        :rules="'required|max:255'" optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-if="isClient" v-model="formData.description" :modelValue="formData.description"
                        name="description" label="Description" :max="0"
                        placeholder="e.g. Description of the highlight" />
                </div>
                <!-- <div class="grid grid-cols-1 gap-[16px]">
                    <div class="flex items-center gap-[8px]">
                        <input type="checkbox" id="has_tooltip" name="has_tooltip" v-model="formData.has_tooltip"
                            class="w-[20px] h-[20px] rounded border-gray cursor-pointer" />
                        <label for="has_tooltip" class="text-[#2a2a2a] opacity-70 cursor-pointer">Has Tooltip</label>
                    </div>
                </div> -->
                <!-- <div v-if="formData.has_tooltip" class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Tooltip Content" name="tooltip_content"
                        placeholder="e.g. Additional information tooltip"
                        optionalMessage="Content to display in tooltip" />
                </div> -->
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Sequence" name="sequence" type="number" placeholder="e.g. 1"
                        :rules="'required|numeric'" optionalMessage="Display order" />
                </div>

                <hr class="h-[1px] w-full border-gray">
                <ImageHandler label="Main Image" max="1" size="5" :dimension="{ width: 800, height: 600 }"
                    :input_payload="{
                        identifier: 'main_image',
                        id: 'main_image_id',
                        category: 'main_image_category',
                        category_value: 'main_image',
                        alt: 'main_image_alt',
                    }" @update:file="handleFileUpdate(`main_image`, $event)" />

            </div>

            <div class="flex self-end gap-[16px]">
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Save
                    Changes</button>
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

const formData = reactive({
    description: '',
    has_tooltip: false,
    main_image: []

});
const isClient = ref(false);

onMounted(() => {
    pageTitle.setTitle(`Add Highlight`);
    pageTitle.setBreadcrumbs(['Plans', 'Highlights', 'Add Highlight']);
    pageTitle.setPageFrom('Highlights');
    pageTitle.setPageFromRoute('/plans/highlights');
    isClient.value = true;
});

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

    // Add plan_id to form data as required by API validation
    form_data.append('plan_id', planId);
    form_data.set('description', formData.description || '');
    // Add has_tooltip as 1 or 0
    form_data.append('has_tooltip', formData.has_tooltip ? 1 : 0);

    if (formData.main_image && formData.main_image.length > 0) {
        formData.main_image.forEach((file) => {
            form_data.append(`main_image[]`, file)
        });
    }

    try {
        const response = await nuxtApp.$axios.post(`/cms/plan-highlight/${planId}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const record = response.data.record;
            nuxtApp.$toast.success('Highlight created successfully!');
            useRouter().push(`/plans/highlights`);
        });

    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error creating highlight. Please try again.');
    }
}
</script>
