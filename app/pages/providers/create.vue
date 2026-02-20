<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Provider Information</h2>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Name" name="name" placeholder="e.g. Dr. Juan Dela Cruz" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Specialization" name="specialization" placeholder="e.g. Cardiology" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Clinic" name="clinic" placeholder="e.g. Medical Center" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Location" name="location" placeholder="e.g. Manila" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Address" name="address" placeholder="e.g. 123 Main Street" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField
                        label="Address Link"
                        name="address_link"
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

onMounted(() => {
    pageTitle.setTitle(`Add Provider`);
    pageTitle.setBreadcrumbs(['Providers', 'Providers List', 'Add Provider']);

    pageTitle.setPageFrom('Providers List');
    pageTitle.setPageFromRoute('/providers');
});

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);

    try {
        const response = await nuxtApp.$axios.post(`/cms/providers`, form_data , {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const record = response.data.record;
            
            nuxtApp.$toast.success('Provider created successfully!');
            useRouter().push(`/providers/${record.id}`);
        }); 

    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error creating provider. Please try again.');
    }
}

</script>
