<script setup>
import TypeServices from "../services/assetTypeManagementServices";
import TemplateServices from "../services/assetTemplateServices";
import { onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  id: {
    required: false,
  },
});

const template = ref({
    id: props.id ?? "add",
    name: null,
    categoryId: null,
    circulatable: false,
    identifierId: null,
    fields: [],
});
const adding = computed(() => isNaN(parseInt(template.value.id)) || isNaN(new Number(template.value.id)));
const templateLoading = ref(false);

const types = ref([]);
const typesLoading = ref(false);

const retrieveAssetTemplate = () => {
    if (adding.value)
    {
        console.log("Adding asset template!");
        return;
    }

    templateLoading.value = true;
    TemplateServices.getAssetTemplate(id)
    .then(response => {
        template.value = response.data;
        templateLoading.value = false;
    })
    .catch(err => {
        console.log(err?.data?.response?.message ?? "Error loading asset template");
        templateLoading.value = false;
    })
};

const retrieveAssetTypes = () => {
    typesLoading.value = true;
    TypeServices.getAllAssetTypes()
    .then(response => {
        types.value = response.data.map(type => {
            return {
                title: type.name,
                value: type.id,
            };
        });
        typesLoading.value = false;
    })
    .catch(err => {
        console.log(err?.data?.response?.message ?? "Error loading asset types");
        typesLoading.value = true;
    });
};

retrieveAssetTypes();
retrieveAssetTemplate();
</script>

<template>
    
</template>

<style scoped>
</style>