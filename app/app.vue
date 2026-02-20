<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
<script setup>
    const { $nonce } = useNuxtApp(); // Access the nonce from the plugin
    useHead({
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/inlife-favicon.ico' },
            { rel: 'shortcut icon', type: 'image/x-icon', href: '/inlife-favicon.ico' },
        ],
        script: [
            {
            innerHTML: 'console.log("Secure inline script with nonce");',
            type: 'text/javascript',
            nonce: $nonce, // Dynamically inject the nonce
            },
        ],
        __dangerouslyDisableSanitizersByTagID: {
            'nonce-script': ['innerHTML'], // Prevent sanitization of the script content
        },
    });
</script>
<style>
    .layout-enter-active,
    .layout-leave-active {
    transition: all 0.4s;
    }
    .layout-enter-from,
    .layout-leave-to {
    filter: grayscale(1);
    }
</style>