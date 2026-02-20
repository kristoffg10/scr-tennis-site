<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form v-if="providerData" id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Provider Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Name" name="name" v-model="formData.name" placeholder="e.g. Dr. Juan Dela Cruz" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Specialization" name="specialization" v-model="formData.specialization" placeholder="e.g. Cardiology" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Clinic" name="clinic" v-model="formData.clinic" placeholder="e.g. Medical Center" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Location" name="location" v-model="formData.location" placeholder="e.g. Manila" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Address" name="address" v-model="formData.address" placeholder="e.g. 123 Main Street" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField
                        label="Address Link"
                        name="address_link"
                        v-model="formData.address_link"
                        placeholder="e.g. https://maps.google.com/..."
                        :rules="'required|https'"
                        optionalMessage="Google Maps or location link"
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
    name: '',
    specialization: '',
    clinic: '',
    location: '',
    address: '',
    address_link: ''
})

const providerData = ref(null);

onMounted(() => {
    pageTitle.setTitle(`Edit Provider`);
    pageTitle.setBreadcrumbs(['Providers', 'Providers List', 'Edit Provider']);

    pageTitle.setPageFrom('Providers List');
    pageTitle.setPageFromRoute('/providers');
    isClient.value = true;
    fetchRecords();
});

const fetchRecords = async () => {
    try {
        const provider_response = await nuxtApp.$axios.get(`/cms/providers/${id}`);
        providerData.value = provider_response.data.record;
        populateData(providerData.value);
    } catch (error) {
        console.error('Error:', error);
    }
};

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    
    form_data.append('_method', 'PATCH');

    try {
        const response = await nuxtApp.$axios.post(`/cms/providers/${id}`, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const record = response.data.record;
            populateData(record);
            nuxtApp.$toast.success('Provider updated successfully!');
        });

    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error updating provider. Please try again.');
    }
}

const populateData = (data) => {
    formData.name = data.name || '';
    formData.specialization = data.specialization || '';
    formData.clinic = data.clinic || '';
    formData.location = data.location || '';
    formData.address = data.address || '';
    formData.address_link = data.address_link || '';
}

</script>
