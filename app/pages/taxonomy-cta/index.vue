<template>
    <div class="relative w-full flex flex-col gap-y-[15px] bg-offwhite overflow-y-auto">
        <div class="p-[16px] gap-y-[20px] overflow-y-auto gap-[16px] flex flex-col">
            <div class="flex justify-between items-center w-full">
                <p v-if="records" class="text-black font-medium text-base">
                    <span class="text-black/60">Displaying </span>
                    {{ records.from ?? 0 }} - {{ records.to ?? 0 }}
                    <span class="text-black/60">of</span>
                    {{ records.total ?? 0 }}
                    <span class="text-black/60">items</span>
                </p>
            </div>
            <table class="min-w-full border-separate border-spacing-0 rounded-[10px] overflow-hidden bg-off-white relative z-10 pb-[140px]">
                <thead>
                    <tr class="h-[40px] bg-white text-black/60 font-medium text-base text-left">
                        <th class="px-[24px] py-[8px]">Title</th>
                        <th class="px-[24px] py-[8px]">Subtitle</th>
                        <th class="px-[24px] py-[8px]">Type</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="records && recordsData.length === 0" class="h-[60px] bg-white">
                        <td colspan="4" class="px-[24px] py-[16px] text-center text-black/60">No taxonomy CTAs found.</td>
                    </tr>
                    <template v-if="records && recordsData.length" v-for="(item, index) in recordsData" :key="item.id">
                        <tr class="h-3">
                            <td colspan="4"></td>
                        </tr>
                        <tr class="h-[40px] bg-white text-black font-light text-base text-left">
                            <td class="px-[24px] py-[8px] text-base font-semibold">{{ item.title || '-' }}</td>
                            <td class="px-[24px] py-[8px] text-base">{{ item.subtitle || '-' }}</td>
                            <td class="px-[24px] py-[8px] text-base font-semibold">{{ item.type || '-' }}</td>
                            <td class="px-[24px] py-[8px] relative w-[150px]">
                                <router-link
                                    :to="`/taxonomy-cta/${item.id}`"
                                    class="inline-flex items-center justify-center w-[32px] h-[32px] rounded-full bg-ui-hover text-ui-color hover:bg-ui-color hover:text-white transition-colors"
                                    :title="`Edit ${item.title || 'item'}`">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM3.86165 17.4505L13.9334 7.3787L16.5192 9.96448L6.44744 20.0363C6.30784 20.1759 6.13004 20.271 5.93645 20.3097L3.00111 20.8968L3.86165 17.4505Z" fill="currentColor" />
                                    </svg>
                                </router-link>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>

    <Pagination />
</template>

<script setup>
import { usePageTitleStore } from '~/stores/pageTitle';
import { usePaginationStore } from '~/stores/pagination';

definePageMeta({
    middleware: 'authenticator'
})

const pageTitle = usePageTitleStore();
const pagination = usePaginationStore();
const nuxtApp = useNuxtApp();

const records = ref(null);

const recordsData = computed(() => {
    if (!records.value) return [];
    if (Array.isArray(records.value)) return records.value;
    if (records.value && Array.isArray(records.value.data)) return records.value.data;
    return [];
});

onMounted(async () => {
    pagination.reset();
    await fetchRecords();
    pageTitle.setTitle('Global CTA');
    pageTitle.setBreadcrumbs(['Global CTA', 'Global CTA List' + ' - Editable Sections used in multiple website pages']);
    pageTitle.setPageFrom('');
    pageTitle.setPageFromRoute('');
});

const fetchRecords = async () => {
    try {
        const url = `/cms/taxonomy-cta?page=${pagination.page}`;
        const response = await nuxtApp.$axios.get(url);
        const rec = response.data?.records;
        if (Array.isArray(rec)) {
            records.value = { data: rec, from: 1, to: rec.length, total: rec.length, last_page: 1 };
        } else if (rec && typeof rec === 'object' && Array.isArray(rec.data)) {
            records.value = rec;
        } else {
            records.value = { data: [], from: 0, to: 0, total: 0, last_page: 1 };
        }
        if (records.value?.last_page) pagination.setTotalPages(records.value.last_page);
    } catch (error) {
        console.error('Taxonomy CTA fetch error:', error);
        records.value = { data: [], from: 0, to: 0, total: 0, last_page: 1 };
        nuxtApp.$toast?.error(error?.response?.data?.message || 'Failed to load taxonomy CTAs.');
    }
};

watch(pagination.page, () => { fetchRecords(); });
</script>
