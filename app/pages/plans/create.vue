<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Plan Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Title" name="title" placeholder="e.g. Individual Health Plan"
                        :rules="'required|max:255'" optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Subtitle" name="subtitle" placeholder="e.g. Comprehensive health coverage"
                        :rules="'max:255'" optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-if="isClient" v-model="formData.description" :modelValue="formData.description"
                        name="description" label="Description" :max="0"
                        placeholder="e.g. Plan description goes here" />
                </div>
                <div class="grid grid-cols-2 gap-[16px]">
                    <SelectField label="Type" name="type" v-model="formData.type" :options="typeOptions"
                        :rules="'required'" />
                    <TextField label="Sequence" name="sequence" type="number" placeholder="e.g. 1"
                        :rules="'required|numeric'" optionalMessage="Display order" />
                </div>
                <div v-if="formData.type === 'group'" class="grid grid-cols-1 gap-[16px]">
                    <SelectField label="Upgrade Badge" name="upgrade_badge" :options="badgeOptions"
                        optionalMessage="Show upgrade badge for group plans" />
                </div>
                <div v-if="formData.type === 'individual'" class="grid grid-cols-2 gap-[16px]">
                    <SelectField label="Plus Badge" name="plus_badge" :options="badgeOptions"
                        optionalMessage="Show plus badge for individual plans" />
                    <TextField label="Shop Link" name="shop_link" placeholder="e.g. https://shop.example.com"
                        :rules="'https'" optionalMessage="Link to online shop" />
                </div>
                <div class="grid grid-cols-2 gap-[16px]">
                    <SelectField
                        label="Featured"
                        name="featured"
                        v-model="formData.featured"
                        :options="booleanOptions"
                        optionalMessage="Feature this plan"
                    />
                    <SelectField
                        label="Enabled"
                        name="enabled"
                        v-model="formData.enabled"
                        :options="booleanOptions"
                        optionalMessage="Enable this plan"
                    />
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

                <ImageHandler label="Icon" max="1" size="5" :dimension="{ width: 200, height: 200 }" :input_payload="{
                    identifier: 'icon',
                    id: 'icon_id',
                    category: 'icon_category',
                    category_value: 'icon',
                    alt: 'icon_alt',
                }" @update:file="handleFileUpdate(`icon`, $event)" />

                <div class="grid grid-cols-1 gap-[16px]">
                    <ImageHandler label="PDF File" max="1" size="10" acceptedFormats="application/pdf" :input_payload="{
                        identifier: 'pdf',
                        id: 'pdf_id',
                        category: 'pdf_category',
                        category_value: 'pdf',
                        alt: 'pdf_alt',
                    }" ref="pdfHandlerRef" v-model="formData.pdf" @update:file="(file) => { formData.pdf = file; }" />

                </div>
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
import { useAsyncData } from 'nuxt/app'

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
const id = route.params.id;

const formattedTitle = ref('');
const secondLastSegment = ref('');
const isClient = ref(false);

const typeOptions = [
    { value: 'individual', label: 'Individual' },
    { value: 'group', label: 'Group' }
];

const badgeOptions = [
    { value: 0, label: 'No' },
    { value: 1, label: 'Yes' }
];

const booleanOptions = [
    { value: 0, label: 'No' },
    { value: 1, label: 'Yes' }
];

const formData = reactive({
    description: '',
    enabled: 1,
    featured: 0,
    type: 'individual',
    main_image: [],
    icon: [],
    pdf: [],
})



onMounted(() => {
    pageTitle.setTitle(`Add Plan`);
    pageTitle.setBreadcrumbs(['Plans', 'Plans List', 'Add Plan']);

    pageTitle.setPageFrom('Plans List');
    pageTitle.setPageFromRoute('/plans');
    isClient.value = true;
});

const handleFileUpdate = (field, file) => {
    const idx = parseInt(field.match(/\d+$/), 10); // Get the number from the field string
    const fieldName = field.replace(/\d+$/, ""); // Remove the number to get the base field name

    if (!Number.isNaN(idx)) {
        formData[fieldName][idx] = file;
        console.log(formData[fieldName]);
    } else {
        formData[fieldName] = file; // Updates the specific image field
        console.log(field);
    }
};

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);

    if (formData.main_image && formData.main_image.length > 0) {
        formData.main_image.forEach((file) => {
            form_data.append(`main_image[]`, file)
        });
    }

    if (formData.icon && formData.icon.length > 0) {
        formData.icon.forEach((file) => {
            form_data.append(`icon[]`, file)
        });
    }

    // Append PDF files
    if (formData.pdf && formData.pdf.length > 0) {
        formData.pdf.forEach((file) => {
            form_data.append(`pdf[]`, file)
        });
    }


    form_data.set('description', formData.description || '');
    form_data.set('enabled', Number(formData.enabled) ? 1 : 0);
    form_data.set('featured', Number(formData.featured) ? 1 : 0);
    form_data.set('type', formData.type);

    if (formData.type === 'group') {
        form_data.set('upgrade_badge', form_data.get('upgrade_badge') || 0)
        form_data.set('plus_badge', 0)
        form_data.set('shop_link', '')
    } else {
        form_data.set('plus_badge', form_data.get('plus_badge') || 0)
        form_data.set('upgrade_badge', 0)
        form_data.set('shop_link', form_data.get('shop_link') || '')
    }

    try {
        const response = await nuxtApp.$axios.post(`/cms/plans`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const record = response.data.record;

            nuxtApp.$toast.success('Plan created successfully!');
            useRouter().push(`/plans/${record.id}`);
        });

    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error creating plan. Please try again.');
    }
}

</script>
