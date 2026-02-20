<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form v-if="hotlineData" id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Hotline Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField
                        label="Title"
                        name="title"
                        v-model="formData.title"
                        placeholder="e.g. Landline"
                        :rules="'required|max:255'"
                        optionalMessage="Max 255 characters"
                    />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField
                        label="Primary Number"
                        name="primary_number"
                        v-model="formData.primary_number"
                        placeholder="e.g. +63283730002"
                        :rules="'required|max:50'"
                        optionalMessage="Primary contact number"
                    />
                </div>
                <div
                    v-if="showSecondaryField"
                    class="grid grid-cols-1 gap-[16px]"
                >
                    <TextField
                        label="Secondary Number"
                        name="secondary_number"
                        v-model="formData.secondary_number"
                        placeholder="e.g. +639612345678 (optional)"
                        :rules="'max:50'"
                        optionalMessage="Optional secondary number"
                    />
                </div>
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

const nuxtApp = useNuxtApp();
const route = useRoute();
const pageTitle = usePageTitleStore();
const id = route.params.id;
const parentId = route.params.parent_id;

const SPECIAL_HOTLINE_PARENT_ID = '56e8b57d-c4e5-4e9c-b1d2-2635f38c55e1';
const showSecondaryField = computed(() => parentId !== SPECIAL_HOTLINE_PARENT_ID);

const formData = reactive({
    title: '',
    type: 'landline',
    primary_number: '',
    secondary_number: '',
    sequence: 1,
})

const hotlineData = ref(null);

onMounted(() => {
    pageTitle.setTitle(`Edit Hotline`);
    pageTitle.setBreadcrumbs(['Section Hotlines', 'Edit Hotline']);
    pageTitle.setPageFrom('Section Hotlines');
    pageTitle.setPageFromRoute(`/section-hotline/${parentId}`);
    fetchRecords();
});

const fetchRecords = async () => {
    try {
        const hotline_response = await nuxtApp.$axios.get(`/cms/section-hotline/${parentId}/${id}`);
        hotlineData.value = hotline_response.data.record;
        populateData(hotlineData.value);
    } catch (error) {
        console.error('Error:', error);
    }
};

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    form_data.set('sequence', formData.sequence);
    form_data.set('type', formData.type);
    form_data.append('_method', 'PATCH');

    try {
        await nuxtApp.$axios.post(`/cms/section-hotline/${parentId}/${id}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const record = response.data.record;
            populateData(record);
            nuxtApp.$toast.success('Hotline updated successfully!');
        });
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error updating hotline. Please try again.');
    }
}

const populateData = (data) => {
    formData.title = data.title || '';
    formData.type = data.type || 'landline';
    formData.primary_number = data.primary_number || '';
    formData.secondary_number = data.secondary_number || '';
    formData.sequence = data.sequence ?? 1;
}
</script>
