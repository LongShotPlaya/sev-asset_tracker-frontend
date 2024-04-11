<script setup>
    import { ref, onMounted, computed } from "vue";
    import { useRouter } from "vue-router";
    import { format } from "@formkit/tempo";

    import Utils from "../config/utils.js";
    import assetServices from "../services/assetServices.js";
    const user = Utils.getStore("user");
    const router = useRouter();
    const message = ref("");

    const fullAsset = ref("");
    const assetId = ref("No ID found");
    const currentBorrower = ref("Not in circulation");
    const assetType = ref("No type found");
    const accPrice = ref(null);
    const accDate = ref("");
    const tab = ref('alerts');
    const assetTemplate = ref("")

    const newAccDate = ref("");
    const dueDate = ref("");
    const location = ref("With a user");
    const due = ref(null);

    const mode = computed(() => assetId.value ? 'edit' : 'add');
    
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
            console.log("Full Borrower: ", currentBorrower);
            assetType.value = response.data.type.name;
            console.log("Asset Type:", assetType);
            accDate.value = format(response.data.acquisitionDate);
            console.log("Accqsition Date: ", accDate);
            accPrice.value = response.data.acquisitionPrice;
            console.log("Asset Price: ", accPrice);
            assetTemplate.value = response.data.template;
            console.log("Asset Template: ", assetTemplate);
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const itemTypes = [ //Update this to take straight from database
        { title: 'Chair', value: 1 },
        { title: 'Key', value: 2 },
        { title: 'Sofa', value: 3 },
        { title: 'Laptop', value: 4 },
        { title: 'Matteress', value: 5 },
        { title: 'Phone', value: 6 },
        { title: 'Projector', value: 7 },
        { title: 'Books', value: 8 },
        { title: 'Whiteboard Accessaries', value: 9 },
        { title: 'Rooftop Unit', value: 10 },
        { title: 'Smoke Detector', value: 11 },
    ];

    const cancel = () => {
        router.go(-1);
    };

    const save = (id) => {
        assetId = id;
        data = {};

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

    const setMode = (id) => {
        assetId.value = id; // Set assetId based on the provided ID
    };

    onMounted(() => {
        user.value = Utils.getStore("User");
        const id = props.id;
        getFullAssetDetails(id);
        setMode(id);
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
        >Asset ID: #{{ id }}<v-btn
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
        <v-container v-if="mode == 'edit'" 
        fluid 
        style="
            height: 700px;
        ">
        <v-title 
        style="
        font-size: x-large;
        ">General Asset Info</v-title><br><br>
            <v-row>
                <v-col> 
                    <v-autocomplete
                    :items="itemTypes"
                    return-object
                    single-line
                    v-model="assetType"
                    ></v-autocomplete>
                </v-col>
                <v-col>
                    <v-textarea
                        class="mx-2"
                        label="Aquisition Price"
                        prepend-inner-icon="mdi-currency-usd"
                        rows="1"
                        v-model="accPrice"
                    ></v-textarea>
                </v-col>
                <v-col>
                    <v-textarea
                    append-inner-icon="mdi-calendar"
                    class="mx-2"
                    label="Aquistion Date"
                    rows="1"
                    v-model="accDate"
                        >
                    </v-textarea>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-text>Template: </v-card-text>
                        <v-card-text>{{ fullAsset.template }}</v-card-text>
                    </v-card>
                </v-col>                                                   
            </v-row>
        </v-container>
        <!-- <v-if mode="edit">
        </v-if> -->
    </v-card><br>
<!--------------------------------------------------------------Main Block 2----------------------------------------------------------->
    <v-card
    class="mx-auto"
    width="90%"
    >    
        <v-toolbar
        style="padding: .5%;">
            <v-toolbar-title
            style="font-size: 28px;">
            Fields: 
            </v-toolbar-title>
        </v-toolbar>
            <v-container>
                <br>
                <v-row>
                    <v-col cols="6" id="sideBar">
                        <v-card id="topBox">
                                <table id="info">
                                <tr>
                                    <td>Type: </td>
                                    <td>{{ fullAsset?.type?.name }}</td>
                                </tr>
                            </table>
                        </v-card>
                            <br>
                        <v-card id="topBox">
                            <v-divider></v-divider>
                            <table id="info">
                                <tr>
                                    <td>Aquisition Date: </td>
                                    <!-- <td>{{ formatDate(fullAsset.acquisitionDate) }}</td> -->
                                </tr>
                            </table>
                        </v-card>
                    <br>
                </v-col>
                <v-col cols="6" id="templateBar">
                    <v-card id="topBox">
                        <v-divider></v-divider>
                        <table id="info">
                            <tr>
                                <td>Template: </td>
                                <td>{{ fullAsset.template }}</td>
                            </tr>
                        </table>
                    </v-card><br>
                    <v-card id="topBox">
                        <v-divider></v-divider>
                        <table id="info">
                            <tr>
                                <td>Aquisition Price: </td>
                                <td>{{ "$" + fullAsset.acquisitionPrice }}</td>
                            </tr>
                        </table>
                    </v-card>                        
                </v-col>                                                   
            </v-row>
        </v-container>
    </v-card><br>
<!-------------------------------------------------------------Alerts and Logs------------------------------->
    <v-card 
    style="width: 90%; margin-left: 5%;">
        <v-tabs
        v-model="tab"
        id="tabsBlock"
        >
            <v-tab value="alerts">Alerts</v-tab> 
            <v-tab value="logs">Logs</v-tab> 
        </v-tabs>

        <v-card-text>
            <v-window v-model="tab">
                <v-window-item value="alerts">
                <!-- Put your content for Alerts here -->
                <!-- For example: -->
                <div>Content for Alerts</div>
                </v-window-item>

                <v-window-item value="logs">
                <!-- Put your content for Logs here -->
                <!-- For example: -->
                <div>Content for Logs</div>
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