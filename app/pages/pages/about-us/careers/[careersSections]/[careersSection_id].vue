<template>
    <div class="relative flex flex-col justify-start p-[16px] mb-[32px] w-full gap-[16px] overflow-y-auto">
        <div v-if="!sectionData" class="flex flex-col items-center justify-center p-8 gap-4">
            <p class="text-gray-500">Loading section data...</p>
            <p class="text-sm text-gray-400">If this persists, check the browser console for errors.</p>
        </div>
        <Form
            v-else
            id="form"
            @submit="submit()"
            @invalid-submit="onInvalidSubmit"
            class="w-full gap-[16px] flex flex-col"
        >
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">
                    {{ `${formattedTitle || sectionData?.name || 'Section'} Information` }}
                </h2>

                <TextField
                    v-model="formData.title"
                    name="title"
                    :label="`${formattedTitle || sectionData?.name || 'Section'} Header Copy`"
                    placeholder="Enter title"
                    :rules="'required|max:255'"
                    :hasErrors="hasErrors"
                />

                <!-- <TextField
                    v-if="isBannerSection || isCommitmentSection || isCTASection"
                    v-model="formData.sub_text"
                    name="sub_text"
                    label="Subtext"
                    placeholder="Enter subtext"
                    :rules="'max:255'"
                    :hasErrors="hasErrors"
                /> -->

                <Quill
                    v-if="(isCommitmentSection || isCTASection) && isClient"
                    v-model="formData.description"
                    :modelValue="formData.description"
                    name="description"
                    :label="`${formattedTitle || sectionData?.name || 'Section'} Copy`"
                    :max="0"
                    placeholder="Start typing..."
                />

                <!-- Section Cards Module Links (for Benefits, Commitment) -->
                <HowToAdd
                    v-if="sectionData && (sectionData.cards !== undefined || sectionData.name === 'Benefits' || sectionData.name === 'Commitment')"
                    title="Cards"
                    :link="`/section-cards/${sectionData.id}`"
                />

                <!-- Section FAQs Module Links (for Careers FAQs) -->
                <HowToAdd
                    v-if="sectionData && (sectionData.faqs !== undefined || sectionData.name === 'Careers FAQs')"
                    title="FAQs"
                    :link="`/section-faqs/${sectionData.id}`"
                />
            </div>

            <!-- Desktop image (Banner and CTA) -->
            <div
                v-if="sectionData && (isBannerSection || isCTASection)"
                class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full"
            >
                <h2 class="font-semibold text-xl text-start w-full">Desktop Image</h2>
                <ImageHandler
                    label="Desktop Image"
                    :data="main_image"
                    max="1"
                    size="5"
                    :dimension="isBannerSection ? { width: 1280, height: 728 } : { width: 432, height: 290 }"
                    :input_payload="{
                        identifier: 'main_image',
                        id: 'main_image_id',
                        category: 'main_image_category',
                        category_value: 'main_image',
                        alt: 'main_image_alt',
                    }"
                    v-model="formData.main_image"
                    @update:file="handleFileUpdate('main_image', $event)"
                />
            </div>

            <ModuleId v-if="sectionData" :id="sectionData.id" />
            <HistoryLog
                v-if="sectionData && sectionData.logs && sectionData.logs.length"
                :log="sectionData.logs[0]"
            />

            <button
                type="submit"
                class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px] self-end"
            >
                Publish Update
            </button>
        </Form>
    </div>
</template>

<script setup>
import { usePageTitleStore } from '~/stores/pageTitle';
import { useSidebarStore } from '~/stores/sidebar';
import { useRoute } from 'vue-router';
import { Form } from 'vee-validate';

definePageMeta({
    name: 'aboutUsCareersSection_id',
    middleware: 'authenticator',
});

const TextField = defineAsyncComponent(() => {
    return import('@/components/TextField.vue');
});
const HowToAdd = defineAsyncComponent(() => {
    return import('@/components/HowToAdd.vue');
});
const ModuleId = defineAsyncComponent(() => {
    return import('@/components/ModuleId.vue');
});
const HistoryLog = defineAsyncComponent(() => {
    return import('@/components/HistoryLog.vue');
});
const ImageHandler = defineAsyncComponent(() => {
    return import('@/components/form-fields/ImageHandler.vue');
});
const Quill = defineAsyncComponent(() => {
    return import('@/components/form-fields/Quill.vue');
});

const pageTitle = usePageTitleStore();
const sidebar = useSidebarStore();
const route = useRoute();
const nuxtApp = useNuxtApp();

const id = route.params.careersSection_id;
const formattedTitle = ref('');
const sectionData = ref(null);

const isBannerSection = computed(() => sectionData.value?.name === 'Banner');
const isCommitmentSection = computed(() => sectionData.value?.name === 'Commitment');
const isCTASection = computed(() => sectionData.value?.name === 'CTA');
const isClient = ref(false);
const main_image = ref([]);

const formData = reactive({
    title: '',
    description: '',
    sub_text: '',
    main_image: [],
});

const hasErrors = ref({});

onMounted(async () => {
    isClient.value = true;
    if (!id) {
        console.error('No section ID found in route params!');
        nuxtApp.$toast.error('Invalid section ID. Please check the URL.');
        return;
    }

    await fetchRecords();

    const pathSegments = route.path.split('/');
    if (pathSegments.length > 2) {
        const secondLastSegment = pathSegments[pathSegments.length - 2];
        if (secondLastSegment) {
            formattedTitle.value = secondLastSegment
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase());
        }
    }

    if (!formattedTitle.value && sectionData.value?.name) {
        formattedTitle.value = sectionData.value.name;
    }

    if (!formattedTitle.value) {
        formattedTitle.value = 'Section';
    }

    pageTitle.setTitle(`Edit ${formattedTitle.value}`);
    pageTitle.setBreadcrumbs(['Pages', sidebar.activeLink, formattedTitle.value]);
    pageTitle.setPageFrom('Pages');
    pageTitle.setPageFromRoute('/pages');
});

// ImageHandler emits an array of File objects; store as flat array so submit appends real files
const handleFileUpdate = (field, files) => {
    if (field === 'main_image') {
        formData.main_image = Array.isArray(files) ? files : (files ? [files] : []);
    }
};

const onInvalidSubmit = ({ values, errors, results }) => {
    hasErrors.value = errors;
    nuxtApp.$toast.error('There are fields that require your attention. Kindly review the form.');
};

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);

    form_data.append('description', formData.description || '');
    if (formData.sub_text !== undefined && formData.sub_text !== null) {
        form_data.append('sub_text', formData.sub_text || '');
    }
    if (formData.main_image && formData.main_image.length > 0) {
        formData.main_image.forEach((file) => {
            if (file instanceof File) {
                form_data.append('main_image[]', file);
            }
        });
    }
    form_data.append('_method', 'PATCH');

    try {
        const response = await nuxtApp.$axios.post(`/cms/page-section/${id}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        sectionData.value = response.data.record;
        nuxtApp.$toast.success('Page updated successfully!');
    } catch (error) {
        console.error('Error updating section:', error);
        nuxtApp.$toast.error('Error updating section. Please try again.');
    }
};

const populateData = (newData) => {
    if (!newData) return;
    formData.title = newData.title || '';
    formData.description = newData.description || '';
    formData.sub_text = newData.sub_text || '';
    main_image.value = newData.images ? newData.images.filter((img) => img.category === 'main_image') : [];
};

const fetchRecords = async () => {
    try {
        const res = await nuxtApp.$axios.get(`/cms/page-section/${id}`);
        const record = res.data?.record || res.data;

        if (!record || !record.id) {
            nuxtApp.$toast.error('Section data not found.');
            return;
        }

        sectionData.value = record;
    } catch (err) {
        console.error('Error fetching section data:', err);
        nuxtApp.$toast.error('Failed to load section data.');
        sectionData.value = null;
    }
};

watch(
    sectionData,
    (newData) => {
        if (newData) {
            populateData(newData);
            if (!formattedTitle.value && newData.name) {
                formattedTitle.value = newData.name;
            }
        }
    },
    { immediate: true },
);
</script>
