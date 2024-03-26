<script setup>
    import { ref, onMounted } from "vue";
    import { useRouter } from "vue-router";
    import Utils from "../config/utils.js";
    import peopleServices from "../services/personServices";
    import assetServices from "../services/assetServices.js";
    import groupServices from "../services/groupServices.js";
    import userServices from "../services/userServices";
    
    const message = ref("");
    const person = ref("");
    const personsAssets = ref([]);
    const user = Utils.getStore("user");
    const router = useRouter();
    
    const props = defineProps({
      id: {
        required: true,
      },
    });

    const getGroup = (id) => {
        groupServices.getGroup(id)
        .then((response) => {
            select.value=response.data.role;
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    }
    
    const getSomeone = (id) => {
        peopleServices.getPerson(id) 
            .then((response) => {
                person.value = response.data;
            })
            .catch((error) => {
                message.value = error.response.data.message;
            })
    };
    
    const assetTypeName = ref("");
    const getAssetTypeName = (typeId) => {
        assetServices.getFullAssetType(typeId)
        .then((response) => {
            assetTypeName.value = response.data.name;
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    };

    const getPersonsAssets = async (id) => { 
        assetServices.getAllAssets()
        .then(async (response) => {
            personsAssets.value = response.data.filter(asset => asset.borrowerId == id);
            console.log("Person's Assets: ", personsAssets);
                await Promise.all(personsAssets.value.map(asset => getAssetTypeName(asset.typeId)));
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    };
    
    //Asset data table
    const headers = [
        { title: 'Type', value: 'typeId', width: '30%' },
        { title: 'ID', value: 'id', width: '30%' },
        { title: 'Status', value: 'status', width: '30%' },
        { title: '', value: 'actions', align: 'end' },
    ];

    const userGroupId = ref("");
    const getUserGroupId = (id) => {
        userServices.getUser(id) 
        .then((response) => {
            userGroupId.value = response.data.groupId;
            console.log("User Group ID: ", userGroupId);
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    }

    const groupName = ref("");
    const getGroupName = (id) => {
        groupServices.getGroup(id)
        .then((response) => {
            groupName.value = response.data.name;
            console.log("Group Name: ", groupName);
        })
        .catch((error) => {
            message.value = error.reaponse.data.message;
        })
    }

    const select = ref("User");
    const roles = [
        { title: 'Super User', value: 1 }, 
        { title: 'User', value: 2 }, 
        { title: 'Person', value: 3 }, 
    ];

    // const saveChanges = () => {
    //     const id = person.value.id;
    //     const data = { role: select.value };

    //     groupServices.updateGroup(id, data)
    //     .then(() => {
    //         console.log("Group updated successfully: ", data);
    //     })
    //     .catch((error) => {
    //         message.value = error.response.data.message;
    //     })
    // };

    const cancel = () => {
        select.value = getGroup();
        router.push({ name: "people" });
    };

    const viewAsset = () => {
        router.push({ name: "asset" }); //Change when page is made. 
    }

    const test = () => {
    const assetTypeId = 2;
    assetServices.getFullAssetType(assetTypeId)
        .then(response => {
            console.log("Full Asset Type: ", response.data);
        })
        .catch(error => {
            if (error.response.status === 404) {
                console.error("Asset type not found:", error.response.data.message);
            } else {
                console.error("Error:", error.message);
            }
        });
    };

    
    onMounted(() => {
        user.value = Utils.getStore("user");
        const id = props.id;
        getGroup(id);
        getSomeone(id);
        getPersonsAssets(id);
        test();
        getUserGroupId(id);
        getGroupName(id);
    });
</script>

<template>
    <br>
    <v-card
    class="mx-auto"
    width="90%"
    >
        <v-app
        class="layout">
            <v-toolbar>
                <v-toolbar-title>{{ person.fName + ' ' + person.lName }}</v-toolbar-title>
            </v-toolbar>
            <v-container
            class="v-container">
                <v-row style="height: 50%">
                    <v-col cols="3"
                    class="sidePanel">
                        <v-card class="side">
                            <v-card-title>Person Role: {{ user.groupId }}
                                <v-select
                                    v-model="select"
                                    :items="roles"
                                    return-object
                                    single-line
                                    ></v-select>
                            </v-card-title>
                            <v-divider></v-divider>
                            <table id="contact">
                                <tr>
                                    <td>ID: </td>
                                    <td>{{ person.id }}</td>
                                </tr>
                                <tr>
                                    <td>Email: </td>
                                    <td>
                                        <a :href=" 'https://mail.google.com/mail/?view=cm&fs=1&to=' + person.email" target="_blank">{{ person.email }}</a>
                                    </td>
                                </tr>
                            </table>
                        </v-card>
                        <br>
                        <v-card class="side">
                        <v-card-title>Label for third block</v-card-title>
                        <v-divider></v-divider>
                        <v-card-text id="block3txt">Block 3</v-card-text>
                    </v-card>
                        <v-btn
                            @click="cancel()"
                            id="btn"
                            color="#811429" 
                            style="margin-top: 3%;"
                            x-large>
                            cancel
                        </v-btn>
                        <!-- saveChanges(person.id, { role: select.value }) -->
                        <v-btn
                            @click=""
                            id="btn"
                            color="green" 
                            style="margin-top: 3%; margin-left: 2%;"
                            x-large>
                            save
                        </v-btn>
                    </v-col>

                    <v-col cols="9">
                        <v-card class="list">
                        <v-card-title>Assets</v-card-title>
                            <v-data-table
                                :headers="headers"
                                :items="personsAssets"
                                item-key="id"
                            >
                                <template v-slot:[`item.typeId`]="{ item }">
                                    {{ assetTypeName }}
                                </template>
                                <template v-slot:[`item.actions`]="{ item }">
                                    <v-btn class="ma-2" color="primary" :icon="true" size="small" @click="viewPerson(item.id)">
                                        <v-icon>mdi-pencil</v-icon> 
                                    </v-btn>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-app>
    </v-card>
</template>

<style scoped>
.v-container{
    min-width: 100%;
    height: 100%;
}

.layout {
    height: 1000px;
}
.sidePanel{
    height: 100%;
    justify-content: center;
    width: auto;
}

#btn {
    width: 49%;
    height: 10.5%;
    font-size: large;
}

.side {
    min-height: 70%;
    width: 100%;
}

.list {
    height: 150%;
    width: auto;
}

#contact {
    margin: 5%;
    width: 100%;
}

#contact td {
    margin-right: 5%;
    font-size: medium;
}

#block3txt {
    font-size: medium;
}
</style>