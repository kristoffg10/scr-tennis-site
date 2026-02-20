<template>
    <div class="relative bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
        <h2 class="font-semibold text-xl text-start w-full">Metadata <span class="text-base font-normal text-black/40">Optional</span></h2>
        <TextField
            v-model="props.meta_title"
            name="meta_title"
            label="Meta Title"
            max="50"
            :rules="'max:50'"
            placeholder="Enter meta title"
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
                <span>{{ description.length }} / {{ maxCharacters }}</span>
            </div>
        </div>
        <div class="flex flex-col gap-[8px]">
            <label for="link_rel" class="text-base font-medium text-black/70">Link Rel <span class="text-sm font-normal text-black/40">Relationship of this page to the linked URL</span></label>
            <select
                id="link_rel"
                name="link_rel"
                :value="props.link_rel"
                @input="$emit('update:link_rel', ($event.target).value)"
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
    </div>
</template>

<script setup>
    const props = defineProps({
        meta_title: {
            type: String,
            default: ''
        },
        meta_description: {
            type: String,
            default: ''
        },
        link_rel: {
            type: String,
            default: 'canonical'
        }
    })

    defineEmits(['update:meta_title', 'update:meta_description', 'update:link_rel'])

    onMounted(() => {
        if (props.meta_description) {
            description.value = props.meta_description
        }
    })
    // SEO best practice: meta description ~155–160 chars for full display in search results
    const maxCharacters = 160;

    const linkRelOptions = [
        { value: 'canonical', label: 'Canonical', description: 'This page will show up in search engines' },
        { value: 'nofollow', label: 'No Follow', description: 'This page will not be indexed by search engines' },
        { value: 'noopener', label: 'No Opener', description: 'When navigating to this page, the link will be opened in a new tab more securely' },
        { value: 'noreferrer', label: 'No Referrer', description: "When navigating to this page, the linked site will not be tracked/shared where the visitor came from" },
        { value: 'noopener noreferrer', label: 'No Opener + No Referrer', description: 'Navigate to the link securley and without tracking where the visitor came from' },
    ];

    const description = ref('');
    // Watcher to ensure character limit is enforced
    watch(description, (newValue) => {
        if (newValue.length > maxCharacters) {
            description.value = newValue.slice(0, maxCharacters);
        } else {
            description.value = newValue;
        }
    });
</script>