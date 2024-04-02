<script setup>
    import { ref, onMounted, computed } from "vue";
    import { useRouter } from "vue-router";
    import Utils from "../config/utils.js";
    import assetServices from "../services/assetServices.js";

    const user = Utils.getStore("user");
    const router = useRouter();
    const message = ref("");
    const fullAsset = ref("");
    const assetId = ref(null);
    const currentBorrower = ref("Not in circulation");
    const dueDate = ref("No return date");
    const location = ref("With a user");

    const mode = computed(() => assetId.value ? 'edit' : 'add');
    
    const props = defineProps({
      id: {
        required: true,
      },
    });

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

    onMounted(() => {
        user.value = Utils.getStore("User");
        const id = props.id;
        getFullAssetDetails(id);
        setMode(id);
    })
</script>

<template>
    <br>
    <v-card
    class="mx-auto"
    width="90%"
    height="85%"
    >    
        <v-app>
            <v-toolbar>
                <v-toolbar-title>{{ mode === 'edit' ? 'Edit Asset' : 'Add Asset' }}</v-toolbar-title>
            </v-toolbar>
            <v-if mode="edit">
                <v-container>
                    <v-row>
                        <v-col cols="4" id="sideBar">
                            <v-card id="sideTop">
                                <v-card-title>Asset Info:</v-card-title>
                                <v-divider></v-divider>
                                    <table id="info">
                                    <tr>
                                        <td>Type: </td>
                                        <td>{{ fullAsset?.type?.name }}</td>
                                    </tr>
                                    <tr>
                                        <td>ID: </td>
                                        <td>{{ fullAsset.id }}</td>
                                    </tr>
                                    <tr>
                                        <td>Aquisition Price: </td>
                                        <td>{{ "$" + fullAsset.acquisitionPrice }}</td>
                                    </tr>
                                    <tr>
                                        <td>Return Date:</td>
                                        <td>{{ dueDate }}</td>
                                    </tr>
                                    <tr>
                                        <td>Location: </td>
                                        <td>{{ location }}</td>
                                    </tr>
                                </table>
                            </v-card>
                                <br>
                            <v-card id="sideBottom">
                                <v-card-title>Borrower Info:</v-card-title>
                                <v-divider></v-divider>
                                <table id="info">
                                    <tr>
                                        <td>Name: </td>
                                        <td>{{ currentBorrower.fName + " " + currentBorrower.lName }}</td>
                                    </tr>
                                    <tr>
                                        <td>Student ID: </td>
                                        <td>{{ currentBorrower.id }}</td>
                                    </tr>
                                    <tr>
                                        <td>Email: </td>
                                        <td style="padding-right: 1%;">
                                            <a :href=" 'https://mail.google.com/mail/?view=cm&fs=1&to=' + currentBorrower.email" target="_blank">{{ currentBorrower.email }}</a>
                                        </td>
                                    </tr>
                                </table>
                            </v-card>
                        <br>
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
                        </v-col>
                        <v-col cols="9">
                            <v-card>
                                                    <!-- <v-row v-for="(row, rowIndex) in fieldGrid" justify="center">
                                                        <v-col v-for="(column, colIndex) in row"
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
                                                            <v-checkbox
                                                                v-if="column.label !== undefined"
                                                                :disabled="fieldIsIdentifier(column)"
                                                                density="compact"
                                                                class="smaller-checkbox"
                                                                label="Field is required to be completed for every asset under this type"
                                                                v-model="fieldGridRef[rowIndex][colIndex].required"
                                                            />
                                                            <v-checkbox
                                                                v-if="column.label !== undefined"
                                                                :disabled="fieldIsIdentifier(column)"
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
                                                    </v-row> -->
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-if>
            <v-else>

            </v-else>
        </v-app>
    </v-card>

</template>

<style>

#sideBar{
    justify-content: center;
    width: auto;
}
#sideTop{
    width: 100%;
}
#sideBottom{
    width: 100%;
}
#info{
    margin: 5%;
    width: 70%;
}
#btn{
    width: 49%;
    height: 10%;
    font-size: large;
    /* margin-top: 3%;  */
}

</style>