<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form v-if="careerData" id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Career Information</h2>
                <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="Title" name="title" v-model="formData.title" placeholder="e.g. Software Engineer" :rules="'required|max:255'" optionalMessage="Job title" />
                    <TextField label="Department" name="department" v-model="formData.department" placeholder="e.g. Technology" :rules="'required|max:255'" optionalMessage="Department name" />
                </div>
                <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="Arrangement" name="arrangement" v-model="formData.arrangement" placeholder="e.g. Full-time" :rules="'required|max:255'" optionalMessage="Work arrangement" />
                    <DateField label="Date" name="date" v-model="formData.date" placeholder="Select date" :rules="''" optionalMessage="Optional" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Address" name="address" v-model="formData.address" placeholder="e.g. Manila, Philippines" :rules="'required|max:500'" optionalMessage="Job location" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-model="formData.benefits" :modelValue="formData.benefits" name="benefits" label="Benefits" :max="0" placeholder="Enter benefits" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-model="formData.responsibilities" :modelValue="formData.responsibilities" name="responsibilities" label="Responsibilities" :max="0" placeholder="Enter responsibilities" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <Quill v-model="formData.qualifications" :modelValue="formData.qualifications" name="qualifications" label="Qualifications" :max="0" placeholder="Enter qualifications" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <h3 class="font-normal text-base text-black/70">Enabled</h3>
                    <div class="pr-[16px] py-[12px] justify-start gap-[8px] flex">
                        <div @click="formData.enabled = !formData.enabled" class="cursor-pointer w-[40px] h-[24px] rounded-[12px] flex items-center hover:border hover:border-black p-[3px]" :class="{'bg-ui-color justify-end' : formData.enabled, 'bg-light-gray justify-start' : !formData.enabled}">
                            <div class="w-[20px] h-[20px] bg-white rounded-full"></div>
                        </div>
                        {{ formData.enabled ? 'Yes' : 'No' }}
                    </div>
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
const DateField = defineAsyncComponent(() => import('@/components/DateField.vue'));
const Quill = defineAsyncComponent(() => import('@/components/form-fields/Quill.vue'));

const nuxtApp = useNuxtApp();
const route = useRoute();
const pageTitle = usePageTitleStore();
const id = route.params.id;

const formData = reactive({
    title: '',
    department: '',
    arrangement: '',
    address: '',
    benefits: '',
    responsibilities: '',
    qualifications: '',
    date: '',
    enabled: true,
});

const careerData = ref(null);

onMounted(() => {
    pageTitle.setTitle('Edit Career');
    pageTitle.setBreadcrumbs(['Careers', 'Careers List', 'Edit Career']);
    pageTitle.setPageFrom('Careers List');
    pageTitle.setPageFromRoute('/careers');
    fetchRecords();
});

const fetchRecords = async () => {
    try {
        const response = await nuxtApp.$axios.get(`/cms/careers/${id}`);
        careerData.value = response.data.record;
        populateData(careerData.value);
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast?.error(error?.response?.data?.message || 'Failed to load career.');
    }
};

const populateData = (data) => {
    formData.title = data.title || '';
    formData.department = data.department || '';
    formData.arrangement = data.arrangement || '';
    formData.address = data.address || '';
    formData.benefits = data.benefits || '';
    formData.responsibilities = data.responsibilities || '';
    formData.qualifications = data.qualifications || '';
    formData.date = data.date ? (typeof data.date === 'string' && data.date.includes(' ') ? data.date.split(' ')[0] : data.date) : '';
    formData.enabled = Boolean(data.enabled);
};

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    form_data.append('_method', 'PATCH');
    form_data.append('benefits', formData.benefits || '');
    form_data.append('responsibilities', formData.responsibilities || '');
    form_data.append('qualifications', formData.qualifications || '');
    form_data.append('date', formData.date || '');
    form_data.append('enabled', formData.enabled ? '1' : '0');

    try {
        await nuxtApp.$axios.post(`/cms/careers/${id}`, form_data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        await fetchRecords();
        nuxtApp.$toast.success('Career updated successfully!');
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error(error?.response?.data?.message || 'Error updating career. Please try again.');
    }
};
</script>
