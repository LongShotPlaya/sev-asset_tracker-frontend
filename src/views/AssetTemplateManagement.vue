<script setup>
import Utils from "../config/utils.js";
import TemplateServices from "../services/assetTemplateServices.js";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { format } from "@formkit/tempo";

const assetTemplates = ref([]);
const deleteDialogue = ref(false)
const item = ref({})


const router = useRouter();
const user = Utils.getStore("user");
const message = ref("Search, Edit or Delete Tutorials");
const headers = [
    {title: 'Name', value: 'name', sortable: true },
    {title: 'Type', value: 'typeName', sortable: true },
    {title: 'Category', value: 'categoryName', sortable: true },
    {title: '', value: 'actions', align: 'end'},
];

const updateAssetTemplates = async (id) => {
  const data = {
    name: assetTemplates.value.name,
    description: assetTemplates.value.description,
  };
  try {
    const response = await TemplateServices.updateAssetTemplate(props.id, data);
    assetTemplates.value.id = response.data.id;
    router.push({ name: "asset-type" });
  } catch (e) {
    message.value = e.response.data.message;
  }
};

// const addAssetTemplate = (data) => {
//   router.push({ name: "asset-type", params: { assetId: props.id } });
// };

const deleteAssetTemplate = () => {
  if(!isNaN(parseInt(item.value.id))){
    TemplateServices.deleteAssetTemplate(item.value.id)
      .then(() => {
        retrieveAssetTemplates();
        deleteDialogue.value = false;
      })
      .catch((e) => {
        message.value = e.response.data.message;
        deleteDialogue.value = false;
      });
  }
  else{
    deleteDialogue.value = false;
  }
};

const openDeleteDialogue = (itemId) =>{
  item.value = assetTemplates.value?.find(cat => cat.id == itemId);
  deleteDialogue.value = true;
}

const closeDialog = () => {
  deleteDialogue.value = false;
  item.value = {}; // Reset item
}

const addEditLink = (id) => {
    router.push({
        name: "",
        params: {id},
    });
}

const retrieveAssetTemplates = async () => {
  assetTemplates.value = (await TemplateServices.getAllAssetTemplates())?.data;
  if(!assetTemplates.value){
    console.log("error getting asset categories")
    return 
  }
    
  TemplateServices.getAllAssetTemplates()
    .then((response) => {
      assetTemplates.value = response.data;
      assetTemplates.value = assetTemplates.value.map(assetTemplate => {
        return {
          ...assetTemplate,
          categoryName: assetTemplate.assetType.category.name,
          typeName: assetTemplate.assetType.name
          
        };
      });
      assetTemplates.value.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
      console.log(assetTemplates.value)
    })
    .catch((e) => {
        console.log(e)
      message.value = e.response.data.message;
    });
};

onMounted(() => {
    retrieveAssetTemplates();
})

</script>

<template>
    <v-container class="space">  
    <v-toolbar>
        <v-toolbar-title>Asset Template Management</v-toolbar-title>
    </v-toolbar>

  <br>
    <v-row>
      <v-spacer></v-spacer>
      <v-col align="right">
        <v-btn color="primary" @click="addEditLink('add')">
          Add
        </v-btn>
      </v-col>
    </v-row>

  <v-row>
      <v-col>
        <v-card>
          <v-data-table
            :headers ="headers"
            :items ="assetTemplates"
            item-key ="id"
          >

            <template v-slot:[`item.actions`]="{ item }">
              <v-btn class="ma-2" color="primary" icon="mdi-pencil" @click="addEditLink(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                class="ma-2"
                color="primary"
                variant="outlined"
                icon="mdi-trash-can"
                @click="openDeleteDialogue(item.id)"
                ></v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

<!-- Delete Dialog -->
  <v-dialog v-model="deleteDialogue" persistent max-width="800px">
    <v-card>
      <v-container>
        <v-card-title class="text-h5, space2" align="center">Are you sure you want to delete this template?</v-card-title>
        <v-row justify="center">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="outlined"  @click="deleteAssetTemplate">
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