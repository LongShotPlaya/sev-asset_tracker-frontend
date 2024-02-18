<template>
  <v-toolbar>
    <v-toolbar-title>Manage Asset Categories</v-toolbar-title>
  </v-toolbar>
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
      <tr v-for="item in categories" :key="item.name">
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
          <v-btn color="red" variant="text" @click="saveChanges">
            Delete
          </v-btn>
          <v-btn color="green-darken-1" variant="text" @click="saveChanges">
            Save
          </v-btn>
          <v-btn color="orange" variant="text" @click="closeDialog">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>

  <!-- Add button to trigger the "Add" functionality -->
  <v-btn color="primary" @click="addCategory">
    Add
  </v-btn>
</template>

<script setup>
import Utils from "../config/utils.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const categories = ref([
  {
    name: 'Vehicle',
    description: 'For vehicle-based assets. This description is super long because I want to see if the text wraps. If this keeps going than it did not wrap which will need to be fixed because no one wants a really wide web page.',
  },
  {
    name: 'Electronics',
    description: 'For electronic-based assets.',
  },
  {
    name: 'Building',
    description: 'For building-based assets.',
  },
])
const dialog = ref(false)
const item = ref({})

const router = useRouter();
const tutorials = ref([]);
const user = Utils.getStore("user");
const message = ref("Search, Edit or Delete Tutorials");

const editTutorial = (tutorial) => {
  router.push({ name: "edit", params: { id: tutorial.id } });
};

const viewTutorial = (tutorial) => {
  router.push({ name: "view", params: { id: tutorial.id } });
};

const deleteTutorial = (tutorial) => {
  TutorialServices.delete(tutorial.id)
    .then(() => {
      retrieveTutorials();
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

// const retrieveTutorials = () => {
//   TutorialServices.getAllForUser(user.userId)
//     .then((response) => {
//       tutorials.value = response.data;
//     })
//     .catch((e) => {
//       message.value = e.response.data.message;
//     });
// };

const openDialog = (item) => {
  item.value = { ...item };
  dialog.value = true;
}

const saveChanges = () => {
  // Handle save logic here
  if (categories.value.includes(item.value)) {
    // Update existing item
    // const index = categories.value.indexOf(item.value);
    // this.$set(this.categories, index, { ...item.value });
  } else {
    // Add new item
    //categories.value.push({ ...item.value });
  }


  closeDialog();
}

const closeDialog = () => {
  dialog.value = false;
  item.value = {}; // Reset item
}

const addCategory = () => {
  // Initialize item for adding a new category
  item.value = { name: '', description: '' };
  dialog.value = true;
}

//retrieveTutorials();
</script>

<style>
  th.column,
  td.column{
    width: 33.33%;
  }
</style>
