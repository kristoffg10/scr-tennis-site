<template>
    <label
        class="text-base font-medium text-black/70 flex gap-[8px] w-full items-center justify-start relative">
        {{ label }}
        <span class="text-sm font-normal text-black/40">{{
            `PDF. Max ${size}MB`
        }}</span>
    </label>
    <div class="w-full mx-auto flex flex-col gap-[16px]">
        <!-- File Upload Section -->
        <div
            v-if="pdfFiles.length < max"
            class="border-dashed border-2 rounded-[10px] p-6 text-center hover:border-ui-color hover:bg-ui-hover transition cursor-pointer p-[20px] min-h-[124px] h-auto flex justify-center items-center group duration-500"
            :class="{
                'border-danger': fileError,
                'border-gray': fileError === '',
            }"
            @click="triggerFileInput"
            @drop.prevent="handleFileDrop"
            @dragover.prevent>
            <input
                ref="fileInput"
                type="file"
                class="hidden"
                accept="application/pdf,.pdf"
                @change="handleFileChange" />
            <span class="w-[40px] h-[36px] mr-[16px]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="44"
                    height="40"
                    viewBox="0 0 44 40"
                    fill="none"
                    class="opacity-20 group-hover:opacity-100 transition">
                    <g>
                        <path
                            d="M21.9983 38.2092V21.8208M21.9983 21.8208L28.3716 28.1941M21.9983 21.8208L15.625 28.1941"
                            stroke="#2A2A2A"
                            stroke-width="2.73141"
                            stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path
                            d="M36.5666 30.2105C39.2865 29.1448 42.0294 26.7172 42.0294 21.8208C42.0294 14.5371 35.9597 12.7162 32.9247 12.7162C32.9247 9.07428 32.9247 1.79053 
              21.9991 1.79053C11.0734 1.79053 11.0734 9.07428 11.0734 12.7162C8.03854 12.7162 1.96875 14.5371 1.96875 21.8208C1.96875 26.7172 4.71159 29.1448 7.43156 
              30.2105"
                            stroke="#2A2A2A"
                            stroke-width="2.73141"
                            stroke-linecap="round"
                            stroke-linejoin="round" />
                    </g>
                </svg>
            </span>
            <p class="text-black text-lg font-medium">
                Click or drag a PDF to upload <br />
                <span class="text-black/60 text-sm font-normal">
                    PDF files only. Maximum of {{ size }}MB.
                </span>
            </p>
        </div>
        <p
            v-if="fileError"
            class="text-danger text-base mt-1">
            {{ fileError }}
        </p>

        <!-- PDF File Display -->
        <div
            v-if="pdfFiles.length"
            v-for="(file, index) in pdfFiles"
            :key="index"
            class="relative px-[20px] py-[16px] bg-cream rounded-[10px] flex gap-[16px] items-center justify-between">
            <div class="flex gap-[16px] items-center w-full">
                <!-- PDF Icon -->
                <div
                    class="w-[70px] h-[54px] bg-red-100 rounded-[5px] flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#dc2626"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path
                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line
                            x1="16"
                            y1="13"
                            x2="8"
                            y2="13" />
                        <line
                            x1="16"
                            y1="17"
                            x2="8"
                            y2="17" />
                        <polyline points="10,9 9,9 8,9" />
                    </svg>
                </div>

                <!-- File Info -->
                <div class="flex flex-col items-start justify-between w-full">
                    <p class="text-lg text-black font-medium">
                        {{ file.name }}
                    </p>
                    <p class="text-sm font-normal text-black/40">
                        PDF / {{ file.size }}
                    </p>
                </div>
            </div>

            <!-- Remove Button -->
            <div class="">
                <button
                    type="button"
                    @click="removeFile(index)"
                    class="p-[10px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                        fill="none">
                        <path
                            d="M11 11.5L6 6.5M6 6.5L1 1.5M6 6.5L11 1.5M6 6.5L1 11.5"
                            stroke="#2A2A2A"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
            </div>

            <!-- Hidden Inputs -->
            <input
                type="hidden"
                :name="`${input_payload.id}[]`"
                v-model="ids[index]" />
            <input
                type="hidden"
                :name="`${input_payload.category}[]`"
                v-model="input_payload.category_value" />
        </div>
    </div>

    <PopupPdf
        v-model:show="showDeletePopup"
        :deletePath="deletePath"
        :form_data="form_data"
        @delete-success="removeArray(index)" />
</template>

<script setup>
const fileError = ref('');

const props = defineProps({
    label: String,
    max: {
        type: String,
        default: '1',
    },
    size: {
        type: String,
        default: '5',
    },
    input_payload: {
        type: Object,
        default: () => {
            return {
                identifier: 'file',
                file: 'file',
                id: 'file_id',
                category: 'file_category',
                category_value: 'file',
            };
        },
    },
    data: {
        type: Object,
        default: null,
    },
    required: {
        type: Boolean,
        default: false,
    },
    modelValue: File || null,
});

const nuxtApp = useNuxtApp();

const emit = defineEmits(['update:file']);
defineExpose({
    validate,
});

const fileInput = ref(null);
const pdfFiles = ref([]);
const selectedFiles = ref([]);
const ids = ref([]);
const parentIds = ref([]);

function validate() {
    if (props.data === null || (props.data && props.data.length === 0)) {
        if (props.required && !props.modelValue) {
            fileError.value = `${props.input_payload.identifier
                .replace(/_/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase())} is required.`;
            return false;
        }
    }
    fileError.value = '';
    return true;
}

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileChange = event => {
    const files = event.target.files;
    if (files.length) {
        Array.from(files).forEach(file => {
            if (file.type !== 'application/pdf') {
                nuxtApp.$toast.error('Only PDF files are allowed');
                return;
            }

            if (file.size / 1024 / 1024 > props.size) {
                nuxtApp.$toast.error(`File size exceeds ${props.size}MB`);
                return;
            }

            pdfFiles.value.push({
                name: file.name,
                size: `${Math.round(file.size / 1024)} KB`,
            });

            selectedFiles.value.push(file);
        });

        emit('update:file', selectedFiles.value);
    }
};

const handleFileDrop = event => {
    const files = event.dataTransfer.files;
    handleFileChange({ target: { files } });
};

const showDeletePopup = ref(false);
const deletePath = ref('');
const activeMenuIndex = ref(null);
const form_data = ref(null);

const openDeletePopup = (url, fileId, parentId = null) => {
    showDeletePopup.value = true;
    deletePath.value = url;
    activeMenuIndex.value = null;
    form_data.value = {
        id: fileId,
        parent_id: parentId
    }
};

const removeFile = async index => {
    const fileId = ids.value[index];
    const parentId = parentIds.value[index];

    if (fileId) {
        try {
            openDeletePopup(`/cms/delete-pdf`, fileId, parentId);
        } catch (error) {
            console.error('Error removing file from the database:', error);
        }
    } else {
        pdfFiles.value.splice(index, 1);
        selectedFiles.value.splice(index, 1);
        ids.value.splice(index, 1);
        parentIds.value.splice(index, 1);
        emit('update:file', selectedFiles.value);
    }
};

const removeArray = index => {
    pdfFiles.value.splice(index, 1);
    selectedFiles.value.splice(index, 1);
    ids.value.splice(index, 1);
    parentIds.value.splice(index, 1);
    emit('update:file', selectedFiles.value);
};

onMounted(() => {
    if (props.data) {
        pdfFiles.value = [];
        ids.value = [];
        parentIds.value = [];
        props.data.forEach(file => {
            pdfFiles.value.push({
                name: file.name,
                size: file.size,
            });
            ids.value.push(file.id);
            parentIds.value.push(file.parent_id);
        });
    }
});

watch(
    () => props.data,
    newVal => {
        if (newVal) {
            pdfFiles.value = [];
            ids.value = [];
            parentIds.value = [];
            newVal.forEach(file => {
                pdfFiles.value.push({
                    name: file.name,
                    size: file.size,
                });
                ids.value.push(file.id);
                parentIds.value.push(file.parent_id);
            });
        }
    }
);
</script>

