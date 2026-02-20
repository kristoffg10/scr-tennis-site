<template>
    <div class="relative w-full flex flex-col gap-y-[15px] bg-offwhite overflow-y-auto">
        <div class="p-[16px] gap-y-[20px] overflow-y-auto gap-[16px] flex flex-col">
            <div class="flex justify-between items-center w-full">
                <p v-if="hotlines && hotlines.data" class="text-black font-medium text-base">
                    <span class="text-black/60">Displaying </span> 
                    {{ hotlines.from }} - {{ hotlines.to }} 
                    <span class="text-black/60">of</span> 
                    {{ hotlines.total }} 
                    <span class="text-black/60">items</span>
                </p>
            </div>
            <table class="min-w-full border-collapse rounded-[10px] overflow-hidden bg-off-white border-separate border-spacing-0 relative z-10 pb-[140px]">
                <thead>
                    <tr class="h-[40px] bg-white text-black/60 font-medium text-base text-left">
                        <th
                            v-if="showSequenceColumn"
                            class="px-[24px] py-[8px] rounded-[10px] cursor-pointer flex gap-[8px]"
                            @click="toggleSort('sequence')"
                        >
                            Seq.
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path
                                    d="M5.22216 7.34717L8.57972 3.1633C8.87841 2.7763 9.37059 2.7763 9.66985 3.1633L13.0274 7.34717C13.3261 7.73417 13.1855 8.0503 12.6758 8.0503H5.57428C5.06466 8.0503 4.92403 7.73361 5.22272 7.34717H5.22216Z"
                                    :fill="sortBy === 'sequence' && sortDirection === 'asc' ? '#4B545B' : '#A6A8AB'"
                                />
                                <path
                                    d="M13.0268 10.6519L9.66928 14.8357C9.3706 15.2227 8.87841 15.2227 8.57916 14.8357L5.2216 10.6519C4.92291 10.2649 5.06353 9.94873 5.57316 9.94873H12.6747C13.1843 9.94873 13.325 10.2654 13.0263 10.6519H13.0268Z"
                                    :fill="sortBy === 'sequence' && sortDirection === 'desc' ? '#4B545B' : '#A6A8AB'"
                                />
                            </svg>
                        </th>
                        <th class="px-[24px] py-[8px]">Title</th>
                        <th class="px-[24px] py-[8px]">Type</th>
                        <th class="px-[24px] py-[8px]">Primary Number</th>
                        <th
                            v-if="showSecondaryColumn"
                            class="px-[24px] py-[8px]"
                        >
                            Secondary Number
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="hotlines && hotlines.data" v-for="(hotline, index) in hotlines.data" :key="hotline.id">
                        <tr class="h-3">
                            <td :colspan="columnCount"></td>
                        </tr>
                        <tr class="h-[40px] bg-white text-black font-normal text-base text-left font-light">
                            <td
                                v-if="showSequenceColumn"
                                class="px-[24px] py-[8px] text-base font-normal"
                            >
                                {{ hotline.sequence }}
                            </td>
                            <td class="px-[24px] py-[8px] text-base font-semibold">{{ hotline.title || '-' }}</td>
                            <td class="px-[24px] py-[8px] text-base font-normal capitalize">{{ hotline.type || '-' }}</td>
                            <td class="px-[24px] py-[8px] text-base font-normal">{{ hotline.primary_number || '-' }}</td>
                            <td
                                v-if="showSecondaryColumn"
                                class="px-[24px] py-[8px] text-base font-normal"
                            >
                                {{ hotline.secondary_number || '-' }}
                            </td>
                            <td class="px-[24px] py-[8px] relative w-[150px]">
                                <router-link
                                    :to="`/section-hotline/${parentId}/${hotline.id}`"
                                    class="inline-flex items-center justify-center w-[32px] h-[32px] rounded-full bg-ui-hover text-ui-color hover:bg-ui-color hover:text-white transition-colors"
                                    :title="`Edit ${hotline.title}`"
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM3.86165 17.4505L13.9334 7.3787L16.5192 9.96448L6.44744 20.0363C6.30784 20.1759 6.13004 20.271 5.93645 20.3097L3.00111 20.8968L3.86165 17.4505Z"
                                            fill="currentColor" />
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
    import { useRoute } from 'vue-router';

    definePageMeta({
        middleware: 'authenticator'
    })

    const pageTitle = usePageTitleStore();
    const pagination = usePaginationStore();
    const route = useRoute();
    
    const nuxtApp = useNuxtApp();
    const hotlines = ref(null);
    const parentId = route.params.parent_id;

    const SPECIAL_HOTLINE_PARENT_ID = '56e8b57d-c4e5-4e9c-b1d2-2635f38c55e1';

    const isSpecialParent = computed(() => parentId === SPECIAL_HOTLINE_PARENT_ID);
    const showSequenceColumn = computed(() => !isSpecialParent.value);
    const showSecondaryColumn = computed(() => !isSpecialParent.value);
    const columnCount = computed(() => {
        // Base columns: Seq, Title, Type, Primary, Secondary, Actions = 6
        // For the special parent, hide Seq and Secondary -> 4 columns
        return isSpecialParent.value ? 4 : 6;
    });

    onMounted( async () => {
        pagination.reset();
        await fetchRecords();
        pageTitle.setTitle("Section Hotlines");
        pageTitle.setBreadcrumbs(['Pages', 'Section Hotlines']);
        pageTitle.setPageFrom('Pages');
        pageTitle.setPageFromRoute('/pages');
    });

    const fetchRecords = async () => {
        try {
            const hotlines_response = await nuxtApp.$axios.get(`/cms/section-hotline/${parentId}?page=${pagination.page}&sortBy=${sortBy.value}&sortDirection=${sortDirection.value}`); 
            hotlines.value = hotlines_response.data.records;
            if (hotlines.value && hotlines.value.last_page) {
                pagination.setTotalPages(hotlines.value.last_page);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const sortBy = ref('sequence');
    const sortDirection = ref('asc');

    const toggleSort = async column => {
        if (sortBy.value === column) {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
        } else {
            sortBy.value = column;
            sortDirection.value = 'asc';
        }
        await fetchRecords();
    };

    watch(pagination.page, () => {
        fetchRecords();
    });
</script>
