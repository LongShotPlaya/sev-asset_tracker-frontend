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
        return "No return Date"; 
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

<template>
    <br>
    <v-card
    class="mx-auto"
    width="90%"
    height="85%"
    >    
        <v-app>
            <v-toolbar
            style="padding: .5%;">
                <v-toolbar-title
                style="font-size: 28px;">
                {{ mode === 'edit' ? 'Edit Asset' : 'Add Asset' }}     
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
                </v-toolbar-title>
            </v-toolbar>
            <v-if mode="edit">
                <v-container>
                    <v-row>
                        <v-col cols="3" id="sideBar">
                            <v-card id="box">
                                <v-card-title>Asset Info:</v-card-title>
                                <v-divider></v-divider>
                                    <table id="info">
                                    <tr>
                                        <td>Type: </td>
                                        <td>{{ fullAsset?.type?.name }}</td>
                                    </tr>
                                    <tr>
                                        <td>Asset ID: </td>
                                        <td>{{ fullAsset.id }}</td>
                                    </tr>
                                    <tr>
                                        <td>Aquisition Price: </td>
                                        <td>{{ "$" + fullAsset.acquisitionPrice }}</td>
                                    </tr>
                                    <tr>
                                        <td>Return Date:</td>
                                        <td>
                                            <v-text-box>{{ formatDate(fullAsset.dueDate) }}</v-text-box> <!--Make this work-->
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Location: </td>
                                        <td>{{ location }}</td> <!--Also make this editable text box-->
                                    </tr>
                                </table>
                            </v-card>
                                <br>
                            <v-card id="box">
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
                        </v-col>

                        <!-----------------------------------------------------------------------Right Half of Page----------------------------------------------------------------------------------------------->

                        <v-col cols="9" id="rightSideBar">
                            <v-card id="box">
                                <v-card-title>Alerts & Logs:</v-card-title>
                                <v-divider></v-divider>
                                   
                            </v-card>
                                <br>
                            <v-card id="box">
                                <v-card-title>Costomize Section Based on Type:</v-card-title>
                                <v-divider></v-divider>
                                
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
#rightSideBar{
    justify-content: center;
    width: auto;
}
#box{
    width: 100%;
    height: 75%;
}
#info{
    margin: 5%;
    width: 70%;
}
#btn{
    font-size: large;
    justify-items: end;
    justify-content: end;
    justify-self: end;
    left: 78%;
}

</style>