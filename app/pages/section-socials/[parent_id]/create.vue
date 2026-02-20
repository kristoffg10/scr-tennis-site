<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Social Media Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title" placeholder="e.g. Facebook" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Link" name="link" v-model="formData.link" type="url" placeholder="e.g. https://facebook.com/example" :rules="'required|url|max:500'"
                        optionalMessage="Valid URL" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <ImageHandler
                        label="Desktop Image"
                        max="1"
                        size="5"
                        :dimension="{ width: 800, height: 600 }"
                        :input_payload="{
                            identifier: 'desktop_image',
                            id: 'desktop_image_id',
                            category: 'desktop_image_category',
                            category_value: 'desktop_image',
                            alt: 'desktop_image_alt',
                        }"
                        :existing_images="[]"
                        @update:file="handleFileUpdate('desktop_image', $event)"
                    />
                </div>
            </div>

            <div class="flex self-end gap-[16px]">
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Create
                    Social Media</button>
            </div>
        </Form>
    </div>
</template>

<script setup>
import { usePageTitleStore } from '~/stores/pageTitle';
import { Form } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';

definePageMeta({
    middleware: 'authenticator'
})

const nuxtApp = useNuxtApp();
const route = useRoute();
const router = useRouter();
const pageTitle = usePageTitleStore();
const parentId = route.params.parent_id;

const ImageHandler = defineAsyncComponent(() => {
    return import('@/components/form-fields/ImageHandler.vue')
})

const formData = reactive({
    title: '',
    link: '',
    sequence: 0,
    desktop_image: []
})

onMounted(() => {
    pageTitle.setTitle(`Create Social Media`);
    pageTitle.setBreadcrumbs(['Section Social Media Links', 'Create Social Media']);
    pageTitle.setPageFrom('Section Social Media Links');
    pageTitle.setPageFromRoute(`/section-socials/${parentId}`);
});

const handleFileUpdate = (field, file) => {
    formData[field] = file;
};

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    // API auto-assigns sequence on create; send placeholder so validation accepts request
    form_data.set('sequence', '1');

    if (formData.desktop_image && formData.desktop_image.length > 0) {
        formData.desktop_image.forEach((file) => {
            form_data.append('desktop_image[]', file);
        });
    }

    try {
        await nuxtApp.$axios.post(`/cms/section-social/${parentId}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            nuxtApp.$toast.success('Social Media created successfully!');
            router.push(`/section-socials/${parentId}`);
        });
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error creating social media. Please try again.');
    }
}
</script>
