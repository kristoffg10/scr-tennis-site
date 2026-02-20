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
                        v-model="formData.title" name="title" :label="`${formattedTitle || sectionData?.name || 'Section'} Header Copy`"  placeholder="Enter banner title"
                        :rules="'required|max:200'" 
                        :hasErrors="hasErrors"
                        /> 
                <!-- <TextInput v-model="formData.title" name="title" :label="`${formattedTitle} Header Copy`" max="50" placeholder="Enter banner title"/> -->
                <!-- Mission Vision section should not have parent copy field -->
                <Quill v-if="sectionData && !isMissionVisionSection && (sectionData.order === 2 || sectionData.order === 3 || sectionData.order === 4)" 
                    v-model="formData.description" 
                    :modelValue="formData.description" :name="`description`" 
                    :label="`${formattedTitle || sectionData?.name || 'Section'} Copy`" :max="1000" :placeholder="`Start typing...`"
                />
                
                <!-- Section Tabs Module Links -->
                <HowToAdd
                    v-if="sectionData && (sectionData.tabs !== undefined)"
                    :title="'Tabs'"
                    :link="`/section-tabs/${sectionData.id}`" />
                
                <!-- Section Videos Module Links -->
                <HowToAdd
                    v-if="sectionData && (sectionData.videos !== undefined || sectionData.name === 'Company Video')"
                    title="Videos"
                    :link="`/section-videos/${sectionData.id}`" />
                
                <!-- Section Emails Module Links -->
                <HowToAdd
                    v-if="sectionData && sectionData.emails !== undefined"
                    title="Emails"
                    :link="`/section-emails/${sectionData.id}`" />
                
                <!-- Section Socials Module Links -->
                <HowToAdd
                    v-if="sectionData && sectionData.socials !== undefined"
                    title="Social Media Links"
                    :link="`/section-socials/${sectionData.id}`" />
                <!-- Section Cards Module Links (Mission Vision) -->
                <HowToAdd
                    v-if="sectionData && (sectionData.cards !== undefined || isMissionVisionSection)"
                    title="Cards"
                    :link="`/section-cards/${sectionData.id}`" />
            </div>
            <!-- Parent section image fields are not used for Mission Vision -->
            <div v-if="sectionData && !isMissionVisionSection && (sectionData.order === 1 || sectionData.order === 3 || sectionData.order === 4 || sectionData.name === 'BOD & Management Team CTA' || sectionData.name === 'Corporate Governance CTA' || sectionData.name === 'Sustainability & CSR CTA' || sectionData.name === 'Careers CTA')"  class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">{{`${formattedTitle || sectionData?.name || 'Section'} Image`}}</h2>
                <ImageHandler 
                    label="Desktop Image" 
                    :data="main_image"
                    max="1"
                    size="5"
                    :dimension="(sectionData.order === 1 && sectionData.name !== 'BOD & Management Team CTA') ? {width:1280, height:685} : {width:566, height:355}"
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
                    :dimension="(sectionData.order === 1 && sectionData.name !== 'BOD & Management Team CTA') ? {width:375, height:480} : {width:566, height:355}"
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
           
            <!-- <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Banner Button</h2>
                <div class="flex flex-col gap-[8px]">
                    <h3 class="font-normal text-base text-ui-color">Has Button <span class="text-sm font-normal text-black/40">This banner will have 2 CTA Button</span></h3>
                    <h3 class="font-normal text-base text-ui-color">Has Button</h3>
                    <div class="pr-[16px] py-[12px] justify-start gap-[8px] flex">
                        <div @click="formData.has_button = !formData.has_button" class="cursor-pointer w-[40px] h-[24px] rounded-[12px] flex  items-center hover:border hover:border-black p-[3px]" :class="{'bg-ui-color justify-end' : formData.has_button, 'bg-light-gray justify-start' : !formData.has_button}">
                            <div class="w-[20px] h-[20px] bg-white rounded-full"></div>
                        </div>
                        {{ formData.has_button === 1 ? 'Yes' : 'No' }}
                    </div>
                </div>
                <div v-if="formData.has_button" v-for="(button, index) in formData.buttons" :key="index" class="">
                    <Button v-if="formData.has_button" :name="`button`" :button="button" :showLink="false"/>
                </div>
            </div> -->
            <ModuleId v-if="sectionData" :id="sectionData.id"/>
            <HistoryLog v-if="sectionData && sectionData.logs.length" :log="sectionData.logs[0]" />
                        
            <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px] self-end">Publish Update</button>
        </Form>
    </div>
</template>
<script setup>
    import { usePageTitleStore } from '~/stores/pageTitle';
    import { useSidebarStore } from '~/stores/sidebar';
    import { useRoute } from 'vue-router';
    import { useAsyncData } from 'nuxt/app';
    import { Form } from 'vee-validate';

    definePageMeta({
        name: 'aboutUsSection_id',
        middleware: 'authenticator'
    })

    const TextInput = defineAsyncComponent(() => {
        return import('@/components/form-fields/TextInput.vue')
    })
    const ImageHandler = defineAsyncComponent(() => {
        return import('@/components/form-fields/ImageHandler.vue')
    })
    const Button = defineAsyncComponent(() => {
        return import('@/components/form-fields/Button.vue')
    })
    const Quill = defineAsyncComponent(() => {
        return import('@/components/form-fields/Quill.vue')
    })
    const HowToAdd = defineAsyncComponent(() => {
        return import('@/components/HowToAdd.vue')
    })

    const pageTitle = usePageTitleStore();
    const sidebar = useSidebarStore();
    const route = useRoute();
    
    
    const nuxtApp = useNuxtApp();

    const id = route.params.aboutUsSection_id;
    const formattedTitle = ref('');
    const secondLastSegment = ref('');
    
    onMounted( async () => {
        if (!id) {
            console.error('No section ID found in route params!');
            nuxtApp.$toast.error('Invalid section ID. Please check the URL.');
            return;
        }
        
        await fetchRecords();
        const currentPath = route.path; // Get the current path
        const pathSegments = route.path.split('/'); 

        const firstPathSegment = currentPath.split('/')[1]; // Split by '/' and get the first segment after the base
        
        if (pathSegments.length > 2) {
            secondLastSegment.value = pathSegments[pathSegments.length - 2];
        }

        // Use sectionData.name as fallback if path parsing fails
        if (secondLastSegment.value) {
            formattedTitle.value = secondLastSegment.value
                .replace(/-/g, ' ') // Replace dashes with spaces
                .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
        }
        
        // Fallback to sectionData.name if formattedTitle is still empty
        if (!formattedTitle.value && sectionData.value?.name) {
            formattedTitle.value = sectionData.value.name;
        }
        
        if (!formattedTitle.value) {
            formattedTitle.value = 'Section';
        }

        // console.log(formattedTitle); // Output: 'Featured House & Lots'
        pageTitle.setTitle(`Edit ${formattedTitle.value}`);
        pageTitle.setBreadcrumbs(['Pages', sidebar.activeLink, formattedTitle.value]);

        pageTitle.setPageFrom('Pages');
        pageTitle.setPageFromRoute('/pages');
        
        // populateData(sectionData.value);
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

    const isMissionVisionSection = computed(() => {
        const name = sectionData.value?.name || formattedTitle.value || secondLastSegment.value || '';
        const normalized = (name || '').toString().toLowerCase().replace(/-/g, ' ').trim();
        return normalized === 'mission vision';
    });

    const handleFileUpdate = (field, file) => {
        formData[field] = file; // Updates the specific image field
    };

    const imageHandler0 = ref(null);
    const imageHandler1 = ref(null);

    const hasErrors = ref({});
    const onInvalidSubmit = ({ values, errors, results }) => {
        hasErrors.value = errors;
        // console.log(hasErrors.value)
        let isFormValid = true;
        if (imageHandler0.value?.validate && !imageHandler0.value.validate()) {
            isFormValid = false;
            console.log(isFormValid)
        }
        if (imageHandler1.value?.validate && !imageHandler1.value.validate()) {
            isFormValid = false;
        }
        nuxtApp.$toast.error('There are fields that require your attention. Kindly review the form.')
    }
    const submit = async () => {
        let isValid = true;
        if (imageHandler0.value?.validate && !imageHandler0.value.validate()) {
            isValid = false;
            console.log('isvalid: ' + isValid)
        }
        if (imageHandler1.value?.validate && !imageHandler1.value.validate()) {
            isValid = false;
        }
        const formElement = document.getElementById('form');
        const form_data = new FormData(formElement);
        console.log(main_image.value.length)
       
        formData.main_image.forEach((file, index) => {
            form_data.append(`main_image[]`, file)
        })
        formData.mobile_image.forEach((file, index) => {
            form_data.append(`mobile_image[]`, file)
        })
        form_data.append('has_button', formData.has_button ? 1 : 0); 
        form_data.append('description', formData.description); 
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

    const sectionData = ref(null);

    const fetchRecords = async () => {
        try {
            if (!id) {
                console.error('ID is undefined or empty!');
                return;
            }
            
            // Use Axios to make the GET request
            const res = await nuxtApp.$axios.get(`/cms/page-section/${id}`);

            // Handle different response structures
            let record = null;
            if (res.data?.record) {
                record = res.data.record;
            } else if (res.data && !res.data.record && res.data.id) {
                // Sometimes the record is directly in res.data
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

            // Set the section data
            sectionData.value = record;
            
            // Update formattedTitle if sectionData.name is available
            if (sectionData.value?.name && !formattedTitle.value) {
                formattedTitle.value = sectionData.value.name;
            }
        } catch (err) {
            console.error('Error fetching section data:', err);
            console.error('Error details:', err.response?.data || err.message);
            nuxtApp.$toast.error(`Failed to load section data: ${err.response?.data?.message || err.message || 'Unknown error'}`);
            sectionData.value = null; // Explicitly set to null on error
        }
    }

    watch(sectionData, (newData) => {
        if (newData) {
            populateData(newData);
            // Update formattedTitle if sectionData.name is available and formattedTitle is still empty
            if (!formattedTitle.value && newData.name) {
                formattedTitle.value = newData.name;
            }
        }
    }, { immediate: true })

</script>