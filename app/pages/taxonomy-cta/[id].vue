<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form v-if="record" id="form" @submit="submit" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Global CTA Information</h2>
                <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title" placeholder="e.g. Get started today" :rules="'required|max:255'" optionalMessage="Max 255 characters" />
                    <TextField label="Subtitle" name="subtitle" v-model="formData.subtitle" placeholder="e.g. Optional subtitle" :rules="'max:255'" optionalMessage="Max 255 characters" />
                </div>
                <!-- <div class="grid grid-cols-2 gap-[16px]">
                    <div class="flex items-end">
                        <p class="text-base text-black/60"><span class="font-medium text-black/70">Type:</span> {{ record.type || '-' }}</p>
                    </div>
                    <TextField label="Sequence" name="sequence" v-model="formData.sequence" type="number" placeholder="0" :rules="'max:10'" optionalMessage="Display order" />
                </div> -->
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-model="formData.description" :modelValue="formData.description" name="description" label="Description" :max="0" placeholder="Enter description" />
                </div>
                <!-- <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="Button Name" name="button_name" v-model="formData.button_name" placeholder="e.g. Learn More" :rules="'max:255'" />
                    <TextField label="Link" name="link" v-model="formData.link" placeholder="e.g. /page or https://..." :rules="''" />
                </div> -->
                <div class="grid grid-cols-1 gap-[16px]">
                    <ImageHandler label="Main Image" max="1" size="5" :dimension="{ width: 800, height: 600 }"
                        :input_payload="{
                            identifier: 'main_image',
                            id: 'main_image_id',
                            category: 'main_image_category',
                            category_value: 'main_image',
                            alt: 'main_image_alt',
                        }"
                        :existing_images="record?.images?.filter(img => img.category === 'main_image')"
                        @update:file="formData.main_image = $event" />
                    <ImageHandler label="Mobile Image" max="1" size="5" :dimension="{ width: 375, height: 508 }"
                        :input_payload="{
                            identifier: 'mobile_image',
                            id: 'mobile_image_id',
                            category: 'mobile_image_category',
                            category_value: 'mobile_image',
                            alt: 'mobile_image_alt',
                        }"
                        :existing_images="record?.images?.filter(img => img.category === 'mobile_image')"
                        @update:file="formData.mobile_image = $event" />
                </div>
                <!-- <div class="flex gap-[24px] items-center">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" v-model="formData.has_button" class="w-4 h-4 rounded" />
                        <span class="text-base">Has Button</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" v-model="formData.is_link_out" class="w-4 h-4 rounded" />
                        <span class="text-base">External Link</span>
                    </label>
                </div> -->
            </div>

            <div class="flex self-end gap-[16px]">
                <NuxtLink to="/taxonomy-cta" class="px-[24px] py-[12px] border border-black/20 text-center rounded-[10px]">Cancel</NuxtLink>
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Save Changes</button>
            </div>
        </Form>
    </div>
</template>

<script setup>
import { usePageTitleStore } from '~/stores/pageTitle';
import { Form } from 'vee-validate';

definePageMeta({
    middleware: 'authenticator'
})

const TextField = defineAsyncComponent(() => import('@/components/TextField.vue'));
const Quill = defineAsyncComponent(() => import('@/components/form-fields/Quill.vue'));
const ImageHandler = defineAsyncComponent(() => import('@/components/form-fields/ImageHandler.vue'));

const route = useRoute();
const nuxtApp = useNuxtApp();
const pageTitle = usePageTitleStore();
const id = route.params.id;

const formData = reactive({
    title: '',
    subtitle: '',
    description: '',
    button_name: '',
    link: '',
    sequence: '0',
    has_button: false,
    is_link_out: false,
    main_image: [],
    mobile_image: [],
});

const record = ref(null);

onMounted(() => {
    pageTitle.setTitle('Edit Global CTA');
    pageTitle.setBreadcrumbs(['Global CTA', 'Global CTA List', 'Edit Global CTA']);
    pageTitle.setPageFrom('Global CTA List');
    pageTitle.setPageFromRoute('/taxonomy-cta');
    fetchRecord();
});

const fetchRecord = async () => {
    try {
        const response = await nuxtApp.$axios.get(`/cms/taxonomy-cta/${id}`);
        record.value = response.data?.record;
        if (record.value) {
            formData.title = record.value.title || '';
            formData.subtitle = record.value.subtitle || '';
            formData.description = record.value.description || '';
            formData.button_name = record.value.button_name || '';
            formData.link = record.value.link || '';
            formData.sequence = String(record.value.sequence ?? '0');
            formData.has_button = !!record.value.has_button;
            formData.is_link_out = !!record.value.is_link_out;
        }
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast?.error('Failed to load taxonomy CTA.');
    }
};

const submit = async (values) => {
    try {
        const hasNewMainImage = formData.main_image?.length > 0;
        const hasNewMobileImage = formData.mobile_image?.length > 0;
        if (hasNewMainImage || hasNewMobileImage) {
            const formElement = document.getElementById('form');
            const form_data = new FormData(formElement);
            form_data.append('_method', 'PATCH');
            form_data.append('title', values.title ?? formData.title);
            form_data.append('subtitle', values.subtitle ?? formData.subtitle ?? '');
            form_data.append('description', formData.description || '');
            form_data.append('button_name', values.button_name ?? formData.button_name ?? '');
            form_data.append('link', values.link ?? formData.link ?? '');
            form_data.append('sequence', String(parseInt(values.sequence ?? formData.sequence ?? '0', 10) || 0));
            form_data.append('has_button', formData.has_button ? '1' : '0');
            form_data.append('is_link_out', formData.is_link_out ? '1' : '0');
            if (hasNewMainImage) {
                formData.main_image.forEach((file) => form_data.append('main_image[]', file));
            }
            if (hasNewMobileImage) {
                formData.mobile_image.forEach((file) => form_data.append('mobile_image[]', file));
            }
            await nuxtApp.$axios.post(`/cms/taxonomy-cta/${id}`, form_data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } else {
            const payload = {
                title: values.title ?? formData.title,
                subtitle: values.subtitle ?? formData.subtitle ?? null,
                description: formData.description || null,
                button_name: values.button_name ?? formData.button_name ?? null,
                link: values.link ?? formData.link ?? null,
                sequence: parseInt(values.sequence ?? formData.sequence ?? '0', 10) || 0,
                has_button: formData.has_button ? 1 : 0,
                is_link_out: formData.is_link_out ? 1 : 0,
            };
            await nuxtApp.$axios.patch(`/cms/taxonomy-cta/${id}`, payload);
        }
        await fetchRecord();
        nuxtApp.$toast.success('Global CTA updated successfully!');
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error(error?.response?.data?.message || 'Error updating taxonomy CTA. Please try again.');
    }
};
</script>