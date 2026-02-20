<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form v-if="testimonialData" id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Testimonial Information</h2>
                <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="Name" name="name" v-model="formData.name" placeholder="e.g. John Doe" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                    <TextField label="Position" name="position" v-model="formData.position" placeholder="e.g. CEO" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Company" name="company" v-model="formData.company" placeholder="e.g. ABC Corporation" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill
                        v-if="isClient"
                        v-model="formData.content"
                        :modelValue="formData.content"
                        :name="`content`"
                        :label="`Content`"
                        :max="150"
                        :placeholder="`Enter testimonial content`"
                    />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Sequence" name="sequence" v-model="formData.sequence" type="number" placeholder="e.g. 1" :rules="'required|numeric'"
                        optionalMessage="Display order" />
                </div>

                <hr class="h-[1px] w-full border-gray">
                <ImageHandler label="Main Image" max="1" size="5" :dimension="{ width: 200, height: 200 }" :input_payload="{
                    identifier: 'main_image',
                    id: 'main_image_id',
                    category: 'main_image_category',
                    category_value: 'main_image',
                    alt: 'main_image_alt',
                }" :existing_images="testimonialData.images?.filter(img => img.category === 'main_image')" 
                @update:file="handleFileUpdate(`main_image`, $event)" />
            </div>

            <div class="flex self-end gap-[16px]">
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Save
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

const ImageHandler = defineAsyncComponent(() => {
    return import('@/components/form-fields/ImageHandler.vue')
})

const Quill = defineAsyncComponent(() => {
    return import('@/components/form-fields/Quill.vue')
})

const nuxtApp = useNuxtApp();
const isClient = ref(false);
const route = useRoute();
const pageTitle = usePageTitleStore();
const id = route.params.id;
const parentId = route.params.parent_id;

const formData = reactive({
    name: '',
    position: '',
    company: '',
    content: '',
    sequence: 0,
    main_image: []
})

const testimonialData = ref(null);
const existingTestimonials = ref([]);

onMounted(() => {
    isClient.value = true;
    pageTitle.setTitle(`Edit Testimonial`);
    pageTitle.setBreadcrumbs(['Section Testimonials', 'Edit Testimonial']);
    pageTitle.setPageFrom('Section Testimonials');
    pageTitle.setPageFromRoute(`/section-testimonials/${parentId}`);
    fetchRecords();
    fetchExistingTestimonials();
});

const fetchExistingTestimonials = async () => {
    try {
        const response = await nuxtApp.$axios.get(`/cms/section-testimonial/${parentId}?all=1`);
        existingTestimonials.value = response.data.records || [];
    } catch (error) {
        console.error('Error fetching existing testimonials:', error);
    }
};

const fetchRecords = async () => {
    try {
        const testimonial_response = await nuxtApp.$axios.get(`/cms/section-testimonial/${parentId}/${id}`);
        testimonialData.value = testimonial_response.data.record;
        populateData(testimonialData.value);
    } catch (error) {
        console.error('Error:', error);
    }
};

const handleFileUpdate = (field, file) => {
    formData[field] = file;
};

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    
    // Frontend validation: check for main image (existing or new)
    const hasExistingMainImage = testimonialData.value?.images?.some(
        (img) => img.category === 'main_image'
    );
    const hasNewMainImage = formData.main_image && formData.main_image.length > 0;
    if (!hasExistingMainImage && !hasNewMainImage) {
        nuxtApp.$toast.error('Main image is required.');
        return;
    }

    // Frontend validation: sequence must be unique within parent, excluding current record
    const requestedSequence = Number(formData.sequence);
    if (!Number.isNaN(requestedSequence)) {
        const duplicate = existingTestimonials.value.find(
            (item) => item.id !== id && Number(item.sequence) === requestedSequence
        );
        if (duplicate) {
            nuxtApp.$toast.error('Sequence number is already used. Please choose another.');
            return;
        }
    }

    // Frontend validation: content max 150 characters (plain text)
    if (formData.content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formData.content;
        const plainTextLength = tempDiv.innerText.trim().length;
        if (plainTextLength > 150) {
            nuxtApp.$toast.error('Content may not be greater than 150 characters.');
            return;
        }
    }

    if (formData.main_image && formData.main_image.length > 0) {
        formData.main_image.forEach((file) => {
            form_data.append(`main_image[]`, file)
        });
    }

    form_data.set('content', formData.content || '');
    form_data.set('sequence', formData.sequence);
    form_data.append('_method', 'PATCH');

    try {
        await nuxtApp.$axios.post(`/cms/section-testimonial/${parentId}/${id}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const record = response.data.record;
            populateData(record);
            nuxtApp.$toast.success('Testimonial updated successfully!');
        });
    } catch (error) {
        console.error('Error:', error);
        const backendErrors = error?.response?.data?.errors;
        if (backendErrors) {
            const firstErrorKey = Object.keys(backendErrors)[0];
            const firstMessage = backendErrors[firstErrorKey][0] || 'Validation error.';
            nuxtApp.$toast.error(firstMessage);
        } else {
            nuxtApp.$toast.error('Error updating testimonial. Please try again.');
        }
    }
}

const populateData = (data) => {
    formData.name = data.name || '';
    formData.position = data.position || '';
    formData.company = data.company || '';
    formData.content = data.content || '';
    formData.sequence = data.sequence || 0;
}
</script>
