<script setup>
import Utils from "../config/utils.js";
import TypeServices from "../services/assetTypeManagementServices.js";
import CatServices from "../services/assetCatServices.js";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const assetTypes = ref([]);
const assetcategories = ref([]);
const editDialogue = ref(false)
const addDialogue = ref(false)
const item = ref({})


const router = useRouter();
const user = Utils.getStore("user");
const message = ref("Search, Edit or Delete Tutorials");
const headers = [
    {title: 'Name', value: 'name'},
    {title: 'Circulatable', value: 'circulatable'},
    {title: 'Created', value: 'createdAt'},
    {title: 'Category', value: 'categoryName'},
    {title: '', value: 'actions', align: 'end'},
];

const updateAssetTypes = async (id) => {
  const data = {
    name: assetTypes.value.name,
    description: assetTypes.value.description,
  };
  try {
    const response = await TypeServices.update(props.id, data);
    assetTypes.value.id = response.data.id;
    router.push({ name: "asset-type" });
  } catch (e) {
    message.value = e.response.data.message;
  }
};

const addAssetType = (data) => {
  router.push({ name: "asset-type", params: { assetId: props.id } });
};

const deleteAssetTypes = () => {
  TypeServices.deleteAssetType()
    .then(() => {
        retrieveAssetTypes();
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const retrieveAssetTypes = async () => {
  assetcategories.value = (await CatServices.getAllAssetCats())?.data;
  if(!assetcategories.value){
    console.log("error getting asset categories")
    return 
  }
    
  TypeServices.getAllAssetTypes()
    .then((response) => {
      assetTypes.value = response.data;
      assetTypes.value = assetTypes.value.map(assetType => {
        return {
            ...assetType,
            categoryName: assetcategories.value.find(cat => cat.id == assetType.categoryId)?.name,
        };
      });
      console.log(assetTypes.value)
    })
    .catch((e) => {
        console.log(e)
      message.value = e.response.data.message;
    });
};

// const openDialog = (itemId) => {
//   if (itemId != undefined && itemId != null){
//     item.value = assetTypes.value?.find(cat => cat.id == itemId);
//     editDialogue.value = true;
//   }
//   else {
//     addDialogue.value = true;
//   }
// }


// const closeDialog = () => {
//   editDialogue.value = false;
//   addDialogue.value = false;
//   item.value = {}; // Reset item
// }


onMounted(() => {
    retrieveAssetTypes();
}) 
</script>

<template>
  <v-container class="space">  
    <v-toolbar>
        <v-toolbar-title>Asset Type Management</v-toolbar-title>
    </v-toolbar>

  <br>
    <v-row>
      <v-spacer></v-spacer>
      <v-col align="right">
        <v-btn color="primary" @click="openDialog(null)">
          Add
        </v-btn>
      </v-col>
    </v-row>

  <v-row>
      <v-col>
        <v-card>
          <v-data-table
            :headers ="headers"
            :items ="assetTypes"
            item-key ="id"
          >

            <template v-slot:[`item.actions`]="{ item }">
              <v-btn class="ma-2" color="primary" icon="mdi-pencil" size="small" @click="">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                class="ma-2"
                color="primary"
                variant="outlined"
                icon="mdi-trash-can"
                @click=""
                ></v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container> 

  <!-- <v-container fluid>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="">
          Add
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-table>
            <thead>
              <tr>
                <th class="">
                  Name
                </th>
                <th class="">
                  Circulatable
                </th>
                <th class="">
                  Created
                </th>
                <th class="">
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in assetTypes" :key="item.id">
                
                <td class="column">{{ item.name }}</td>
                <td class="column">{{ item.circulatable }}</td>
                <td class="column">{{ item.createdAt }}</td>
                <td class="column">{{ item.category }}</td>
                <td class="text-right column">
                  <v-btn color="primary" @click="">
                    Edit
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>  -->
</template>

<style>
    th.column,
    td.column{
        width: 33.3%;
    }
    .space{
        padding-left: 5%;
        padding-right: 5%;
        margin-top: 1%;
    }
</style>