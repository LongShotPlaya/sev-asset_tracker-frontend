<template>
  <v-toolbar>
    <v-toolbar-title>Manage Asset Categories</v-toolbar-title>
  </v-toolbar>
  <v-card class="space">
    <v-table>
      <thead>
        <tr>
          <th class="text-left column">
            Name
          </th>
          <th class="text- column">
            Description
          </th>
          <th class="text-left column">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in assetcategories" :key="item.name">
          <td class="column">{{ item.name }}</td>
          <td class="column">{{ item.description }}</td>
          <td class="column">
            <v-btn color="primary" @click="openDialog(item)">
              Edit
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>

<!--Call the AssetCatAddEdit component-->
  <v-dialog v-model="dialog" persistent max-width="800px">  
    <AssetCatAddEdit :item="item" @close="closeDialog" :save-function="saveAssetCat" :edit-function="editAssetCat"/> 
  </v-dialog>

<!-- 
  <v-dialog v-model="dialog" persistent max-width="800px">
    <v-card>
      <v-container>
        <v-card-title class="text-h5">
          <v-text-field
            v-model="item.name"
            id="name"
            :counter="50"
            label="Name"
            required
          ></v-text-field>
        </v-card-title>
        <v-textarea
          v-model="item.description"
          id="description"
          :counter="50"
          label="Description"
          required
        ></v-textarea>
      
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" variant="text" @click=f"deleteAssetCats">
            Delete
          </v-btn>
          <v-btn color="green-darken-1" variant="text" @click="updateAssetCats">
            Save
          </v-btn>
          <v-btn color="orange" variant="text" @click="closeDialog">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog> -->

  <v-btn color="primary" @click="addAssetCats">
    Add
  </v-btn>
</template>

<script setup>
import Utils from "../config/utils.js";
import CatServices from "../services/assetCatServices.js";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AssetCatAddEdit from "../components/AssetCatAddEdit.vue"; 

const assetcategories = ref([]);
const dialog = ref(false)
const item = ref({})

const router = useRouter();
const tutorials = ref([]);
const user = Utils.getStore("user");
const message = ref("Search, Edit or Delete Categories");


const updateAssetCats = async (id) => {
  const data = {
    name: assetcategories.value.name,
    description: assetcategories.value.description,
  };
  try {
    const response = await CatServices.update(props.id, data);
    assetcategories.value.id = response.data.id; //check to see if the cat id matches the responce id
    router.push({ name: "asset-category" });  //then push the reponse to asset cat
  } catch (e) {
    message.value = e.response.data.message;
  }
  closeDialog();
};

const addAssetCats = (data) => {
  openDialog({});
};

// save function
const saveAssetCat = async (newItemData) => {
  retrieveAssetCats();
};

//edit function 
const editAssetCat = (itemData) => {
  console.log('Editing asset:', itemData);
  closeDialog(); 
};


const deleteAssetCats = () => {
  CatServices.deleteAssetCat()
    .then(() => {
      retrieveAssetCats();
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const retrieveAssetCats = () => {
  CatServices.getAllAssetCats()
    .then((response) => {
      assetcategories.value = response.data;
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const openDialog = (itemData) => { 
  const newItem = { ...itemData }; // Copy the item data 
  item.value = newItem;  // Update the item value with the new copy
  dialog.value = true;
}


const closeDialog = () => {
  dialog.value = false;
  item.value = {}; // Reset item
}


onMounted(() => {
  retrieveAssetCats();
}) 

</script>

<style>
  th.column,
  td.column{
    width: auto;
  }
  .space{
    margin-left: 2%;
    margin-right: 2%;
    margin-top: 2%;
  }
</style>
