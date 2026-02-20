<template>
    <div class="relative flex flex-col justify-start p-[16px] mb-[32px] w-full h-full gap-y-[16px] overflow-y-auto bg-white">
        <Form id="form" @submit="submit()" class="w-full gap-[16px] flex flex-col">
            <h2 class="font-semibold text-xl text-start w-full">Metadata <span class="text-base font-normal text-black/40"></span></h2>
                <TextField
                    label="Meta Title"
                    name="meta_title"
                    v-model="formData.meta_title"
                    placeholder="Enter meta title"
                    :rules="'max:50'"
                    optionalMessage="Max 50 characters" />
            <div class="flex flex-col gap-[8px] relative">
                <label for="description" class="text-base font-medium text-black/70">Meta Description <span class="text-sm font-normal text-black/40">{{ `Maximum ${maxCharacters} characters` }}</span></label>
                <textarea
                id="description"
                v-model="description"
                name="meta_description"
                rows="5"
                cols="40"
                placeholder="Enter your description here..."
                class="outline-none border-[1px] border-gray rounded-[10px] p-[16px] text-base font-normal placeholder:text-black/40 focus:border-ui-color bg-white"
                > </textarea>
                <div class="absolute bottom-[32px] right-[32px] text-black/40 text-sm">
                    <span>{{ (formData.meta_description || '').length }} / {{ maxCharacters }}</span>
                </div>
            </div>
            <div class="flex flex-col gap-[8px]">
                <label for="link_rel" class="text-base font-medium text-black/70">Link Rel <span class="text-sm font-normal text-black/40">Relationship of this page to the linked URL</span></label>
                <select
                    id="link_rel"
                    name="link_rel"
                    v-model="formData.link_rel"
                    class="outline-none border-[1px] border-gray rounded-[10px] p-[16px] text-base font-normal text-black focus:border-ui-color bg-white w-full"
                >
                    <option
                        v-for="opt in linkRelOptions"
                        :key="opt.value"
                        :value="opt.value"
                    >
                        {{ opt.label }} — {{ opt.description }}
                    </option>
                </select>
            </div>
            <input type="hidden" name="parent_id" v-model="formData.parent_id" />

            <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px] absolute bottom-[16px] right-[16px]">Publish Update</button>
        </Form>
    </div>
</template>
<script setup>
    import { Form } from 'vee-validate';
    import { usePageTitleStore } from '~/stores/pageTitle';
    import { useSidebarStore } from '~/stores/sidebar';
    import { useRoute } from 'vue-router';
    import { onMounted } from 'vue';

    definePageMeta({
        name: 'metadata_id',
        middleware: 'authenticator'
    })

    const TextInput = defineAsyncComponent(() => {
        return import('@/components/form-fields/TextInput.vue')
    })

    const pageTitle = usePageTitleStore();
    const sidebar = useSidebarStore();
    const route = useRoute();

    const nuxtApp = useNuxtApp();

    const id = route.params.id;

    const formData = reactive({
        parent_id: '',
        meta_title: '',
        meta_description: '',
        link_rel: 'canonical',
    });
    // SEO best practice: meta description ~155–160 chars for full display in search results
    const maxCharacters = 160;

    const linkRelOptions = [
        { value: 'canonical', label: 'Canonical', description: 'Main version of this page for search engines' },
        { value: 'nofollow', label: 'No Follow', description: 'Ask search engines not to follow this link' },
        { value: 'noopener', label: 'No Opener', description: 'Opens the link more securely' },
        { value: 'noreferrer', label: 'No Referrer', description: "Don't tell the linked site where the visitor came from" },
        { value: 'noopener noreferrer', label: 'No Opener + No Referrer', description: 'Secure link that does not share where the visitor came from' },
    ];

    const description = ref('');
    // Watcher to ensure character limit is enforced
    watch(description, (newValue) => {
        if (newValue.length > maxCharacters) {
            formData.meta_description = newValue.slice(0, maxCharacters);
        } else {
            formData.meta_description = newValue;
        }
    });


    onMounted(() => {
        if (pageData.value) populateData(pageData.value);
        pageTitle.setTitle(pageData.value?.name ? `${pageData.value.name} Metadata` : 'Metadata');
        pageTitle.setBreadcrumbs(pageData.value?.name ? ['Pages', pageData.value.name + ' Metadata'] : ['Pages', 'Metadata']);

        pageTitle.setPageFrom('Pages');
        pageTitle.setPageFromRoute('/pages');
    })

    const populateData = (data) => {
        if (!data) return;
        formData.parent_id = data.metadata?.parent_id ?? '';
        formData.meta_title = data.metadata?.meta_title ?? '';
        formData.meta_description = data.metadata?.meta_description ? data.metadata.meta_description : '';
        description.value = data.metadata?.meta_description ? data.metadata.meta_description : '';
        const linkRel = (data.metadata?.link_rel || '').trim().toLowerCase();
        formData.link_rel = linkRel || 'canonical';
    }

    const submit = async () => {
        const formElement = document.getElementById('form');
        const form_data = new FormData(formElement);
        form_data.append('_method', 'PATCH'); 

        try {
            const response = await nuxtApp.$axios.post(`/cms/page/update/${id}`, form_data , {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response) => {
                pageData.value = response.data.record;
                nuxtApp.$toast.success('Page updated successfully!');
            }); 

        } catch (error) {
            console.error('Error:', error);
        }
    }

    const { data: pageData, error, status: isLoading } = useAsyncData(`page-${id}`, async () => {
        try {
            // Use Axios to make the GET request
            const res = await nuxtApp.$axios.get(`/cms/page/show/${id}`);

            // Axios automatically parses JSON, so we just need to return the record
            return res.data.record; // Assuming 'record' is the field you need
        } catch (err) {
            console.error('Error fetching section data:', err);
            throw new Error('Failed to fetch data');
        }
    })

    watch(pageData, (newData) => {
        if (newData) populateData(newData);
    })
</script>