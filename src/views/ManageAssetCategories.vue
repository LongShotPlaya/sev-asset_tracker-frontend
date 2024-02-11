<template>
  <v-toolbar>
    <v-toolbar-title>Manage Asset Categories</v-toolbar-title>
  </v-toolbar>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">
          Name
        </th>
        <th class="text-left">
          Description
        </th>
        <th class="text-left">
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in categories" :key="item.name">
        <td>{{ item.name }}</td>
        <td>{{ item.description }}</td>
        <td>
          <v-btn color="primary" @click="openDialog(item)">
            Edit
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>

  <v-dialog v-model="dialog" persistent max-width="800px">
    <v-card>
      <v-card-title class="text-h5">
        <v-text-field
          v-model="item.name"
          id="name"
          :counter="50"
          label="Name"
          required
        ></v-text-field>
      </v-card-title>
      <v-text-field
        v-model="item.description"
        id="description"
        :counter="50"
        label="Description"
        required
      ></v-text-field>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-1" variant="text" @click="saveChanges">
          Save
        </v-btn>
        <v-btn color="green-darken-1" variant="text" @click="closeDialog">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Add button to trigger the "Add" functionality -->
  <v-btn color="primary" @click="addCategory">
    Add
  </v-btn>
</template>

<script>
export default {
  data() {
    return {
      categories: [
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
      ],
      dialog: false,
      item: {},
    };
  },
  methods: {
    openDialog(item) {
      this.item = { ...item };
      this.dialog = true;
    },
    saveChanges() {
      // Handle save logic here
      if (this.categories.includes(this.item)) {
        // Update existing item
        const index = this.categories.indexOf(this.item);
        this.$set(this.categories, index, { ...this.item });
      } else {
        // Add new item
        this.categories.push({ ...this.item });
      }

      this.closeDialog();
    },
    closeDialog() {
      this.dialog = false;
      this.item = {}; // Reset item
    },
    addCategory() {
      // Initialize item for adding a new category
      this.item = { name: '', description: '' };
      this.dialog = true;
    },
  },
};
</script>
