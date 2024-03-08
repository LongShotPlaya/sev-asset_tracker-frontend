<template>
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
  //script
  const editDialogue = ref(false)
  const deleteDialogue = ref(false)
  
  //define the item
  const item = ref({
    name: '',
    description: ''
  });

  // openDialog happens when the user clicks on the add or edit button
  const openDialog = (itemId) => {
    if (itemId != undefined && itemId != null){
      item.value = assetcategories.value?.find(cat => cat.id == itemId);
      editDialogue.value = true;
    }
    else {
      addDialogue.value = true;
    }
  }


  //handle the addAssetCat functionality 
  const addAssetCats = () => {
    // Retrieve input values, validate, make API call, update UI, close dialog, handle errors, etc.
  };

  //handle the updateAssetCat functionality 
  const updateAssetCats = () => {
    // TODO
  };

  //handle the deleteAssetCat functionality?
</script>



<style>
</style>