<template>
    <div class="relative w-full flex flex-col gap-y-[15px] bg-offwhite overflow-y-auto">
        <div class="relative w-full flex p-[16px] justify-between items-center bg-white">
            <form @submit="onSubmit" class="gap-y-[8px] w-full flex flex-col">
                <div class="flex gap-[16px] items-end">
                    <div class="flex-1">
                        <label for="search" class="text-base font-medium text-black/70">
                            Search for job title
                        </label>
                        <Search v-model="keyword" class="w-full"/>
                    </div>
                </div>
            </form>
        </div>
        
        <div class="p-[16px] gap-y-[20px] overflow-y-auto gap-[16px] flex flex-col">
            <div class="flex justify-between items-center w-full">
                <p v-if="careers" class="text-black font-medium text-base">
                    <span class="text-black/60">Displaying </span> 
                    {{ careers.from ?? 0 }} - {{ careers.to ?? 0 }} 
                    <span class="text-black/60">of</span> 
                    {{ careers.total ?? 0 }} 
                    <span class="text-black/60">items</span>
                </p>
                <div class="flex gap-[16px] items-center">
                    <router-link :to="`/careers/create`" class="px-[16px] py-[10px] rounded-[10px] bg-ui-color border border-ui-color text-white text-base font-medium transition hover:bg-dark-ui-color flex gap-[4px]">
                        <span class="w-[21px] h-[21px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 19.6875C5.42587 19.6875 1.3125 15.5728 1.3125 10.5C1.3125 5.42719 5.42587 1.3125 10.5 1.3125C15.5741 1.3125 19.6875 5.42719 19.6875 10.5C19.6875 15.5728 15.5741 19.6875 10.5 19.6875ZM10.5 0C4.70072 0 0 4.69875 0 10.5C0 16.3012 4.70072 21 10.5 21C16.2993 21 21 16.3012 21 10.5C21 4.69875 16.2993 0 10.5 0ZM14.4375 9.84375H11.1562V6.5625C11.1562 6.20156 10.8629 5.90625 10.5 5.90625C10.1371 5.90625 9.84375 6.20156 9.84375 6.5625V9.84375H6.5625C6.19959 9.84375 5.90625 10.1391 5.90625 10.5C5.90625 10.8609 6.19959 11.1562 6.5625 11.1562H9.84375V14.4375C9.84375 14.7984 10.1371 15.0938 10.5 15.0938C10.8629 15.0938 11.1562 14.7984 11.1562 14.4375V11.1562H14.4375C14.8004 11.1562 15.0938 10.8609 15.0938 10.5C15.0938 10.1391 14.8004 9.84375 14.4375 9.84375Z" fill="#FCFCFC"/>
                            </svg>
                        </span>
                        Add Career
                    </router-link>
                </div>
            </div>
            <table class="min-w-full border-collapse rounded-[10px] overflow-hidden bg-off-white border-separate border-spacing-0 relative z-10 pb-[140px]">
                <thead>
                    <tr class="h-[40px] bg-white text-black/60 font-medium text-base text-left">
                        <th class="px-[24px] py-[8px]">Title</th>
                        <th class="px-[24px] py-[8px]">Department</th>
                        <th class="px-[24px] py-[8px]">Arrangement</th>
                        <th class="px-[24px] py-[8px]">Status</th>
                        <th class="px-[24px] py-[8px]">Date Edited</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="careers && careersData.length === 0" class="h-[60px] bg-white">
                        <td colspan="6" class="px-[24px] py-[16px] text-center text-black/60">No careers found.</td>
                    </tr>
                    <template v-if="careers && careersData.length" v-for="(career, index) in careersData" :key="career.id">
                        <tr class="h-3">
                            <td colspan="6"></td>
                        </tr>
                        <tr class="h-[40px] bg-white text-black font-normal text-base text-left font-light">
                            <td class="px-[24px] py-[8px] text-base font-semibold">{{ career.title || '-' }}</td>
                            <td class="px-[24px] py-[8px] text-base font-semibold">{{ career.department || '-' }}</td>
                            <td class="px-[24px] py-[8px] text-base font-semibold">{{ career.arrangement || '-' }}</td>
                            <td class="px-[24px] py-[8px] text-base font-semibold">
                                <span
                                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                                    :class="career.enabled
                                        ? 'bg-ui-color/10 text-ui-color border border-ui-color/40'
                                        : 'bg-gray-100 text-gray-600 border border-gray-300'">
                                    {{ career.enabled ? 'Enabled' : 'Disabled' }}
                                </span>
                            </td>
                            <td class="px-[24px] py-[8px]">
                                {{ $moment(career.updated_at).format('MMM DD, YYYY') }}<br>
                                <span class="text-sm text-black">{{ $moment(career.updated_at).format('hh:mm A') }}</span>
                            </td>
                            <td class="px-[24px] py-[8px] relative w-[150px]">
                                <div class="flex items-center gap-[8px]">
                                    <router-link
                                        :to="`/careers/${career.id}`"
                                        class="inline-flex items-center justify-center w-[32px] h-[32px] rounded-full bg-ui-hover text-ui-color hover:bg-ui-color hover:text-white transition-colors"
                                        :title="`Edit ${career.title}`"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM3.86165 17.4505L13.9334 7.3787L16.5192 9.96448L6.44744 20.0363C6.30784 20.1759 6.13004 20.271 5.93645 20.3097L3.00111 20.8968L3.86165 17.4505Z" fill="currentColor" />
                                        </svg>
                                    </router-link>
                                    <button
                                        class="inline-flex items-center justify-center w-[32px] h-[32px] rounded-full bg-danger/10 text-danger hover:bg-danger hover:text-white transition-colors"
                                        :title="`Delete ${career.title}`"
                                        @click="openDeletePopup(`/cms/careers/${career.id}`)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 20 23" fill="none">
                                            <path d="M7.77778 17.7778C8.07246 17.7778 8.35508 17.6607 8.56345 17.4523C8.77183 17.244 8.88889 16.9614 8.88889 16.6667V10C8.88889 9.70531 8.77183 9.4227 8.56345 9.21433C8.35508 9.00595 8.07246 8.88889 7.77778 8.88889C7.48309 8.88889 7.20048 9.00595 6.9921 9.21433C6.78373 9.4227 6.66667 9.70531 6.66667 10V16.6667C6.66667 16.9614 6.78373 17.244 6.9921 17.4523C7.20048 17.6607 7.48309 17.7778 7.77778 17.7778ZM18.8889 4.44444H14.4444V3.33333C14.4444 2.44928 14.0933 1.60143 13.4681 0.976311C12.843 0.35119 11.9952 0 11.1111 0H8.88889C8.00483 0 7.15699 0.35119 6.53187 0.976311C5.90674 1.60143 5.55556 2.44928 5.55556 3.33333V4.44444H1.11111C0.816426 4.44444 0.533811 4.56151 0.325437 4.76988C0.117063 4.97825 0 5.26087 0 5.55556C0 5.85024 0.117063 6.13286 0.325437 6.34123C0.533811 6.5496 0.816426 6.66667 1.11111 6.66667H2.22222V18.8889C2.22222 19.7729 2.57341 20.6208 3.19853 21.2459C3.82365 21.871 4.6715 22.2222 5.55556 22.2222H14.4444C15.3285 22.2222 16.1763 21.871 16.8015 21.2459C17.4266 20.6208 17.7778 19.7729 17.7778 18.8889V6.66667H18.8889C19.1836 6.66667 19.4662 6.5496 19.6746 6.34123C19.8829 6.13286 20 5.85024 20 5.55556C20 5.26087 19.8829 4.97825 19.6746 4.76988C19.4662 4.56151 19.1836 4.44444 18.8889 4.44444ZM7.77778 3.33333C7.77778 3.03865 7.89484 2.75603 8.10322 2.54766C8.31159 2.33929 8.5942 2.22222 8.88889 2.22222H11.1111C11.4058 2.22222 11.6884 2.33929 11.8968 2.54766C12.1052 2.75603 12.2222 3.03865 12.2222 3.33333V4.44444H7.77778V3.33333ZM15.5556 18.8889C15.5556 19.1836 15.4385 19.4662 15.2301 19.6746C15.0217 19.8829 14.7391 20 14.4444 20H5.55556C5.26087 20 4.97826 19.8829 4.76988 19.6746C4.56151 19.4662 4.44444 19.1836 4.44444 18.8889V6.66667H15.5556V18.8889ZM12.2222 17.7778C12.5169 17.7778 12.7995 17.6607 13.0079 17.4523C13.2163 17.244 13.3333 16.9614 13.3333 16.6667V10C13.3333 9.70531 13.2163 9.4227 13.0079 9.21433C12.7995 9.00595 12.5169 8.88889 12.2222 8.88889C11.9275 8.88889 11.6449 9.00595 11.4365 9.21433C11.2282 9.4227 11.1111 9.70531 11.1111 10V16.6667C11.1111 16.9614 11.2282 17.244 11.4365 17.4523C11.6449 17.6607 11.9275 17.7778 12.2222 17.7778Z" fill="currentColor" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table> 
        </div>
    </div>
    
    <PopupDelete v-model:show="showDeletePopup" :deletePath="deletePath" @delete-success="fetchRecords" />
    <Pagination />
</template>

<script setup>
import { usePageTitleStore } from '~/stores/pageTitle';
import { usePaginationStore } from '~/stores/pagination';
import { useAuthStore } from '~/stores/auth';

const PopupDelete = defineAsyncComponent(() => import('~/components/popup/delete.vue'));

definePageMeta({
    middleware: 'authenticator'
})

const pageTitle = usePageTitleStore();
const pagination = usePaginationStore();
const authStore = useAuthStore();

const nuxtApp = useNuxtApp();
const careers = ref(null);

// Redirect if role does not have careers permission (defense in depth with middleware)
const hasCareersPermission = () => {
  if (authStore.isSuperAdmin) return true;
  const user = authStore.user;
  if (!user?.role?.permissions) return false;
  try {
    const raw = user.role.permissions;
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const uniques = (parsed || []).map((p) => p?.unique).filter(Boolean);
    return uniques.includes('careers');
  } catch {
    return false;
  }
};

const careersData = computed(() => {
    if (!careers.value) return [];
    if (Array.isArray(careers.value)) return careers.value;
    if (careers.value && Array.isArray(careers.value.data)) return careers.value.data;
    return [];
});

onMounted(async () => {
    if (!hasCareersPermission()) {
        await navigateTo('/dashboard');
        return;
    }
    pagination.reset();
    await fetchRecords();
    pageTitle.setTitle("Careers");
    pageTitle.setBreadcrumbs(['Careers', 'Careers List']);
    pageTitle.setPageFrom('');
    pageTitle.setPageFromRoute('');
});

const fetchRecords = async () => {
    try {
        const response = await nuxtApp.$axios.get(`/cms/careers?page=${pagination.page}&keyword=${keyword.value || ''}`);
        const rec = response.data?.records;
        if (Array.isArray(rec)) {
            careers.value = { data: rec, from: 1, to: rec.length, total: rec.length, last_page: 1 };
        } else if (rec && typeof rec === 'object' && Array.isArray(rec.data)) {
            careers.value = rec;
        } else {
            careers.value = { data: [], from: 0, to: 0, total: 0, last_page: 1 };
        }
        if (careers.value?.last_page) {
            pagination.setTotalPages(careers.value.last_page);
        }
    } catch (error) {
        console.error('Careers fetch error:', error);
        careers.value = { data: [], from: 0, to: 0, total: 0, last_page: 1 };
        nuxtApp.$toast?.error(error?.response?.data?.message || 'Failed to load careers. Check the API and try again.');
    }
};

const showDeletePopup = ref(false);
const deletePath = ref('');
const keyword = ref('');

const openDeletePopup = (url) => {
    showDeletePopup.value = true;
    deletePath.value = url;
};

const onSubmit = () => {
    fetchRecords();
};

watch(keyword, () => { 
    pagination.reset();
    fetchRecords(); 
});
watch(() => pagination.page, () => { fetchRecords(); });
</script>
