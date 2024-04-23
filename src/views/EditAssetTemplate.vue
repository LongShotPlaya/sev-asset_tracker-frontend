<script setup>
import TypeServices from "../services/assetTypeManagementServices";
import TemplateServices from "../services/assetTemplateServices";
import { computed, ref } from "vue";
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
    assetTypeId: null,
    assetType: {
        fields: [],
    },
});
const adding = computed(() => isNaN(parseInt(template.value.id)) || isNaN(new Number(template.value.id)));
const templateLoading = ref(false);

const types = ref([]);
const typesLoading = ref(false);

const type = ref(null);
const typeLoading = ref(false);

const fieldGridCols = ref(0);
const fieldGridRef = ref([]);
const fieldGrid = computed(() => {
    const grid = [];
    fieldGridCols.value = 0;

    type.value?.fields.forEach(field => {
        if (field.templateField)
        {
            const templateDataField = template.value.assetType.fields.find(templateField => templateField.id == field.id);
            templateDataField.templateData ??= { value: null };
            field.templateData = templateDataField.templateData;
        }

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

const retrieveAssetTemplate = () => {
    if (adding.value)
    {
        console.log("Adding asset template!");
        return;
    }

    templateLoading.value = true;
    TemplateServices.getFullAssetTemplate(template.value.id)
    .then(response => {
        template.value = response.data;
        changeType();
        templateLoading.value = false;
    })
    .catch(err => {
        if (err?.response?.status == 404) router.push({ name: "home" });
        console.log(err?.data?.response?.message ?? "Error loading asset template");
        templateLoading.value = false;
    })
};

const retrieveAssetTypes = () => {
    typesLoading.value = true;
    types.value = [{ title: "No asset type selected!", value: null }];
    
    TypeServices.getAllAssetTypes()
    .then(response => {
        types.value = response.data.map(type => {
            return {
                title: type.name,
                value: type.id,
            };
        })
        .sort((a, b) => a.title > b.title ? 1 : a.title < b.title ? -1 : 0);
        typesLoading.value = false;
    })
    .catch(err => {
        console.log(err?.data?.response?.message ?? "Error loading asset types");
        typesLoading.value = true;
    });
};

const saveTemplate = async () => {
    let error = false;

    templateLoading.value = true;
    if (adding.value)
    {
        // We need to create the type and ensure that its identifier is null since fields cannot be added
        // in a create call to the backend
        const resultingTemplate = await TemplateServices.createAssetTemplate({ ...template.value, id: null })
        .catch(err => {
            error = true;
            templateLoading.value = false;
            console.log(err?.response?.data?.message ?? "Error creating asset type!");
        });
        
        if (error || !resultingTemplate) return;

        template.value = {
            ...template.value,
            ...resultingTemplate.data,
        };
    }

    TemplateServices.updateAssetTemplate(template.value.id, template.value)
    .then(response => {
        retrieveAssetTemplate(template.value.id);
    })
    .catch(err => {
        console.log(err?.response?.data?.message ?? "Error saving asset type!");
        retrieveAssetTemplate(template.value.id);
    });
};

const cancelChanges = () => {
    router.go(-1);
};

const changeType = () => {
    if (!template.value.assetTypeId) return;

    typeLoading.value = true;
    TypeServices.getFullAssetType(template.value.assetTypeId)
    .then(response => {
        type.value = response.data;
        template.value.assetType.fields = template.value.assetType.fields.filter(field => !!type.value.fields.find(typeField => typeField.id == field.id && typeField.templateField));
        type.value.fields.forEach(field => {
            if (!field.templateField) return;

            if (!template.value.assetType.fields.find(templateField => field.id == templateField.id))
                template.value.assetType.fields.push(field);
        });
        typeLoading.value = false;
    })
    .catch(err => {
        console.log(err?.data?.response?.message ?? "Error loading asset template");
        typeLoading.value = false;
    });
};

retrieveAssetTypes();
retrieveAssetTemplate();
</script>

<template>
    <v-container>
        <v-toolbar>
            <v-toolbar-title>{{ adding ? 'Add' : 'Edit' }} Asset Template</v-toolbar-title>
        </v-toolbar>
        <br>
        <v-card :loading="typeLoading || templateLoading">
            <v-container>
                <v-row>
                    <v-card-title>Asset Template Info</v-card-title>
                </v-row>
                <v-row>
                    <v-col>
                        <v-combobox
                            label="Asset Type"
                            v-model="template.assetTypeId"
                            :loading="typesLoading || templateLoading"
                            :items="types"
                            :readonly="!adding"
                            auto-select-first
                            :hint="!adding ? 'Cannot be changed once template is created!' : ''"
                            :return-object="false"
                            @update:modelValue="changeType"
                        />
                    </v-col>
                    <v-col>
                        <v-text-field
                            label="Template Name"
                            v-model="template.name"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-card-title>Asset Template Fields</v-card-title>
                </v-row>
                <v-row>
                    <v-card-text>
                        This should be similar to what you would see if you were filling out information
                        for an asset under the template "{{ template.name }}". It uses a grid system where
                        you can have up to 8 columns, but as many rows as you like.
                    </v-card-text>
                </v-row>
                <v-row>
                    <v-container class="ma-3">
                        <v-row v-for="(row, rowIndex) in fieldGrid" :key=rowIndex justify="center">
                            <v-col v-for="(column, colIndex) in row"
                                :key="colIndex"
                                :cols="Math.round((fieldGridCols - column.columnSpan) / fieldGridCols * 12)"
                            >
                                <br>
                                <v-row v-if="column.label !== undefined" align="baseline">
                                    <v-text-field
                                        v-if="fieldGridRef[rowIndex][colIndex].templateField"
                                        :label="fieldGridRef[rowIndex][colIndex].label"
                                        v-model="fieldGridRef[rowIndex][colIndex].templateData.value"
                                        clearable
                                    />
                                    <v-text-field
                                        v-else
                                        :label="fieldGridRef[rowIndex][colIndex].label"
                                        disabled
                                    />
                                </v-row>
                            </v-col>
                        </v-row>
                        <br><br>
                        <v-row justify="center">
                            <v-col align="end">
                                <v-btn
                                    color="primary"
                                    :loading="templateLoading"
                                    :disabled="!type || (template.name?.length ?? 0) == 0"
                                    @click="saveTemplate"
                                >
                                    {{ adding ? 'Add' : 'Save' }} Asset Template
                                </v-btn>
                            </v-col>
                            <v-col align="start">
                                <v-btn
                                    color="secondary"
                                    @click="cancelChanges"
                                >
                                    Cancel
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-row>
            </v-container>
        </v-card>
    </v-container>
</template>

<style scoped>
</style>