<template>
    <div class="overflow-y-scroll">
        <div class="p-[16px]">
            <!-- Control  -->
            <div class="flex items-center justify-between mb-[12px]">
                <div>
                    Displaying {{ records.length }} of
                    {{ totalRecords }} Email Recipients
                </div>
            </div>
            <!-- Table  -->
            <table class="w-full border-separate border-spacing-y-[12px]">
                <thead class="bg-[#fcfcfc]">
                    <tr class="px-[24px] py-[8px] opacity-60">
                        <th>Submission Type</th>
                        <th>Assigned Email Recipients</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        class="bg-[#fff] border-[1px] border-[#e9e9e9]"
                        v-for="(record, index) in records"
                        :key="record">
                        <td class="py-[34.5px]">
                            <span class="font-[500]">{{ record.name }}</span>
                        </td>
                        <td>
                            <div
                                class="font-[500] flex flex-col gap-[10px] py-[10px]">
                                <p
                                    class="px-[12px] py-[2px] bg-ui-color rounded-[10px] text-white w-max"
                                    v-for="(email, idx) in (record.email_recipients || [])"
                                    :key="idx">
                                    {{ email }}
                                </p>
                            </div>
                        </td>
                        <td class="py-[34.5px] relative w-[150px]">
                            <div class="flex items-center gap-[8px]">
                                <NuxtLink
                                    :to="`/taxonomies/email-recipients/form-pages/${record.id}`"
                                    class="inline-flex items-center justify-center w-[32px] h-[32px] rounded-full bg-ui-hover text-ui-color hover:bg-ui-color hover:text-white transition-colors"
                                    :title="`Edit ${record.name}`">
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
                                </NuxtLink>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Pagination />
    </div>
</template>

<script setup>
import { Form } from 'vee-validate';
import { usePageTitleStore } from '~/stores/pageTitle';
import { useFilterStore } from '~/stores/filters';
import { useSidebarStore } from '~/stores/sidebar';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { usePaginationStore } from '~/stores/pagination';
const showPopup = ref(false);

// definePageMeta({
//     name: 'pages',
//     middleware: 'authenticator'
// })

const records = ref([]);
const totalRecords = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const isSubmitting = ref(false);
const pageTitle = usePageTitleStore();
const filter = useFilterStore();
const sidebar = useSidebarStore();
const keyword = ref('');

onMounted(() => {
    pageTitle.reset();
    pageTitle.setTitle('Email Recipients');
    pageTitle.setBreadcrumbs(['Taxonomies', 'Email Recipients']);

    fetchRecords(pagination.page);
});

const sortBy = ref('name');
const sortDirection = ref('asc');
const pagination = usePaginationStore();

const fetchRecords = async (page = 1) => {
    try {
        const response = await nuxtApp.$axios.get(
            `/cms/taxonomy/submission_type?page=${page}&sortBy=${sortBy.value}&sortDirection=${sortDirection.value}`
        );

        const rec = response.data.records;

        if (rec && Array.isArray(rec.data)) {
            records.value = rec.data;
            totalRecords.value = rec.total ?? rec.data.length ?? 0;
            totalPages.value = rec.last_page ?? 1;
            pagination.setTotalPages(rec.last_page ?? 1);
        } else if (Array.isArray(rec)) {
            records.value = rec;
            totalRecords.value = rec.length;
            totalPages.value = 1;
            pagination.setTotalPages(1);
        } else {
            records.value = [];
            totalRecords.value = 0;
            totalPages.value = 1;
            pagination.setTotalPages(1);
        }

        currentPage.value = page;
    } catch (error) {
        console.log(error);
    }
};

const nuxtApp = useNuxtApp();

watch(() => pagination.page, (newPage) => {
    fetchRecords(newPage);
});

definePageMeta({
    middleware: 'authenticator',
});
// const goToPage = (page, module) => {
//     pageTitle.setTitle(`Edit ${module.name}`);
//     pageTitle.setBreadcrumbs(['Pages', page.name, module.name]);
//     sidebar.setActiveLink(page.name);

//     pageTitle.setPageFrom('Pages');
//     pageTitle.setPageFromRoute('/pages');

//     router.push(
//         `/pages/${page.name.toLowerCase().replace(/ /g, '-')}/${module.name
//             .toLowerCase()
//             .replace(/ /g, '-')}/${module.id}`
//     );
// };
</script>

<style scoped>
th {
    padding-block: 8px;
}

th,
td {
    text-align: left;
}
th:first-child,
td:first-child {
    padding-left: 24px;
}

th:last-child,
td:last-child {
    padding-right: 24px;
}
</style>
