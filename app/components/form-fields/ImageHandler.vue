<template>
  <label class="text-base font-medium text-white/70 flex gap-[8px] w-full items-center justify-start relative">
    {{ label }}
    <span class="text-sm font-normal text-white/40">{{ ` ${acceptedFormats}. Max ${size}MB` }}</span>
    <span v-if="dimension" class="text-sm font-normal text-white/40 absolute right-0">{{ `Recommended Image Dimension
      ${dimension.width}px (W) ${dimension.height}px (H) ` }}</span>
  </label>
  <div class="w-full mx-auto flex flex-col gap-[16px]">
    <!-- File Upload Section -->
    <div v-if="imageUrls.length < max" class="border-dashed border-2 rounded-[10px] p-6 text-center hover:border-ui-color hover:bg-ui-hover
        transition cursor-pointer p-[20px] min-h-[124px] h-auto flex justify-center items-center group duration-500"
      :class="{ 'border-danger': fileError, 'border-gray': fileError === '' }" @click="triggerFileInput"
      @drop.prevent="handleFileDrop" @dragover.prevent>
      <input ref="fileInput" type="file" class="hidden" :accept="acceptedFormats" :multiple="parseInt(max, 10) > 1" @change="handleFileChange" />
      <span class="w-[40px] h-[36px] mr-[16px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="40" viewBox="0 0 44 40" fill="none"
          class="opacity-20 group-hover:opacity-100 transition">
          <g>
            <path d="M21.9983 38.2092V21.8208M21.9983 21.8208L28.3716 28.1941M21.9983 21.8208L15.625 28.1941"
              stroke="#2A2A2A" stroke-width="2.73141" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M36.5666 30.2105C39.2865 29.1448 42.0294 26.7172 42.0294 21.8208C42.0294 14.5371 35.9597 12.7162 32.9247 12.7162C32.9247 9.07428 32.9247 1.79053 
              21.9991 1.79053C11.0734 1.79053 11.0734 9.07428 11.0734 12.7162C8.03854 12.7162 1.96875 14.5371 1.96875 21.8208C1.96875 26.7172 4.71159 29.1448 7.43156 
              30.2105" stroke="#2A2A2A" stroke-width="2.73141" stroke-linecap="round" stroke-linejoin="round" />
          </g>
        </svg>
      </span>
      <p class="text-white text-lg font-medium">
        Click or drag an image to upload <br />
        <span class="text-white/60 text-sm font-normal">
          {{ acceptedFormats.includes('pdf') ? `PDF. Maximum of ${size}MB.` : `JPG, PNG, WebP. Maximum of ${size}MB.` }}
        </span>
      </p>
    </div>
    <p v-if="fileError" class="text-danger text-base mt-1">{{ fileError }}</p>
    <div v-if="imageUrls.length" v-for="(url, index) in imageUrls" :key="index"
      class="relative px-[20px] py-[16px] bg-[#315a5c] rounded-[10px] flex gap-[16px] items-center justify-between">
      <div v-if="type === 'amenity_gallery'" class="flex gap-[8px] w-[384px]">
        <div class="w-[70px] h-[54px] aspect-ratio rounded-[5px] overflow-hidden">
          <img :src="url" class="w-full h-full object-cover" alt="Preview" />
        </div>
        <div class="flex flex-col items-start justify-between w-full">
          <p class="text-lg text-white font-medium">{{ fileNames[index] }}</p>
          <p class="text-sm font-normal text-white/40">{{ fileExtensions[index] }} / {{ fileSizes[index] }} </p>

        </div>
      </div>
      <div v-else class="w-1/2 xl:w-1/3 aspect-video rounded-[5px] overflow-hidden">
        <div v-if="isImage(url)" class="w-full h-full">
          <img :src="url" class="w-full h-full object-contain" alt="Preview" />
        </div>
        <div v-else class="pdf-preview">
          <!-- <span class="w-full h-full">📄</span> -->
          <span class="w-full h-full">
            <img src="/images/pdf-icon.png" class="mx-auto w-[60%]" />
          </span>

          <!-- <p class="file-name">{{ url.name }}</p> -->
        </div>
        <!-- <img :src="url" class="w-full h-full object-cover" alt="Preview" /> -->
      </div>
      <div v-if="showAlt && type === 'amenity_gallery'"
        class="flex flex-col gap-[8px] border-l-[1px] border-gray/50 pl-[16px] w-1/2 ">
        <label class="block text-base text-white/70 font-medium">Alt Text <span
            class="text-sm font-normal text-white/40">Max 200 characters</span></label>
        <TextField label="" :name="`${input_payload.alt}[${index}]`" v-model="altTexts[index]"
          placeholder="Enter alt text" :rules="'required|max:200'" />
        <!-- <input
              v-model="altTexts[index]"
              :name="`${input_payload.alt}[]`"
              type="text"
              maxlength="50"
              placeholder="Enter alt text"
              class="p-[16px] border border-gray rounded-[10px] w-full text-base outline-none focus:border-ui-color"
            /> -->
      </div>
      <div v-else class="flex flex-col items-start justify-between w-full">
        <p class="text-lg text-white font-medium">{{ fileNames[index] }}</p>
        <p class="text-sm font-normal text-white/40">{{ fileExtensions[index] }} / {{ fileSizes[index] }} </p>
        <div v-if="showAlt && isImage(url)" class="mt-[16px] flex flex-col gap-[8px] w-full">
          <label class="block text-base text-white/70 font-medium">Image Alt Text <span
              class="text-sm font-normal text-white/40">Max 200 characters</span></label>
          <TextField label="" :name="`${input_payload.alt}[${index}]`" v-model="altTexts[index]"
            placeholder="Enter alt text" :rules="'required|max:200'" />
        </div>
        
         <div v-if="fileAlt" class="mt-[16px] flex flex-col gap-[8px] w-full">
          <label class="block text-base text-white/70 font-medium">Filename Display <span
              class="text-sm font-normal text-white/40">Max 100 characters</span></label>
          <TextField
            label=""
            :name="`${input_payload.title}[${index}]`"
            v-model="altTexts[index]"
            placeholder="Enter title"
            :rules="'required|max:100'"
          />
        </div>
      </div>
      <div class="">
        <button type="button" @click="removeImage(index, isImage(url))" class="p-[10px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
            <path d="M11 11.5L6 6.5M6 6.5L1 1.5M6 6.5L11 1.5M6 6.5L1 11.5" stroke="#2A2A2A" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      <!-- <div class="absolute top-0 right-0 p-1">
          <button @click="removeImage" class="bg-white rounded-full p-1 shadow-md">
            ✕
          </button>
        </div> -->

      <input type="hidden" :name="`${input_payload.id}[]`" v-model="ids[index]">
      <!-- <input type="hidden" :name="`${input_payload.sequence}[]`" :value="index+1"> -->
      <input type="hidden" :name="`${input_payload.category}[]`" v-model="input_payload.category_value">
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'

const fileError = ref('');

const props = defineProps({
  // modelValue: String,
  label: String,
  max: String,
  size: String,
  acceptedFormats: {
    type: String,
    default: '.jpeg, .png, .webp, .svg'
  },
  input_payload: {
    type: Object,
    default: () => {
      return {
        identifier: 'image',
        file: 'image',
        id: '',
        category: 'image_category',
        category_value: 'image',
        alt: 'image_alt',
        title: 'image_title',
        sequence: 'image_sequence'
      }
    }
  },
  data: {
    type: Array,
    default: () => []
  },
  existing_images: {
    type: Array,
    default: () => []
  },
  dimension: {
    type: Object,
    default: () => { }
  },
  type: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  showAlt: {
    type: Boolean,
    default: true
  },
  fileAlt: {
    type: Boolean,
    default: false
  },
  modelValue: File || null
});

const nuxtApp = useNuxtApp();

const emit = defineEmits(['update:file']) // Emit event to send file to parent
defineExpose({
  validate,
});

const fileInput = ref(null)
const imageUrls = ref([])
const fileNames = ref([])
const fileSizes = ref([])
const fileExtensions = ref([])
const altTexts = ref([])
const selectedFiles = ref([])
const ids = ref([])

const localType = ref(props.type);

function validate() {
  if (props.data === null || (props.data && props.data.length === 0)) {
    if (props.required && !props.modelValue) {
      fileError.value = `${props.input_payload.identifier.replace(/_/g, ' ') // Replace dashes with spaces
        .replace(/\b\w/g, char => char.toUpperCase())} is required.`;
      return false;
    }
  }
  fileError.value = '';
  return true;
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const files = event.target.files
  if (files.length) {
    Array.from(files).forEach((file) => {
      // Ensure the file is within the size limit (5MB)
      if (file.size / 1024 / 1024 > props.size) {
        // alert('File size exceeds 5MB')

        nuxtApp.$toast.error(`File size exceeds ${props.size}MB`);
        return
      }

      fileNames.value.push(file.name)

      selectedFiles.value.push(file)
      fileSizes.value.push(`${Math.round(file.size / 1024)} KB`) // Size in KB

      // Extract file extension
      const extension = file.name.split('.').pop().toLowerCase()
      fileExtensions.value.push(extension)

      // Create a preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        imageUrls.value.push(e.target.result)
      }
      reader.readAsDataURL(file)
    })
    console.log(altTexts)

    emit('update:file', selectedFiles.value)
  }
}

const handleFileDrop = (event) => {
  const files = event.dataTransfer.files
  handleFileChange({ target: { files } })
}

const removeImage = async (index, isImage) => {
  const image = ids.value[index];

  // If the image is from the database, confirm and delete via API
  if (image) {
    const confirmed = window.confirm('Are you sure you want to delete this image? This action cannot be undone.');
    if (!confirmed) {
      return;
    }
    try {

      if (isImage) {
        await nuxtApp.$axios.delete(`/cms/extra/delete-image/${image}`);
      }
      else {
        await nuxtApp.$axios.delete(`/cms/extra/delete-file/${image}`);
      }


      nuxtApp.$toast.success('Deleted successfully!');
    } catch (error) {
      nuxtApp.$toast.error('Failed to delete image');
      console.error('Error removing image from the database:', error);
      return;
    }
  }

  // Remove locally (for both existing and newly added images)
  imageUrls.value.splice(index, 1);
  fileNames.value.splice(index, 1);
  selectedFiles.value.splice(index, 1);
  fileSizes.value.splice(index, 1);
  altTexts.value.splice(index, 1);
  fileExtensions.value.splice(index, 1);
  ids.value.splice(index, 1);
  emit('update:file', selectedFiles.value);
};

const isImage = (file) => /image\/|\.jpg$|\.png$|\.jpeg$|\.webp$|\.svg$/.test(file);

onMounted(() => {
  const images = (props.data && props.data.length ? props.data : props.existing_images)
  if (images && images.length) {
    imageUrls.value = []
    fileNames.value = []
    fileSizes.value = []
    fileExtensions.value = []
    altTexts.value = []
    ids.value = []
    images.forEach((image) => {
      imageUrls.value.push(image.path)
      fileNames.value.push(image.name)
      // For file uploads with custom title, prefer the 'title' field over 'alt'
      if (props.fileAlt) {
        altTexts.value.push(image.title)
      } else {
        altTexts.value.push(image.alt)
      }
      fileSizes.value.push(image.size)
      const extension = image.name.split('.').pop().toLowerCase()
      fileExtensions.value.push(extension)
      ids.value.push(image.id)
    })
  }
});

const populateFromImages = (images) => {
  if (images && images.length) {
    imageUrls.value = []
    fileNames.value = []
    fileSizes.value = []
    fileExtensions.value = []
    altTexts.value = []
    ids.value = []
    images.forEach((image) => {
      imageUrls.value.push(image.path)
      fileNames.value.push(image.name)
      if (props.fileAlt) {
        altTexts.value.push(image.title)
      } else {
        altTexts.value.push(image.alt)
      }
      fileSizes.value.push(image.size)
      const extension = image.name.split('.').pop().toLowerCase()
      fileExtensions.value.push(extension)
      ids.value.push(image.id)
    })
  }
}

watch(() => props.data, (newVal) => {
  populateFromImages(newVal)
});

watch(() => props.existing_images, (newVal) => {
  populateFromImages(newVal)
});
</script>