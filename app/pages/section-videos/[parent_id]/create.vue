<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Video Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title" placeholder="e.g. Video Title" :rules="'max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="YouTube URL" name="youtube_url" v-model="formData.youtube_url" placeholder="e.g. https://www.youtube.com/watch?v=VIDEO_ID" :rules="'required|url'"
                        optionalMessage="Enter full YouTube URL" />
                    <p class="text-xs text-gray-500">The video details will be automatically fetched from YouTube</p>
                </div>
            </div>

            <div class="flex self-end gap-[16px]">
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Create
                    Video</button>
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

const formData = reactive({
    title: '',
    youtube_url: ''
})

onMounted(() => {
    pageTitle.setTitle(`Create Video`);
    pageTitle.setBreadcrumbs(['Section Videos', 'Create Video']);
    pageTitle.setPageFrom('Section Videos');
    pageTitle.setPageFromRoute(`/section-videos/${parentId}`);
});

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);

    try {
        await nuxtApp.$axios.post(`/cms/section-video/${parentId}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        nuxtApp.$toast.success('Video created successfully!');
        router.push(`/section-videos/${parentId}`);
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error(error?.response?.data?.message || 'Error creating video. Please try again.');
    }
}
</script>
