<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form v-if="videoData" id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
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
                <div v-if="videoData.yt_title" class="grid grid-cols-1 gap-[16px]">
                    <div class="p-[16px] bg-gray-50 rounded-[10px]">
                        <p class="text-sm font-medium text-black/70 mb-[8px]">YouTube Video Details:</p>
                        <p class="text-sm text-black/60"><strong>Title:</strong> {{ videoData.yt_title }}</p>
                        <p class="text-sm text-black/60"><strong>Published:</strong> {{ videoData.yt_published_date ? $moment(videoData.yt_published_date).format('MMM DD, YYYY') : '-' }}</p>
                        <div v-if="videoData.yt_thumbnail" class="mt-[8px]">
                            <img :src="videoData.yt_thumbnail" alt="Video thumbnail" class="max-w-[200px] rounded-[5px]" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex self-end gap-[16px]">
                <button type="button" @click="submit()" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Save
                    Changes</button>
            </div>
        </Form>
    </div>
</template>

<script setup>
import { usePageTitleStore } from '~/stores/pageTitle';
import { Form } from 'vee-validate';
import { useRoute } from 'vue-router';

definePageMeta({
    middleware: 'authenticator'
})

const nuxtApp = useNuxtApp();
const route = useRoute();
const pageTitle = usePageTitleStore();
const id = route.params.id;
const parentId = route.params.parent_id;

const formData = reactive({
    title: '',
    youtube_url: ''
})

const videoData = ref(null);

onMounted(() => {
    pageTitle.setTitle(`Edit Video`);
    pageTitle.setBreadcrumbs(['Section Videos', 'Edit Video']);
    pageTitle.setPageFrom('Section Videos');
    pageTitle.setPageFromRoute(`/section-videos/${parentId}`);
    fetchRecords();
});

const fetchRecords = async () => {
    try {
        const video_response = await nuxtApp.$axios.get(`/cms/section-video/${parentId}/${id}`);
        videoData.value = video_response.data.record;
        populateData(videoData.value);
    } catch (error) {
        console.error('Error:', error);
    }
};

const submit = async () => {
    // Read current values from form inputs (TextField doesn't emit v-model, so formData can be stale)
    const formEl = document.getElementById('form');
    const titleInput = formEl?.querySelector('input[name="title"]');
    const youtubeInput = formEl?.querySelector('input[name="youtube_url"]');
    const title = (titleInput?.value ?? formData.title ?? '') || '';
    const youtube_url = (youtubeInput?.value ?? formData.youtube_url ?? '') || '';

    const form_data = new FormData();
    form_data.append('title', title);
    form_data.append('youtube_url', youtube_url);
    form_data.append('_method', 'PATCH');

    try {
        const response = await nuxtApp.$axios.post(`/cms/section-video/${parentId}/${id}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        const record = response.data.record;
        populateData(record);
        nuxtApp.$toast.success('Video updated successfully!');
        await fetchRecords();
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error(error?.response?.data?.message || 'Error updating video. Please try again.');
    }
}

const populateData = (data) => {
    formData.title = data.title || '';
    formData.youtube_url = data.yt_url || '';
}
</script>
