<template>
    <div class="relative flex flex-col justify-start p-[16px] mb-[32px] w-full gap-y-[16px] overflow-y-auto">
        <Form v-if="sectionData && formattedTitle" id="form" @submit="submit()" @invalid-submit="onInvalidSubmit"
            class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">{{ `${formattedTitle} Information` }}</h2>
                <!-- Title: hidden for banner sections -->
                <TextField v-if="!isBannerSection" v-model="formData.title" name="title" :label="`${formattedTitle} Header Title`"
                    placeholder="Enter title" :rules="'required|max:255'" :hasErrors="hasErrors" />
                <!-- Description Quill: Hide for Testimonials, Digital Platform CTA, General FAQs, Request for Proposal CTA -->
                <Quill v-if="(isBannerSection || (isCTASection && !isDigitalPlatformCTASection && !isRequestForProposalCTASection) || (isFAQsSection && !isGeneralFAQsSection)) && !isTestimonialsSection && isClient" 
                    v-model="formData.description" :modelValue="formData.description" :name="`description`" :label="`Description`" 
                    :max="0" :placeholder="`Enter description`"/>
                <!-- Sub Text: Hide for Homepage Banner, General FAQs, Request for Proposal CTA -->
                <!-- <TextField v-if="sectionData && sectionData.sub_text !== undefined && !isHomepageBannerSection && !isGeneralFAQsSection && !isRequestForProposalCTASection" v-model="formData.sub_text" name="sub_text" 
                    label="Sub Text" placeholder="Enter sub text" :rules="'max:255'" :hasErrors="hasErrors" /> -->
                <!-- <TextField v-if="
                    sectionData &&
                    (sectionData.name === 'Top Banner' || sectionData.name === 'Payment Channel CTA')"
                    v-model="formData.description" name="description" :label="`${formattedTitle} Header Description`"
                    placeholder="Enter description" :rules="'required|max:60'" :hasErrors="hasErrors" /> -->
                <!-- <TextInput v-model="formData.title" name="title" :label="`${formattedTitle} Header Copy`" max="50" placeholder="Enter banner title"/> -->
                <!-- <HowToAdd
                    v-if="sectionData && (sectionData.name === 'Featured House & Lots' || sectionData.name === 'Featured Condominiums')"
                    :title="formattedTitle"
                    :link="`/properties/${sectionData.name === 'Featured House & Lots' ? 'house-and-lots' : 'condominiums'}`" /> -->
                <!-- Section Cards Module Links -->
                <HowToAdd
                    v-if="sectionData && (sectionData.name === 'Availment Instructions' || sectionData.name === 'Enrollment Guide' || sectionData.name === 'Claim Instructions' || sectionData.name === 'Plan Highlights' || sectionData.name === 'App Highlights' || sectionData.name === 'Telemedicine Features' || sectionData.name === 'Benefits' || sectionData.name === 'Optional Benefits')"
                    :title="sectionData.name"
                    :link="`/section-cards/${sectionData.id}`" />
                
                <!-- Section Tabs Module Links -->
                <HowToAdd
                    v-if="sectionData && sectionData.name === 'Claim Requirements'"
                    title="Claim Requirements"
                    :link="`/section-tabs/${sectionData.id}`" />
                
                <!-- Section Videos Module Links -->
                <HowToAdd
                    v-if="sectionData && sectionData.name === 'Video'"
                    title="Video"
                    :link="`/section-videos/${sectionData.id}`" />
                
                <!-- Section Testimonials Module Links -->
                <HowToAdd
                    v-if="isTestimonialsSection"
                    title="Testimonials"
                    :link="`/section-testimonials/${sectionData.id}`" />
            </div>
            <!-- Images Section - For Banner, General FAQs, and CTA sections (Hide for Member Mobile App CTA and Digital Platforms CTA) -->
            <div
                v-if="(isBannerSection || isGeneralFAQsSection || (isCTASection && sectionData.has_button && !isDigitalPlatformCTASection)) && !isMemberMobileAppCTASection" 
                class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">
                    {{ `${formattedTitle} Image` }}
                </h2>
                <ImageHandler label="Desktop Images" :data="main_image" max="1" size="5"
                    :dimension="isBannerSection ? { width: 1280, height: 728 } : { width: 432, height: 290 }"
                    :input_payload="{
                        identifier: 'main_image',
                        id: 'main_image_id',
                        category: 'main_image_category',
                        category_value: 'main_image',
                        alt: 'main_image_alt',
                    }" :required="isBannerSection" ref="imageHandler0" v-model="formData.main_image"
                    @update:file="handleFileUpdate('main_image', $event)" />

                <hr v-if="isBannerSection" class="h-[1px] w-full border-gray" />
                <ImageHandler v-if="isBannerSection" label="Mobile Image" max="1" size="5"
                    :data="mobile_image"
                    :dimension="{ width: 375, height: 508 }"
                    :input_payload="{
                        identifier: 'mobile_image',
                        id: 'mobile_image_id',
                        category: 'mobile_image_category',
                        category_value: 'mobile_image',
                        alt: 'mobile_image_alt',
                    }" :required="true" ref="imageHandler1"
                    v-model="formData.mobile_image[0]" @update:file="handleFileUpdate('mobile_image', $event)" />
            </div>
            
            <!-- Buttons Section - CTA only, hidden for banner and specific homepage CTAs -->
            <div v-if="isCTASection && !isDigitalPlatformCTASection && !isNoButtonsCTASection"
                class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Buttons</h2>
                <div class="flex flex-col gap-[8px]">
                    <h3 class="font-normal text-base text-ui-color">Has Button</h3>
                    <div class="pr-[16px] py-[12px] justify-start gap-[8px] flex">
                        <div @click="formData.has_button = !formData.has_button"
                            class="cursor-pointer w-[40px] h-[24px] rounded-[12px] flex items-center hover:border hover:border-black p-[3px]"
                            :class="{
                                'bg-ui-color justify-end': formData.has_button,
                                'bg-light-gray justify-start': !formData.has_button,
                            }">
                            <div class="w-[20px] h-[20px] bg-white rounded-full"></div>
                        </div>
                        {{ formData.has_button === 1 ? 'Yes' : 'No' }}
                    </div>
                </div>
                <div v-if="formData.has_button" v-for="(button, index) in formData.buttons" :key="index" class="">
                    <Button v-if="formData.has_button" :name="`button`" :button="button" :showLink="true"
                        :index="index" />
                </div>
            </div>
            
            
            <!-- FAQs Management Section -->
            <div v-if="isFAQsSection" class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <div class="flex justify-between items-center">
                    <h2 class="font-semibold text-xl text-start w-full">FAQs</h2>
                    <button type="button" @click="openFAQModal()" 
                        class="px-[16px] py-[8px] bg-ui-color text-white text-center rounded-[10px] text-sm">
                        Add FAQ
                    </button>
                </div>
                <div v-if="sectionData && sectionData.faqs && sectionData.faqs.length > 0" 
                    class="flex flex-col gap-[12px]">
                    <div v-for="(faq, index) in sectionData.faqs" :key="faq.id"
                        class="border border-gray rounded-[10px] p-[16px] flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="font-semibold text-base">{{ faq.title }}</h3>
                            <p class="text-sm text-black/80 mt-[8px]">{{ stripHtml(faq.answer) }}</p>
                        </div>
                        <div class="flex gap-[8px]">
                            <button type="button" @click="editFAQ(faq)" 
                                class="px-[12px] py-[6px] bg-ui-hover text-ui-color rounded-[5px] text-sm">
                                Edit
                            </button>
                            <button type="button" @click="deleteFAQ(faq.id)" 
                                class="px-[12px] py-[6px] bg-red-100 text-red-600 rounded-[5px] text-sm">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                <p v-else class="text-sm text-black/60">No FAQs added yet.</p>
            </div>
            <ModuleId v-if="sectionData" :id="sectionData.id" />
            <HistoryLog v-if="sectionData && sectionData.logs.length" :log="sectionData.logs[0]" />

            <button type="submit"
                class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px] self-end">
                Publish Update
            </button>
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
    name: 'homepageSection_id',
    middleware: 'authenticator',
});

const TextField = defineAsyncComponent(() => {
    return import('@/components/TextField.vue');
});
const ImageHandler = defineAsyncComponent(() => {
    return import('@/components/form-fields/ImageHandler.vue');
});
const Button = defineAsyncComponent(() => {
    return import('@/components/form-fields/Button.vue');
});
const Quill = defineAsyncComponent(() => {
    return import('@/components/form-fields/Quill.vue');
});
const ModuleId = defineAsyncComponent(() => {
    return import('@/components/ModuleId.vue');
});
const HistoryLog = defineAsyncComponent(() => {
    return import('@/components/HistoryLog.vue');
});
const HowToAdd = defineAsyncComponent(() => {
    return import('@/components/HowToAdd.vue');
});

const pageTitle = usePageTitleStore();
const sidebar = useSidebarStore();
const route = useRoute();

const nuxtApp = useNuxtApp();

const formattedTitle = ref('');
const secondLastSegment = ref('');
const sectionData = ref(null);
const isClient = ref(false);
onMounted(async () => {
    isClient.value = true;
    await fetchRecords();
    const currentPath = route.path; // Get the current path
    const pathSegments = route.path.split('/');

    if (pathSegments.length > 2) {
        secondLastSegment.value = pathSegments[pathSegments.length - 2];
    }

    // Use section name if available, otherwise use formatted title from URL
    if (sectionData.value && sectionData.value.name) {
        formattedTitle.value = sectionData.value.name;
    } else {
        formattedTitle.value = secondLastSegment.value
            .replace(/-/g, ' ') // Replace dashes with spaces
            .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
    }

    pageTitle.setTitle(`Edit ${formattedTitle.value}`);
    pageTitle.setBreadcrumbs([
        'Pages',
        sidebar.activeLink,
        formattedTitle.value,
    ]);

    pageTitle.setPageFrom('Pages');
    pageTitle.setPageFromRoute('/pages');
});
const id = route.params.homepageSection_id;

const formData = reactive({
    title: '',
    description: '',
    sub_text: '',
    has_button: 0,
    buttons: [],
    main_image: [],
    mobile_image: [],
});

// Computed properties to determine section type
const isBannerSection = computed(() => {
    return sectionData.value && sectionData.value.name && 
           (sectionData.value.name.toLowerCase().includes('banner'));
});

const isCTASection = computed(() => {
    return sectionData.value && sectionData.value.name && 
           sectionData.value.name.toLowerCase().includes('cta');
});

const isTestimonialsSection = computed(() => {
    return sectionData.value && sectionData.value.name && 
           sectionData.value.name.toLowerCase().includes('testimonial');
});

const isFAQsSection = computed(() => {
    return sectionData.value && sectionData.value.name && 
           (sectionData.value.name.toLowerCase().includes('faq') || 
            sectionData.value.name.toLowerCase().includes('faqs'));
});

// Specific section identifiers for homepage modules
const isHomepageBannerSection = computed(() => {
    return sectionData.value && sectionData.value.name && 
           sectionData.value.name.toLowerCase() === 'homepage banner';
});

const isMemberMobileAppCTASection = computed(() => {
    return sectionData.value && sectionData.value.name && 
           sectionData.value.name.toLowerCase().includes('member mobile app');
});

const isDigitalPlatformCTASection = computed(() => {
    return sectionData.value && sectionData.value.name && 
           (sectionData.value.name.toLowerCase().includes('digital platform') ||
            sectionData.value.name.toLowerCase().includes('our digital platforms'));
});

const isGeneralFAQsSection = computed(() => {
    return sectionData.value && sectionData.value.name && 
           sectionData.value.name.toLowerCase() === 'general faqs';
});

const isRequestForProposalCTASection = computed(() => {
    return sectionData.value && sectionData.value.name && 
           sectionData.value.name.toLowerCase().includes('request for proposal');
});

// Homepage CTAs where buttons should be hidden
const isNoButtonsCTASection = computed(() => {
    if (!sectionData.value || !sectionData.value.name) return false;
    const name = sectionData.value.name.toLowerCase();
    return name.includes('eshop cta')
        || name.includes('member mobile app cta')
        || name.includes('our digital platforms cta')
        || name.includes('request proposal cta')
        || name.includes('annual report cta');
});

const main_image = ref([]);
const mobile_image = ref([]);

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
        // console.log(isFormValid)
    }
    if (imageHandler1.value?.validate && !imageHandler1.value.validate()) {
        isFormValid = false;
    }
    nuxtApp.$toast.error('There are fields that require your attention. Kindly review the form.')
}
const submit = async () => {
    let isValid = true;
    if (imageHandler0.value?.validate && !imageHandler0.value.validate() && main_image.value.length == 0) {
        isValid = false;
        console.log('isvalid: ' + isValid)
    }
    if (imageHandler1.value?.validate && !imageHandler1.value.validate() && mobile_image.value.length == 0) {
        isValid = false;
    }
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    // console.log(main_image.value.length);

    if (formData.main_image && formData.main_image.length > 0) {
        formData.main_image.forEach((file, index) => {
            form_data.append(`main_image[]`, file);
        });
    }
    if (formData.mobile_image && formData.mobile_image.length > 0) {
        formData.mobile_image.forEach((file, index) => {
            form_data.append(`mobile_image[]`, file);
        });
    }
    form_data.append('has_button', formData.has_button ? 1 : 0);
    form_data.append('description', formData.description || '');
    const subTextEl = formElement.querySelector('input[name="sub_text"], textarea[name="sub_text"]');
    const subTextValue = subTextEl ? subTextEl.value : (formData.sub_text ?? '');
    form_data.delete('sub_text');
    form_data.append('sub_text', subTextValue);
    form_data.append('_method', 'PATCH');

    if (isValid) {
        try {
            const response = await nuxtApp.$axios
                .post(`/cms/page-section/${id}`, form_data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then(async response => {
                    sectionData.value = response.data.record;
                    await fetchRecords();
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
        formData.sub_text = newData.sub_text || ''
        formData.has_button = Number(newData.has_button) ? 1 : 0
        formData.buttons = newData.buttons && newData.buttons.length ? newData.buttons : [{
            button_name: '',
            link: '',
            id: '',
            is_link_out: 0
        }]
        main_image.value = newData.images ? newData.images.filter(image => image.category === 'main_image') : [];
        mobile_image.value = newData.images ? newData.images.filter(image => image.category === 'mobile_image') : [];
    }
}

// FAQs management functions
const openFAQModal = () => {
    navigateTo(`/section-faqs/${id}/create`);
}

const editFAQ = (faq) => {
    navigateTo(`/section-faqs/${id}/${faq.id}`);
}

const stripHtml = (html) => {
    if (!html || typeof html !== 'string') return '';
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const deleteFAQ = async (faqId) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
        try {
            await nuxtApp.$axios.delete(`/cms/section-faq/${id}/${faqId}`);
            await fetchRecords(); // Refresh data
            nuxtApp.$toast.success('FAQ deleted successfully!');
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            nuxtApp.$toast.error('Error deleting FAQ');
        }
    }
}

const fetchRecords = async () => {
    try {
        // Use Axios to make the GET request
        const res = await nuxtApp.$axios.get(`/cms/page-section/${id}`);

        // Axios automatically parses JSON, so we just need to return the record
        sectionData.value = res.data.record; // Assuming 'record' is the field you need
        console.log('Section data loaded:', sectionData.value);
    } catch (err) {
        console.error('Error fetching section data:', err);
        throw new Error('Failed to fetch data');
    }
}

watch(sectionData, newData => {
    populateData(newData);
});
</script>
