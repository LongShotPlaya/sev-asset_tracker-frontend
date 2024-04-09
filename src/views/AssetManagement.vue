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
    const assetId = ref(null);
    const currentBorrower = ref("Not in circulation");
    const dueDate = ref("");
    const location = ref("With a user");

    const mode = computed(() => assetId.value ? 'edit' : 'add');
    
    const props = defineProps({
      id: {
        required: true,
      },
    });

    const formatDate = (datetime) => {
        if (datetime !== null && !isNaN(datetime)){
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(datetime).toLocaleDateString(undefined, options);
        } else {
            return null; 
        }
    };

    const setMode = (id) => {
        assetId.value = id; // Set assetId based on the provided ID
    };

    const getFullAssetDetails = (id) => {
        assetServices.getFullAsset(id)
        .then(response => {
            fullAsset.value = response.data;
            console.log("Full Asset Details: ", fullAsset);
            currentBorrower.value = response.data.borrower;
            console.log("Full Borrower: ", currentBorrower);
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const tab = ref('alerts');

    const cancel = () => {
        router.go(-1);
    };

    onMounted(() => {
        user.value = Utils.getStore("User");
        const id = props.id;
        getFullAssetDetails(id);
        setMode(id);
    })
</script>

<template><br>
    <v-toolbar
    style="
    padding-top: 2%;
    padding-left: .5%;
    padding-right: .5%;
    ">
        <v-toolbar-title
        style="font-size: 28px;"
        >
        General Asset Info: 
            <div class="buttons">     
                <v-btn
                    @click=""
                    id="btn"
                    color="green" 
                    x-large>
                    save
                </v-btn>
                <v-btn
                    @click="cancel()"
                    id="btn"
                    color="#811429" 
                    style= "margin-left: 2%;"
                    x-large>
                    cancel
                </v-btn>
            </div>
        </v-toolbar-title>
    </v-toolbar>
    <v-card
    class="mx-auto"
    width="90%"
    >
        <v-container v-if="mode == 'edit'" fluid>
            <v-row>
            </v-row>
            <v-row>
                <v-col> 
                    <v-card>
                        <v-card-text>Type: </v-card-text>
                        <v-card-text>{{ fullAsset?.type?.name }}</v-card-text>
                            <!-- <table id="info">
                            <tr>
                                <td class="label">Type: </td>
                                <td>{{ fullAsset?.type?.name }}</td>
                            </tr>
                        </table> -->
                    </v-card><br>
                </v-col>
                <v-col>
                    <v-card>
                        <v-divider></v-divider>
                        <!-- <table id="info"> 
                            <tr>
                                <td class="label">Aquisition Date: </td>
                                <td>{{ format(fullAsset.acquisitionDate) }}</td>
                            </tr>
                        </table> -->
                    </v-card><br>
                </v-col>
                <v-col>
                    <v-card>
                        <v-divider></v-divider>
                        <!-- <table id="info">
                            <tr>
                                <td class="label">Aquisition Price: </td>
                                <td>{{ "$" + fullAsset.acquisitionPrice }}</td>
                            </tr>
                        </table> -->
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card>
                        <v-divider></v-divider>
                            <!-- <table id="info">
                                <tr>
                                    <td class="label">Template: </td>
                                    <td>{{ fullAsset.template }}</td>
                                </tr>
                            </table> -->
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
                                    <td>{{ formatDate(fullAsset.acquisitionDate) }}</td>
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
.tabsBlock{
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
    /* justify-content: start; */
    align-content: center;
}
#topbox tr{
    margin: 5%;
}
#info{
    margin: 5%;
    width: 70%;
}
#buttons{ /**Try background color change */

}
#btn{
    font-size: large;
}
td{
    font-size: x-large;
}
.label{
    text-align: left;
}

</style>