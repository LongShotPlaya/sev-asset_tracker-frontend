<template>
  <v-toolbar>
    <v-toolbar-title>Manage Asset Categories</v-toolbar-title>
  </v-toolbar>

  <v-card class="space2"> 
    <v-btn color="primary" @click="openDialog(null)">
      Add
    </v-btn>
  </v-card>

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
          <th class="text-right column">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in assetcategories" :key="item.id">
          <td class="column">{{ item.name }}</td>
          <td class="column">{{ item.description }}</td>
          <td class="text-right column">
            <v-btn color="primary" @click="openDialog(item.id)">
              Edit
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
  
  <!-- add pop-up -->
  <v-dialog v-model="addDialogue" persistent max-width="800px">
    <v-card>
      <v-container>
        <v-card-title class="text-h5">Add</v-card-title>
        <v-text-field
          v-model="item.name"
          id="name"
          :counter="50"
          label="Name"
          required
        ></v-text-field>
        
        <v-textarea
          v-model="item.description"
          id="description"
          :counter="50"
          label="Description"
          required
        ></v-textarea>
      
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="outlined" @click="addAssetCats">
            Save
          </v-btn>
          <v-btn color="grey-darken-3" variant="outlined" @click="closeDialog">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>

  <!-- edit pop-up -->
  <v-dialog v-model="editDialogue" persistent max-width="800px">
    
    <v-card>
      <v-container>
        <v-card-title class="text-h5">Edit</v-card-title>
        <v-text-field
          v-model="item.name"
          id="name"
          :counter="50"
          label="Name"
          required
        ></v-text-field>
        
        <v-textarea
          v-model="item.description"
          id="description"
          :counter="50"
          label="Description"
          required
        ></v-textarea>
      
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="outlined" @click="deleteAssetCats">
            Delete
          </v-btn>
          <v-btn color="green" variant="outlined" @click="updateAssetCats">
            Save
          </v-btn>
          <v-btn color="grey-darken-3" variant="outlined" @click="closeDialog">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>

  
  
</template>



<script setup>
import Utils from "../config/utils.js";
import CatServices from "../services/assetCatServices.js";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const assetcategories = ref([]);
const editDialogue = ref(false)
const addDialogue = ref(false)
const item = ref({})

const router = useRouter();
const tutorials = ref([]);
const user = Utils.getStore("user");
const message = ref("Search, Edit or Delete Tutorials");

const updateAssetCats = async (id) => {
  const data = {
    name: assetcategories.value.name,
    description: assetcategories.value.description,
  };
  try {
    const response = await CatServices.update(props.id, data);
    assetcategories.value.id = response.data.id;
    router.push({ name: "asset-category" });
  } catch (e) {
    message.value = e.response.data.message;
  }
  closeDialog();
};

const addAssetCats = (data) => {
  router.push({ name: "asset-category", params: { assetId: props.id } });
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

const openDialog = (itemId) => {
  if (itemId != undefined && itemId != null){
    item.value = assetcategories.value?.find(cat => cat.id == itemId);
    editDialogue.value = true;
  }
  else {
    addDialogue.value = true;
  }
}


const closeDialog = () => {
  editDialogue.value = false;
  addDialogue.value = false;
  item.value = {}; // Reset item
}


onMounted(() => {
  retrieveAssetCats();
}) 

</script>

<style>
  th.column,
  td.column{
    width: 33.3%;
  }
  .space{
    margin-left: 2%;
    margin-right: 2%;
    margin-top: 2%;
  }

  .space2{
    margin-left: 2%;
    margin-right: 93.6%;
    margin-top: 2%;
  }
</style>
