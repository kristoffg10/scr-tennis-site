<template>
    <div>
        <div v-if="label" class="flex gap-[8px] items-end mb-[8px]">
            <p
                :class="[
                    { 'text-[#F12222]': hasError },
                    'text-white opacity-70',
                ]">
                {{ label }}
            </p>
            <p
                v-if="optionalMessage"
                class="text-white text-[14px] opacity-40">
                {{ optionalMessage }}
            </p>
        </div>
        <Field
            :name="name"
            :rules="rules"
            as="select"
            v-bind="fieldProps"
            :value="modelValue"
            @input="updateValue"
            @change="updateValue"
            :validate-on-blur="true"
            class="w-full p-[16px] border rounded-[10px] mb-[8px] bg-white outline-none focus:border-ui-color text-[#2a2a2a]"
            :class="{
                'border-danger': hasError,
                'border-[#2A2A2A]/20': !hasError,
            }" >
            <option
                v-if="placeholder"
                value=""
                disabled
                selected>
                {{ placeholder }}
            </option>
            <option
                v-for="option in options"
                :key="option.value"
                :value="option.value">
                {{ option.label }}
            </option>
        </Field>
        <ErrorMessage
            :name="name"
            class="text-[#F12222] font-[500]" />
    </div>
</template>

<script setup>
import { Field, ErrorMessage, useField } from 'vee-validate';
import { defineProps, computed, defineEmits } from 'vue';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    label: {
        type: String,
        required: false,
        default: '',
    },
    name: {
        type: String,
        required: true,
    },
    placeholder: {
        type: String,
        default: '',
    },
    rules: {
        type: String,
        default: 'required',
    },
    optionalMessage: {
        type: String,
        default: '',
    },
    options: {
        type: Array,
        required: true,
        validator: value => {
            return value.every(
                option =>
                    typeof option === 'object' &&
                    'value' in option &&
                    'label' in option
            );
        },
    },
    fieldProps: {
        type: Object,
        default: () => ({}),
    },
    modelValue: {
        type: String,
        default: '',
    }, 
     hasErrors: {
        type: Object,
        default: {}
    }
});
const hasError = ref(false)
watch(() => props.hasErrors, (newErrors) => {
    // console.log(newErrors)
    hasError.value = newErrors && newErrors[props.name];
})

const updateValue = (event) => {
    emit('update:modelValue', event.target.value);
}
</script>
