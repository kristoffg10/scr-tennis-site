<template>
    <div class="relative w-full flex flex-col gap-y-[15px] bg-offwhite overflow-y-auto">
        <!-- Header / Title -->
        <div class="relative w-full flex p-[16px] justify-between items-center bg-white">
            <div class="flex flex-col gap-y-[8px]">
                <h1 class="text-xl font-semibold text-black">Section Files</h1>
                <p class="text-sm text-black/60">
                    Files attached to this page section (e.g., Annual Integrated Report PDFs).
                </p>
            </div>
        </div>

        <div class="p-[16px] gap-y-[20px] overflow-y-auto gap-[16px] flex flex-col">
            <!-- Loading state -->
            <div v-if="!sectionData" class="flex flex-col items-center justify-center p-8 gap-2">
                <p class="text-gray-500">Loading section files...</p>
                <p class="text-xs text-gray-400">If this persists, please check the browser console for errors.</p>
            </div>

            <template v-else>
                <!-- Uploader -->
                <Form id="form" @submit="submit"
                    class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                    <h2 class="font-semibold text-xl text-start w-full">Upload Files</h2>
                    <p class="text-sm text-black/60">
                        Upload PDF files associated with this section. These will be linked as downloads on the site.
                    </p>

                    <ImageHandler
                        label="PDF Files"
                        :data="pdfFiles"
                        :max="pdfMax"
                        :fileAlt="true"
                        size="10"
                        acceptedFormats="application/pdf"
                        :input_payload="{
                            identifier: 'pdf',
                            id: 'pdf_id',
                            category: 'pdf_category',
                            category_value: 'pdf',
                            alt: 'pdf_alt',
                            title: 'pdf_title'
                        }"
                        @update:file="handlePdfUpdate"
                        @file-deleted="fetchSection"
                    />

                    <div class="flex self-end gap-[16px]">
                        <button type="submit"
                            class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">
                            Save Files
                        </button>
                    </div>
                </Form>

                <!-- Files table -->
                <p class="text-black font-medium text-base" v-if="files && files.length">
                    <span class="text-black/60">Total files:</span> {{ files.length }}
                </p>

                <table v-if="files && files.length"
                    class="min-w-full border-collapse rounded-[10px] overflow-hidden bg-off-white border-separate border-spacing-0 relative z-10">
                    <thead>
                        <tr class="h-[40px] bg-white text-black/60 font-medium text-base text-left">
                             <th class="px-[24px] py-[8px]">#</th>
                            <th class="px-[24px] py-[8px] rounded-[10px]">Filename</th>
                            <th class="px-[24px] py-[8px]">Title</th>
                            <th class="px-[24px] py-[8px]">File</th>
                            <th class="px-[24px] py-[8px]">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(file, index) in files" :key="file.id" class="h-[40px] bg-white text-black text-left">
                             <td class="px-[24px] py-[8px] text-base font-normal">
                                {{ index+1}}
                            </td>
                            <td class="px-[24px] py-[8px] text-base font-normal">
                                {{ file.alt ?? '-' }}.pdf
                            </td>
                            <td class="px-[24px] py-[8px] text-base font-semibold">
                                {{ file.title || file.name || '-' }}
                            </td>
                            <td class="px-[24px] py-[8px] text-base font-normal">
                                <a v-if="file.path" class="text-ui-color underline break-all" :href="file.path"
                                    target="_blank" rel="noopener noreferrer">
                                    {{ file.path }}
                                </a>
                                <span v-else>-</span>
                            </td>
                            <td class="px-[24px] py-[8px] text-base font-normal">
                                <span v-if="file.updated_at">
                                    {{ $moment(file.updated_at).format('MMM DD, YYYY') }}
                                    <br />
                                    <span class="text-sm text-black">
                                        {{ $moment(file.updated_at).format('hh:mm A') }}
                                    </span>
                                </span>
                                <span v-else>-</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div v-else class="flex flex-col items-center justify-center p-8 gap-2 bg-white rounded-[10px]">
                    <p class="text-gray-500">No files attached to this section yet.</p>
                    <p class="text-xs text-gray-400 text-center max-w-xl">
                        Files (like Annual Integrated Report PDFs) are managed together with this page section's
                        content. Once files are uploaded for this section, they will appear here.
                    </p>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { usePageTitleStore } from '~/stores/pageTitle';
import { useRoute } from 'vue-router';
import { Form } from 'vee-validate';

definePageMeta({
    middleware: 'authenticator',
});

const ImageHandler = defineAsyncComponent(() => import('@/components/form-fields/ImageHandler.vue'));

const pageTitle = usePageTitleStore();
const route = useRoute();
const nuxtApp = useNuxtApp();

const parentId = route.params.parent_id;
const sectionData = ref(null);
const files = ref([]);
const formData = reactive({
    pdf: []
});

// Section IDs that allow only 1 PDF upload
const SECTION_IDS_SINGLE_PDF = [
    '51ab3b63-5cb3-4caf-8bcd-317a4cbc7ee5',
    '8adde00d-a8e1-47a0-835b-88409fda7b72',
    'ce69a142-65f3-4c85-8633-53e72a978ad0',
    '6ccafa7f-bd80-4e2e-bf29-cff72b5e36cb'
];

// For Claim Requirements sections (or specific section ID), limit PDFs to 1; others can have up to 5
const isClaimRequirementsSection = computed(() => {
    return sectionData.value && sectionData.value.name &&
        sectionData.value.name.toLowerCase().includes('claim requirements');
});

const isSinglePdfSection = computed(() => SECTION_IDS_SINGLE_PDF.includes(parentId));

const pdfMax = computed(() => {
    return (isClaimRequirementsSection.value || isSinglePdfSection.value) ? 1 : 5;
});

const pdfFiles = computed(() => {
    if (!sectionData.value || !Array.isArray(sectionData.value.files)) return [];
    // Filter only PDF-like files (by category or extension)
    return sectionData.value.files.filter((f) => {
        const isPdfCategory = (f.category || '').toLowerCase() === 'pdf';
        const isPdfName = (f.name || f.path || '').toLowerCase().endsWith('.pdf');
        return isPdfCategory || isPdfName;
    });
});

onMounted(async () => {
    pageTitle.setTitle('Section Files');
    pageTitle.setBreadcrumbs(['Pages', 'Section Files']);
    pageTitle.setPageFrom('Pages');
    pageTitle.setPageFromRoute('/pages');

    await fetchSection();
});

const fetchSection = async () => {
    try {
        if (!parentId) {
            console.error('Missing parent_id in route params for section-files.');
            nuxtApp.$toast?.error?.('Invalid section ID. Please check the URL.');
            return;
        }

        const res = await nuxtApp.$axios.get(`/cms/page-section/${parentId}`);
        const record = res.data?.record;

        if (!record) {
            console.error('No section record found for section-files:', res.data);
            nuxtApp.$toast?.error?.('Section data not found.');
            return;
        }

        sectionData.value = record;
        files.value = Array.isArray(record.files) ? record.files : [];
        console.log('Section files loaded:', files.value);
    } catch (error) {
        console.error('Error fetching section files:', error);
        nuxtApp.$toast?.error?.('Failed to load section files.');
    }
};

const handlePdfUpdate = (filesArr) => {
    formData.pdf = filesArr || [];
};

const submit = async () => {
    try {
        if (!parentId) {
            nuxtApp.$toast?.error?.('Invalid section ID. Please check the URL.');
            return;
        }

        const formElement = document.getElementById('form');
        const form_data = new FormData(formElement);

        // Append new PDFs
        if (formData.pdf && formData.pdf.length) {
            formData.pdf.forEach((file) => {
                form_data.append('pdf[]', file);
            });
        }

        form_data.append('_method', 'PATCH');

        const res = await nuxtApp.$axios.post(`/cms/page-section/${parentId}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        sectionData.value = res.data?.record || sectionData.value;
        files.value = Array.isArray(sectionData.value.files) ? sectionData.value.files : [];
        formData.pdf = [];

        nuxtApp.$toast?.success?.('Files saved successfully!');
        console.log('Section files updated:', files.value);
    } catch (error) {
        console.error('Error saving section files:', error);
        nuxtApp.$toast?.error?.('Failed to save section files.');
    }
};
</script>