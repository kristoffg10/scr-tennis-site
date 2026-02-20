<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form v-if="agentData" id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Agent Information</h2>
                <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="First Name" name="firstname" v-model="formData.firstname" placeholder="e.g. Juan" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                    <TextField label="Last Name" name="lastname" v-model="formData.lastname" placeholder="e.g. Dela Cruz" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Middle Initial" name="middle_initial" v-model="formData.middle_initial" placeholder="e.g. M" :rules="'max:1'"
                        optionalMessage="Single character only" />
                </div>
                <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="License Type" name="license_type" v-model="formData.license_type" placeholder="e.g. Life Insurance" :rules="'max:255'"
                        optionalMessage="Max 255 characters" />
                    <TextField label="License ID" name="license_id" v-model="formData.license_id" placeholder="e.g. LIC-12345" :rules="'max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-2 gap-[16px]">
                    <DateField label="Effectivity Date" name="effectivity" v-model="formData.effectivity" placeholder="Select effectivity date" />
                    <DateField label="Expiry Date" name="expiry" v-model="formData.expiry" placeholder="Select expiry date" />
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
import { useAsyncData } from 'nuxt/app'

definePageMeta({
    middleware: 'authenticator'
})

const nuxtApp = useNuxtApp();

const route = useRoute();
const pageTitle = usePageTitleStore();
const id = route.params.id;

const formattedTitle = ref('');
const secondLastSegment = ref('');
const isClient = ref(false);

const formData = reactive({
    firstname: '',
    lastname: '',
    middle_initial: '',
    license_type: '',
    license_id: '',
    effectivity: '',
    expiry: ''
})

const agentData = ref(null);

onMounted(() => {
    pageTitle.setTitle(`Edit Agent`);
    pageTitle.setBreadcrumbs(['Agents', 'Agents List', 'Edit Agent']);

    pageTitle.setPageFrom('Agents List');
    pageTitle.setPageFromRoute('/agents');
    isClient.value = true;
    fetchRecords();
});

const fetchRecords = async () => {
    try {
        const agent_response = await nuxtApp.$axios.get(`/cms/agents/${id}`);
        agentData.value = agent_response.data.record;
        populateData(agentData.value);
    } catch (error) {
        console.error('Error:', error);
    }
};

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    
    form_data.append('_method', 'PATCH');

    try {
        const response = await nuxtApp.$axios.post(`/cms/agents/${id}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        const record = response.data.record;
        populateData(record);
        nuxtApp.$toast.success('Agent updated successfully!');
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error(error?.response?.data?.message || 'Error updating agent. Please try again.');
    }
}

const populateData = (data) => {
    formData.firstname = data.firstname || '';
    formData.lastname = data.lastname || '';
    formData.middle_initial = data.middle_initial || '';
    formData.license_type = data.license_type || '';
    formData.license_id = data.license_id || '';
    formData.effectivity = data.effectivity || '';
    formData.expiry = data.expiry || '';
}

</script>
