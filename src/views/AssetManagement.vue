<script setup>
    import { ref, onMounted, computed } from "vue";
    import { useRouter } from "vue-router";
    import { format } from "@formkit/tempo";
    import { VBtn } from 'vuetify/components';

    import Utils from "../config/utils.js";
    import assetServices from "../services/assetServices.js";
    import assetTypeServices from "../services/assetTypeManagementServices.js";
    import alertServices from "../services/alertServices.js";
    import logServices from "../services/logServices.js";
    import assetCatServices from "../services/assetCatServices";
    import assetTemplateServices from "../services/assetTemplateServices.js";

    const user = Utils.getStore("user");
    const router = useRouter();
    const message = ref("");

    const props = defineProps({
      id: {
        required: true,
        default: null,
      },
    });

    const adding = computed(() => isNaN(parseInt(props.id)) || isNaN(new Number(props.id)));
    const isBuilding = computed(() => allAssetCategories.value.find(assetCat => assetCat.value == fullAsset.value.type.categoryId)?.title=='Locations' && allAssetCategories.value.length > 0);

    const fullAsset = ref({
        id: props.id,
        acquisitionDate: null,
        acquisitionPrice: 0,
        dueDate: null,
        condition: 'Like New',
        type: {
            id: null,
            identifierId: null,
            categoryId: null,
            fields: [],
        },
        templateId: null,
        template: {
            id: null,
        },
        borrower: {
            id: null,
            fName: null,
            lName: null,
            email: null,
        },
        location: null,
        logs: [],
        alerts: [],
    });
    const assetType = ref(null);
    const tab = ref('alerts');
    const assetTemplate = ref("");
    const allAssetTypes = ref([]);
    const alertTypes = ref([]);
    const allAssetCategories = ref([]);
    const allAssetTemplates = ref([]);

    const fieldGridCols = ref(0);
    const fieldGridRef = ref([]);
    const fieldGrid = computed(() => {
        const grid = [];
        fieldGridCols.value = 0;

        fullAsset.value.type.fields.forEach(field => {
            if (!field.templateData && !field.assetData) field.assetData = { value: null };

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


    const getFullAssetDetails = (id) => {
        assetServices.getFullAsset(id)
        .then(response => {
            fullAsset.value = response.data;
            fullAsset.value.acquisitionDate = format(fullAsset.value.acquisitionDate, 'YYYY-MM-DD');

            // currentBorrower.value = response.data.borrower;
            // // console.log("Full Borrower: ", currentBorrower);
            // const acquisitionDate = new Date(response.data.acquisitionDate);
            // accDate.value = acquisitionDate.toISOString().split('T')[0];
            // // console.log("Accqsition Date: ", accDate);
            // accPrice.value = (response.data.acquisitionPrice / 100).toFixed(2);
            // // console.log("Asset Price: ", accPrice);
            // assetTemplate.value = response.data.template;
            // // console.log("Asset Template: ", assetTemplate);
            // assetTemplateId.value = response.data.template.id;
            // console.log("Asset Template ID: ", assetTemplateId);
            // assetLocation.value = response.data.location;
            // // console.log("Asset Location: ", assetLocation);
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const getAllAssetTypes = () => {
        assetTypeServices.getAllAssetTypes() 
        .then(response => {
            allAssetTypes.value = response.data.map(assetType => ({
                title: assetType.name, 
                value: assetType.id, 
            }));
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const changeAssetType = () => {
        if (!fullAsset.value.type.id)
            return;
        assetTypeServices.getFullAssetType(asset.value.typeId)
        .then(response => {
            assetType.value = response.data;
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const getAllAssetCats = () => {
        assetCatServices.getAllAssetCats()
        .then(response => {
            allAssetCategories.value = response.data.map(assetCat => {
                return {
                    title: assetCat.name,
                    value: assetCat.id,
                }
            });
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const getAllAssetTemplates = () => {
        assetTemplateServices.getAllAssetTemplates()
        .then(response => {
            allAssetTemplates.value = response.data.map(assetTemplate => ({
                title: assetTemplate.name,
                value: assetTemplate.id,
            }));
            // console.log("All Asset Templates: ", allAssetTemplates);
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const cancel = () => {
        router.go(-1);
    };

    const save = () => {
        assetServices.updateAsset(fullAsset.value.id, fullAsset.value)
        .then(response => {
            router.go(0);
        })
        .catch(err => {
            console.log(err.response.data.message)
            message.value = err.response.data.message;
        })
    };

    const logHeaders = ref([
        { title: "Time Stamp", value: "date", sortable: true },
        { title: "Description", value: "description" },
        { title: "Type", value: "type" },
        { title: "Condition", value: "condition" },
        { title: "Status", value: "circulationStatus" },
    ]);

    const alertHeaders = ref([
        { title: "Time Stamp", value: "date", sortable: true },
        { title: "Description", value: "description" },
        { title: "Status", value: "status" },
        { title: "Time Updated", value: "updatedAt" },
    ]);

    onMounted(() => {
        user.value = Utils.getStore("User");
        const id = props.id;
        getFullAssetDetails(id);
        getAllAssetTypes();
        changeAssetType();
        getAllAssetCats();
        getAllAssetTemplates(); 
    });
</script>

<template>
    <v-container>

        <br>
        <v-toolbar>
            <v-toolbar-title
            style="font-size: 28px;"
            >Asset: {{ id }}<v-btn
                    @click="cancel()"
                    color="#811429" 
                    style= "margin-left: 2%;
                    float: right;
                    font-size: large;
                    margin-right: 1%;
                    ">
                    cancel
                </v-btn>
                <v-btn
                    @click="save(id)"
                    color="green" 
                    style="float: right;
                    font-size: large;
                    ">
                    save
                </v-btn>
            </v-toolbar-title>
        </v-toolbar>
        <br>
        <v-card>
            <v-container>  
                <v-row>
                    <v-col>
                        <v-card-title 
                        style="
                        font-size: x-large;
                        ">General Asset Info</v-card-title><br><br>
                    </v-col>
                </v-row>
                <v-row class="ma-1">
                    <v-col>
                        <v-combobox
                            :items="allAssetCategories"
                            :return-object = "false"
                            variant="outlined"
                            label="Category"
                            :readonly = "!adding"
                            :hint="adding?'' : 'Cannot change after creating asset'"
                            v-model="fullAsset.type.categoryId"
                        ></v-combobox>
                    </v-col>    
                    <v-col> 
                        <v-combobox
                        :items="allAssetTypes"
                        variant="outlined"
                        label="Type"
                        :return-object = "false"
                        auto-select-first
                        :readonly = '!adding'
                        :hint="adding?'' : 'Cannot change after creating asset'"
                        v-model="fullAsset.type.id"
                        ></v-combobox>
                    </v-col>
                    <v-col>
                        <v-combobox
                        :items="allAssetTemplates"
                        variant="outlined"
                        label="Template"
                        :return-object = 'false'
                        auto-select-first
                        v-model="fullAsset.templateId"
                        >
                        </v-combobox>
                    </v-col> 
                </v-row>
                <v-row class="ma-1">
                    <v-col>
                        <v-text-field
                        variant="outlined"
                        label="Aquisition Price"
                        prepend-inner-icon="mdi-currency-usd"
                        rows="1"
                        v-model="fullAsset.acquisitionPrice"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field
                        variant="outlined"
                        type="date"
                        label="Acquisition Date"
                        v-model="fullAsset.acquisitionDate"
                        ></v-text-field>
                    </v-col>                                           
                </v-row>
            </v-container>
        </v-card><br>
    <!--------------------------------------------------------------Fields Block----------------------------------------------------------->
        <v-card>
            <v-container>
                <v-row>
                    <v-col>
                        <v-card-title 
                        style="
                        font-size: x-large;
                        ">Fields</v-card-title>
                    </v-col>
                </v-row>
                <v-row v-for="(row, rowIndex) in fieldGrid" :key=rowIndex justify="center" class="ma-4">
                    <v-col v-for="(column, colIndex) in row"
                        :key="colIndex"
                        :cols="Math.round((fieldGridCols - column.columnSpan) / fieldGridCols * 12)"
                    >
                        <br>
                        <v-row v-if="column.label !== undefined" align="baseline">
                            <v-text-field
                                v-if="fieldGridRef[rowIndex][colIndex].templateField && !!fieldGridRef[rowIndex][colIndex].templateData?.value"
                                :label="fieldGridRef[rowIndex][colIndex].label"
                                v-model="fieldGridRef[rowIndex][colIndex].templateData.value"
                                disabled
                            />
                            <v-text-field
                                v-else
                                :label="fieldGridRef[rowIndex][colIndex].label"
                                v-model="fieldGridRef[rowIndex][colIndex].assetData.value"
                            />
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-card><br>
    <!------------------------------------------------------------Alerts and Logs------------------------------->
        <v-card>
            <v-tabs
            v-model="tab"
            id="tabsBlock"
            >
                <v-tab value="alerts">Alerts</v-tab> 
                <v-tab value="logs">Logs</v-tab> 
                <v-tab value="Buildings" v-if = 'isBuilding'>Buildings</v-tab>
            </v-tabs>
            <v-card-text>
                <v-window v-model="tab">
                    <v-window-item value="alerts">
                        <v-data-table
                            :headers="alertHeaders"
                            :items="fullAsset.alerts"
                            :sortBy="[{ key: 'date', order: 'asc' }]"
                            >
                            <template #item.date="{ item }">
                                {{ format(item.date) }}
                            </template>
                            <template #item.updatedAt="{ item }">
                                {{ format(item.updtatedAt) }}
                            </template>
                        </v-data-table>
                    </v-window-item>
                    <v-window-item value="logs">
                        <v-data-table
                        :headers="logHeaders"
                        :items="fullAsset.logs"
                        :sort-by="[{ key: 'date', order: 'asc' }]"
                        >
                            <template #item.date="{ item }">
                                {{ format(item.date) }}
                            </template>
                        </v-data-table>
                    </v-window-item>
                    <v-window-item 
                    value="buildings"
                    >
                        <v-card-title>
                            Buildings
                        </v-card-title>
                    </v-window-item>
                </v-window>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<style>
/* big blocks */
.mx-auto{ 
    max-height: 22%;
}
.tabsBlock{ /**Def need this */
    width: 90%;
}
#sideBar{
    justify-content: left;
    width: 100%;
}
#templateBar{
    justify-content: center;
    justify-items: center;
    width: auto;
}
#topBox{
    width: 100%;
    height: 100%;
    align-content: center;
}
#topbox tr{
    margin: 5%;
}
#info{
    margin: 5%;
    width: 70%;
}
.label{
    text-align: left;
}

</style>