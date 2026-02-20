<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form v-if="planData" id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Plan Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title"
                        placeholder="e.g. Individual Health Plan" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Subtitle" name="subtitle" v-model="formData.subtitle"
                        placeholder="e.g. Comprehensive health coverage" :rules="'max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-if="isClient" v-model="formData.description" :modelValue="formData.description"
                        name="description" label="Description" :max="0"
                        placeholder="e.g. Plan description goes here" />
                </div>
                <div class="grid grid-cols-2 gap-[16px]">
                    <SelectField label="Type" name="type" v-model="formData.type" :options="typeOptions"
                        :rules="'required'" />
                    <TextField label="Sequence" name="sequence" v-model="formData.sequence" type="number"
                        placeholder="e.g. 1" :rules="'required|numeric'" optionalMessage="Display order" />
                </div>
                <div v-if="formData.type === 'group'" class="grid grid-cols-1 gap-[16px]">
                    <div class="flex flex-col gap-[8px]">
                        <label class="text-sm font-medium text-gray-700">Upgrade Badge</label>
                        <p class="text-xs text-gray-500">Show upgrade badge for group plans</p>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="formData.upgrade_badge" :true-value="1" :false-value="0"
                                class="sr-only peer" />
                            <div
                                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ui-color">
                            </div>
                            <span class="ml-3 text-sm font-medium text-gray-700">{{ formData.upgrade_badge ? 'Yes' :
                                'No' }}</span>
                        </label>
                    </div>
                </div>
                <div v-if="formData.type === 'individual'" class="grid grid-cols-2 gap-[16px]">
                    <div class="flex flex-col gap-[8px]">
                        <label class="text-sm font-medium text-gray-700">Plus Badge</label>
                        <p class="text-xs text-gray-500">Show plus badge for individual plans</p>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="formData.plus_badge" :true-value="1" :false-value="0"
                                class="sr-only peer" />
                            <div
                                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ui-color">
                            </div>
                            <span class="ml-3 text-sm font-medium text-gray-700">{{ formData.plus_badge ? 'Yes' : 'No'
                                }}</span>
                        </label>
                    </div>
                    <TextField label="Shop Link" name="shop_link" v-model="formData.shop_link"
                        placeholder="e.g. https://shop.example.com" :rules="'https'"
                        optionalMessage="Link to online shop" />
                </div>
                <div class="grid grid-cols-2 gap-[16px]">
                    <div class="flex flex-col gap-[8px]">
                        <label class="text-sm font-medium text-gray-700">Featured</label>
                        <p class="text-xs text-gray-500">Feature this plan</p>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="formData.featured" :true-value="1" :false-value="0"
                                class="sr-only peer" />
                            <div
                                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ui-color">
                            </div>
                            <span class="ml-3 text-sm font-medium text-gray-700">{{ formData.featured ? 'Yes' : 'No'
                                }}</span>
                        </label>
                    </div>
                    <div class="flex flex-col gap-[8px]">
                        <label class="text-sm font-medium text-gray-700">Enabled</label>
                        <p class="text-xs text-gray-500">Enable this plan</p>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="formData.enabled" :true-value="1" :false-value="0"
                                class="sr-only peer" />
                            <div
                                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ui-color">
                            </div>
                            <span class="ml-3 text-sm font-medium text-gray-700">{{ formData.enabled ? 'Yes' : 'No'
                                }}</span>
                        </label>
                    </div>
                </div>

                <hr class="h-[1px] w-full border-gray">
                <ImageHandler label="Main Image" max="1" size="5" :dimension="{ width: 800, height: 600 }"
                    :input_payload="{
                        identifier: 'main_image',
                        id: 'main_image_id',
                        category: 'main_image_category',
                        category_value: 'main_image',
                        alt: 'main_image_alt',
                    }" :existing_images="planData.images?.filter(img => img.category === 'main_image')"
                    @update:file="handleFileUpdate(`main_image`, $event)" />

                <ImageHandler label="Icon" max="1" size="5" :dimension="{ width: 200, height: 200 }" :input_payload="{
                    identifier: 'icon',
                    id: 'icon_id',
                    category: 'icon_category',
                    category_value: 'icon',
                    alt: 'icon_alt',
                }" :existing_images="planData.images?.filter(img => img.category === 'icon')"
                    @update:file="handleFileUpdate(`icon`, $event)" />

                <div class="grid grid-cols-1 gap-[16px]">
                    <ImageHandler label="PDF File" max="1" size="10" acceptedFormats="application/pdf" :input_payload="{
                        identifier: 'pdf',
                        id: 'pdf_id',
                        category: 'pdf_category',
                        category_value: 'pdf',
                        alt: 'pdf_alt',
                    }" :existing_images="pdfFiles" ref="pdfHandlerRef" v-model="formData.pdf"
                        @update:file="(file) => { formData.pdf = file; }" />
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


const formData = reactive({
    enabled: 1,
    featured: 0,
    type: 'individual',
    title: '',
    subtitle: '',
    description: '',
    sequence: 0,
    upgrade_badge: 0,
    plus_badge: 0,
   
    main_image: [],
    icon: [],
    pdf: [],
})



const pdfFiles = computed(() => {
    if (!planData.value) return [];
    const files = planData.value.files || [];
    const pdfs = files.filter(file => {
        const cat = (file.category || '').toLowerCase();
        const name = (file.name || file.path || '').toLowerCase();
        return cat === 'pdf' || name.endsWith('.pdf');
    });
    return pdfs;
});

const planData = ref(null);

onMounted(() => {
    pageTitle.setTitle(`Edit Plan`);
    pageTitle.setBreadcrumbs(['Plans', 'Plans List', 'Edit Plan']);

    pageTitle.setPageFrom('Plans List');
    pageTitle.setPageFromRoute('/plans');
    isClient.value = true;
    fetchRecords();
});

const fetchRecords = async () => {
    try {
        const plan_response = await nuxtApp.$axios.get(`/cms/plans/${id}`);
        planData.value = plan_response.data.record;
        populateData(planData.value);
    } catch (error) {
        console.error('Error:', error);
    }
};

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
    form_data.set('enabled', formData.enabled);
    form_data.set('featured', formData.featured);
    form_data.set('type', formData.type);
    form_data.append('_method', 'PATCH');

    if (formData.type === 'group') {
        form_data.set('upgrade_badge', formData.upgrade_badge)
        form_data.set('plus_badge', 0)
        //form_data.set('shop_link', '')
    } else {
        form_data.set('plus_badge', formData.plus_badge)
        form_data.set('upgrade_badge', 0)
        //form_data.set('shop_link', formData.shop_link)
    }

    console.log(formData.shop_link)

    try {
        const response = await nuxtApp.$axios.post(`/cms/plans/${id}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const record = response.data.record;
            populateData(record);
            nuxtApp.$toast.success('Plan updated successfully!');
        });

    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error updating plan. Please try again.');
    }
}

const populateData = (data) => {
    formData.title = data.title || '';
    formData.subtitle = data.subtitle || '';
    formData.description = data.description || '';
    formData.type = data.type || 'individual';
    formData.sequence = data.sequence || 0;
    formData.upgrade_badge = Number(data.upgrade_badge) || 0;
    formData.plus_badge = Number(data.plus_badge) || 0;
    formData.shop_link = data.shop_link || '';
    formData.enabled = Number(data.enabled) ? 1 : 0;
    formData.featured = Number(data.featured) ? 1 : 0;
}

</script>
