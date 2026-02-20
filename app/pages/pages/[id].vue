<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form v-if="pageData" id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Page Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Name" name="name" v-model="formData.name" placeholder="e.g. Homepage" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <!-- Hide all other fields for Homepage -->
                <template v-if="!isHomepage">
                    <div class="grid grid-cols-1 gap-[16px]">
                        <TextField label="Subtitle" name="subtitle" v-model="formData.subtitle" placeholder="e.g. Welcome to our site" :rules="'required|max:255'"
                            optionalMessage="Max 255 characters" />
                    </div>
                    <div class="grid grid-cols-1 gap-[16px]">
                        <TextField class="col-span-3" label="Description" name="description" v-model="formData.description"
                            placeholder="e.g. Page description goes here" :rules="'max:1000'"
                            optionalMessage="Max 1000 characters" />
                    </div>
                    <!-- Order number hidden in Page module form; sequence remains for internal sorting -->
                    <div class="grid grid-cols-1 gap-[16px]">
                        <TextField
                            label="Sequence"
                            name="sequence"
                            v-model="formData.sequence"
                            type="number"
                            placeholder="e.g. 1"
                            :rules="'numeric'"
                            optionalMessage="Display sequence"
                        />
                    </div>
                    <div class="grid grid-cols-2 gap-[16px]">
                        <SelectField label="Featured" name="featured" v-model="formData.featured" :options="booleanOptions" 
                            optionalMessage="Feature this page" />
                        <SelectField label="Enabled" name="enabled" v-model="formData.enabled" :options="booleanOptions" 
                            optionalMessage="Enable this page" />
                    </div>
                    <div class="grid grid-cols-1 gap-[16px]">
                        <TextField label="Date Published" name="date_published" v-model="formData.date_published" type="date" 
                            placeholder="Select date" />
                    </div>

                    <hr class="h-[1px] w-full border-gray">
                    <ImageHandler label="Main Image" max="1" size="5" :dimension="{ width: 800, height: 600 }" :input_payload="{
                        identifier: 'main_image',
                        id: 'main_image_id',
                        category: 'main_image_category',
                        category_value: 'main_image',
                        alt: 'main_image_alt',
                    }" :existing_images="pageData.images?.filter(img => img.category === 'main_image')" 
                    @update:file="handleFileUpdate(`main_image`, $event)" />
                    
                    <ImageHandler label="Icon" max="1" size="5" :dimension="{ width: 200, height: 200 }" :input_payload="{
                        identifier: 'icon',
                        id: 'icon_id',
                        category: 'icon_category',
                        category_value: 'icon',
                        alt: 'icon_alt',
                    }" :existing_images="pageData.images?.filter(img => img.category === 'icon')" 
                    @update:file="handleFileUpdate(`icon`, $event)" />
                </template>
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

const nuxtApp = useNuxtApp();

const route = useRoute();
const pageTitle = usePageTitleStore();
const id = route.params.id;

const formattedTitle = ref('');
const secondLastSegment = ref('');
const isClient = ref(false);

const booleanOptions = [
    { value: 0, label: 'No' },
    { value: 1, label: 'Yes' }
];

const formData = reactive({
    enabled: 1,
    featured: 0,
    name: '',
    subtitle: '',
    description: '',
    order: 0,
    sequence: 0,
    date_published: '',
    main_image: [],
    icon: []
})

const pageData = ref(null);

// Computed property to check if the page is Homepage
const isHomepage = computed(() => {
    return pageData.value && (
        pageData.value.slug === 'homepage' || 
        pageData.value.name?.toLowerCase() === 'homepage'
    );
});

onMounted(() => {
    pageTitle.setTitle(`Edit Page`);
    pageTitle.setBreadcrumbs(['Pages', 'Pages List', 'Edit Page']);

    pageTitle.setPageFrom('Pages List');
    pageTitle.setPageFromRoute('/pages');
    isClient.value = true;
    fetchRecords();
});

const fetchRecords = async () => {
    try {
        const page_response = await nuxtApp.$axios.get(`/cms/pages/${id}`);
        pageData.value = page_response.data.record;
        populateData(pageData.value);
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

    form_data.set('enabled', formData.enabled ? 1 : 0);
    form_data.set('featured', formData.featured ? 1 : 0);
    form_data.append('_method', 'PATCH');

    try {
        const response = await nuxtApp.$axios.post(`/cms/pages/${id}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const record = response.data.record;
            populateData(record);
            nuxtApp.$toast.success('Page updated successfully!');
        });

    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error updating page. Please try again.');
    }
}

const populateData = (data) => {
    formData.name = data.name || '';
    formData.subtitle = data.subtitle || '';
    formData.description = data.description || '';
    formData.order = data.order || 0;
    formData.sequence = data.sequence || data.order || 0;
    formData.date_published = data.date_published || '';
    formData.enabled = Number(data.enabled) ? 1 : 0;
    formData.featured = Number(data.featured) ? 1 : 0;
}

</script>
