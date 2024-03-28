<script setup>
import Utils from "../config/utils.js";
import TypeServices from "../services/assetTypeManagementServices.js";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const assetTypes = ref([]);
const editDialogue = ref(false)
const addDialogue = ref(false)
const item = ref({})

const router = useRouter();
const user = Utils.getStore("user");
const message = ref("Search, Edit or Delete Tutorials");

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

const retrieveAssetTypes = () => {
  TypeServices.getAllAssetTypes()
    .then((response) => {
      assetTypes.value = response.data;
    })
    .catch((e) => {
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
    <v-toolbar>
    <v-toolbar-title>Asset Type Management</v-toolbar-title>
  </v-toolbar>

  <v-container fluid>
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
  </v-container> 
</template>

<style>
th.column,
  td.column{
    width: 33.3%;
  }
</style>