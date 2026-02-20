<template>
    <div class="relative flex flex-col justify-start p-[16px] mb-[32px] w-full gap-y-[16px] overflow-y-auto">
        <Form v-if="sectionData && formattedTitle" id="form" @submit="submit()" @invalid-submit="onInvalidSubmit" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">{{ `${formattedTitle} Information` }}</h2>
                <TextField v-model="formData.title" name="title" :label="`${formattedTitle} Header Title`" placeholder="Enter title" :rules="'required|max:255'" :hasErrors="hasErrors" />
                <Quill v-if="(isBannerSection || isCTASection || isContentSection) && isClient" 
                    v-model="formData.description" :modelValue="formData.description" :name="`description`" :label="`Description`" :max="0" :placeholder="`Enter description`"/>
                <TextField v-if="sectionData && sectionData.sub_text !== undefined" v-model="formData.sub_text" name="sub_text" label="Sub Text" placeholder="Enter sub text" :rules="'max:255'" :hasErrors="hasErrors" />
                
                <!-- Section Cards Module Links (for sidebar section) -->
                <HowToAdd
                    v-if="sectionData && (sectionData.cards !== undefined || sectionData.name === 'sidebar section')"
                    title="Sidebar Section"
                    :link="`/section-cards/${sectionData.id}`" />
            </div>

            <div v-if="isBannerSection || (isCTASection && sectionData.has_button)" class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">{{ `${formattedTitle} Image` }}</h2>
                <ImageHandler label="Desktop Images" :data="main_image" max="1" size="5"
                    :dimension="isBannerSection ? { width: 1280, height: 728 } : { width: 432, height: 290 }"
                    :input_payload="{ identifier: 'main_image', id: 'main_image_id', category: 'main_image_category', category_value: 'main_image', alt: 'main_image_alt' }"
                    :required="isBannerSection" ref="imageHandler0" v-model="formData.main_image" @update:file="handleFileUpdate('main_image', $event)" />
                <hr v-if="isBannerSection" class="h-[1px] w-full border-gray" />
                <ImageHandler v-if="isBannerSection" label="Mobile Image" max="1" size="5" :data="mobile_image" :dimension="{ width: 375, height: 508 }"
                    :input_payload="{ identifier: 'mobile_image', id: 'mobile_image_id', category: 'mobile_image_category', category_value: 'mobile_image', alt: 'mobile_image_alt' }"
                    :required="true" ref="imageHandler1" v-model="formData.mobile_image[0]" @update:file="handleFileUpdate('mobile_image', $event)" />
            </div>
            
            <div v-if="isBannerSection || isCTASection" class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Buttons</h2>
                <div class="pr-[16px] py-[12px] justify-start gap-[8px] flex">
                    <div @click="formData.has_button = !formData.has_button" class="cursor-pointer w-[40px] h-[24px] rounded-[12px] flex items-center p-[3px]"
                        :class="{ 'bg-ui-color justify-end': formData.has_button, 'bg-light-gray justify-start': !formData.has_button }">
                        <div class="w-[20px] h-[20px] bg-white rounded-full"></div>
                    </div>
                    {{ formData.has_button === 1 ? 'Yes' : 'No' }}
                </div>
                <div v-if="formData.has_button" v-for="(button, index) in formData.buttons" :key="index">
                    <Button :name="`button`" :button="button" :showLink="false" :index="index" />
                </div>
            </div>

            <ModuleId v-if="sectionData" :id="sectionData.id" />
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

definePageMeta({ name: 'annualReportSection_id', middleware: 'authenticator' });

const TextField = defineAsyncComponent(() => import('@/components/TextField.vue'));
const ImageHandler = defineAsyncComponent(() => import('@/components/form-fields/ImageHandler.vue'));
const Button = defineAsyncComponent(() => import('@/components/form-fields/Button.vue'));
const Quill = defineAsyncComponent(() => import('@/components/form-fields/Quill.vue'));
const ModuleId = defineAsyncComponent(() => import('@/components/ModuleId.vue'));
const HistoryLog = defineAsyncComponent(() => import('@/components/HistoryLog.vue'));
const HowToAdd = defineAsyncComponent(() => import('@/components/HowToAdd.vue'));

const pageTitle = usePageTitleStore();
const sidebar = useSidebarStore();
const route = useRoute();
const nuxtApp = useNuxtApp();

const formattedTitle = ref('');
const sectionData = ref(null);
const isClient = ref(false);

onMounted(async () => {
    isClient.value = true;
    await fetchRecords();
    const pathSegments = route.path.split('/');
    const seg = pathSegments.length > 2 ? pathSegments[pathSegments.length - 2] : '';
    formattedTitle.value = (sectionData.value?.name) || seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    pageTitle.setTitle(`Edit ${formattedTitle.value}`);
    pageTitle.setBreadcrumbs(['Pages', sidebar.activeLink, formattedTitle.value]);
    pageTitle.setPageFrom('Pages');
    pageTitle.setPageFromRoute('/pages');
});

const id = route.params.annualReportSection_id;

const formData = reactive({ title: '', description: '', sub_text: '', has_button: 0, buttons: [], main_image: [], mobile_image: [] });

const isBannerSection = computed(() => sectionData.value?.name?.toLowerCase().includes('banner'));
const isCTASection = computed(() => sectionData.value?.name?.toLowerCase().includes('cta'));
const isContentSection = computed(() => sectionData.value?.name?.toLowerCase().includes('content'));

const main_image = ref([]);
const mobile_image = ref([]);
const handleFileUpdate = (field, file) => { formData[field] = file; };
const imageHandler0 = ref(null);
const imageHandler1 = ref(null);
const hasErrors = ref({});

const onInvalidSubmit = () => {
    if (imageHandler0.value?.validate && !imageHandler0.value.validate()) hasErrors.value = { image: true };
    if (imageHandler1.value?.validate && !imageHandler1.value.validate()) hasErrors.value = { ...hasErrors.value, image1: true };
    nuxtApp.$toast.error('There are fields that require your attention. Kindly review the form.');
};

const submit = async () => {
    let isValid = !(imageHandler0.value?.validate && !imageHandler0.value.validate() && main_image.value.length === 0) &&
                 !(imageHandler1.value?.validate && !imageHandler1.value.validate() && mobile_image.value.length === 0);
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    if (formData.main_image?.length) formData.main_image.forEach(f => form_data.append('main_image[]', f));
    if (formData.mobile_image?.length) formData.mobile_image.forEach(f => form_data.append('mobile_image[]', f));
    form_data.append('has_button', formData.has_button ? 1 : 0);
    form_data.append('description', formData.description || '');
    if (formData.sub_text) form_data.append('sub_text', formData.sub_text);
    form_data.append('_method', 'PATCH');
    if (isValid) {
        try {
            const res = await nuxtApp.$axios.post(`/cms/page-section/${id}`, form_data, { headers: { 'Content-Type': 'multipart/form-data' } });
            sectionData.value = res.data.record;
            nuxtApp.$toast.success('Page updated successfully!');
        } catch (e) { console.error('Error:', e); }
    } else { nuxtApp.$toast.error('There are fields that require your attention. Kindly review the form.'); }
};

const populateData = (d) => {
    if (d) {
        formData.title = d.title || ''; formData.description = d.description || ''; formData.sub_text = d.sub_text || '';
        formData.has_button = Number(d.has_button) ? 1 : 0;
        formData.buttons = d.buttons?.length ? d.buttons : [{ button_name: '', link: '', id: '', is_link_out: 0 }];
        main_image.value = d.images?.filter(i => i.category === 'main_image') || [];
        mobile_image.value = d.images?.filter(i => i.category === 'mobile_image') || [];
    }
};

const fetchRecords = async () => {
    try { const res = await nuxtApp.$axios.get(`/cms/page-section/${id}`); sectionData.value = res.data.record; }
    catch (err) { console.error('Error fetching section data:', err); throw new Error('Failed to fetch data'); }
};

watch(sectionData, d => populateData(d));
</script>
