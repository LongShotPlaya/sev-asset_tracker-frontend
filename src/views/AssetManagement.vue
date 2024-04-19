<script setup>
    import { ref, onMounted, computed, watch } from "vue";
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
    import personServices from "../services/personServices.js";
    import userServices from "../services/userServices.js";

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
    const allAssetTypes = ref([]);
    const alertTypes = ref([]);
    const allAssetCategories = ref([]);
    const allAssetTemplates = ref([]);
    const formattedAccPrice = ref("0");
    const validAccPrice = computed(() => {
        const removeCommas = formattedAccPrice.value.replace(/,/g, "");
        return !isNaN(parseFloat(removeCommas)) && !isNaN(new Number(removeCommas));
    });
    const filteredAssetTemplates = computed(() => allAssetTemplates.value.filter(template => template.assetTypeId == fullAsset.value.type.id));

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

    watch(formattedAccPrice, (newValue, oldValue) => {
        if (!validAccPrice.value) return;
        const decimal = formattedAccPrice.value.includes('.');
        fullAsset.value.acquisitionPrice = parseInt(formattedAccPrice.value.replace(".", "").replace(/,/g, "")) * (decimal ? 1 : 100);
    });

    const newAlert = ref({
        description: '',
        status: ''
    });

    const newLog = ref({
        description: "",
        type: "",
        condition: "",
        status: "",
    });

    const getFullAssetDetails = (id) => {
        assetServices.getFullAsset(id)
        .then(response => {
            fullAsset.value = response.data;
            fullAsset.value.acquisitionDate = format(fullAsset.value.acquisitionDate, 'YYYY-MM-DD');
            const unformattedAccPrice = `${fullAsset.value.acquisitionPrice}`; 
            formattedAccPrice.value = "";
            for(let i = 0; i < unformattedAccPrice.length; i++) {
                formattedAccPrice.value += unformattedAccPrice.length - i == 2 ? '.' + unformattedAccPrice[i] : unformattedAccPrice[i];
            }
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
            changeAssetType();
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const changeAssetType = () => {
        if (!fullAsset.value?.type?.id)
            return;
        assetTypeServices.getFullAssetType(fullAsset.value.type.id)
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
            allAssetTemplates.value = response.data.map(assetTemplate => {
                return {
                    title: assetTemplate.name,
                    value: assetTemplate.id,
                    assetTypeId: assetTemplate.assetTypeId,
                };
            });
            changeTemplate();
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const changeTemplate = () => {
        if (!fullAsset.value?.templateId)
            return;

        assetTemplateServices.getFullAssetTemplate(fullAsset.value.templateId)
        .then(response => {
            const templateData = response.data.assetType.fields
            .map(field => field.templateData)
            .filter(data => !!data);

            fullAsset.value.type.fields.forEach(field => {
                field.templateData = templateData.find(data => data.fieldId == field.id) ?? null;
            });
        })
        .catch(err => {
            message.value = err.response.data.message;
        });
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

    const addLog = () => {
        fullAsset.value.logs.push({ ...newLog.value });
        newLog.value = {
            description: "",
            type: "",
            condition: "",
            status: "",
        }
    };

    const alertHeaders = ref([
        { title: "Time Stamp", value: "date", sortable: true },
        { title: "Description", value: "description" },
        { title: "Status", value: "status" },
        { title: "Time Updated", value: "updatedAt" },
    ]);

    const addAlert = () => {
        fullAsset.value.alerts.push({ ...newAlert.value });
        newAlert.value = {
            description: '',
            status: '',
        };
    };

    onMounted(() => {
        user.value = Utils.getStore("User");
        const id = props.id;
        getFullAssetDetails(id);
        getAllAssetTypes();
        getAllAssetCats();
        getAllAssetTemplates(); 
    });
</script>

<template>
    <v-container>
        <v-toolbar>
            <v-container>
                <v-row>
                    <v-col>
                        <v-toolbar-title
                        style="font-size: 28px;"
                        >{{ adding ? 'Add' : 'Edit' }} Asset
                        </v-toolbar-title>
                    </v-col>
                    <v-col>

                    </v-col>
                </v-row>
            </v-container>
        </v-toolbar>
        <br>
        <v-card>
            <v-container>
                <v-row>
                    <v-col>
                        <v-card-title 
                        style="
                        font-size: x-large;
                        ">General Asset Info</v-card-title>
                    </v-col>
                    <v-col class="mr-4">
                        <v-btn
                            @click="cancel()"
                            color="secondary" 
                            style= "margin-left: 2%;
                            float: right;
                            font-size: large;
                            "
                            size="large">
                            cancel
                        </v-btn>
                        <v-btn
                            @click="save(id)"
                            color="primary" 
                            style="float: right;
                            font-size: large;
                            "
                            size="large">
                            save
                        </v-btn>
                    </v-col>
                </v-row>
                <br>
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
                        :items="filteredAssetTemplates"
                        variant="outlined"
                        label="Template"
                        :return-object = 'false'
                        auto-select-first
                        v-model="fullAsset.templateId"
                        @update:modelValue="changeTemplate"
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
                        :rules="[validAccPrice]"
                        v-model="formattedAccPrice"
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
                <br>
                <v-row class="ma-1">
                    <v-col>
                        <v-combobox
                            v-if="!fullAsset.borrower"
                            label="Building and room"
                            variant="outlined"
                        />
                        <v-combobox
                            v-else
                            label="Person"
                            variant="outlined"
                        />
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
                                variant="outlined"
                                disabled
                            />
                            <v-text-field
                                v-else
                                :label="fieldGridRef[rowIndex][colIndex].label"
                                v-model="fieldGridRef[rowIndex][colIndex].assetData.value"
                                variant="outlined"
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
                            :sort-by="[{ key: 'date', order: 'asc' }]"
                        >
                            <!-- Formatting for date and updatedAt columns -->
                            <template #item.date="{ item }">
                                {{ format(item.date) }}
                            </template>
                            <template #item.updatedAt="{ item }">
                                {{ format(item.updatedAt) }}
                            </template>

                            <!-- Add Alert functionality -->
                            <template v-slot:top-row>
                                <tr>
                                    <td>
                                        <!-- Editable description input for the new alert -->
                                        <v-text-field v-model="newAlert.description" placeholder="Enter description" />
                                    </td>
                                    <td>
                                        <!-- Editable status input for the new alert -->
                                        <v-text-field v-model="newAlert.status" placeholder="Enter status" />
                                    </td>
                                    <td>
                                        <!-- Save button to add the new alert -->
                                        <v-btn @click="addAlert">Save</v-btn>
                                    </td>
                                </tr>
                            </template>

                            <!-- Slot for existing alert rows to allow editing -->
                            <template #item="{ item }">
                                <tr>
                                    <td>
                                        <!-- Editable description input for existing alerts -->
                                        <v-text-field v-model="item.description" />
                                    </td>
                                    <td>
                                        <!-- Editable status input for existing alerts -->
                                        <v-text-field v-model="item.status" />
                                    </td>
                                    <td>
                                        <!-- Save button to save changes to existing alerts -->
                                        <v-btn @click="">Save</v-btn> 
                                        <!-- <v-btn @click="saveAlert(item)">Save</v-btn>  -->
                                    </td>
                                </tr>
                            </template>

                            <!-- Add New Alert button -->
                            <template v-slot:top>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-spacer></v-spacer>
                                <v-btn class="mb-2" color="primary" dark @click="addAlert" style="margin-left: 85%; width: 15%;">
                                    New Alert
                                </v-btn>
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
                                <template v-slot:top>
                                    <v-divider class="mx-4" inset vertical></v-divider>
                                    <v-btn class="mb-2" color="primary" dark @click="addLog" style="margin-left: 85%; width: 15%;">
                                        New Log
                                    </v-btn>
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