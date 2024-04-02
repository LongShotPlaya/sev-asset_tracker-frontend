<script setup>
    import { ref, onMounted, computed } from "vue";
    import { useRouter } from "vue-router";
    import Utils from "../config/utils.js";
    import assetServices from "../services/assetServices.js";

    const user = Utils.getStore("user");
    const router = useRouter();
    const message = ref("");
    const fullAsset = ref("");
    const assetId = ref(null);
    const mode = computed(() => assetId.value ? 'edit' : 'add');
    
    const props = defineProps({
      id: {
        required: true,
      },
    });

    const setMode = (id) => {
        assetId.value = id; // Set assetId based on the provided ID
    };

    const getFullAssetDetails = (id) => {
        assetServices.getFullAsset(id)
        .then(response => {
            fullAsset.value = response.data;
            console.log("Full Asset Details: ", fullAsset);
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    onMounted(() => {
        user.value = Utils.getStore("User");
        const id = props.id;
        getFullAssetDetails(id);
        setMode(id);
    })
</script>

<template>
    <v-toolbar>
        <v-toolbar-title>Welcome</v-toolbar-title>
    </v-toolbar>

    <div>
        <h1>{{ mode === 'edit' ? 'Edit Asset' : 'Add Asset' }}</h1>
        <!-- Your asset details form goes here -->
    </div>

</template>

<style>

</style>