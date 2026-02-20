<template>
    <div class="relative w-full p-[16px] flex flex-col gap-y-[15px] bg-white">
        <div class="relative w-full flex justify-between items-center">
            <form @submit.prevent="onSubmit" class="gap-y-[8px]">
                <label for="search" class="text-base font-medium text-black/70">
                    Search by Page Name
                </label>
                <Search v-model="keyword" />
            </form>
            <div class="gap-y-[8px]">
                <label for="filter" class="text-base font-medium text-black/70">
                    Filter by Page Category
                </label>
                <Filter v-if="records" :options="records" :placeholder="'Choose a Category'" :filterBy="'Category'"/>
            </div>
        </div>
        <div v-if="filter.value" class="flex justify-start items-center w-full">
            <div class="py-[4px] px-[16px] rounded-[60px] bg-ui-color flex justify-center items-center  gap-x-[8px]">
                <p class="text-sm font-normal text-white/40">{{ filter.name }}</p>
                <p class="text-sm font-medium text-white">{{ filter.value }}</p>
                <span class="w-[10px] h-[10px] cursor-pointer" @click="filter.reset()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 11" fill="none">
                    <path d="M8.75011 0.500488L4.99956 4.25016L1.24989 0.500488L0 1.75038L3.74967 5.50005L0 9.24971L1.24989 10.4996L4.99956 6.74994L8.75011 10.4996L10 9.24971L6.25033 5.50005L10 1.75038L8.75011 0.500488Z" fill="white"/>
                    </svg>
                </span>
            </div>
            <div class="ml-[56px] text-danger/40 text-base font-medium leading-normal cursor-pointer flex justify-center items-center  " @click="filter.reset()">
                <span class="w-[25px] h-[25px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" class="fill-danger/40">
                    <path d="M8.33333 7.2915C8.05707 7.2915 7.79211 7.40125 7.59676 7.5966C7.40141 7.79195 7.29167 8.0569 7.29167 8.33317C7.29167 8.60944 7.40141 
                    8.87439 7.59676 9.06974C7.79211 9.26509 8.05707 9.37484 8.33333 9.37484H20.8333C21.1096 9.37484 21.3746 9.26509 21.5699 9.06974C21.7653 8.87439 
                    21.875 8.60944 21.875 8.33317C21.875 8.0569 21.7653 7.79195 21.5699 7.5966C21.3746 7.40125 21.1096 7.2915 20.8333 7.2915H8.33333ZM5.20833 
                    12.4998C5.20833 12.2236 5.31808 11.9586 5.51343 11.7633C5.70878 11.5679 5.97373 11.4582 6.25 11.4582H18.75C19.0263 11.4582 19.2912 11.5679 
                    19.4866 11.7633C19.6819 11.9586 19.7917 12.2236 19.7917 12.4998C19.7917 12.7761 19.6819 13.0411 19.4866 13.2364C19.2912 13.4318 19.0263 
                    13.5415 18.75 13.5415H6.25C5.97373 13.5415 5.70878 13.4318 5.51343 13.2364C5.31808 13.0411 5.20833 12.7761 5.20833 12.4998ZM3.125 16.6665C3.125 
                    16.3902 3.23475 16.1253 3.4301 15.9299C3.62545 15.7346 3.8904 15.6248 4.16667 15.6248H16.6667C16.9429 15.6248 17.2079 15.7346 17.4032 15.9299C17.5986 
                    16.1253 17.7083 16.3902 17.7083 16.6665C17.7083 16.9428 17.5986 17.2077 17.4032 17.4031C17.2079 17.5984 16.9429 17.7082 16.6667 17.7082H4.16667C3.8904 
                    17.7082 3.62545 17.5984 3.4301 17.4031C3.23475 17.2077 3.125 16.9428 3.125 16.6665Z"/>
                    </svg>
                </span>
                <span class="ml-[4px]">Clear All Filters</span>
            </div>
        </div>
    </div>
    <div class="p-[16px] gap-y-[20px] overflow-y-auto">
        <p v-if="pageRecords" class="text-black font-medium text-base">
            <span class="text-black/60">Displaying </span>
            {{ pageRecords.from }} - {{ pageRecords.to }}
            <span class="text-black/60">of</span>
            {{ pageRecords.total }}
            <span class="text-black/60">items</span>
        </p>

        <div
            v-if="groupedPages && groupedPages.length"
            class="mt-[16px] flex flex-col gap-y-[24px]"
        >
            <section
                v-for="group in groupedPages"
                :key="group.category"
                class="flex flex-col gap-y-[12px]"
            >
                <h2 class="text-xs font-semibold uppercase tracking-[0.08em] text-black/60">
                    {{ group.category || 'Uncategorized' }}
                </h2>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-[12px]">
                    <article
                        v-for="record in group.pages"
                        :key="record.id"
                        class="relative bg-white rounded-[12px] border border-gray/70 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div class="px-[16px] py-[12px] flex justify-between items-start gap-[8px]">
                            <div class="flex flex-col gap-[4px] min-w-0">
                                <div class="flex items-center gap-[8px]">
                                    <!-- Order number hidden as requested -->
                                    <p class="text-sm font-semibold text-black truncate" :title="record.name">
                                        {{ record.name }}
                                    </p>
                                </div>
                                <p v-if="record.slug" class="text-xs text-black/50 truncate" :title="record.slug">
                                    /{{ record.slug === 'homepage' ? '' : record.slug }}
                                </p>
                            </div>

                           <!-- Edit page button intentionally removed to prevent editing from Pages list -->
                           <div class="flex-shrink-0 flex items-center gap-[8px]"></div>
                        </div>

                        <div class="px-[16px] pb-[12px] pt-[4px] flex flex-col gap-[8px] border-t border-gray/60 bg-off-white/40">
                            <div class="flex items-center justify-between gap-[8px]">
                                <p class="text-xs font-medium text-black/60">
                                    Edit Modules
                                </p>
                                <div class="flex items-center gap-[6px]">
                                    <router-link
                                        :to="`/pages/metadata/${record.id}`"
                                        class="w-[28px] h-[24px] bg-ui-hover text-ui-color p-[4px] flex justify-center items-center font-medium rounded-[5px]"
                                        :title="`Edit metadata for ${record.name}`"
                                    >
                                        {{'</>'}}
                                    </router-link>
                                    <a
                                        :href="webUrl ? `${webUrl}${record.slug === '/' ? '' : record.slug}` : '/dashboard'"
                                        target="_blank"
                                        referrer="no-referrer"
                                        class="p-[4px] flex justify-start w-fit items-center bg-ui-hover rounded-[5px]"
                                        :title="`Open live page for ${record.name}`"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
                                            <g clip-path="url(#clip0_4486_48528)">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M18.9722 16.8824C17.6557 16.4445 16.2401 16.1173 14.7503 15.9055C14.9531 14.7141 15.0611 13.4656 15.0954 12.1875H20.5989C20.4758 13.9207 19.8935 15.5246 18.9722 16.8824ZM13.3609 20.8218C13.8188 19.7156 14.1934 18.5201 14.4815 17.2606C15.7176 17.4435 16.9029 17.7136 18.0256 18.0684C16.7853 19.3904 15.1752 20.3633 13.3609 20.8218ZM11.6676 21.0913C11.4462 21.1071 11.2255 21.125 11 21.125C10.7745 21.125 10.5545 21.1071 10.3324 21.0913C9.74738 19.8731 9.27369 18.5173 8.92307 17.0784C9.60644 17.0186 10.2987 16.9835 11 16.9835C11.7013 16.9835 12.3936 17.0186 13.0776 17.0784C12.7263 18.5173 12.2526 19.8731 11.6676 21.0913ZM3.97444 18.0684C5.09713 17.7136 6.28238 17.4435 7.5185 17.2606C7.80657 18.5201 8.18125 19.7156 8.63912 20.8218C6.82481 20.3633 5.21538 19.3904 3.97444 18.0684ZM3.02775 16.8824C2.1065 15.5246 1.52418 13.9207 1.40112 12.1875H6.90456C6.93894 13.4656 7.04687 14.7141 7.24969 15.9055C5.75987 16.1173 4.34432 16.4445 3.02775 16.8824ZM3.02775 6.11758C4.34432 6.55551 5.75987 6.88342 7.24969 7.09449C7.04687 8.28592 6.93894 9.53444 6.90456 10.8125H1.40112C1.52418 9.07931 2.1065 7.47539 3.02775 6.11758ZM8.63912 2.17817C8.18125 3.28436 7.80657 4.47992 7.5185 5.73942C6.28238 5.55723 5.09713 5.28636 3.97444 4.93161C5.21538 3.60955 6.82481 2.63674 8.63912 2.17817ZM10.3324 1.9087C10.5545 1.89357 10.7745 1.875 11 1.875C11.2255 1.875 11.4462 1.89357 11.6676 1.9087C12.2526 3.12695 12.7263 4.48337 13.0776 5.92162C12.3936 5.98143 11.7013 6.01649 11 6.01649C10.2987 6.01649 9.60644 5.98143 8.92307 5.92162C9.27369 4.48337 9.74738 3.12695 10.3324 1.9087ZM13.7184 12.1875C13.6812 13.3982 13.5712 14.5889 13.3643 15.7323C12.5902 15.6649 11.803 15.625 11 15.625C10.197 15.625 9.40981 15.6649 8.63637 15.7323C8.42875 14.5889 8.31875 13.3982 8.28231 12.1875H13.7184ZM8.28231 10.8125C8.31875 9.60181 8.42875 8.41106 8.63637 7.26775C9.40981 7.33512 10.197 7.375 11 7.375C11.803 7.375 12.5902 7.33512 13.3636 7.26775C13.5713 8.41106 13.6812 9.60181 13.7184 10.8125H8.28231ZM18.0256 4.93161C16.9029 5.28636 15.7176 5.55723 14.4815 5.73942C14.1934 4.47992 13.8188 3.28436 13.3609 2.17817C15.1752 2.63674 16.7853 3.60955 18.0256 4.93161ZM18.9722 6.11758C19.8935 7.47539 20.4758 9.07931 20.5989 10.8125H15.0954C15.0611 9.53444 14.9531 8.28592 14.7503 7.09449C16.2401 6.88342 17.6557 6.55551 18.9722 6.11758ZM11 0.5C4.92525 0.5 0 5.42456 0 11.5C0 17.5754 4.92525 22.5 11 22.5C17.0748 22.5 22 17.5754 22 11.5C22 5.42456 17.0748 0.5 11 0.5Z" fill="#283894"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_4486_48528">
                                                <rect width="22" height="22" fill="white" transform="translate(0 0.5)"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <div class="min-h-[40px]">
                                <template v-if="record.page_sections && record.page_sections.length > 0">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-[8px]">
                                        <button
                                            class="px-[12px] py-[6px] bg-ui-hover text-black text-xs font-medium rounded-[10px] flex justify-between items-center gap-x-[8px] text-left cursor-pointer hover:bg-ui-color hover:text-white transition-colors"
                                            v-for="module in record.page_sections" :key="`${record.id}-${module.id || module.name || Math.random()}`" 
                                            @click.stop.prevent="goToPage(record, module)"
                                            style="user-select: none;">
                                            <span class="flex items-center gap-x-[6px] overflow-hidden">
                                                <span class="w-[12px] h-[12.6px] shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                    <path d="M12.0032 1.0851L12.0032 1.08509C11.2922 0.338564 10.1358 0.338561 9.42478 1.08509L9.55096 1.20527L9.42478 1.08509L1.66647 9.23134C1.41323 9.49724 1.24149 9.8349 1.1717 10.2013L1.34344 10.234L1.1717 10.2013L0.849983 11.8903C0.675922 12.8041 1.44463 13.6381 2.34751 13.4485L3.95605 13.1107C4.30986 13.0364 4.63357 12.854 4.88689 12.588L12.6452 4.44179C13.3516 3.70009 13.3516 2.50092 12.6452 1.75921L12.0032 1.0851ZM11.6168 2.81432L11.6168 2.81434C11.7664 2.97145 11.7664 3.22955 11.6168 3.38667L11.6168 3.38668L10.2795 4.79084L9.10417 3.55674L10.4532 2.14022C10.4532 2.14021 10.4532 2.14021 10.4532 2.1402C10.5983 1.98791 10.8297 1.98792 10.9748 2.14022L11.6168 2.81432ZM2.31765 11.9235L2.59023 10.4925C2.6053 10.4134 2.64215 10.3418 2.6949 10.2864L2.56818 10.1658L2.6949 10.2864L8.08748 4.62422L9.26282 5.85833L3.85846 11.5329C3.80581 11.5882 3.73979 11.6248 3.66921 11.6397L3.6692 11.6397L2.31765 11.9235Z" fill="currentColor" stroke="currentColor" stroke-width="0.35"/>
                                                    </svg>
                                                </span>
                                                <span class="truncate">
                                                    {{ module.name || 'Unnamed Module' }}
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                </template>
                                <p v-else class="text-black/60 text-xs">
                                    No modules configured yet.
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    </div>
    
    <PopupDelete
        v-model:show="showDeletePopup"
        :deletePath="deletePath"
        @delete-success="fetchRecords()" />
</template>

<script setup>  
import { usePageTitleStore } from '~/stores/pageTitle';
import { useFilterStore } from '~/stores/filters';
import { useSidebarStore } from '~/stores/sidebar';
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import authenticator from '~/middleware/authenticator';
import { useAuthStore } from '~/stores/auth';

const router = useRouter();

const PopupDelete = defineAsyncComponent(() => {
    return import('~/components/popup/delete.vue')
})

    definePageMeta({
        name: 'pages',
        middleware: 'authenticator'
    })

    const pageTitle = usePageTitleStore();
    const filter = useFilterStore();
    const sidebar = useSidebarStore();
    const authStore = useAuthStore();

    
    onMounted(() => {
        pageTitle.reset();
        pageTitle.setTitle('Pages');
        pageTitle.setBreadcrumbs(['Pages']);

        fetchRecords();
    });

    
    const keyword = ref('');

    const onSubmit = () => {
        fetchRecords();
    }

    watch(keyword, () => {
        fetchRecords();
    })


    const nuxtApp = useNuxtApp()
    const runtimeConfig = useRuntimeConfig()
    const webUrl = computed(() => runtimeConfig.public.webURL || '')
    const records = ref(null);
    const pageRecords = ref(null);
    const activeMenuIndex = ref(null);
    const showDeletePopup = ref(false);
    const deletePath = ref('');

    const groupedPages = computed(() => {
        if (!pageRecords.value || !pageRecords.value.data) return [];

        const groups = {};

        pageRecords.value.data.forEach((page) => {
            // Show pages with modules; also show pages without modules except Search Results
            const hasSections = page.page_sections && Array.isArray(page.page_sections) && page.page_sections.length > 0;
            const isSearchResults = (page.name || '').trim().toLowerCase() === 'search results';
            if (!hasSections && isSearchResults) {
                return;
            }

            const categoryKey = page.category || 'Uncategorized';
            if (!groups[categoryKey]) {
                groups[categoryKey] = [];
            }
            groups[categoryKey].push(page);
        });

        // Only return categories that still have at least one page after filtering
        return Object.keys(groups)
            .filter((category) => groups[category].length > 0)
            .map((category) => ({
                category,
                pages: groups[category],
            }));
    });

    const normalizeName = (name) => name.replace(/^Page\s/, '').trim();

    /** True when the page is a parent section (top-level slug with no path segment), e.g. Homepage, Services. */
    const isParentPage = (record) => {
        const slug = record?.slug ?? '';
        if (!slug || slug === 'homepage') return true;
        return !slug.includes('/');
    };
    const permissions = computed(() => {
        try {
            if (!authStore.user?.role?.permissions) {
                console.warn('No permissions found in user role');
                return [];
            }
            const parsed = JSON.parse(authStore.user.role.permissions);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error('Error parsing permissions:', error);
            return [];
        }
    });

    const toggleMenu = index => {
        activeMenuIndex.value = activeMenuIndex.value === index ? null : index;
    };

    const openDeletePopup = url => {
        showDeletePopup.value = true;
        deletePath.value = url;
        activeMenuIndex.value = null;
    };

    const fetchRecords = async () => {
        try {
            const categories_response = await nuxtApp.$axios.get(`/cms/page-categories`); // Add your endpoint
            // Fetch all pages by using a large per_page value or fetching all pages
            // Use all=1 parameter like the sidebar does to get all pages without backend permission filtering
            const pages_response = await nuxtApp.$axios.get(`/cms/pages?all=1&page=1&per_page=1000&category=${filter.value}&keyword=${keyword.value}`);
            
            // Handle both paginated and non-paginated responses (like sidebar does)
            let allPages = [];
            if (pages_response.data.records) {
                // Check if it's paginated (has data property) or direct array
                allPages = Array.isArray(pages_response.data.records) 
                    ? pages_response.data.records 
                    : (pages_response.data.records.data || []);
            } else if (Array.isArray(pages_response.data)) {
                allPages = pages_response.data;
            }
            
            // Filter pages by user permissions before displaying
            const filteredPages = allPages.filter((page) => {
                // If page has a category, check permission for the category (parent page)
                if (page.category && page.category.trim() !== '') {
                    // Convert category name to permission unique format
                    // e.g., "Services" -> "pages-services"
                    // e.g., "Partnerships & Accreditations" -> "pages-partnerships-accreditations"
                    const categorySlug = page.category
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-') // Replace any non-alphanumeric chars with single dash
                        .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
                    const categoryUnique = `pages-${categorySlug}`;
                    
                    // Check if user has permission for this category
                    return permissions.value.some((perm) => perm.unique === categoryUnique);
                } else {
                    // For pages without category (parent pages), check exact match
                    const slugBase = page.slug || page.identifier || (page.name || '')
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                    const pageUnique = `pages-${slugBase}`;
                    
                    // Check if user has permission for this specific page
                    return permissions.value.some((perm) => perm.unique === pageUnique);
                }
            });
            
            // If we got a direct array, convert it to paginated format for compatibility
            if (Array.isArray(filteredPages) && filteredPages.length > 0) {
                pageRecords.value = {
                    data: filteredPages,
                    total: filteredPages.length,
                    from: 1,
                    to: filteredPages.length,
                    current_page: 1,
                    last_page: 1
                };
            } else {
                pageRecords.value = { data: [], total: 0, from: 0, to: 0, current_page: 1, last_page: 1 };
            }
            
            
            // Filter categories by permissions, but if no permissions exist, show all categories
            if (permissions.value.length === 0) {
                // If user has no permissions, show all categories (similar to sidebar behavior)
                records.value = categories_response.data.record.map((name) => name.category);
            } else {
                records.value = categories_response.data.record
                    .filter((categoryRecord) => {
                        // Convert category name to permission unique format
                        // e.g., "Partnerships & Accreditations" -> "pages-partnerships-accreditations"
                        const categorySlug = categoryRecord.category
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-') // Replace any non-alphanumeric chars with single dash
                            .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
                        const categoryUnique = `pages-${categorySlug}`;
                        
                        // Check if user has permission for this category
                        return permissions.value.some((perm) => perm.unique === categoryUnique);
                    })
                    .map((name) => name.category);
            }
            
            // records.value = categories_response.data.record.map((record) => record.category);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    
    watch(() => filter.value, (newPage) => {
        if(filter.value !== '') {

            fetchRecords(); // Call the API whenever the page changes
        } else {
            window.location.reload();
        }
    });

    const goToPage = (page, module) => {
        if (!module || !module.id) {
            console.error('Module or module.id is missing:', module);
            alert('Error: Module ID is missing. Please check the console.');
            return;
        }
        
        // Normalize page slug - handle special cases
        let pageSlug = page.slug || page.identifier;
        if (!pageSlug) {
            // Fallback: convert page name to slug
            pageSlug = (page.name || '').toLowerCase().replace(/ /g, '-');
        }
        
        // Ensure homepage uses 'homepage' slug
        if (page.name && page.name.toLowerCase() === 'homepage') {
            pageSlug = 'homepage';
        }
        
        // Check if page is under services category and use services route pattern
        // For pages under services that don't have their own folder structure,
        // use the generic services route: /pages/services/[sectionSlug]/[id]
        const isServicePage = page.category && page.category.toLowerCase() === 'services';
        
        // If the slug contains "services/" prefix, remove it and use services route
        if (pageSlug.startsWith('services/')) {
            pageSlug = 'services';
        } else if (isServicePage) {
            // Check if it's a service sub-page that should use the generic services route
            // These pages use /pages/services/[sectionSlug]/[id] pattern
            const serviceSubPages = ['downloadable-forms', 'digital-platforms', 'member-mobile-app', 'provider-search', 'beneficiary-enrollment'];
            if (serviceSubPages.includes(pageSlug)) {
                pageSlug = 'services';
            }
        }

        // Map API slugs to actual CMS route paths (fix 404s when API slug doesn't match file-based routes)
        const slugToRouteMap = {
            'products/voluntary-employee-benefit': 'products/voluntary-employee-benefit-program',
            'products/voluntary-employment-benefit': 'products/voluntary-employee-benefit-program',
            'products/individual-and-msmes': 'products/individual-insurance-plan',
            'products/group-products': 'products/group-insurance-plan',
            'about-inlife-benefits': 'about-us',
            'about-inlife-benefits/corporate-governance': 'about-us/corporate-governance',
            'partnerships-and-accreditation' : 'partnerships-accreditations',
            'partnerships-and-accreditation/hospital-accreditation' : 'partnerships-accreditations/hospital-accreditation',
            'partnerships-and-accreditation/clinic-accreditation' : 'partnerships-accreditations/clinic-accreditation',
            'partnerships-and-accreditation/doctor-accreditation' : 'partnerships-accreditations/doctor-accreditation',
            'about-inlife-benefits/sustainability' : 'about-us/sustainability',
            'about-inlife-benefits/corporate-governance/code-of-conduct' : 'about-us/corporate-governance/code-of-conduct',
            'about-inlife-benefits/corporate-governance/annual-corporate-governance-reports-acgr' : 'about-us/corporate-governance',
            'about-us/corporate-governance/annual-corporate-governance-reports' : 'about-us/corporate-governance',
            'about-inlife-benefits/careers' : 'about-us/careers',
            'resources/help-and-faqs' : 'resources/help-faq-center',


        };
        if (slugToRouteMap[pageSlug]) {
            pageSlug = slugToRouteMap[pageSlug];
        }
        
        // Normalize section slug - handle special characters and ensure proper formatting
        let sectionSlug = (module.name || '').toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^a-z0-9-]/g, '') // Remove special characters
            .replace(/-+/g, '-') // Replace multiple dashes with single dash
            .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
        
        // Handle edge cases for section names
        if (!sectionSlug) {
            sectionSlug = 'section';
        }

        // FAQs modules on specific section-based pages should use section-faqs route
        const isFaqsModule = (module.name || '').toLowerCase().trim() === 'faqs';
        const isSectionFaqsParentPage = ['privacy-policy/', 'partnerships-accreditations/doctor-accreditation', 'partnerships-accreditations/clinic-accreditation', 'partnerships-accreditations/hospital-accreditation']
            .some(prefix => (pageSlug || '').startsWith(prefix));
        const routePath = (isFaqsModule && isSectionFaqsParentPage)
            ? `/section-faqs/${module.id}`
            : `/pages/${pageSlug}/${sectionSlug}/${module.id}`;
        
        try {
            pageTitle.setTitle(`Edit ${module.name}`);
            pageTitle.setBreadcrumbs(['Pages', page.name, module.name]);
            sidebar.setActiveLink(page.name);

            pageTitle.setPageFrom('Pages');
            pageTitle.setPageFromRoute('/pages');

            router.push(routePath).then(() => {
                console.log('Navigation successful to:', routePath);
            }).catch(err => {
                alert(`Failed to navigate to ${module.name}.\nRoute: ${routePath}\nError: ${err.message}`);
            });
        } catch (error) {
            console.error('Error in goToPage:', error);
            alert(`Error navigating: ${error.message}`);
        }
    }

</script>