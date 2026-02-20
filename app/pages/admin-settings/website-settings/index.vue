<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form v-if="settingsData !== undefined" id="form" @submit="submit()" class="w-full justify-between flex flex-col h-auto min-h-[600px]">
            <div class="w-full gap-[16px] flex flex-col">
                <!-- Contact & Hotline -->
                <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                    <h2 class="font-semibold text-xl text-start w-full">Contact & Hotline</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                        <TextField
                            label="Customer Care Contact"
                            name="customer_care_contact"
                            v-model="formData.customer_care_contact"
                            placeholder="e.g. +63 2 1234 5678"
                        />
                        <TextField
                            label="Telemedicine Hotline"
                            name="telemedicine_hotline"
                            v-model="formData.telemedicine_hotline"
                            placeholder="e.g. +63 2 8765 4321"
                        />
                    </div>
                </div>

                <!-- Address -->
                <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                    <h2 class="font-semibold text-xl text-start w-full">Website Information</h2>
                    <div class="grid grid-cols-1 gap-[16px]">
                        <TextField
                            label="Address"
                            name="address"
                            v-model="formData.address"
                            placeholder="e.g. Full address"
                            :rules="'required'"
                        />
                        <TextField
                            label="Address Link (Map URL)"
                            name="address_link"
                            v-model="formData.address_link"
                            placeholder="e.g. https://maps.google.com/..."
                        />
                    </div>
                </div>

                <!-- Socials -->
                <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                    <h2 class="font-semibold text-xl text-start w-full">Socials Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                        <TextField
                            label="Facebook"
                            name="facebook"
                            v-model="formData.facebook"
                            placeholder="e.g. https://facebook.com/..."
                        />
                        <TextField
                            label="Instagram"
                            name="instagram"
                            v-model="formData.instagram"
                            placeholder="e.g. https://instagram.com/..."
                        />
                        <TextField
                            label="LinkedIn"
                            name="linkedin"
                            v-model="formData.linkedin"
                            placeholder="e.g. https://linkedin.com/..."
                        />
                        <TextField
                            label="YouTube"
                            name="youtube"
                            v-model="formData.youtube"
                            placeholder="e.g. https://youtube.com/..."
                        />
                    </div>
                </div>
            </div>
            <div class="flex self-end justify-self-end gap-[16px]">
                <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px]">Save Changes</button>
            </div>
        </Form>
        <div v-else class="flex items-center justify-center min-h-[300px] text-gray-500">Loading settings...</div>
    </div>
</template>

<script setup>
    import { useAuthStore } from '~/stores/auth';
    import { usePageTitleStore } from '~/stores/pageTitle';
    import { usePermissionStore } from '~/stores/permissions';
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import { useRoute } from 'vue-router';

    definePageMeta({
        middleware: 'authenticator'
    })

    const nuxtApp = useNuxtApp();
    const authStore = useAuthStore();
    const route = useRoute();
    const router = useRouter();
    const pageTitle = usePageTitleStore();
    const permissionStore = usePermissionStore();

    const userUniques = computed(() => {
        const user = authStore.user;
        if (!user?.role?.permissions) return [];
        try {
            const raw = user.role.permissions;
            const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
            return (parsed || []).map((p) => p?.unique).filter(Boolean);
        } catch {
            return [];
        }
    });

    const canAccessWebsiteSettings = computed(() =>
        userUniques.value.includes('admin-settings-website-settings') || userUniques.value.includes('admin-settings')
    );

    const formData = reactive({
        customer_care_contact: '',
        telemedicine_hotline: '',
        address: '',
        address_link: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        youtube: ''
    });

    onMounted(() => {
        if (!canAccessWebsiteSettings.value) {
            nuxtApp.$toast.error('You do not have permission to access Website Settings.');
            router.replace('/dashboard');
            return;
        }
        pageTitle.setTitle('Website Settings');
        pageTitle.setBreadcrumbs(['Admin Settings', 'Website Settings']);
        pageTitle.setPageFromRoute('/admin-settings/website-settings');
        fetchRecords();
    });

    const submit = async () => {
        try {
            const formElement = document.getElementById('form');
            const form_data = new FormData(formElement);

            const response = await nuxtApp.$axios.post(`/cms/setting/manage`, form_data);
            populateData(response.data.record);
            nuxtApp.$toast.success('Website Settings updated successfully.');
        } catch (error) {
            console.error('Error:', error);
            nuxtApp.$toast.error(error.response?.data?.message || 'Failed to save settings.');
        }
    };

    const settingsData = ref(undefined);

    const fetchRecords = async () => {
        try {
            const response = await nuxtApp.$axios.get(`/cms/setting/show`);
            settingsData.value = response.data.record;
            populateData(response.data.record || {});
        } catch (error) {
            console.error('Error:', error);
            settingsData.value = null;
            nuxtApp.$toast.error(error.response?.data?.message || 'Failed to load settings.');
        }
    };

    const populateData = (data) => {
        if (!data) return;
        formData.customer_care_contact = data.customer_care_contact ?? '';
        formData.telemedicine_hotline = data.telemedicine_hotline ?? '';
        formData.address = data.address ?? '';
        formData.address_link = data.address_link ?? '';
        formData.facebook = data.facebook ?? '';
        formData.instagram = data.instagram ?? '';
        formData.linkedin = data.linkedin ?? '';
        formData.youtube = data.youtube ?? '';
    };
</script>
