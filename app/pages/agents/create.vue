<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Agent Information</h2>
                <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="First Name" name="firstname" placeholder="e.g. Juan" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                    <TextField label="Last Name" name="lastname" placeholder="e.g. Dela Cruz" :rules="'required|max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-1 gap-[16px]">
                    <TextField label="Middle Initial" name="middle_initial" placeholder="e.g. M" :rules="'max:1'"
                        optionalMessage="Single character only" />
                </div>
                <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="License Type" name="license_type" placeholder="e.g. Life Insurance" :rules="'max:255'"
                        optionalMessage="Max 255 characters" />
                    <TextField label="License ID" name="license_id" placeholder="e.g. LIC-12345" :rules="'max:255'"
                        optionalMessage="Max 255 characters" />
                </div>
                <div class="grid grid-cols-2 gap-[16px]">
                    <DateField label="Effectivity Date" name="effectivity" placeholder="Select effectivity date" />
                    <DateField label="Expiry Date" name="expiry" placeholder="Select expiry date" />
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
    pageTitle.setTitle(`Add Agent`);
    pageTitle.setBreadcrumbs(['Agents', 'Agents List', 'Add Agent']);

    pageTitle.setPageFrom('Agents List');
    pageTitle.setPageFromRoute('/agents');
});

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);

    try {
        const response = await nuxtApp.$axios.post(`/cms/agents`, form_data , {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const record = response.data.record;
            
            nuxtApp.$toast.success('Agent created successfully!');
            useRouter().push(`/agents/${record.id}`);
        }); 

    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast.error('Error creating agent. Please try again.');
    }
}

</script>
