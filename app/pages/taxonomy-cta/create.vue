<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Global CTA Information</h2>
                <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title" placeholder="e.g. Get started today" :rules="'required|max:255'" optionalMessage="Max 255 characters" />
                    <TextField label="Subtitle" name="subtitle" v-model="formData.subtitle" placeholder="e.g. Optional subtitle" :rules="'max:255'" optionalMessage="Max 255 characters" />
                </div>
                <!-- <div class="grid grid-cols-2 gap-[16px]">
                    <SelectField label="Type" name="type" v-model="formData.type" :options="typeOptions" placeholder="Select type" :rules="'required'" />
                    <TextField label="Sequence" name="sequence" v-model="formData.sequence" type="number" placeholder="0" :rules="'max:10'" optionalMessage="Display order" />
                </div> -->
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Description" name="description" v-model="formData.description" as="textarea" placeholder="Enter description" :rules="''" :fieldProps="{ rows: 4 }" />
                </div>
                <!-- <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="Button Name" name="button_name" v-model="formData.button_name" placeholder="e.g. Learn More" :rules="'max:255'" />
                    <TextField label="Link" name="link" v-model="formData.link" placeholder="e.g. /page or https://..." :rules="''" />
                </div> -->
                <div class="grid grid-cols-1 gap-[16px]">
                    <ImageHandler label="Mobile Image" max="1" size="5" :dimension="{ width: 375, height: 508 }"
                        :input_payload="{
                            identifier: 'mobile_image',
                            id: 'mobile_image_id',
                            category: 'mobile_image_category',
                            category_value: 'mobile_image',
                            alt: 'mobile_image_alt',
                        }"
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
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Save</button>
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
const SelectField = defineAsyncComponent(() => import('@/components/SelectField.vue'));
const ImageHandler = defineAsyncComponent(() => import('@/components/form-fields/ImageHandler.vue'));

const nuxtApp = useNuxtApp();
const pageTitle = usePageTitleStore();

const typeOptions = [
    { value: 'telemedicine', label: 'Telemedicine' },
    { value: 'employee', label: 'Employee' },
    { value: 'providers', label: 'Providers' },
    { value: 'insurance_upgrade', label: 'Insurance Upgrade' },
    { value: 'online_shop', label: 'Online Shop' },
];

const formData = reactive({
    title: '',
    subtitle: '',
    type: '',
    description: '',
    button_name: '',
    link: '',
    sequence: '0',
    has_button: false,
    is_link_out: false,
    mobile_image: [],
});

onMounted(() => {
    pageTitle.setTitle('Add Global CTA');
    pageTitle.setBreadcrumbs(['Global CTA', 'Global CTA List', 'Add Global CTA']);
    pageTitle.setPageFrom('Global CTA List');
    pageTitle.setPageFromRoute('/taxonomy-cta');
});

const submit = async (values) => {
    try {
        const hasMobileImage = formData.mobile_image?.length > 0;

        if (hasMobileImage) {
            const formElement = document.getElementById('form');
            const form_data = new FormData(formElement);

            // Normalize primitive fields
            form_data.set('title', values.title || formData.title);
            form_data.set('subtitle', values.subtitle ?? formData.subtitle ?? '');
            form_data.set('type', values.type || formData.type || '');
            form_data.set('description', values.description ?? formData.description ?? '');
            form_data.set('button_name', values.button_name ?? formData.button_name ?? '');
            form_data.set('link', values.link ?? formData.link ?? '');
            form_data.set('sequence', String(parseInt(values.sequence || formData.sequence || '0', 10) || 0));
            form_data.set('has_button', formData.has_button ? 1 : 0);
            form_data.set('is_link_out', formData.is_link_out ? 1 : 0);

            // Attach mobile image
            formData.mobile_image.forEach((file) => {
                form_data.append('mobile_image[]', file);
            });

            const response = await nuxtApp.$axios.post('/cms/taxonomy-cta', form_data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const record = response.data?.record;
            nuxtApp.$toast.success('Global CTA created successfully!');
            navigateTo(`/taxonomy-cta/${record.id}`);
        } else {
            const payload = {
                title: values.title || formData.title,
                subtitle: values.subtitle ?? formData.subtitle ?? null,
                type: values.type || formData.type || null,
                description: values.description ?? formData.description ?? null,
                button_name: values.button_name ?? formData.button_name ?? null,
                link: values.link ?? formData.link ?? null,
                sequence: parseInt(values.sequence || formData.sequence || '0', 10) || 0,
                has_button: formData.has_button ? 1 : 0,
                is_link_out: formData.is_link_out ? 1 : 0,
            };
            const response = await nuxtApp.$axios.post('/cms/taxonomy-cta', payload);
            const record = response.data?.record;
            nuxtApp.$toast.success('Global CTA created successfully!');
            navigateTo(`/taxonomy-cta/${record.id}`);
        }
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error(error?.response?.data?.message || 'Error creating taxonomy CTA. Please try again.');
    }
};
</script>
