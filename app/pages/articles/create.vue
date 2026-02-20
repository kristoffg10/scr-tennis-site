<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
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
                    <TextField label="Title" name="title" placeholder="e.g. Article Title" :rules="'required|max:255'" optionalMessage="Max 255 characters" />
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
                    <ImageHandler label="Main Image" :data="[]" max="1" size="5"
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
                <div class="grid grid-cols-1 gap-[16px]">
                    <h3 class="font-medium text-base">Article Youtube Video</h3>
                    <p class="text-sm text-black/60">
                        You can add a single YouTube video to this article after it has been created, from the Edit Article screen.
                        The video will be managed under the global Videos module.
                    </p>
                </div>
                <div class="grid grid-cols-1 gap-[16px]" v-if="isSustainabilityType">
                    <h3 class="font-medium text-base">Gallery Images</h3>
                    <ImageHandler label="Gallery Images" :data="[]" max="10" size="5"
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

definePageMeta({
    middleware: 'authenticator'
})

const TextField = defineAsyncComponent(() => import('@/components/TextField.vue'));
const SelectField = defineAsyncComponent(() => import('@/components/SelectField.vue'));
const DateField = defineAsyncComponent(() => import('@/components/DateField.vue'));
const Quill = defineAsyncComponent(() => import('@/components/form-fields/Quill.vue'));
const ImageHandler = defineAsyncComponent(() => import('@/components/form-fields/ImageHandler.vue'));
const nuxtApp = useNuxtApp();
const pageTitle = usePageTitleStore();

const typeOptions = [
    { value: 'sustainability', label: 'Sustainability' },
    { value: 'blog', label: 'Blog' },
    { value: 'press-release', label: 'Press Release' },
];

const categoryOptions = ref([]);

const formData = reactive({
    type: '',
    date: '',
    time: '',
    content: '',
    enabled: true,
    featured: false,
    main_image: null,
    gallery: []
});

const isSustainabilityType = computed(() => (formData.type || '').toLowerCase() === 'sustainability');

onMounted(async () => {
    pageTitle.setTitle('Add Article');
    pageTitle.setBreadcrumbs(['Articles', 'Articles List', 'Add Article']);
    pageTitle.setPageFrom('Articles List');
    pageTitle.setPageFromRoute('/articles');
    await fetchCategories();
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

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);

    // Combine date and time into a single timestamp string expected by the API.
    if (formData.date) {
        const time = formData.time || '00:00';
        const combined = `${formData.date} ${time}:00`;
        form_data.set('date', combined);
    }
    // We don't need to send a standalone time field to the API.
    form_data.delete('time');

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
        const response = await nuxtApp.$axios.post('/cms/articles', form_data);
        const record = response.data.record;
        nuxtApp.$toast.success('Article created successfully!');
        useRouter().push(`/articles/${record.id}`);
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error(error?.response?.data?.message || 'Error creating article. Please try again.');
    }
};
</script>
