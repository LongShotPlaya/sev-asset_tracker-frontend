<template>
 

  <v-container class="space">
    <v-toolbar>
      <v-toolbar-title>Manage Asset Categories</v-toolbar-title>
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
          <v-data-table>
            <thead>
              <tr style="background-color: rgb(129, 20, 41)">
                <th class="text-left column, fontcolor">
                  Name
                </th>
                <th class="text- column , fontcolor">
                  Description
                </th>
                <th class="text-right column">
                  
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in assetcategories" :key="item.id">
                <td class="column">{{ item.name }}</td>
                <td class="column">{{ item.description }}</td>
                <td class="text-right column">
                  <v-btn class="ma-2" color="primary" icon="mdi-pencil"  @click="openDialog(item.id)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    class="ma-2"
                    color="primary"
                    variant="outlined"
                    icon="mdi-trash-can"
                    @click="openDeleteDialogue"
                  ></v-btn>
                </td>
              </tr>
            </tbody>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  
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

  <!-- delete pop-up -->
  <v-dialog v-model="deleteDialogue" persistent max-width="800px">
    <v-card>
      <v-container>
        <v-card-title class="text-h5, space2" align="center">Are you sure you want to delete this category?</v-card-title>
        <v-row justify="center">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="outlined"  @click="deleteAssetCats">
              Yes
            </v-btn>
            <v-btn color="grey-darken-3" variant="outlined" @click="closeDialog">
              No
            </v-btn>
          </v-card-actions>
        </v-row>
        
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
const deleteDialogue = ref(false)
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

const openDeleteDialogue = () =>{
  deleteDialogue.value = true;
}


const closeDialog = () => {
  editDialogue.value = false;
  addDialogue.value = false;
  deleteDialogue.value = false;
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
    padding-left: 5%;
    padding-right: 5%;
    margin-top: 1%;
  }

  .space2{
    margin-bottom: 4%;
    margin-top: 1%;
  }

  .fontcolor{
    color: rgb(255, 255, 255);
  }
</style>
