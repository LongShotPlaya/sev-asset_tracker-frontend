import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
// import TutorialsList from "./views/TutorialsList.vue";
// import EditTutorial from "./views/EditTutorial.vue";
// import AddTutorial from "./views/AddTutorial.vue";
// import ViewTutorial from "./views/ViewTutorial.vue";
// import AddLesson from "./views/AddLesson.vue";
// import EditLesson from "./views/EditLesson.vue";
import AllAssets from "./views/AllAssets.vue";
import AssetData from "./views/AllAssets/Data.vue";
import AssetType from "./views/AssetType.vue"; //Make page
import AssetCat from "./views/AssetCat.vue"; //Make page
import AssetField from "./views/AssetField.vue"; //Make page
import AssetTemplate from "./views/AssetTemplate.vue"; //Make page
import Alerts from "./view/Alert.vue";
import AlertType from "./view/AlertType.vue";
//Make all following pages
import Building from "./view/Building.vue";
import FieldList from "./view/FieldList.vue";
import FieldListOption from "./view/FieldListOption.vue";
import Group from "./view/Group.vue";
import Log from "./view/Log.vue";
import Notification from "./view/Notification.vue";
import Permission from "./view/Permission.vue";
import Person from "./view/Person.vue";
import Room from "./view/Person.vue";
import TemplateData from "./view/TemplateData.vue";
import Vendor from "./view/Vendor.vue";


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
      path: "/assets/data",
      name: "data",
      component: AssetData,
    },
    {
      path: "/asset/type",
      name: "type",
      component: AssetType,
    },
    {
      path: "/asset/category",
      name: "category",
      component: AssetCat,
    },
    {
      path: "/asset/field",
      name: "field",
      component: AssetField,
    },
    {
      path: "/asset/template",
      name: "template",
      component: AssetTemplate,
    },
    {
      path: "/alert",
      name: "/alert",
      component: Alerts,
    },
    {
      path: "/alertType",
      name: "/alerts",
      component: AlertType,
    },
    {
      path: "/buildings",
      name: "buildings",
      component: Building,
    },
    {
      path: "/fieldList",
      name: "fieldList",
      component: FieldList,
    },
    {
      path: "/fieldList/option",
      name: "option",
      component: FieldListOption,
    },
    {
      path: "/group",
      name: "group",
      component: Group,
    },
    {
      path: "/log",
      name: "log",
      component: Log,
    },
    {
      path: "/notification",
      name: "notification",
      component: Notification,
    },
    {
      path: "/permission",
      name: "permission",
      component: Permission,
    },
    {
      path: "/person",
      name: "person",
      component: Person,
    },
    {
      path: "/room",
      name: "room",
      component: Room,
    },
    {
      path: "/templateData",
      name: "tamplateData",
      component: TemplateData,
    },
    {
      path: "/vendor",
      name: "vendor",
      component: Vendor,
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
