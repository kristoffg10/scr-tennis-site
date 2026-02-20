<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
        <Form v-if="record" id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
                <h2 class="font-semibold text-xl text-start w-full">Taxonomy Information</h2>
                <div class="grid grid-cols-2 gap-[16px]">
                    <TextField label="Name" name="name" v-model="formData.name" placeholder="e.g. Unit Manager" :rules="'required|max:255'" optionalMessage="Max 255 characters" />
                    <div class="flex items-end">
                        <p class="text-base text-black/60"><span class="font-medium text-black/70">Type:</span> {{ typeLabel }}</p>
                    </div>
                </div>
            </div>

            <div class="flex self-end gap-[16px]">
                <NuxtLink :to="`/taxonomies/global/${typeParam}`" class="px-[24px] py-[12px] border border-black/20 text-center rounded-[10px]">Cancel</NuxtLink>
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

const route = useRoute();
const nuxtApp = useNuxtApp();
const pageTitle = usePageTitleStore();
const id = route.params.id;

const typeParam = computed(() => route.params.type || 'agent_position');

const typeOptions = [
    { value: 'agent_position', label: 'Agent Position' },
    { value: 'article_category', label: 'Article Category' },
];
const typeLabel = computed(() => typeOptions.find(o => o.value === typeParam.value)?.label || typeParam.value);

const formData = reactive({ name: '' });
const record = ref(null);

onMounted(() => {
    pageTitle.setTitle(`Edit ${typeLabel.value}`);
    pageTitle.setBreadcrumbs(['Taxonomies', 'Global', typeLabel.value, 'Edit']);
    pageTitle.setPageFrom(typeLabel.value);
    pageTitle.setPageFromRoute(`/taxonomies/global/${typeParam.value}`);
    fetchRecord();
});

const fetchRecord = async () => {
    try {
        const response = await nuxtApp.$axios.get(`/cms/taxonomy/${typeParam.value}/${id}`);
        record.value = response.data?.record;
        if (record.value) formData.name = record.value.name || '';
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast?.error('Failed to load taxonomy.');
    }
};

const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    form_data.append('_method', 'PATCH');

    try {
        await nuxtApp.$axios.post(`/cms/taxonomy/${typeParam.value}/${id}`, form_data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        await fetchRecord();
        nuxtApp.$toast.success('Taxonomy updated successfully!');
    } catch (error) {
        console.error('Error:', error);
        nuxtApp.$toast?.error(error?.response?.data?.message || 'Error updating taxonomy. Please try again.');
    }
};
</script>
