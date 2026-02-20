<template>
    <div class="p-4">Redirecting...</div>
</template>

<script setup>
definePageMeta({
    middleware: 'authenticator'
})

// Redirect to default type when hitting /taxonomies/global
onMounted(() => {
    navigateTo('/taxonomies/global/agent_position', { replace: true });
});
</script>
