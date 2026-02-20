<template>
    <div class="relative flex flex-col justify-start p-[16px] mb-[32px] w-full gap-y-[16px] overflow-y-auto">
        <div v-if="!sectionData" class="flex flex-col items-center justify-center p-8 gap-4">
            <p class="text-gray-500">Loading section data...</p>
            <p class="text-sm text-gray-400">If this persists, check the browser console for errors.</p>
        </div>
        <Form v-else id="form" @submit="submit()" @invalid-submit="onInvalidSubmit" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">{{ `${formattedTitle || sectionData?.name || 'Section'} Information` }}</h2>
                <TextField
                    v-model="formData.title"
                    name="title"
                    :label="`${formattedTitle || sectionData?.name || 'Section'} Header Copy`"
                    placeholder="Enter title"
                    :rules="'required|max:255'"
                    :hasErrors="hasErrors"
                />
                <!-- Description field (rich text) -->
                <Quill
                    v-if="isClient"
                    v-model="formData.description"
                    :modelValue="formData.description"
                    :name="`description`"
                    :label="`${formattedTitle || sectionData?.name || 'Section'} Copy`"
                    :max="0"
                    :placeholder="`Start typing...`"
                />
            </div>

            <!-- PDF upload (single file) -->
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Code of Conduct PDF</h2>
                <p class="text-sm text-black/60">
                    Upload a single PDF file for this Content Block.
                </p>
                <ImageHandler
                    label="PDF File"
                    :data="pdfFiles"
                    max="1"
                    size="10"
                    acceptedFormats="application/pdf"
                    :fileAlt="true"
                    :input_payload="{
                        identifier: 'pdf',
                        id: 'pdf_id',
                        category: 'pdf_category',
                        category_value: 'pdf',
                        alt: 'pdf_alt',
                        title: 'pdf_title'
                    }"
                    @update:file="handleFileUpdate('pdf', $event)"
                />
            </div>

            <ModuleId v-if="sectionData" :id="sectionData.id"/>
            <HistoryLog v-if="sectionData && sectionData.logs && sectionData.logs.length" :log="sectionData.logs[0]" />
                        
            <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px] self-end">Publish Update</button>
        </Form>
    </div>
</template>
<script setup>
    import { usePageTitleStore } from '~/stores/pageTitle';
    import { useSidebarStore } from '~/stores/sidebar';
    import { useRoute } from 'vue-router';
    import { Form } from 'vee-validate';

    definePageMeta({
        name: 'codeOfConductSection_id',
        middleware: 'authenticator'
    })

    const TextField = defineAsyncComponent(() => {
        return import('@/components/TextField.vue')
    })
    const Quill = defineAsyncComponent(() => {
        return import('@/components/form-fields/Quill.vue')
    })
    const ImageHandler = defineAsyncComponent(() => {
        return import('@/components/form-fields/ImageHandler.vue')
    })
    const ModuleId = defineAsyncComponent(() => {
        return import('@/components/ModuleId.vue')
    })
    const HistoryLog = defineAsyncComponent(() => {
        return import('@/components/HistoryLog.vue')
    })

    const pageTitle = usePageTitleStore();
    const sidebar = useSidebarStore();
    const route = useRoute();
    const nuxtApp = useNuxtApp();
    const isClient = ref(false);

    const id = route.params.codeOfConductSection_id;
    const formattedTitle = ref('');
    const sectionData = ref(null);

    onMounted( async () => {
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
                    .replace(/\b\w/g, char => char.toUpperCase());
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

    const formData = reactive({ 
        title: '',
        description: '',
        pdf: [],
    });

    const hasErrors = ref({});
    const onInvalidSubmit = ({ values, errors, results }) => {
        hasErrors.value = errors;
        nuxtApp.$toast.error('There are fields that require your attention. Kindly review the form.')
    }
    const submit = async () => {
        const formElement = document.getElementById('form');
        const form_data = new FormData(formElement);
        form_data.append('description', formData.description || ''); 

        // Append single PDF file if present
        if (formData.pdf && formData.pdf.length > 0) {
            formData.pdf.forEach((file) => {
                form_data.append('pdf[]', file);
            });
        }

        form_data.append('_method', 'PATCH'); 
        
        try {
            const response = await nuxtApp.$axios.post(`/cms/page-section/${id}`, form_data , {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response) => {
                sectionData.value = response.data.record;
                nuxtApp.$toast.success('Page updated successfully!');
            }); 

        } catch (error) {
            console.error('Error:', error);
        } 
    }

    const populateData = (newData) => {
        if (newData) {
            formData.title = newData.title || ''
            formData.description = newData.description || ''
        }
    }

    const pdfFiles = computed(() => {
        if (!sectionData.value || !Array.isArray(sectionData.value.files)) return [];

        return sectionData.value.files.filter((f) => {
            const isPdfCategory = (f.category || '').toLowerCase() === 'pdf';
            const isPdfName = (f.name || f.path || '').toLowerCase().endsWith('.pdf');
            return isPdfCategory || isPdfName;
        });
    });

    const handleFileUpdate = (field, file) => {
        formData[field] = file;
    };

    const fetchRecords = async () => {
        try {
            if (!id) {
                console.error('ID is undefined or empty!');
                return;
            }
            
            const res = await nuxtApp.$axios.get(`/cms/page-section/${id}`);

            let record = null;
            if (res.data?.record) {
                record = res.data.record;
            } else if (res.data && !res.data.record && res.data.id) {
                record = res.data;
            } else {
                console.error('Unexpected API response structure:', res.data);
                nuxtApp.$toast.error('Unexpected response format from server.');
                return;
            }

            if (!record) {
                console.error('No record found in API response:', res.data);
                nuxtApp.$toast.error('Section data not found. The section may have been deleted.');
                return;
            }

            sectionData.value = record;
            
            if (sectionData.value?.name && !formattedTitle.value) {
                formattedTitle.value = sectionData.value.name;
            }
        } catch (err) {
            console.error('Error fetching section data:', err);
            console.error('Error details:', err.response?.data || err.message);
            nuxtApp.$toast.error(`Failed to load section data: ${err.response?.data?.message || err.message || 'Unknown error'}`);
            sectionData.value = null;
        }
    }

    watch(sectionData, (newData) => {
        if (newData) {
            populateData(newData);
            if (!formattedTitle.value && newData.name) {
                formattedTitle.value = newData.name;
            }
        }
    }, { immediate: true })
</script>
