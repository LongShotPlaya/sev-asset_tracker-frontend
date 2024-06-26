import { createRouter, createWebHistory } from "vue-router";

import AlertTypeManagement from "./views/AlertTypeManagement.vue";
import AllAssets from "./views/AllAssets.vue";
import Asset from "./views/EditAsset.vue";
import AssetTypeManagement from "./views/AssetTypeManagement.vue";
import AssetCatManagement from "./views/AssetCatManagement.vue";
import AssetTemplateManagement from "./views/AssetTemplateManagement.vue";
import EditAssetType from "./views/EditAssetType.vue";
import EditAssetTemplate from "./views/EditAssetTemplate.vue";
import FieldListManagement from "./views/FieldListManagement.vue"; //here for dropdowns
import GenerateReports from "./views/GenerateReports.vue";
import GroupManagement from "./views/GroupManagement.vue";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import PersonManagement from "./views/PersonManagement.vue";
import VendorManagement from "./views/VendorManagement.vue";
import ViewPerson from './views/EditPerson.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/home",
      name: "home",
      component: Home,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/alert-types",
      name: "alert-types",
      component: AlertTypeManagement,
    },
    {
      path: "/assets",
      name: "assets",
      component: AllAssets,
    },
    {
      path: "/assets/add",
      name: "add-asset",
      component: Asset,
    },
    {
      path: "/assets/:id",
      name: "asset",
      component: Asset,
      props: true,
    },
    {
      path: "/asset-types",
      name: "asset-types",
      component: AssetTypeManagement,
    },
    {
      path: "/asset-types/add",
      name: "asset-type-add",
      component: EditAssetType,
    },
    {
      path: "/asset-types/:id",
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
      path: "/asset-templates/add",
      name: "asset-template-add",
      component: EditAssetTemplate,
    },
    {
      path: "/asset-templates/:id",
      name: "asset-template-edit",
      component: EditAssetTemplate,
      props: true,
    },
    // {
    //   path: "/field-list",
    //   name: "field-list",
    //   component: FieldListManagement,
    // },
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
      path: "/people/:id", 
      name: "person",
      component: ViewPerson,
      props: true,
    },    
    {
      path: "/reports",
      name: "reports",
      component: GenerateReports,
    },
    // {
    //   path: "/vendors",
    //   name: "vendors",
    //   component: VendorManagement,
    // },
  ],
});

export default router;