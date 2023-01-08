import { createApp } from "vue";
import { createPinia } from "pinia";
import VNetworkGraph from "v-network-graph";
import "v-network-graph/lib/style.css";
import "@/style.css";
import App from "@/App.vue";
import router from "@/router/index";

const pinia = createPinia();

pinia.use((context) => {
  const storeId = context.store.$id;
  const serializer = {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  };
  const fromStorage = serializer.deserialize(
    window.localStorage.getItem(storeId)
  );
  if (fromStorage) {
    context.store.$patch(fromStorage);
  }

  context.store.$subscribe((mutation, state) => {
    window.localStorage.setItem(storeId, serializer.serialize(state));
  });
});

createApp(App).use(router).use(pinia).use(VNetworkGraph).mount("#app");
