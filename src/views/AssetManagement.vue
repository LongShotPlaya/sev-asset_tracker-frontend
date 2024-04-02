<script setup>
    import { ref, onMounted } from "vue";
    import { useRouter } from "vue-router";
    import Utils from "../config/utils.js";
    import assetServices from "../services/assetServices.js";

    const user = Utils.getStore("user");
    const router = useRouter();
    const message = ref("");
    const fullAsset = ref("");
    const mode = ref("");
    
    const props = defineProps({
      id: {
        required: true,
      },
    });

    const setMode = (id) => {    
        if (isNaN(id)){
            return mode == "add";
        } else {
            return mode == "edit";
        }
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

</template>

<style>

</style>