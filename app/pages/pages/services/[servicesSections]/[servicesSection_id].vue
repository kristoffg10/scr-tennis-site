<template>
    <div class="relative flex flex-col justify-start p-[16px] mb-[32px] w-full gap-y-[16px] overflow-y-auto">
        <Form v-if="sectionData && formattedTitle" id="form" @submit="submit()" @invalid-submit="onInvalidSubmit"
            class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">{{ `${formattedTitle} Information` }}</h2>
                <TextField
                    v-if="!isFormsSection"
                    v-model="formData.title"
                    name="title"
                    :label="`${formattedTitle} Header Title`"
                    placeholder="Enter title"
                    :rules="'required|max:255'"
                    :hasErrors="hasErrors"
                />
                <Quill
                    v-if="!isClaimsBannerSection && !isServicesBannerSection && !isDownloadableFormsCTASection && !isBeneficiaryEnrollmentGuideCTASection && !isAvailmentProceduresBannerSection && !isAvailmentProcedureFaqsSection && !isServicesRootBannerSection && !isBeneficiaryFaqsSection && !isClaimsFAQsSection && !isTitleSubtextDesktopOnlySection && !isMobileAppAvailmentCTASection && !isEmergenciesCTASection && (isBannerSection || isCTASection || isTestimonialsSection || isFAQsSection) && isClient"
                    v-model="formData.description"
                    :modelValue="formData.description"
                    :name="`description`"
                    :label="`Description`"
                    :max="0"
                    :placeholder="`Enter description`"
                />
                <TextField
                    v-if="sectionData && (sectionData.sub_text !== undefined || isTitleSubtextDesktopOnlySection) && !isClaimsFAQsSection && !isDownloadableFormsCTASection && !isFormsSection && (!isClaimRequirementsSection || isTitleSubtextDesktopOnlySection)"
                    v-model="formData.sub_text"
                    name="sub_text"
                    label="Sub Text"
                    placeholder="Enter sub text"
                    :rules="'max:255'"
                    :hasErrors="hasErrors"
                />

                <!-- Section Cards Module Links (hidden for title+subtext+desktop-only sections) -->
                <HowToAdd
                    v-if="sectionData && !isTitleSubtextDesktopOnlySection && (sectionData.name === 'Availment Instructions' || sectionData.name === 'Enrollment Guide' || sectionData.name === 'Claim Instructions' || sectionData.name === 'Plan Highlights' || sectionData.name === 'App Highlights' || sectionData.name === 'Telemedicine Features' || sectionData.name === 'Benefits' || sectionData.name === 'Optional Benefits')"
                    :title="sectionData.name"
                    :link="`/section-cards/${sectionData.id}`" />
                
                <!-- Section Tabs Module Links -->
                <HowToAdd
                    v-if="sectionData && !isTitleSubtextDesktopOnlySection && (sectionData.name === 'Claim Requirements' || sectionData.name === 'Forms')"
                    :title="sectionData.name"
                    :link="`/section-tabs/${sectionData.id}`"
                    :buttonLabel="sectionData.name === 'Claim Requirements' ? 'Claim Requirement List' : undefined" />
                
                <!-- Section Videos Module Links -->
                <HowToAdd
                    v-if="sectionData && !isTitleSubtextDesktopOnlySection && sectionData.name === 'Video'"
                    title="Video"
                    :link="`/section-videos/${sectionData.id}`" />
            </div>

            <!-- Claim Requirements PDF upload (limited to 1, specific section) -->
            <div
                v-if="isClaimRequirementsPdfSection"
                class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full"
            >
                <h2 class="font-semibold text-xl text-start w-full">Claim Requirements PDF</h2>
                <p class="text-sm text-black/60">
                    Upload a single PDF file for this Claim Requirements section.
                </p>
                <ImageHandler
                    label="PDF File"
                    :data="pdfFiles"
                    max="1"
                    size="10"
                    acceptedFormats="application/pdf"
                    :input_payload="{
                        identifier: 'pdf',
                        id: 'pdf_id',
                        category: 'pdf_category',
                        category_value: 'pdf',
                        alt: 'pdf_alt'
                    }"
                    @update:file="handleFileUpdate('pdf', $event)"
                />
            </div>

            <!-- Claim Instructions: multi-PDF upload -->
            <div
                v-if="isClaimInstructionsSection"
                class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full"
            >
                <h2 class="font-semibold text-xl text-start w-full">PDF Files</h2>
                <p class="text-sm text-black/60">
                    Upload PDF files for Claim Instructions (e.g., guides, forms). You can upload more than one.
                </p>
                <ImageHandler
                    label="PDF Files"
                    :data="pdfFiles"
                    max="5"
                    size="10"
                    :fileAlt="true"
                    acceptedFormats="application/pdf"
                    :allowMultiple="true"
                    :showTitle="true"
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
                    @file-deleted="fetchRecords"
                />
            </div>
               <!-- Images Section - Banner/CTA (full) or Claims Filing CTA / Availment Procedures CTA (desktop only) - hidden for Services root banner -->
            <div
    v-if="(isBannerSection || (isCTASection && sectionData.has_button)) && !isClaimsBannerSection && !isAvailmentProceduresBannerSection && (!isServicesRootBannerSection || id === 'b0b0fc92-9bcf-4a5f-8bd7-c0c64137ad72' || id === 'e252184b-330e-4559-b8c0-6e3a1a282973')"
    class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">
                    {{ isTitleSubtextDesktopOnlySection ? 'Desktop Image' : `${formattedTitle} Image` }}
                </h2>
                <ImageHandler :label="isTitleSubtextDesktopOnlySection ? 'Desktop Image' : 'Desktop Images'" :data="main_image" max="1" size="5"
                    :dimension="isBannerSection ? { width: 1280, height: 728 } : { width: 432, height: 290 }"
                    :input_payload="{
                        identifier: 'main_image',
                        id: 'main_image_id',
                        category: 'main_image_category',
                        category_value: 'main_image',
                        alt: 'main_image_alt',
                    }" :required="isBannerSection" ref="imageHandler0" v-model="formData.main_image"
                    @update:file="handleFileUpdate('main_image', $event)" />

                <hr v-if="(isBannerSection || isBeneficiaryEnrollmentGuideCTASection) && !isTitleSubtextDesktopOnlySection" class="h-[1px] w-full border-gray" />
                <ImageHandler v-if="(isBannerSection || isBeneficiaryEnrollmentGuideCTASection) && !isTitleSubtextDesktopOnlySection" label="Mobile Image" max="1" size="5"
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
            
            <!-- Buttons Section - For Banner and CTA (hidden for Mobile App Availment CTA, Emergencies CTA, Claims Filing CTA, Availment Procedures CTA, Claims Banner, Services Banner, root Services Banner, Downloadable Forms CTA, Beneficiary Enrollment Guide CTA, Digital Platforms CTA, Availment Procedures Banner) -->
            <div v-if="!isClaimsBannerSection && !isServicesBannerSection && !isServicesRootBannerSection && !isDownloadableFormsCTASection && !isBeneficiaryEnrollmentGuideCTASection && !isDigitalPlatformsCTASection && !isAvailmentProceduresBannerSection && (isBannerSection || isCTASection) && !isAvailmentProceduresCTASection && !isTitleSubtextDesktopOnlySection && !isMobileAppAvailmentCTASection && !isEmergenciesCTASection"
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
                    <Button v-if="formData.has_button" :name="`button`" :button="button" :showLink="false"
                        :index="index" />
                </div>
            </div>
            
            <!-- Testimonials Management Section -->
            <div v-if="isTestimonialsSection" class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <div class="flex justify-between items-center">
                    <h2 class="font-semibold text-xl text-start w-full">Testimonials</h2>
                    <button type="button" @click="openTestimonialModal()" 
                        class="px-[16px] py-[8px] bg-ui-color text-white text-center rounded-[10px] text-sm">
                        Add Testimonial
                    </button>
                </div>
                <div v-if="sectionData && sectionData.testimonials && sectionData.testimonials.length > 0" 
                    class="flex flex-col gap-[12px]">
                    <div v-for="(testimonial, index) in sectionData.testimonials" :key="testimonial.id"
                        class="border border-gray rounded-[10px] p-[16px] flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="font-semibold text-base">{{ testimonial.name }}</h3>
                            <p class="text-sm text-black/60">{{ testimonial.position }}{{ testimonial.company ? `, ${testimonial.company}` : '' }}</p>
                            <p class="text-sm text-black/80 mt-[8px]">{{ testimonial.content }}</p>
                        </div>
                        <div class="flex gap-[8px]">
                            <button type="button" @click="editTestimonial(testimonial)" 
                                class="px-[12px] py-[6px] bg-ui-hover text-ui-color rounded-[5px] text-sm">
                                Edit
                            </button>
                            <button type="button" @click="deleteTestimonial(testimonial.id)" 
                                class="px-[12px] py-[6px] bg-red-100 text-red-600 rounded-[5px] text-sm">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                <p v-else class="text-sm text-black/60">No testimonials added yet.</p>
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
                            <p class="text-sm text-black/80 mt-[8px]">{{ faq.answer }}</p>
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

            <ModuleId v-if="sectionData && !isFormsSection" :id="sectionData.id" />
            <HistoryLog v-if="sectionData && sectionData.logs.length && !isFormsSection" :log="sectionData.logs[0]" />

            <button
                v-if="!isFormsSection"
                type="submit"
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
    name: 'servicesSection_id',
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
    const pathSegments = route.path.split('/');

    if (pathSegments.length > 2) {
        secondLastSegment.value = pathSegments[pathSegments.length - 2];
    }

    if (sectionData.value && sectionData.value.name) {
        formattedTitle.value = sectionData.value.name;
    } else {
        formattedTitle.value = secondLastSegment.value
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
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

const id = route.params.servicesSection_id;

const isClaimsBannerSection = computed(() => {
    return route.params.servicesSections === 'claims-banner';
});

// Services Banner: hide description field and buttons section
const isServicesBannerSection = computed(() => {
    return route.params.servicesSections === 'services-banner';
});

// Downloadable Forms CTA: hide description field and buttons section
const isDownloadableFormsCTASection = computed(() => {
    return route.params.servicesSections === 'downloadable-forms-cta';
});

// Beneficiary Enrollment Guide CTA: hide description field and buttons section
const isBeneficiaryEnrollmentGuideCTASection = computed(() => {
    return route.params.servicesSections === 'beneficiary-enrollment-guide-cta';
});

// Digital Platforms CTA: hide buttons section
const isDigitalPlatformsCTASection = computed(() => {
    return route.params.servicesSections === 'digital-platforms-cta';
});

// Availment Procedures Banner: hide description field, images, and buttons section
const isAvailmentProceduresBannerSection = computed(() => {
    return route.params.servicesSections === 'availment-procedures-banner';
});

// Availment Procedure FAQs: hide description field
const isAvailmentProcedureFaqsSection = computed(() => {
    return route.params.servicesSections === 'availment-procedure-faqs';
});

// Root Services Banner: hide description field
const isServicesRootBannerSection = computed(() => {
    return route.params.servicesSections === 'banner';
});

// Beneficiary FAQs: hide description field
const isBeneficiaryFaqsSection = computed(() => {
    return route.params.servicesSections === 'beneficiary-faqs';
});

// Forms section: hide header title and sub text fields
const isFormsSection = computed(() => {
    return route.params.servicesSections === 'forms';
});

const formData = reactive({
    title: '',
    description: '',
    sub_text: '',
    has_button: 0,
    buttons: [],
    main_image: [],
    mobile_image: [],
    pdf: [],
});

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

// Claims FAQs: hide description and sub text fields
const isClaimsFAQsSection = computed(() => {
    return sectionData.value && sectionData.value.name &&
        sectionData.value.name.toLowerCase().includes('claims faqs');
});

// Claim Requirements: hide sub text field
const isClaimRequirementsSection = computed(() => {
    return sectionData.value && sectionData.value.name &&
        sectionData.value.name.toLowerCase().includes('claim requirements');
});

// Claim Requirements sections: show single-PDF uploader
const isClaimRequirementsPdfSection = computed(() => {
    return sectionData.value && sectionData.value.name &&
        sectionData.value.name.toLowerCase().includes('claim requirements');
});

// Claim Instructions / Availment Instructions sections: show multi-PDF uploader
const isClaimInstructionsSection = computed(() => {
    const name = sectionData.value?.name?.toLowerCase() || '';
    return name.includes('claim instructions') || name.includes('availment instructions');
});

// Existing PDF files attached to this section (if any)
const pdfFiles = computed(() => {
    if (!sectionData.value || !Array.isArray(sectionData.value.files)) return [];

    return sectionData.value.files.filter((f) => {
        const isPdfCategory = (f.category || '').toLowerCase() === 'pdf';
        const isPdfName = (f.name || f.path || '').toLowerCase().endsWith('.pdf');
        return isPdfCategory || isPdfName;
    });
});

// Specific services CTA sections
const isAvailmentProceduresCTASection = computed(() => {
    return sectionData.value && sectionData.value.name &&
        sectionData.value.name.toLowerCase().includes('availment procedures cta');
});

// Claims Filing CTA & Availment Procedures CTA: only title, subtext, desktop image
const isTitleSubtextDesktopOnlySection = computed(() => {
    const name = sectionData.value?.name?.toLowerCase() || '';
    return name.includes('claims filing cta') || name.includes('availment procedures cta');
});

// Mobile App Availment CTA: hide description and buttons
const isMobileAppAvailmentCTASection = computed(() => {
    const name = sectionData.value?.name?.toLowerCase() || '';
    return name.includes('mobile app availment cta');
});

// Emergencies CTA: hide description and buttons
const isEmergenciesCTASection = computed(() => {
    const name = sectionData.value?.name?.toLowerCase() || '';
    return name.includes('emergencies cta');
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
    if (imageHandler0.value?.validate && !imageHandler0.value.validate()) {
        isFormValid = false;
    }
    if (imageHandler1.value?.validate && !imageHandler1.value.validate()) {
        isFormValid = false;
    }
    nuxtApp.$toast.error('There are fields that require your attention. Kindly review the form.');
};

const submit = async () => {
    let isValid = true;
    if (imageHandler0.value?.validate && !imageHandler0.value.validate() && main_image.value.length == 0) {
        isValid = false;
    }
    if (imageHandler1.value?.validate && !imageHandler1.value.validate() && mobile_image.value.length == 0) {
        isValid = false;
    }
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);

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
    // Append PDF file(s) – single for Claim Requirements, multiple for Claim Instructions
    if (formData.pdf && formData.pdf.length > 0) {
        formData.pdf.forEach((file) => {
            form_data.append('pdf[]', file);
        });
    }
    form_data.append('has_button', formData.has_button ? 1 : 0);
    form_data.append('description', formData.description || '');
    if (formData.sub_text) {
        form_data.append('sub_text', formData.sub_text);
    }
    form_data.append('_method', 'PATCH');

    if (isValid) {
        try {
            await nuxtApp.$axios
                .post(`/cms/page-section/${id}`, form_data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then(response => {
                    sectionData.value = response.data.record;
                    if (isClaimInstructionsSection.value && formData.pdf?.length) {
                        formData.pdf = [];
                    }
                    nuxtApp.$toast.success('Page updated successfully!');
                });

        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        nuxtApp.$toast.error('There are fields that require your attention. Kindly review the form.');
    }
};

const populateData = (newData) => {
    if (newData) {
        formData.title = newData.title || '';
        formData.description = newData.description || '';
        formData.sub_text = newData.sub_text || '';
        formData.has_button = Number(newData.has_button) ? 1 : 0;
        formData.buttons = newData.buttons && newData.buttons.length ? newData.buttons : [{
            button_name: '',
            link: '',
            id: '',
            is_link_out: 0,
        }];
        main_image.value = newData.images ? newData.images.filter(image => image.category === 'main_image') : [];
        mobile_image.value = newData.images ? newData.images.filter(image => image.category === 'mobile_image') : [];
    }
};

const openTestimonialModal = () => {
    navigateTo(`/section-testimonials/${id}/create`);
};

const editTestimonial = (testimonial) => {
    navigateTo(`/section-testimonials/${id}/${testimonial.id}`);
};

const deleteTestimonial = async (testimonialId) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
        try {
            await nuxtApp.$axios.delete(`/cms/section-testimonial/${id}/${testimonialId}`);
            await fetchRecords();
            nuxtApp.$toast.success('Testimonial deleted successfully!');
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            nuxtApp.$toast.error('Error deleting testimonial');
        }
    }
};

const openFAQModal = () => {
    navigateTo(`/section-faqs/${id}/create`);
};

const editFAQ = (faq) => {
    navigateTo(`/section-faqs/${id}/${faq.id}`);
};

const deleteFAQ = async (faqId) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
        try {
            await nuxtApp.$axios.delete(`/cms/section-faq/${id}/${faqId}`);
            await fetchRecords();
            nuxtApp.$toast.success('FAQ deleted successfully!');
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            nuxtApp.$toast.error('Error deleting FAQ');
        }
    }
};

const fetchRecords = async () => {
    try {
        const res = await nuxtApp.$axios.get(`/cms/page-section/${id}`);
        sectionData.value = res.data.record;
        console.log('Section data loaded:', sectionData.value);
    } catch (err) {
        console.error('Error fetching section data:', err);
        throw new Error('Failed to fetch data');
    }
};

watch(sectionData, newData => {
    populateData(newData);
});
</script>
