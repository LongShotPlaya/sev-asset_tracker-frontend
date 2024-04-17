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
    import assetFieldServices from"../services/fieldListServices.js";
    import assetCatServices from "../services/assetCatServices";
    import assetTemplateServices from "../services/assetTemplateServices.js";

    const user = Utils.getStore("user");
    const router = useRouter();
    const message = ref("");

    const fullAsset = ref("");
    const assetId = ref("No ID found");
    const currentBorrower = ref("Not in circulation");
    const assetType = ref(null);
    const accPrice = ref(null);
    const accDate = ref("");
    const tab = ref('alerts');
    const assetTemplate = ref("");
    const allAssetTypes = ref([]);
    const alerts = ref([]);
    const logs = ref([]);
    const template = ref({});
    const assetTemplateId = ref();
    const assetFields = ref();
    const assetTypeId = ref();
    const allAssetCategories = ref([]);
    const assetLocation = ref(null);
    const allAssetTemplates = ref([]);
    const assetCatName = ref(null);
    const assetCatId = ref();

    const props = defineProps({
      id: {
        required: true,
      },
    });

    const getFullAssetDetails = (id) => {
        assetServices.getFullAsset(id)
        .then(response => {
            fullAsset.value = response.data;
            console.log("Full Asset Details: ", fullAsset);
            currentBorrower.value = response.data.borrower;
            // console.log("Full Borrower: ", currentBorrower);
            assetType.value = response.data.type.name;
            console.log("Asset Type:", assetType);
            const acquisitionDate = new Date(response.data.acquisitionDate);
            accDate.value = acquisitionDate.toISOString().split('T')[0];
            // console.log("Accqsition Date: ", accDate);
            accPrice.value = (response.data.acquisitionPrice / 100).toFixed(2);
            // console.log("Asset Price: ", accPrice);
            assetTemplate.value = response.data.template;
            // console.log("Asset Template: ", assetTemplate);
            assetTemplateId.value = response.data.template.id;
            // console.log("Asset Template ID: ", assetTemplateId);
            assetLocation.value = response.data.location;
            // console.log("Asset Location: ", assetLocation);
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const getAsset = (id) => {
        assetServices.getAsset(id)
        .then(response => {
            assetTemplateId.value = response.data.templateId;
            console.log("Asset Template ID: ", assetTemplateId);
            assetTypeId.value = response.data.typeId;
            console.log("Asset Type ID: ", assetTypeId);
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const getItemTypes = () => {
        assetTypeServices.getAllAssetTypes() 
        .then(response => {
            allAssetTypes.value = response.data.map(assetType => ({
                title: assetType.name, 
                value: assetType.id, 
            }));
            // console.log("Asset Types: ", allAssetTypes);
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const getAllAlerts = (id) => {
        alertServices.getAllAlerts()
        .then(response => {
            alerts.value = response.data.filter(alert => alert.assetId == id);
            // console.log("Alerts for Asset: ", alerts);
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const getAllLogs = (id) => {
        logServices.getAllLogs()
        .then(response => {
            logs.value = response.data.filter(logs => logs.assetId == id);
            // console.log("Logs for asset: ", logs);
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const getAssetFields = (id) => { //404 error, why????
        assetFieldServices.getOneFieldList(id)
        .then(response => {
            assetFields.value = response.data;
            console.log("Asset Fields: ", assetFields);
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const getAllAssetCats = () => {
        assetCatServices.getAllAssetCats()
        .then(response => {
            allAssetCategories.value = response.data.map(assetCat => ({
                title: assetCat.name,
                value: assetCat.id,
            }));
            // console.log("All Asset Categories: ", allAssetCategories);
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

    const getAssetCatId = (id) => {
        assetTypeServices.getAssetType(id)
        .then(response => {
            assetCatId.value = response.data.categoryId;
            console.log("Asset Cat ID HERE: ", assetCatId);
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const getAssetCatName = () => { //************************************ */
        assetCatServices.getAssetCat()
        .then (response => {

        })
        .catch (error => {
            message.value = error.response.data.message;
        })
    }

    const cancel = () => {
        router.go(-1);
    };

    const save = (id) => {
        assetId = id;
        data = { 
            acquisitionDate: accDate.value,
            acquisitionPrice: accPrice.value,
            templateId: assetTemplateId.value,
            location: assetLocation.value,
            template: assetTemplate.value,
        };

        const updateAsset = (assetId, data) => {
            assetServices.updateAsset(assetId, data)
            .then(() => {
                console.log("Updated Asset info: ", data);
            })
            .catch((error) => {
                message.value = error.response.data.message;
            })
        };
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

    const setMode = (id) => {
        assetId.value = id; // Set assetId based on the provided ID
    };

    onMounted(() => {
        user.value = Utils.getStore("User");
        const id = props.id;
        getFullAssetDetails(id);
        setMode(id);
        getItemTypes();
        getAllAlerts(id);
        getAllLogs(id);
        getAsset(id);
        getAssetFields(assetTypeId);
        getAllAssetCats();
        getAllAssetTemplates();
        getAssetCatId(assetTypeId);
    });
</script>

<template><br>
    <v-toolbar
    style="
    padding-top: .5%;
    padding-left: .5%;
    padding-right: .5%;
    width: 90%;
    margin-left: 5%;
    ">
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
    <v-card
    class="mx-auto"
    width="90%"
    >
        <v-container 
        fluid 
        style="
            min-height: 900px;
        ">  
        <v-title 
        style="
        font-size: x-large;
        ">General Asset Info</v-title><br><br>
            <v-row>
                <v-col>
                    <v-combobox
                        :items="allAssetCategories"
                        variant="outlined"
                        label="Category"
                        return-object
                        auto-select-first
                        v-model="assetCatName"
                    ></v-combobox>
                </v-col>    
                <v-col> 
                    <v-combobox
                    :items="allAssetTypes"
                    variant="outlined"
                    label="Type"
                    return-object
                    auto-select-first
                    v-model="assetType"
                    ></v-combobox>
                </v-col>
                <v-col>
                    <v-combobox
                    :items="allAssetTemplates"
                    variant="outlined"
                    label="Template"
                    return-object
                    auto-select-first
                    v-model="assetTemplate.name"
                    >
                    </v-combobox>
                </v-col> 
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                    class="mx-2"
                    variant="outlined"
                    label="Aquisition Price"
                    prepend-inner-icon="mdi-currency-usd"
                    rows="1"
                    v-model="accPrice"
                    ></v-text-field>
                </v-col>
                <v-col 
                style="position: relative;">
                    <v-text-field
                    variant="outlined"
                    type="date"
                    label="Acquisition Date"
                    v-model="accDate"
                    ></v-text-field>
                </v-col>                                           
            </v-row>
        </v-container>
    </v-card><br>
<!--------------------------------------------------------------Fields Block----------------------------------------------------------->
    <v-card
    class="mx-auto"
    width="90%"
    ><v-title 
        style="
        font-size: x-large;
        margin: 1%;
        ">Fields</v-title>
            <v-container
            fluid>
                <v-row>
                    <v-col>
                        <v-card>
                            <v-card-text>{{ assetFields }}</v-card-text>
                        </v-card>
                    </v-col>                     
                </v-row>
            </v-container>
    </v-card><br>
<!------------------------------------------------------------Alerts and Logs------------------------------->
    <v-card 
    style="width: 90%; 
    margin-left: 5%;">
        <v-tabs
        v-model="tab"
        id="tabsBlock"
        >
            <v-tab value="alerts">Alerts</v-tab> 
            <v-tab value="logs">Logs</v-tab> 
            <v-tab value="Buildings">Buildings</v-tab>
        </v-tabs>
        <v-card-text>
            <v-window v-model="tab">
                <v-window-item value="alerts">
                    <v-data-table
                        :headers="alertHeaders"
                        :items="alerts"
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
                    :items="logs"
                    :sort-by="[{ key: 'date', order: 'asc' }]"
                    >
                        <template #item.date="{ item }">
                            {{ format(item.date) }}
                        </template>
                    </v-data-table>
                </v-window-item>
                <v-window-item value="Buildings"
                :disabled="assetLocation == null"
                >
                    <div>Buildings</div>
                    <!--Complete data table here-->
                </v-window-item>
            </v-window>
        </v-card-text>
    </v-card>
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
td{
    font-size: x-large;
}
.label{
    text-align: left;
}

</style>