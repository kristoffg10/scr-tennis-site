<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <div v-if="!tabData" class="flex flex-col items-center justify-center p-8 gap-4">
            <p class="text-gray-500">Loading tab data...</p>
            <p class="text-sm text-gray-400">If this persists, check the browser console for errors.</p>
        </div>
        <Form v-else id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Tab Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title" placeholder="e.g. Tab Title" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div v-if="!hideContentFields" class="grid grid-cols-1 gap-[16px]">
                    <Quill v-if="isClient" v-model="formData.content_1" :modelValue="formData.content_1" :name="`content_1`" :label="`Content 1`" 
                        :max="0" :placeholder="`Enter content 1`"/>
                </div>
                <div v-if="!hideContentFields" class="grid grid-cols-1 gap-[16px]">
                    <Quill v-if="isClient" v-model="formData.content_2" :modelValue="formData.content_2" :name="`content_2`" :label="`Content 2`" 
                        :max="0" :placeholder="`Enter content 2`"/>
                </div>
                <div class="grid grid-cols-1 gap-[16px]" v-show="!hideSequenceField">
                    <TextField label="Sequence" name="sequence" v-model="formData.sequence" type="number" placeholder="e.g. 1" :rules="'required|numeric'"
                        optionalMessage="Display order" />
                </div>

                <!-- Section Tab FAQs Module Links (for Help and FAQ center); only when parent and tab ids are defined -->
                <HowToAdd
                    v-if="tabData && (tabData.faqs !== undefined || isHelpAndFaqContext) && sectionFaqsLink && !hideFaqsSection"
                    title="FAQs"
                    :link="sectionFaqsLink" />

                <hr v-if="tabData && (tabData.faqs !== undefined || isHelpAndFaqContext) && sectionFaqsLink && !hideFaqsSection" class="h-[1px] w-full border-gray">
                <ImageHandler
                    v-if="!disableImageUpload"
                    label="Main Image"
                    max="1"
                    size="5"
                    :dimension="{ width: 800, height: 600 }"
                    :input_payload="{
                        identifier: 'main_image',
                        id: 'main_image_id',
                        category: 'main_image_category',
                        category_value: 'main_image',
                        alt: 'main_image_alt',
                    }"
                    :existing_images="tabData.images?.filter(img => img.category === 'main_image')" 
                    @update:file="handleFileUpdate(`main_image`, $event)" />
            </div>

            <!-- PDF Files Upload Section (hidden for specific section tab parent) -->
            <div
                v-if="!disablePdfUpload"
                class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">PDF Files</h2>
                <p class="text-sm text-black/60">
                    Upload PDF files for this tab (e.g., application forms, claim forms, etc.)
                </p>
                <ImageHandler 
                    v-if="tabData"
                    label="PDF Files" 
                    :max="pdfMaxFiles" 
                    size="10" 
                    :fileAlt="true"
                    acceptedFormats="application/pdf"
                    :allowMultiple="pdfWithTitleAndMultiple"
                    :showTitle="pdfWithTitleAndMultiple"
                    :input_payload="{
                        identifier: 'pdf',
                        id: 'pdf_id',
                        category: 'pdf_category',
                        category_value: 'pdf',
                        alt: 'pdf_alt',
                        title: 'pdf_title'
                    }"
                    :existing_images="pdfFiles"
                    @update:file="handleFileUpdate('pdf', $event)" 
                />
                <div v-else class="flex items-center justify-center p-8">
                    <p class="text-gray-500">Loading...</p>
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
import { nextTick } from 'vue';

definePageMeta({
    middleware: 'authenticator'
})

const TextField = defineAsyncComponent(() => {
    return import('@/components/TextField.vue')
})

const ImageHandler = defineAsyncComponent(() => {
    return import('@/components/form-fields/ImageHandler.vue')
})

const Quill = defineAsyncComponent(() => {
    return import('@/components/form-fields/Quill.vue')
})
const HowToAdd = defineAsyncComponent(() => {
    return import('@/components/HowToAdd.vue')
})

const nuxtApp = useNuxtApp();
const isClient = ref(false);
const route = useRoute();
const pageTitle = usePageTitleStore();
const id = computed(() => route.params.id);
const parentId = computed(() => {
    const pid = route.params.parent_id;
    if (!pid || pid === 'undefined') {
        console.error('Parent ID is undefined in route. Route path:', route.path);
        console.error('Route params:', route.params);
        // Try to extract from the path if it's in the URL
        const pathParts = route.path.split('/');
        const parentIndex = pathParts.indexOf('section-tabs');
        if (parentIndex >= 0 && pathParts[parentIndex + 1] && pathParts[parentIndex + 1] !== 'undefined') {
            return pathParts[parentIndex + 1];
        }
    }
    return pid;
});

const formData = reactive({
    title: '',
    content_1: '',
    content_2: '',
    sequence: 0,
    main_image: [],
    pdf: []
})

const hideSequenceAndFaqs = computed(() => {
    const pid = parentId.value;
    const tabId = id.value;
    
    const hiddenRoutes = [
        { pid: '1f458320-4ebb-4200-aecc-f7547e798948', tabId: '16fddd9c-b053-4fa3-b4b4-ac5484e017d2' },
        { pid: '8e9c9978-ce11-4e33-8ad6-fadbaa9b8995', tabId: '53d786f1-e7ec-4bf4-b9aa-fd36c40aa622' },
        { pid: '515a7602-82ed-47dc-8236-4e0e9ab3e57f', tabId: '9b018af8-3ebd-4d68-af89-6f5144e861f9' },
    ];
    
    return hiddenRoutes.some(route => route.pid === pid && route.tabId === tabId);
});
// Disable PDF upload for specific section tab parents (includes hideMainImageForParentIds)
const disablePdfUpload = computed(() => {
    return parentId.value === '544f0ae5-920b-43b1-912f-5955795e844c'
        || hideMainImageForParentIds.includes(parentId.value);
});

// Hide Content 1 and Content 2 for specific section tabs (e.g. RFP / request for proposal; claim requirements 544f0ae5..., Corporate Governance sidebar section)
const hideContentFields = computed(() => {
    return parentId.value === '47b48c8d-ce83-4ad9-978f-15f1704f1513'
        || parentId.value === '544f0ae5-920b-43b1-912f-5955795e844c'
        || parentId.value === '563152e1-6744-4ad8-a525-83061fb2076c';
});

// Hide sequence input field visually for specific parent, but keep it in the form for submission
const hideSequenceField = computed(() => {
    return parentId.value === '544f0ae5-920b-43b1-912f-5955795e844c'
        || parentId.value === '563152e1-6744-4ad8-a525-83061fb2076c'
        || hideSequenceAndFaqs.value
        || hideMainImageForParentIds.includes(parentId.value);
});

const hideFaqsSection = computed(() => {
    return parentId.value === '563152e1-6744-4ad8-a525-83061fb2076c'
        || hideSequenceAndFaqs.value
        || hideMainImageForParentIds.includes(parentId.value);
});

// PDF max files: 1 for Corporate Governance sidebar section, 5 otherwise
const pdfMaxFiles = computed(() => {
    return parentId.value === '563152e1-6744-4ad8-a525-83061fb2076c' ? 1 : 5;
});

// PDF with title + multiple files per upload for specific section
const pdfWithTitleAndMultiple = computed(() => {
    return parentId.value === '47b48c8d-ce83-4ad9-978f-15f1704f1513';
});

// Hide main_image upload for specific parent IDs
const hideMainImageForParentIds = [
    '515a7602-82ed-47dc-8236-4e0e9ab3e57f',
    '8e9c9978-ce11-4e33-8ad6-fadbaa9b8995',
    '1f458320-4ebb-4200-aecc-f7547e798948',
];

// Hide image and PDF upload for specific parent (claim requirements 544f0ae5..., Corporate Governance sidebar section); only title and sequence shown
const disableImageUpload = computed(() => {
    return parentId.value === '544f0ae5-920b-43b1-912f-5955795e844c'
        || parentId.value === '563152e1-6744-4ad8-a525-83061fb2076c'
        || hideMainImageForParentIds.includes(parentId.value);
});

// Section FAQs link: only when parent and tab ids are defined (avoids /section-tabs/undefined/undefined/section-faqs)
const sectionFaqsLink = computed(() => {
    const pid = parentId.value;
    const tabId = id.value;
    if (!pid || !tabId || pid === 'undefined' || tabId === 'undefined') return '';
    return `/section-tabs/${pid}/${tabId}/section-faqs`;
});

const tabData = ref(null);
const isHelpAndFaqContext = ref(false);

// Computed property to get PDF files from tab data
const pdfFiles = computed(() => {
    if (!tabData.value) return [];
    
    // Check if files array exists
    const files = tabData.value.files || [];
    
    console.log('Tab files:', files);
    
    // Filter files that are PDFs (by category or extension)
    const pdfs = files.filter(file => {
        const isPdfCategory = (file.category || '').toLowerCase() === 'pdf';
        const isPdfName = (file.name || file.path || '').toLowerCase().endsWith('.pdf');
        return isPdfCategory || isPdfName;
    });
    
    console.log('Filtered PDF files:', pdfs);
    return pdfs;
});

onMounted(async () => {
    isClient.value = true;
    console.log('Component mounted');
    console.log('Route params:', route.params);
    console.log('Route path:', route.path);
    console.log('Parent ID:', parentId.value);
    console.log('Tab ID:', id.value);
    
    if (!parentId.value || parentId.value === 'undefined') {
        console.error('Parent ID is missing. Cannot load tab data.');
        nuxtApp.$toast?.error?.('Invalid section ID. Redirecting...');
        // Try to redirect back or extract parent_id from tab data
        await nextTick();
        // If we have a tab ID, we can try to fetch the tab first to get parent_id
        if (id.value) {
            // We'll handle this in fetchRecords
        } else {
            navigateTo('/pages');
            return;
        }
    }
    
    pageTitle.setTitle(`Edit Tab`);
    pageTitle.setBreadcrumbs(['Section Tabs', 'Edit Tab']);
    pageTitle.setPageFrom('Section Tabs');
    pageTitle.setPageFromRoute(`/section-tabs/${parentId.value}`);
    
    await fetchRecords();
});

const fetchRecords = async () => {
    try {
        const tabId = id.value;
        let sectionId = parentId.value;
        
        console.log('Fetching tab data...');
        console.log('Parent ID from route:', sectionId);
        console.log('Tab ID:', tabId);
        
        if (!tabId) {
            console.error('Tab ID is missing!');
            nuxtApp.$toast.error('Invalid tab ID. Please check the URL.');
            return;
        }
        
        // If parentId is undefined, we need to find another way to get it
        // Try to use the tab's parent_id if we can fetch it somehow
        // For now, if sectionId is undefined, we'll show an error
        if (!sectionId || sectionId === 'undefined') {
            console.error('Parent ID is missing from route!');
            console.error('Route path:', route.path);
            console.error('Route params:', route.params);
            nuxtApp.$toast.error('Invalid section ID in URL. Please navigate from the section tabs list.');
            
            // Try to redirect to pages if we can't proceed
            setTimeout(() => {
                navigateTo('/pages');
            }, 2000);
            return;
        }
        
        const tab_response = await nuxtApp.$axios.get(`/cms/section-tab/${sectionId}/${tabId}`);
        console.log('Tab API Response:', tab_response);
        console.log('Tab Response Data:', tab_response.data);
        console.log('Tab Record:', tab_response.data?.record);
        
        if (!tab_response.data?.record) {
            console.error('No tab record found in API response');
            nuxtApp.$toast.error('Tab data not found. The tab may have been deleted.');
            return;
        }
        
        const record = tab_response.data.record;
        
        // Update parentId if it was missing and we got it from the record
        if ((!sectionId || sectionId === 'undefined') && record.parent_id) {
            console.log('Updating parentId from tab record:', record.parent_id);
            // Note: We can't directly update a computed property, but we can use the record's parent_id
            sectionId = record.parent_id;
        }
        
        // Check if record exists and has an ID
        if (!record) {
            console.error('No record in API response');
            nuxtApp.$toast.error('Tab data not found. The tab may have been deleted.');
            return;
        }
        
        if (!record.id) {
            console.error('Invalid record structure - missing ID');
            console.error('Record received:', record);
            console.error('Record keys:', Object.keys(record));
            nuxtApp.$toast.error('Invalid tab data structure received from API. The tab ID may be incorrect.');
            return;
        }
        
        // Log all fields to debug
        console.log('Record fields:', {
            id: record.id,
            title: record.title,
            content_1: record.content_1,
            content_2: record.content_2,
            sequence: record.sequence,
            parent_id: record.parent_id,
            images: record.images,
            files: record.files,
            faqs: record.faqs
        });
        
        // Ensure files array exists
        if (!record.files) {
            record.files = [];
        }
        
        // Ensure images array exists
        if (!record.images) {
            record.images = [];
        }
        
        tabData.value = record;
        console.log('Tab Data set:', tabData.value);
        console.log('Tab files:', tabData.value.files);
        console.log('Tab images:', tabData.value.images);
        populateData(tabData.value);
        console.log('Form Data after population:', formData);
        
        // Check if parent section is Help and FAQ center
        try {
            const section_response = await nuxtApp.$axios.get(`/cms/page-section/${sectionId}`);
            const sectionName = section_response.data.record?.name || '';
            isHelpAndFaqContext.value = sectionName.toLowerCase().includes('help') || sectionName.toLowerCase().includes('faq');
        } catch (err) {
            console.error('Error checking section context:', err);
        }
    } catch (error) {
        console.error('Error fetching tab data:', error);
        console.error('Error details:', error.response?.data || error.message);
        nuxtApp.$toast.error(`Failed to load tab data: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
};

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

    // Append PDF files
    if (formData.pdf && formData.pdf.length > 0) {
        formData.pdf.forEach((file) => {
            form_data.append(`pdf[]`, file)
        });
    }

    form_data.set('content_1', formData.content_1 || '');
    form_data.set('content_2', formData.content_2 || '');
    // Do NOT override the sequence coming from the actual form field.
    // The FormData already includes the current "sequence" input value,
    // and the backend should use that as-is for updates.
    form_data.append('_method', 'PATCH');
    console.log(id.value, parentId.value);
    try {
        await nuxtApp.$axios.post(`/cms/section-tab/${parentId.value}/${id.value}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const record = response.data.record;
            
            // Ensure files and images arrays exist
            if (!record.files) record.files = [];
            if (!record.images) record.images = [];
            
            tabData.value = record;
            console.log('Tab updated - files:', record.files);
            populateData(record);
            // Clear PDF files from form after successful save
            formData.pdf = [];
            nuxtApp.$toast.success('Tab updated successfully!');
        });
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error updating tab. Please try again.');
    }
}

const populateData = (data) => {
    if (!data) {
        console.warn('populateData called with no data');
        return;
    }

    console.log(data.id);
    
    console.log('Populating form data from:', data);
    console.log('Data keys:', Object.keys(data));
    
    // Populate form fields - handle both null and undefined
    formData.title = data.title ?? '';
    formData.content_1 = data.content_1 ?? '';
    formData.content_2 = data.content_2 ?? '';
    formData.sequence = data.sequence ?? 0;
    
    // Force reactivity update
    nextTick(() => {
        console.log('Form data populated (after nextTick):', {
            title: formData.title,
            content_1: formData.content_1,
            content_2: formData.content_2,
            sequence: formData.sequence
        });
    });
}

// Watch for tabData changes to ensure data is populated
watch(tabData, (newData) => {
    if (newData) {
        console.log('tabData changed, populating form:', newData);
        populateData(newData);
    }
}, { immediate: true });
</script>
