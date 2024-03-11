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
    assetCatServices.createAssetCat(item.value)
      .then((response) => {
        const newAssetCat = response.data;
        assetcategories.value.push(newAssetCat);

        // Close the dialog
        addDialogue.value = false;
      })
      .catch((error) => {
        console.error("Error adding asset category:", error);
      });
  };

  //handle the updateAssetCat functionality 
  const updateAssetCats = () => {    
    assetCatServices.updateAssetCat(item.value.id, item.value)
      .then((response) => {
        const updatedAssetCat = response.data;
        const index = assetcategories.value.findIndex(cat => cat.id === updatedAssetCat.id);
        if (index !== -1) {
          assetcategories.value.splice(index, 1, updatedAssetCat);
        }

        // Close the dialog
        editDialogue.value = false;
      })
      .catch((error) => {
        console.error("Error updating asset category:", error);
      });
  };

  //handle the deleteAssetCat functionality?
  const deleteAssetCat = () => {
    const assetCatIdToDelete = item.value.id;

    assetCatServices.deleteAssetCat(assetCatIdToDelete)
      .then(() => {
        // Assuming the deletion was successful
        const index = assetcategories.value.findIndex(cat => cat.id === assetCatIdToDelete);
        if (index !== -1) {
          assetcategories.value.splice(index, 1);
        }

        // Close the dialog 
        editDialogue.value = false; 
      })
      .catch((error) => {
        console.error("Error deleting asset category:", error);
      });
  };

</script>



<style>
</style>