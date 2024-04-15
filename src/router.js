import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import AllAssets from "./views/AllAssets.vue";
import AssetData from "./views/AssetData.vue";
import AssetManagement from "./views/AssetManagement.vue";
import AssetTypeManagement from "./views/AssetTypeManagement.vue";
import AssetCatManagement from "./views/ManageAssetCategories.vue";
import AssetTemplateManagement from "./views/AssetTemplateManagement.vue";
import AssetFieldManagement from "./views/AssetFieldManagement.vue";
import BuildingManagement from "./views/BuildingManagement.vue";
import GroupManagement from "./views/GroupManagement.vue";
import PersonManagement from "./views/PersonManagement.vue";
import ViewPerson from './views/EditPerson.vue';
import RoomManagement from "./views/RoomManagement.vue";
import TemplateDataManagement from "./views/TemplateDataManagement.vue";
import VendorManagement from "./views/VendorManagement.vue";
import GenerateReports from "./views/GenerateReports.vue";
import EditAssetType from "./views/EditAssetType.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/home",
      name: "home",
      component: Home,
    },
    {
      path: "/assets",
      name: "assets",
      component: AllAssets,
    },
    {
      path: "/asset/:id?",
      name: "asset",
      component: AssetManagement,
      props: true,
    },
    {
      path: "/asset-data",
      name: "asset-data",
      component: AssetData,
    },
    {
      path: "/asset-type",
      name: "asset-type",
      component: AssetTypeManagement,
    },
    {
      path: "/asset-type/:id",
      name: "asset-type-edit",
      component: EditAssetType,
      props: true,
    },
    {
      path: "/asset-categories",
      name: "asset-categories",
      component: AssetCatManagement,
    },
    {
      path: "/asset-templates",
      name: "asset-templates",
      component: AssetTemplateManagement,
    },
    {
      path: "/asset-fields",
      name: "asset-fields",
      component: AssetFieldManagement,
    },
    {
      path: "/buildings",
      name: "buildings",
      component: BuildingManagement,
    },
    {
      path: "/groups",
      name: "groups",
      component: GroupManagement,
    },
    {
      path: "/people",
      name: "people",
      component: PersonManagement,
    },
    {
      path: "/person/:id", 
      name: "person",
      component: ViewPerson,
      props: true,
    },    
    {
      path: "/reports",
      name: "reports",
      component: GenerateReports,
    },
    {
      path: "/rooms",
      name: "rooms",
      component: RoomManagement,
    },
    {
      path: "/template-data",
      name: "template-data",
      component: TemplateDataManagement,
    },
    {
      path: "/vendors",
      name: "vendors",
      component: VendorManagement,
    },
  ],
});

export default router;
