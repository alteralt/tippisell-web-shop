<template>
    <button :disabled="loading" type="button">
        <span v-if="loading === false">{{ text }}</span>
        <span v-else>{{ loadingText }}</span>
    </button>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{ text: string; loadingText: string; loading?: boolean }>(),
    { loading: false },
)
</script>
