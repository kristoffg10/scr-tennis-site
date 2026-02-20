<template>
    <div class="relative flex justify-start p-[16px] mb-[32px] w-full overflow-y-auto">
        <Form
            id="form"
            @submit="submit()"
            @invalid-submit="onInvalidSubmit"
            class="w-full gap-[16px] flex flex-col"
        >
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">
                    {{ `${formattedTitle || sectionData?.name || 'Section'} Information` }}
                </h2>

                <!-- Only render form fields AFTER data is loaded to ensure correct initial binding -->
                <template v-if="isLoaded">
                    <!-- Title / header (uses API 'title' field) -->
                    <TextField
                        v-if="!disableMainForm"
                        v-model="formData.title"
                        name="title"
                        :label="`${formattedTitle || sectionData?.name || 'Section'} Header`"
                        placeholder="Enter title"
                        :rules="'required|max:255'"
                        :hasErrors="hasErrors"
                    />

                    <!-- Description / body (Quill editor uses API 'description' field) -->
                    <Quill
                        v-if="isClient && !disableMainForm"
                        v-model="formData.description"
                        :modelValue="formData.description"
                        name="description"
                        :label="`${formattedTitle || sectionData?.name || 'Section'}`"
                        :max="0"
                        placeholder="Start typing..."
                    />
                </template>

                <!-- Section Emails Module Links -->
                <HowToAdd
                    v-if="sectionData && (sectionData.emails !== undefined || sectionData.name === 'Contact Information')"
                    title="Emails"
                    :link="`/section-emails/${sectionData.id}`"
                />
                
                <!-- Section Socials Module Links -->
                <HowToAdd
                    v-if="sectionData && (sectionData.socials !== undefined || sectionData.name === 'Contact Information')"
                    title="Social Media Links"
                    :link="`/section-socials/${sectionData.id}`"
                />
            </div>

            <div v-if="sectionData && sectionData.order === 3 && !disableMainForm" class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">
                    {{ `${formattedTitle || sectionData?.name || 'Section'} Image` }}
                </h2>
                <ImageHandler 
                    label="Desktop Image" 
                    :data="main_image"
                    max="1"
                    size="5"
                    :dimension="{width:566, height:355}"
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
            </div>

            <div v-if="sectionData && sectionData.order === 3 && !disableMainForm" class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">
                    {{ (formattedTitle || sectionData?.name || 'Section') + ' Button' }}
                </h2>
                <div class="flex flex-col gap-[8px]">
                    <h3 class="font-normal text-base text-ui-color">Has Button</h3>
                    <div class="pr-[16px] py-[12px] justify-start gap-[8px] flex">
                        <div
                            @click="formData.has_button = !formData.has_button"
                            class="cursor-pointer w-[40px] h-[24px] rounded-[12px] flex items-center hover:border hover:border-black p-[3px]"
                            :class="{'bg-ui-color justify-end' : formData.has_button, 'bg-light-gray justify-start' : !formData.has_button}"
                        >
                            <div class="w-[20px] h-[20px] bg-white rounded-full"></div>
                        </div>
                        {{ formData.has_button === 1 ? 'Yes' : 'No' }}
                    </div>
                </div>
                <div v-if="formData.has_button" v-for="(button, index) in formData.buttons" :key="index">
                    <Button :name="`button`" :button="button" :showLink="false" />
                </div>
            </div> 

            <ModuleId v-if="sectionData" :id="sectionData.id" />
            <HistoryLog v-if="sectionData && sectionData.logs && sectionData.logs.length" :log="sectionData.logs[0]" />

            <button
                v-if="!disableMainForm"
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
    import { useRoute, useRouter } from 'vue-router';
    import { Form } from 'vee-validate';

    definePageMeta({
        name: 'contactUsSection_id',
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
    const Button = defineAsyncComponent(() => {
        return import('@/components/form-fields/Button.vue')
    })
    const HowToAdd = defineAsyncComponent(() => {
        return import('@/components/HowToAdd.vue')
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
    const router = useRouter();
    const nuxtApp = useNuxtApp();

    const formattedTitle = ref('');
    const secondLastSegment = ref('');
    const sectionData = ref(null);
    const isClient = ref(false);

    // ✅ NEW: Gate that prevents TextField/Quill from mounting before data is ready
    const isLoaded = ref(false);

    const EMAIL_US_SECTION_ID = 'df7b710a-d93d-4add-aa10-ac07aba8fee0';
    const SOCIALS_SECTION_ID = '46da49e1-8c90-428d-a77f-4c3adacf0361';

    const isEmailUsStatic = computed(() => {
        const slug = route.params.contactUsSections;
        const sectionId = route.params.contactUsSection_id;
        return slug === 'email-us' && sectionId === EMAIL_US_SECTION_ID;
    });

    const isSocialsStatic = computed(() => {
        const slug = route.params.contactUsSections;
        const sectionId = route.params.contactUsSection_id;
        return slug === 'socials' && sectionId === SOCIALS_SECTION_ID;
    });

    const disableMainForm = computed(() => isEmailUsStatic.value || isSocialsStatic.value);

    onMounted(async () => {
        isClient.value = true;

        // If this is the "Call Us" section, redirect directly to the Section Hotlines list
        const sectionSlug = route.params.contactUsSections;
        const sectionId = route.params.contactUsSection_id;

        if (sectionSlug === 'call-us' && sectionId) {
            router.replace(`/section-hotline/${sectionId}`);
            return;
        }

        await fetchRecords();

        const pathSegments = route.path.split('/'); 
        if (pathSegments.length > 2) {
            secondLastSegment.value = pathSegments[pathSegments.length - 2];
        }

        // Prefer API name, fall back to URL slug
        if (sectionData.value && sectionData.value.name) {
            formattedTitle.value = sectionData.value.name;
        } else if (secondLastSegment.value) {
            formattedTitle.value = secondLastSegment.value
                .replace(/-/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase());
        } else {
            formattedTitle.value = 'Section';
        }

        pageTitle.setTitle(`Edit ${formattedTitle.value}`);
        pageTitle.setBreadcrumbs(['Pages', sidebar.activeLink, formattedTitle.value]);
        pageTitle.setPageFrom('Pages');
        pageTitle.setPageFromRoute('/pages');
    });

    const id = route.params.contactUsSection_id; 

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
    const hasErrors = ref({});

    const onInvalidSubmit = ({ values, errors, results }) => {
        hasErrors.value = errors;
        let isFormValid = true;
        if (imageHandler0.value?.validate && !imageHandler0.value.validate() && main_image.value.length == 0) {
            isFormValid = false;
        }
        nuxtApp.$toast.error('There are fields that require your attention. Kindly review the form.')
    }

    const submit = async () => {
        let isValid = true;
        if (imageHandler0.value?.validate && !imageHandler0.value.validate() && main_image.value.length == 0) {
            isValid = false;
        }

        const formElement = document.getElementById('form');
        const form_data = new FormData(formElement);

        // ✅ FIX: Explicitly set title and description from reactive state.
        // TextField may not write to the native DOM input reliably,
        // and Quill NEVER writes to a native input — it's a contenteditable div.
        // Without this, both fields are missing from the submitted FormData.
        form_data.set('title', formData.title || '');
        form_data.set('description', formData.description || '');

        formData.main_image.forEach((file) => {
            form_data.append(`main_image[]`, file)
        })
        formData.mobile_image.forEach((file) => {
            form_data.append(`mobile_image[]`, file)
        })
        form_data.append('has_button', formData.has_button ? 1 : 0); 
        form_data.append('_method', 'PATCH'); 

        if (isValid) {
            try {
                const response = await nuxtApp.$axios.post(`/cms/page-section/${id}`, form_data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                sectionData.value = response.data.record;
                nuxtApp.$toast.success('Page updated successfully!');
            } catch (error) {
                console.error('Error:', error);
                nuxtApp.$toast.error('Failed to update page. Please try again.');
            }
        } else {
            nuxtApp.$toast.error('There are fields that require your attention. Kindly review the form.')
        }
    }

    const populateData = (newData) => {
        if (!newData) return;

        console.log('Populating Contact Us form with record:', newData);

        // ✅ FIX: Populate title from API 'title' field
        formData.title = newData.title || '';

        // ✅ FIX: Populate description from API 'description' field
        formData.description = newData.description || '';

        formData.has_button = Number(newData.has_button) ? 1 : 0;

        if (newData.buttons && Array.isArray(newData.buttons) && newData.buttons.length) {
            formData.buttons = newData.buttons;
        } else {
            formData.buttons = [
                {
                    button_name: '',
                    button_link: '',
                    button_id: '',
                },
            ];
        }

        const imagesArray = Array.isArray(newData.images) ? newData.images : [];
        main_image.value = imagesArray.filter((image) => image.category === 'main_image');
        mobile_image.value = imagesArray.filter((image) => image.category === 'mobile_image');
    }

    const fetchRecords = async () => {
        try {
            console.log('Fetching contact-us section data for ID:', id);
            if (!id) {
                console.error('contactUsSection_id is undefined or empty!');
                nuxtApp.$toast.error('Invalid section ID. Please check the URL.');
                return;
            }

            const res = await nuxtApp.$axios.get(`/cms/page-section/${id}`);
            console.log('Contact-us API response:', res.data);

            let record = null;
            if (res.data && res.data.record) {
                record = res.data.record;
            } else if (res.data && res.data.id) {
                record = res.data;
            }

            if (!record) {
                console.error('No valid section record returned for contact-us section:', res.data);
                nuxtApp.$toast.error('Section data not found for this Contact Us section.');
                sectionData.value = null;
                return;
            }

            sectionData.value = record;
            console.log('Contact-us section data set:', sectionData.value);

            // ✅ Populate form data from the loaded record
            populateData(sectionData.value);

            // ✅ FIX: Only flip isLoaded AFTER data is in formData.
            // This ensures TextField and Quill mount with the correct initial values
            // instead of binding to empty strings and missing the later data update.
            isLoaded.value = true;

        } catch (err) {
            console.error('Error fetching section data:', err);
            console.error('Error response:', err.response?.data || err.message);
            nuxtApp.$toast.error('Failed to load section data for Contact Us.');
            sectionData.value = null;
            // Still show the form even on error so the user isn't stuck
            isLoaded.value = true;
        }
    }

    // Keep the watcher as a safety net for any external sectionData updates (e.g. after save)
    watch(sectionData, (newData) => {
        populateData(newData);
    })
</script>