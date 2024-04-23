<script setup>
import CatServices from "../services/assetCatServices";
import TypeServices from "../services/assetTypeManagementServices";
import { onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  id: {
    required: false,
  },
});

const assetType = ref({
    id: props.id ?? "add",
    name: null,
    categoryId: null,
    circulatable: false,
    identifierId: null,
    fields: [],
});
const adding = computed(() => isNaN(parseInt(assetType.value.id)) || isNaN(new Number(assetType.value.id)));
const typeLoading = ref(false);

const categories = ref([]);
const catsLoading = ref(false);

const identifierSelectionEnabled = ref(false);
const identifierSelection = computed(() => {
    const result = assetType.value.fields.map(field => {
        return {
            title: field.label,
            value: field.id ?? field.label,
            valid: !!field.label,
        };
    });

    identifierSelectionEnabled.value = result.length > 0;

    return identifierSelectionEnabled.value ? result : [{
        title: "There are no fields for this asset type!",
        value: null,
        valid: true,
    }];
});
const fieldsValid = computed(() => identifierSelection.value.every(selection => selection.valid));
const fieldGridCols = ref(0);
const fieldGridRef = ref([]);
const fieldGrid = computed(() => {
    const grid = [];
    fieldGridCols.value = 0;

    assetType.value.fields.forEach(field => {
        while (grid.length <= field.row)
        {
            const newRow = [];
            while (newRow.length <= field.column) newRow.push({ columnSpan: 1 });
            grid.push(newRow);
        }
        
        grid[field.row][field.column] = field;
        fieldGridCols.value = Math.max(fieldGridCols.value, grid[field.row].reduce((prev, curr) => prev += curr.columnSpan, 0));
    });
    
    grid.forEach(row => {
        let columns = row.reduce((prev, curr) => prev += curr.columnSpan, 0);
        while (columns != fieldGridCols.value)
        {
            if (columns < fieldGridCols.value)
            {
                row.push({ columnSpan: 1 });
                columns++;
            }
            else
            {
                columns -= row.pop().columnSpan ?? 1;
            }
        }
    });
    
    fieldGridRef.value = grid;
    return grid;
});

const assetTypeSaving = ref(false);
const validAssetType = computed(() => [
    !assetTypeSaving.value,
    assetType.value.categoryId != null,
    assetType.value.name != null,
    fieldsValid.value
].every(check => check));

const formerIdentifier = ref(null);

// In case we want to add functionality later where the user can rapid-fire add asset types (for some reason)
const keepAdding = ref(false);

const fieldIsIdentifier = (field) => {
    return (field.id ?? field.label ?? "") == assetType.value.identifierId;
};

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
    })
    .catch(err => {
        if (err?.response?.status == 404) router.push({ name: "home" });
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

const addField = () => {
    assetType.value.fields.push({
        id: null,
        label: null,
        required: false,
        row: fieldGridRef.value.length,
        rowSpan: 1,
        column: 0,
        columnSpan: 1,
        templateField: false,
    });
};

const removeField = (field) => {
    const location = assetType.value.fields.indexOf(field);
    if (field.id == assetType.value.identifierId || field.label == assetType.value.identifierId) assetType.value.identifierId = null;
    assetType.value.fields.splice(location, 1);

    // Seems redundant, but is necessary to make fieldGrid recalculate
    assetType.value = assetType.value;
};

const saveAssetType = async () => {
    console.log(assetType.value)

    assetTypeSaving.value = true;
    let error = false;

    if (adding.value)
    {
        // We need to create the type and ensure that its identifier is null since fields cannot be added
        // in a create call to the backend
        const resultingType = await TypeServices.createAssetType({ ...assetType.value, id: null, identifierId: null })
        .catch(err => {
            error = true;
            assetTypeSaving.value = false;
            console.log(err?.response?.data?.message ?? "Error creating asset type!");
        });
        
        if (error || !resultingType) return;
        
        const identifierTemp = assetType.value.identifierId;
        assetType.value = {
            ...assetType.value,
            ...resultingType.data,
            identifierId: identifierTemp,
        };
    }

    TypeServices.updateAssetType(assetType.value.id, assetType.value)
    .then(async response => {
        assetTypeSaving.value = false;
        await router.push({ name: "asset-type-edit", params: { id: assetType.value.id } });
        router.go(0);
    })
    .catch(err => {
        console.log(err?.response?.data?.message ?? "Error saving asset type!");
        assetTypeSaving.value = false;
    });
};

const refreshPage = () => {
    retrieveAssetType();
    retrieveAssetCategories();
};

const changeIdentifier = (newValue) => {
    if (!!formerIdentifier.value)
    {
        formerIdentifier.value.required = formerIdentifier.value?.oldValues?.required ?? formerIdentifier.value.required ?? false;
        formerIdentifier.value.templateField = formerIdentifier.value?.oldValues?.templateField ?? formerIdentifier.value.templateField ?? false;
    }

    const newField = assetType.value.fields.find(field => field.id == newValue || field.label == newValue);
    if (!newField || ((newValue ?? null) === null)) return;
    newField.oldValues = {
        required: newField.required,
        templateField: newField.templateField,
    };
    newField.required = true;
    newField.templateField = false;
    formerIdentifier.value = newField;
};

onMounted(() => {
    refreshPage();
})
</script>

<template>
    <v-container>
        <v-toolbar>
            <v-toolbar-title>{{ adding ? "Create" : "Edit" }} Asset Type</v-toolbar-title>
        </v-toolbar>
        <br>
        <v-card>
            <v-container>
                <v-row>
                    <v-col>
                        <v-card-title>Asset Type Information</v-card-title>
                    </v-col>
                    <v-col align="end" class="mr-4">
                        <v-btn
                            :loading="assetTypeSaving || typeLoading"
                            :disabled="!validAssetType"
                            color="primary"
                            size="large"
                            class="mr-4"
                            @click="saveAssetType"
                        >Save</v-btn>
                        <v-btn
                            color="secondary"
                            size="large"
                            @click="router.go(-1)"
                        >Cancel</v-btn>
                    </v-col>
                </v-row>
                <v-row class="ml-1 mr-1">
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
                <v-row class="ml-1 mr-1">
                    <v-col>
                        <v-select
                            :disabled="!identifierSelectionEnabled"
                            :loading="typeLoading"
                            label="Identifier"
                            hint="The field which can uniquely identify assets of this type"
                            :items="identifierSelection"
                            v-model="assetType.identifierId"
                            @update:modelValue="(oldValue, newValue) => changeIdentifier(oldValue, newValue)"
                            clearable
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
            <v-card-title class="ml-5 mr-5">Asset Type Fields</v-card-title>
            <v-card-text class="ml-5 mr-5">
                This should be similar to what you would see if you were filling out information
                for an asset under "{{ assetType.name }}". It uses a grid system where you can
                have up to 8 columns, but as many rows as you like.
            </v-card-text>
            
            <v-container class="ml-8 mr-8">
                <v-row class="mr-12" v-for="(row, rowIndex) in fieldGrid" :key=rowIndex justify="center">
                    <v-col v-for="(column, colIndex) in row"
                        :key="colIndex"
                        :cols="Math.round((fieldGridCols - column.columnSpan) / fieldGridCols * 12)"
                        class="display-col"
                    >
                        <br>
                        <v-row v-if="column.label !== undefined" align="baseline">
                            <v-text-field
                                label="Field Name"
                                prepend-icon="mdi-drag"
                                v-model="fieldGridRef[rowIndex][colIndex].label"
                            />
                            <br>
                            <v-btn
                                class="ma-2"
                                color="primary"
                                variant="outlined"
                                icon="mdi-trash-can"
                                @click="removeField(column)"
                            />
                        </v-row>
                        <!-- <v-checkbox
                            v-if="column.label !== undefined"
                            :disabled="fieldIsIdentifier(column)"
                            density="compact"
                            class="smaller-checkbox"
                            label="Field is required to be completed for every asset under this type"
                            v-model="fieldGridRef[rowIndex][colIndex].required"
                        /> -->
                        <v-radio-group
                            class="mt-2"
                            v-if="column.label !== undefined"
                            :disabled="fieldIsIdentifier(fieldGridRef[rowIndex][colIndex])"
                            v-model="fieldGridRef[rowIndex][colIndex].required"
                            density="compact"
                            inline
                        >
                            <v-radio class="mr-4" label="Required Field" :value="true" />
                            <v-radio label="Unrequired Field" :value="false" />
                        </v-radio-group>
                        <v-checkbox
                            v-if="column.label !== undefined"
                            :disabled="fieldIsIdentifier(fieldGridRef[rowIndex][colIndex])"
                            density="compact"
                            class="smaller-checkbox"
                            label="Field is able to be used in asset templates under this asset type"
                            v-model="fieldGridRef[rowIndex][colIndex].templateField"
                        />
                    </v-col>
                </v-row>
                <v-row justify="center">
                    <v-col align="center">
                        <v-btn
                            :disabled="!fieldsValid"
                            color="primary"
                            size="x-large"
                            @click="addField"
                        >
                            <v-icon
                                icon="mdi-plus-circle-outline"
                                color="secondary"
                                size="x-large"
                                start
                            />
                            Add Field
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-container>
</template>

<style>
    .display-col {
        border: 1px dashed rgba(0, 0, 0, 0.25);
    }

    .smaller-checkbox {
        height: 25%;
    }
</style>