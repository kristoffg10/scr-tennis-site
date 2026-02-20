<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form v-if="articleData" id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <div class="flex items-center justify-between w-full gap-4">
                    <h2 class="font-semibold text-xl text-start">Article Information</h2>
                    <div class="flex items-center gap-[24px] shrink-0">
                        <div class="flex items-center gap-[12px]">
                            <label class="text-base font-medium text-black/70">Enabled</label>
                            <button
                                type="button"
                                @click="formData.enabled = !formData.enabled"
                                class="w-10 h-6 rounded-xl flex items-center p-0.5 transition-colors shrink-0"
                                :class="formData.enabled ? 'bg-ui-color justify-end' : 'bg-light-gray justify-start'">
                                <div class="w-5 h-5 bg-white rounded-full shadow-sm"></div>
                            </button>
                            <span class="text-sm text-black/60">{{ formData.enabled ? 'On' : 'Off' }}</span>
                        </div>
                        <div class="flex items-center gap-[12px]">
                            <label class="text-base font-medium text-black/70">Featured</label>
                            <button
                                type="button"
                                @click="formData.featured = !formData.featured"
                                class="w-10 h-6 rounded-xl flex items-center p-0.5 transition-colors shrink-0"
                                :class="formData.featured ? 'bg-ui-color justify-end' : 'bg-light-gray justify-start'">
                                <div class="w-5 h-5 bg-white rounded-full shadow-sm"></div>
                            </button>
                            <span class="text-sm text-black/60">{{ formData.featured ? 'On' : 'Off' }}</span>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title" placeholder="e.g. Article Title" :rules="'required|max:255'" optionalMessage="Max 255 characters" />
                    <SelectField label="Type" name="type" v-model="formData.type" :options="typeOptions" :rules="'required'" />
                </div>
                <div class="grid grid-cols-2 gap-[16px]">
                    <DateField label="Date" name="date" v-model="formData.date" :rules="'required'" />
                    <div class="flex flex-col gap-[12px]">
                        <div class="flex flex-col gap-[4px]">
                            <label for="time" class="text-base font-medium text-black/70">Time</label>
                            <input
                                id="time"
                                name="time"
                                type="time"
                                v-model="formData.time"
                                class="h-[44px] px-[12px] py-[10px] rounded-[10px] border border-[#2A2A2A]/20 text-base text-black/80 focus:outline-none focus:border-ui-color focus:ring-1 focus:ring-ui-color"
                                required
                            />
                            <p class="text-xs text-black/40">Set the publish time for this article.</p>
                        </div>
                        <SelectField
                            label="Category"
                            name="category_id"
                            v-model="formData.category_id"
                            :options="categoryOptions"
                            placeholder="Select Category"
                            :rules="'required'"
                        />
                    </div>
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-model="formData.content" :modelValue="formData.content" name="content" label="Content" :max="0" placeholder="Enter article content" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <h3 class="font-medium text-base">Main Image</h3>
                    <ImageHandler label="Main Image" :data="main_image" max="1" size="5"
                        :dimension="{ width: 1200, height: 630 }"
                        :input_payload="{
                            identifier: 'main_image',
                            id: 'main_image_id',
                            category: 'main_image_category',
                            category_value: 'main_image',
                            alt: 'main_image_alt',
                        }"
                        ref="imageHandlerRef"
                        v-model="formData.main_image"
                        @update:file="(file) => { formData.main_image = file; }" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]" v-if="canHaveVideo && videoInitialized">
                    <h3 class="font-medium text-base">Article Youtube Video</h3>
                    <p class="text-sm text-black/60">
                        Attach a single YouTube video to this article. The video is saved under the global Videos module.
                    </p>

                    <!-- Video Title and Content are intentionally hidden; stored in videoForm state only -->
                    <input type="hidden" name="video_title" :value="videoForm.title" />

                    <div class="grid grid-cols-1 gap-[16px]">
                        <TextField
                            label="YouTube URL"
                            name="video_youtube_url"
                            v-model="videoForm.youtube_url"
                            placeholder="e.g. https://www.youtube.com/watch?v=VIDEO_ID"
                            optionalMessage="Optional"
                            :rules="''"
                        />
                        <p class="text-xs text-gray-500">
                            The video details will be automatically fetched from YouTube. Leave blank to skip.
                        </p>
                    </div>
                    <div v-if="videoData && videoData.yt_title" class="grid grid-cols-1 gap-[16px]">
                        <div class="p-[16px] bg-gray-50 rounded-[10px]">
                            <p class="text-sm font-medium text-black/70 mb-[8px]">YouTube Video Details:</p>
                            <p class="text-sm text-black/60"><strong>Title:</strong> {{ videoData.yt_title }}</p>
                            <p class="text-sm text-black/60">
                                <strong>Published:</strong>
                                {{ videoData.yt_published_date ? $moment(videoData.yt_published_date).format('MMM DD, YYYY') : '-' }}
                            </p>
                            <div v-if="videoData.yt_thumbnail" class="mt-[8px]">
                                <img :src="videoData.yt_thumbnail" alt="Video thumbnail" class="max-w-[200px] rounded-[5px]" />
                            </div>
                        </div>
                    </div>
                    <span v-if="isSavingVideo" class="text-sm text-black/60">Saving video...</span>
                </div>
                <div class="grid grid-cols-1 gap-[16px]" v-if="isSustainabilityType">
                    <h3 class="font-medium text-base">Gallery Images</h3>
                    <ImageHandler label="Gallery Images" :data="gallery_images" max="10" size="5"
                        :dimension="{ width: 1200, height: 800 }"
                        :input_payload="{
                            identifier: 'gallery',
                            id: 'gallery_id',
                            category: 'gallery_category',
                            category_value: 'gallery',
                            alt: 'gallery_alt',
                        }"
                        ref="galleryHandlerRef"
                        v-model="formData.gallery"
                        @update:file="(files) => { formData.gallery = files; }" />
                </div>
            </div>

            <div class="flex self-end gap-[16px]">
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Save Changes</button>
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

const TextField = defineAsyncComponent(() => import('@/components/TextField.vue'));
const SelectField = defineAsyncComponent(() => import('@/components/SelectField.vue'));
const DateField = defineAsyncComponent(() => import('@/components/DateField.vue'));
const Quill = defineAsyncComponent(() => import('@/components/form-fields/Quill.vue'));
const ImageHandler = defineAsyncComponent(() => import('@/components/form-fields/ImageHandler.vue'));
const nuxtApp = useNuxtApp();
const route = useRoute();
const pageTitle = usePageTitleStore();
const id = route.params.id;

const typeOptions = [
    { value: 'sustainability', label: 'Sustainability' },
    { value: 'blog', label: 'Blog' },
    { value: 'press-release', label: 'Press Release' },
];

const categoryOptions = ref([]);

const formData = reactive({
    title: '',
    type: '',
    date: '',
    time: '',
    category_id: '',
    content: '',
    enabled: true,
    featured: false,
    main_image: null,
    gallery: []
});

const isSustainabilityType = computed(() => (formData.type || '').toLowerCase() === 'sustainability');
const canHaveVideo = computed(() => ['blog', 'press-release'].includes((formData.type || '').toLowerCase()));

const articleData = ref(null);
const main_image = ref([]);
const gallery_images = ref([]);

const videoData = ref(null);
const videoInitialized = ref(false);
const isSavingVideo = ref(false);
const videoForm = reactive({
    title: '',
    content: '',
    youtube_url: ''
});

onMounted(async () => {
    pageTitle.setTitle('Edit Article');
    pageTitle.setBreadcrumbs(['Articles', 'Articles List', 'Edit Article']);
    pageTitle.setPageFrom('Articles List');
    pageTitle.setPageFromRoute('/articles');
    await fetchCategories();
    fetchRecords();
});

const fetchCategories = async () => {
    try {
        const response = await nuxtApp.$axios.get('/cms/taxonomy/article_category?all=1');
        const records = response.data?.records ?? [];
        const categories = Array.isArray(records) ? records : (records?.data ?? []);
        categoryOptions.value = categories.map(cat => ({
            value: cat.id,
            label: cat.name,
        }));
    } catch (error) {
        console.error('Error fetching article categories:', error);
    }
};

const fetchRecords = async () => {
    try {
        const response = await nuxtApp.$axios.get(`/cms/articles/${id}`);
        articleData.value = response.data.record;
        populateData(articleData.value);
        await fetchArticleVideo();
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error loading article. Please try again.');
    }
};

const fetchArticleVideo = async () => {
    try {
        const response = await nuxtApp.$axios.get('/cms/videos', {
            params: {
                article_id: id,
                all: 1,
            },
        });
        const records = response.data?.records ?? [];
        const videos = Array.isArray(records) ? records : (records?.data ?? records);
        // Prefer the most recently updated so we always update the same record (one per article).
        const sorted = [...videos].sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
        const video = sorted[0] ?? null;
        videoData.value = video;

        if (video) {
            // Fallbacks: if custom title/content are empty, use YouTube metadata
            videoForm.title = video.title || video.yt_title || '';
            videoForm.content = video.content || '';
            videoForm.youtube_url = video.yt_url || '';
        } else {
            // Explicitly reset form when no video exists
            videoForm.title = '';
            videoForm.content = '';
            videoForm.youtube_url = '';
        }
        videoInitialized.value = true;
    } catch (error) {
        videoData.value = null;
        videoForm.title = '';
        videoForm.content = '';
        videoForm.youtube_url = '';
        videoInitialized.value = true;
    }
};

const populateData = (data) => {
    formData.title = data.title || '';
    formData.type = data.type || '';
    if (data.date) {
        const [datePart, timePart] = String(data.date).split(' ');
        formData.date = datePart || '';
        // Expect HH:MM[:SS], trim to HH:MM for the time input.
        formData.time = timePart ? timePart.slice(0, 5) : '';
    } else {
        formData.date = '';
        formData.time = '';
    }
    formData.category_id = data.category_id || '';
    formData.content = data.content || '';
    formData.enabled = data.enabled ?? true;
    formData.featured = data.featured ?? false;
    main_image.value = data.images ? data.images.filter(img => img.category === 'main_image') : [];
    gallery_images.value = data.images ? data.images.filter(img => img.category === 'gallery') : [];
};

const saveArticleVideo = async (suppressEmptyError = false) => {
    if (!canHaveVideo.value) {
        if (!suppressEmptyError) {
            nuxtApp.$toast.error('Only Blog and Press Release articles can have an embedded video.');
        }
        return;
    }

    const normalizedType = (formData.type || '').toLowerCase();
    const videoType = ['blog', 'press-release'].includes(normalizedType) ? normalizedType : 'blog';

    // Read the YouTube URL from reactive state (title/content fields are hidden, read from videoForm directly)
    const formEl = document.getElementById('form');
    const videoYoutubeInput = formEl?.querySelector('input[name="video_youtube_url"]');

    const title = videoForm.title || '';
    const youtubeUrl = (videoYoutubeInput?.value ?? videoForm.youtube_url ?? '').trim();

    // If YouTube URL is empty and a video exists, delete it
    if (!youtubeUrl && videoData.value && videoData.value.id) {
        isSavingVideo.value = true;
        try {
            await nuxtApp.$axios.delete(`/cms/videos/${videoData.value.id}`);
            videoData.value = null;
            videoForm.title = '';
            videoForm.content = '';
            videoForm.youtube_url = '';
            if (!suppressEmptyError) {
                nuxtApp.$toast.success('Video removed successfully!');
            }
        } catch (error) {
            console.error('Error deleting video:', error);
            if (!suppressEmptyError) {
                nuxtApp.$toast.error('Error removing video. Please try again.');
            }
            throw error;
        } finally {
            isSavingVideo.value = false;
        }
        return;
    }

    // If YouTube URL is empty and no video exists, skip silently
    if (!youtubeUrl) {
        return;
    }

    const form_data = new FormData();
    form_data.append('title', title);
    form_data.append('content', videoForm.content || '');
    form_data.append('youtube_url', youtubeUrl);
    form_data.append('type', videoType);
    form_data.append('enabled', formData.enabled ? '1' : '0');
    form_data.append('featured', formData.featured ? '1' : '0');
    form_data.append('category_id', formData.category_id || '');
    form_data.append('article_id', id);

    isSavingVideo.value = true;

    try {
        let response;
        if (videoData.value && videoData.value.id) {
            form_data.append('_method', 'PATCH');
            response = await nuxtApp.$axios.post(`/cms/videos/${videoData.value.id}`, form_data);
        } else {
            response = await nuxtApp.$axios.post('/cms/videos', form_data);
        }

        const record = response.data.record;
        videoData.value = record;
        videoForm.title = record.title || '';
        videoForm.content = record.content || '';
        videoForm.youtube_url = record.yt_url || '';

        nuxtApp.$toast.success('Article video saved successfully!');
    } catch (error) {
        console.error('Error saving article video:', error);
        throw error; // Rethrow so submit() can show error and avoid "Article updated successfully!"
    } finally {
        isSavingVideo.value = false;
    }
};

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    form_data.append('_method', 'PATCH');
    // Combine date and time into a single timestamp string expected by the API.
    if (formData.date) {
        const time = formData.time || '00:00';
        const combined = `${formData.date} ${time}:00`;
        form_data.set('date', combined);
    }
    form_data.delete('time');
    // Remove the hidden video_title field from the article payload (it belongs to the video endpoint only)
    form_data.delete('video_title');

    form_data.append('content', formData.content || '');
    form_data.append('enabled', formData.enabled ? '1' : '0');
    form_data.append('featured', formData.featured ? '1' : '0');

    if (formData.main_image && formData.main_image.length > 0) {
        formData.main_image.forEach((file) => {
            form_data.append(`main_image[]`, file)
        });
    }
    
    if (formData.gallery && Array.isArray(formData.gallery)) {
        formData.gallery.forEach((file, index) => {
            if (file instanceof File) {
                form_data.append(`gallery[${index}]`, file);
            }
        });
    }

    try {
        await nuxtApp.$axios.post(`/cms/articles/${id}`, form_data);
        // Also save or update the associated video in a single flow.
        await saveArticleVideo(true);
        await fetchRecords();
        nuxtApp.$toast.success('Article updated successfully!');
    } catch (error) {
        console.error('Error:', error);
        const message = error?.response?.data?.errors?.youtube_url?.[0]
            || error?.response?.data?.message
            || 'Error updating article. Please try again.';
        nuxtApp.$toast.error(message);
    }
};
</script>