<template></template>
<script setup>
    definePageMeta({
        middleware: 'authenticator'
    })

    // Redirect to main pages list - filtering is handled there
    const route = useRoute();
    const sidebar = useSidebarStore();
    
    onMounted(() => {
        // Set active link so the filter works correctly
        sidebar.setActiveLink('Homepage');
        
        // Only redirect if we're not already on /pages
        if (route.path !== '/pages') {
            navigateTo('/pages');
        }
    });
</script>