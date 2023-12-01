<template>
    <button :disabled="loading" type="button">
        <span v-if="loading === false">{{ text }}</span>
        <span v-else>{{ loadingText }}</span>
    </button>
</template>

<script>
export default {
    props: {
        loading: {
            type: Boolean,
            required: false,
            default: false,
        },
        text: {
            type: String,
            required: true,
        },
        loadingText: {
            type: String,
            required: true,
        },
    },
}
</script>
