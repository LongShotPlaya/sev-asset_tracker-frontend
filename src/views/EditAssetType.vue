<script setup>
import CatServices from "../services/assetCatServices";
import TypeServices from "../services/assetTypeManagementServices";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  id: {
    required: false,
  },
});

const adding = computed(() => isNaN(parseInt(props.id)) || isNaN(new Number(props.id)));
const assetType = ref({
    name: null,
    categoryId: null,
    circulatable: false,
    identifierId: null,
    fields: [],
});
const typeLoading = ref(false);

const categories = ref([]);
const catsLoading = ref(false);

const identifierSelection = computed(() => assetType.value.fields.map(field => {
    return {
        title: field.label,
        value: field.id,
    };
}));
const fieldGrid = computed(() => {
    const grid = [false];

    

    return grid;
});

const retrieveAssetType = () => {
    if (adding.value)
    {
        console.log("New asset type!")
        return;
    }

    typeLoading.value = true;
    TypeServices.getFullAssetType(props.id)
    .then(response => {
        assetType.value = response.data;
        typeLoading.value = false;
        console.log(assetType.value)
    })
    .catch(err => {
        if (err.response.status === 404) console.log("No asset type found with id of " + props.id);
        else console.log("Error retrieving asset type!");
        typeLoading.value = false;
    });
};

const retrieveAssetCategories = () => {
    catsLoading.value = true;
    CatServices.getAllAssetCats()
    .then(response => {
        categories.value = response.data.map(cat => { return { title: cat.name, value: cat.id }; });
        catsLoading.value = false;
    })
    .catch(err => {
        console.log("Error retrieving asset categories!");
        catsLoading.value = false;
    });
};

retrieveAssetType();
retrieveAssetCategories();
</script>

<template>
    <v-container>
        <v-toolbar>
            <v-toolbar-title align="center">{{ adding ? "Create" : "Edit" }} Asset Type</v-toolbar-title>
        </v-toolbar>
        <br>
        <v-card>
            <v-card-title>Asset Type Information</v-card-title>
            <v-container>
                <v-row>
                    <v-col>
                        <v-text-field
                            :loading="typeLoading"
                            label="Name"
                            v-model="assetType.name"
                        />
                    </v-col>
                    <v-col>
                        <v-select
                            :loading="catsLoading || typeLoading"
                            label="Category"
                            v-model="assetType.categoryId"
                            :items="categories"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-select
                            :loading="typeLoading"
                            label="Identifier"
                            hint="The field which can uniquely identify assets of this type"
                            :items="identifierSelection"
                            v-model="assetType.identifierId"
                        />
                    </v-col>
                    <v-col>
                        <v-checkbox
                            :loading="typeLoading"
                            :label='`Assets belonging to "${assetType.name}" can be checked in and checked out`'
                            v-model="assetType.circulatable"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
        <br>
        <v-card>
            <v-card-title>Asset Type Fields</v-card-title>
            <v-card-text>
                This should be similar to what you would see if you were filling out information
                for an asset under "{{ assetType.name }}". It uses a grid system where you can
                have up to 8 columns, but as many rows as you like.
            </v-card-text>
            
            <v-container>
                <v-row v-for="field in assetType.fields" class="display-row">
                    <v-col>
                        <v-text-field
                            :label="field.label"
                            hint="This field is read-only, but is just to help you visualize what your type looks like."
                            prepend-icon="mdi-drag"
                            readonly
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-container>
</template>

<style>
    .display-row {
        border: 1px dashed rgba(0, 0, 0, 0.25);
    }
</style>