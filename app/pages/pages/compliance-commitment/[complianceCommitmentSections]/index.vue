<template>
    <div class="w-full h-full">
        <NuxtPage />
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'authenticator'
})
</script>

