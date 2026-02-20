<template>
    <div></div>
</template>

<script setup>
definePageMeta({
    middleware: 'authenticator'
})

// Redirect to pages list if someone accesses this route directly
// The actual page should be accessed via /pages/partnerships-accreditations/request-for-proposal/section-name/section-id
onMounted(() => {
    navigateTo('/pages')
})
</script>
