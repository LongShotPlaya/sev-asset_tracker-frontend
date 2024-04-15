<script setup>
//This is referencing EditLesson.vue
import assetCatServices from "../services/assetCatServices";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(true);
const asset = ref({
  id: null,
  name: "",
  description: "",
  published: false,
});
const message = ref("Enter data and click save");

const props = defineProps({
  assetId: {
    required: true,
  },
});

const saveAsset = () => {
  const data = {
    name: asset.value.name,
    description: asset.value.description,
    assetId: props.assetId,
  };
  assetCatServices.createAssetCat(data)
    .then((response) => {
      asset.value.id = response.data.id;

      router.push({ name: "view", params: { id: props.assetId } });
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const cancel = () => {
  router.push({ name: "view", params: { id: props.assetId } });
};
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Asset Category Add/Edit</v-toolbar-title>
      </v-toolbar>
      <br />
      <h4>{{ message }}</h4>
      <br />
      <h4>Asset: {{ assetId }}</h4>
      <br />
      <v-form ref="form" v-model="valid" lazy validation>
        <!-- Edit the asset category name -->
        <v-text-field
          v-model="asset.name"
          id="title"
          :counter="50"
          label="Title"
          required
        ></v-text-field>
        <!-- Edit the asset category description -->
        <v-text-field
          v-model="asset.description"
          id="description"
          :counter="50"
          label="Description"
          required
        ></v-text-field>

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="saveAsset"
        >
          Save
        </v-btn>

        <v-btn color="error" class="mr-4" @click="cancel"> Cancel </v-btn>
      </v-form>
    </v-container>
  </div>
</template>
