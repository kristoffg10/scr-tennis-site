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
                        v-model="formData.title" name="title" :label="`${formattedTitle || sectionData?.name || 'Section'} Header Copy`"  placeholder="Enter title"
                        :rules="'required|max:255'" 
                        :hasErrors="hasErrors"
                        /> 
            </div>
            <div v-if="sectionData && sectionData.order === 1"  class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">{{`${formattedTitle || sectionData?.name || 'Section'} Image`}}</h2>
                <ImageHandler 
                    label="Desktop Image" 
                    :data="main_image"
                    max="1"
                    size="5"
                    :dimension="{width:1280, height:685}"
                    :input_payload="{
                        identifier: 'main_image',
                        id: 'main_image_id',
                        category: 'main_image_category',
                        category_value: 'main_image',
                        alt: 'main_image_alt',
                    }"
                    :required="true"
                    ref="imageHandler0"
                        v-model="formData.main_image[0]"
                    @update:file="handleFileUpdate('main_image', $event)"
                />
                <hr class="h-[1px] w-full border-gray">
                <ImageHandler 
                    label="Mobile Image" 
                    max="1"
                    size="5"
                    :data="mobile_image"
                    :dimension="{width:375, height:480}"
                    :input_payload="{
                        identifier: 'mobile_image',
                        id: 'mobile_image_id',
                        category: 'mobile_image_category',
                        category_value: 'mobile_image',
                        alt: 'mobile_image_alt',
                    }"
                    :required="true"
                    ref="imageHandler1"
                        v-model="formData.mobile_image[0]"
                    @update:file="handleFileUpdate('mobile_image', $event)"
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
        name: 'pressReleasesSection_id',
        middleware: 'authenticator'
    })

    const TextField = defineAsyncComponent(() => {
        return import('@/components/TextField.vue')
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

    const id = route.params.pressReleasesSection_id;
    const formattedTitle = ref('');
    const sectionData = ref(null);

    onMounted( async () => {
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
        has_button: 0,
        buttons: [],
        main_image: [],
        mobile_image: []
    });

    const main_image = ref([]);
    const mobile_image = ref([]);

    const handleFileUpdate = (field, file) => {
        formData[field] = file;
    };

    const imageHandler0 = ref(null);
    const imageHandler1 = ref(null);

    const hasErrors = ref({});
    const onInvalidSubmit = ({ values, errors, results }) => {
        hasErrors.value = errors;
        let isFormValid = true;
        if (imageHandler0.value?.validate && !imageHandler0.value.validate() && sectionData.value?.order === 1) {
            isFormValid = false;
        }
        if (imageHandler1.value?.validate && !imageHandler1.value.validate() && sectionData.value?.order === 1) {
            isFormValid = false;
        }
        nuxtApp.$toast.error('There are fields that require your attention. Kindly review the form.')
    }
    const submit = async () => {
        let isValid = true;
        if (imageHandler0.value?.validate && !imageHandler0.value.validate() && sectionData.value?.order === 1) {
            isValid = false;
        }
        if (imageHandler1.value?.validate && !imageHandler1.value.validate() && sectionData.value?.order === 1) {
            isValid = false;
        }
        const formElement = document.getElementById('form');
        const form_data = new FormData(formElement);
       
        formData.main_image.forEach((file, index) => {
            form_data.append(`main_image[]`, file)
        })
        formData.mobile_image.forEach((file, index) => {
            form_data.append(`mobile_image[]`, file)
        })
        form_data.append('has_button', formData.has_button ? 1 : 0); 
        form_data.append('_method', 'PATCH'); 
        if (isValid) {
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
        } else {
            nuxtApp.$toast.error('There are fields that require your attention. Kindly review the form.')
        }
    }

    const populateData = (newData) => {
        if (newData) {
            formData.title = newData.title || ''
            formData.description = newData.description || ''
            formData.has_button = Number(newData.has_button) ? 1 : 0
            formData.buttons = (newData.buttons && Array.isArray(newData.buttons) && newData.buttons.length) ? newData.buttons : [{
                button_name: '',
                link: '',
                id: '',
                is_link_out: 0
            }]
            main_image.value = (newData.images && Array.isArray(newData.images)) ? newData.images.filter(image => image.category === 'main_image') : [];
            mobile_image.value = (newData.images && Array.isArray(newData.images)) ? newData.images.filter(image => image.category === 'mobile_image') : [];
        }
    }

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
