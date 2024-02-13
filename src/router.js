import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
// import TutorialsList from "./views/TutorialsList.vue";
// import EditTutorial from "./views/EditTutorial.vue";
// import AddTutorial from "./views/AddTutorial.vue";
// import ViewTutorial from "./views/ViewTutorial.vue";
// import AddLesson from "./views/AddLesson.vue";
// import EditLesson from "./views/EditLesson.vue";
import AllAssets from "./views/AllAssets.vue";
import AssetData from "./views/AssetData.vue";
import AssetTypeManagement from "./views/AssetTypeManagement.vue";
import AssetCatManagement from "./views/AssetCatManagement.vue";
import AssetTemplateManagement from "./views/AssetTemplateManagement.vue";
import BuildingManagement from "./views/BuildingManagement.vue";
import GroupManagement from "./views/GroupManagement.vue";
import PersonManagement from "./views/PersonManagement.vue";
import RoomManagement from "./views/RoomManagement.vue";
import TemplateDataManagement from "./views/TemplateDataManagement.vue";
import VendorManagement from "./views/VendorManagement.vue";


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
      path: "/assets",
      name: "assets",
      component: AllAssets,
    },
    {
      path: "/assetData",
      name: "data",
      component: AssetData,
    },
    {
      path: "/assetType",
      name: "type",
      component: AssetTypeManagement,
    },
    {
      path: "/asset/category",
      name: "category",
      component: AssetCatManagement,
    },
    {
      path: "/asset/template",
      name: "template",
      component: AssetTemplateManagement,
    },
    {
      path: "/buildingManagement",
      name: "buildingsManagement",
      component: BuildingManagement,
    },
    {
      path: "/groupManagement",
      name: "groupManagement",
      component: GroupManagement,
    },
    {
      path: "/personManagement",
      name: "personManagement",
      component: PersonManagement,
    },
    {
      path: "/roomManagement",
      name: "roomManagement",
      component: RoomManagement,
    },
    {
      path: "/templateDataManagement",
      name: "tamplateDataManagement",
      component: TemplateDataManagement,
    },
    {
      path: "/vendorManagement",
      name: "vendorManagement",
      component: VendorManagement,
    },
    //{
    //   path: "/tutorials",
    //   name: "tutorials",
    //   component: TutorialsList,
    // },
    // {
    //   path: "/edit/:id",
    //   name: "edit",
    //   component: EditTutorial,
    //   props: true,
    // },
    // {
    //   path: "/add",
    //   name: "add",
    //   component: AddTutorial,
    // },
    // {
    //   path: "/view/:id",
    //   name: "view",
    //   component: ViewTutorial,
    //   props: true,
    // },
    // {
    //   path: "/addLesson/:tutorialId",
    //   name: "addLesson",
    //   component: AddLesson,
    //   props: true,
    // },
    // {
    //   path: "/editLesson/:tutorialId/:lessonId",
    //   name: "editLesson",
    //   component: EditLesson,
    //   props: true,
    // },
  ],
});

export default router;
