import Vue from "vue";
import VueRouter from "vue-router";

import Auth from "@/components/Auth";
import Home from "@/components/Home";
import Motherboards from "@/components/Motherboards";
import MotherboardsForm from "@/components/MotherboardsForm";
import Marca from "@/components/Marca";

Vue.use(VueRouter);

const routes = [
  { name: "auth", path: "/auth", component: Auth },
  { name: "home", path: "/", component: Home },
  { name: "home", path: "/home", component: Home },
  { name: "motherboards", path: "/motherboards", component: Motherboards },
  { name: "motherboards", path: "/motherboards/:id", component: Motherboards },
  {
    name: "motherboardsForm",
    path: "/motherboards/form",
    component: MotherboardsForm
  },
  {
    name: "motherboardsFormId",
    path: "/motherboards/form/:id",
    component: MotherboardsForm
  },
  { name: "marca", path: "/brands", component: Marca }
];

export default new VueRouter({
  mode: "history",
  routes: routes
});
