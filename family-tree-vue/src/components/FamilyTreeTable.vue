<template>
  <div class="table-container">
    <div class="table-column">
      <div class="table-row-1">
        <div v-if="store.hasFather(focusedPerson.id)">
          <div>
            {{ store.hasFather(focusedPerson.id).firstName }}
            {{ store.hasFather(focusedPerson.id).lastName }}
          </div>
          {{ store.hasFather(focusedPerson.id).birthDate }}
        </div>
      </div>
      <div class="table-row-1">
        <div v-if="store.hasMother(focusedPerson.id)">
          <div>
            {{ store.hasMother(focusedPerson.id).firstName }}
            {{ store.hasMother(focusedPerson.id).lastName }}
          </div>
          {{ store.hasMother(focusedPerson.id).birthDate }}
        </div>
      </div>
    </div>
    <div class="table-column">
      <div class="table-row-2">
        <div v-if="store.hasFather(store.hasFather(focusedPerson.id)?.id)">
          <div>
            {{
              store.hasFather(store.hasFather(focusedPerson.id).id).firstName
            }}
            {{ store.hasFather(store.hasFather(focusedPerson.id).id).lastName }}
          </div>
          {{ store.hasFather(store.hasFather(focusedPerson.id).id).birthDate }}
        </div>
      </div>
      <div class="table-row-2">
        <div v-if="store.hasMother(store.hasFather(focusedPerson.id)?.id)">
          <div>
            {{
              store.hasMother(store.hasFather(focusedPerson.id).id).firstName
            }}
            {{ store.hasMother(store.hasFather(focusedPerson.id).id).lastName }}
          </div>
          {{ store.hasMother(store.hasFather(focusedPerson.id).id).birthDate }}
        </div>
      </div>
      <div class="table-row-2">
        <div v-if="store.hasFather(store.hasMother(focusedPerson.id)?.id)">
          <div>
            {{
              store.hasFather(store.hasMother(focusedPerson.id).id).firstName
            }}
            {{ store.hasFather(store.hasMother(focusedPerson.id).id).lastName }}
          </div>
          {{ store.hasFather(store.hasMother(focusedPerson.id).id).birthDate }}
        </div>
      </div>
      <div class="table-row-2">
        <div v-if="store.hasMother(store.hasMother(focusedPerson.id)?.id)">
          <div>
            {{
              store.hasMother(store.hasMother(focusedPerson.id).id).firstName
            }}
            {{ store.hasMother(store.hasMother(focusedPerson.id).id).lastName }}
          </div>
          {{ store.hasMother(store.hasMother(focusedPerson.id).id).birthDate }}
        </div>
      </div>
    </div>
    <div class="table-column">
      <div class="table-row-3">
        <div
          v-if="
            store.hasFather(
              store.hasFather(store.hasFather(focusedPerson.id)?.id)?.id
            )
          "
        >
          <div>
            {{
              store.hasFather(
                store.hasFather(store.hasFather(focusedPerson.id).id).id
              ).firstName
            }}
            {{
              store.hasFather(
                store.hasFather(store.hasFather(focusedPerson.id).id).id
              ).lastName
            }}
          </div>
          {{
            store.hasFather(
              store.hasFather(store.hasFather(focusedPerson.id).id).id
            ).birthDate
          }}
        </div>
      </div>
      <div class="table-row-3">
        <div
          v-if="
            store.hasMother(
              store.hasFather(store.hasFather(focusedPerson.id)?.id)?.id
            )
          "
        >
          <div>
            {{
              store.hasMother(
                store.hasFather(store.hasFather(focusedPerson.id).id).id
              ).firstName
            }}
            {{
              store.hasMother(
                store.hasFather(store.hasFather(focusedPerson.id).id).id
              ).lastName
            }}
          </div>
          {{
            store.hasMother(
              store.hasFather(store.hasFather(focusedPerson.id).id).id
            ).birthDate
          }}
        </div>
      </div>
      <div class="table-row-3">
        <div
          v-if="
            store.hasFather(
              store.hasMother(store.hasFather(focusedPerson.id)?.id)?.id
            )
          "
        >
          <div>
            {{
              store.hasFather(
                store.hasMother(store.hasFather(focusedPerson.id).id).id
              ).firstName
            }}
            {{
              store.hasFather(
                store.hasMother(store.hasFather(focusedPerson.id).id).id
              ).lastName
            }}
          </div>
          {{
            store.hasFather(
              store.hasMother(store.hasFather(focusedPerson.id).id).id
            ).birthDate
          }}
        </div>
      </div>
      <div class="table-row-3">
        <div
          v-if="
            store.hasMother(
              store.hasMother(store.hasFather(focusedPerson.id)?.id)?.id
            )
          "
        >
          <div>
            {{
              store.hasMother(
                store.hasMother(store.hasFather(focusedPerson.id).id).id
              ).firstName
            }}
            {{
              store.hasMother(
                store.hasMother(store.hasFather(focusedPerson.id).id).id
              ).lastName
            }}
          </div>
          {{
            store.hasMother(
              store.hasMother(store.hasFather(focusedPerson.id).id).id
            ).birthDate
          }}
        </div>
      </div>
      <div class="table-row-3">
        <div
          v-if="
            store.hasFather(
              store.hasFather(store.hasMother(focusedPerson.id)?.id)?.id
            )
          "
        >
          <div>
            {{
              store.hasFather(
                store.hasFather(store.hasMother(focusedPerson.id).id).id
              ).firstName
            }}
            {{
              store.hasFather(
                store.hasFather(store.hasMother(focusedPerson.id).id).id
              ).lastName
            }}
          </div>
          {{
            store.hasFather(
              store.hasFather(store.hasMother(focusedPerson.id).id).id
            ).birthDate
          }}
        </div>
      </div>
      <div class="table-row-3">
        <div
          v-if="
            store.hasMother(
              store.hasFather(store.hasMother(focusedPerson.id)?.id)?.id
            )
          "
        >
          <div>
            {{
              store.hasMother(
                store.hasFather(store.hasMother(focusedPerson.id).id).id
              ).firstName
            }}
            {{
              store.hasMother(
                store.hasFather(store.hasMother(focusedPerson.id).id).id
              ).lastName
            }}
          </div>
          {{
            store.hasMother(
              store.hasFather(store.hasMother(focusedPerson.id).id).id
            ).birthDate
          }}
        </div>
      </div>
      <div class="table-row-3">
        <div
          v-if="
            store.hasFather(
              store.hasMother(store.hasMother(focusedPerson.id)?.id)?.id
            )
          "
        >
          <div>
            {{
              store.hasFather(
                store.hasMother(store.hasMother(focusedPerson.id).id).id
              ).firstName
            }}
            {{
              store.hasFather(
                store.hasMother(store.hasMother(focusedPerson.id).id).id
              ).lastName
            }}
          </div>
          {{
            store.hasFather(
              store.hasMother(store.hasMother(focusedPerson.id).id).id
            ).birthDate
          }}
        </div>
      </div>
      <div class="table-row-3">
        <div
          v-if="
            store.hasMother(
              store.hasMother(store.hasMother(focusedPerson.id)?.id)?.id
            )
          "
        >
          <div>
            {{
              store.hasMother(
                store.hasMother(store.hasMother(focusedPerson.id).id).id
              ).firstName
            }}
            {{
              store.hasMother(
                store.hasMother(store.hasMother(focusedPerson.id).id).id
              ).lastName
            }}
          </div>
          {{
            store.hasMother(
              store.hasMother(store.hasMother(focusedPerson.id).id).id
            ).birthDate
          }}
        </div>
      </div>
    </div>
  </div>
  <div class="kids-search-siblings">
    <div class="kids-container">
      <h2>Children</h2>
      <div
        v-if="store.getKids(focusedPerson.id)"
        v-for="kid in store.getKids(focusedPerson.id)"
      >
        <div>{{ kid.firstName }} {{ kid.lastName }}</div>
        <div>{{ kid.birthDate }}</div>
        <button @click="setFocus(kid.id)">Focus</button>
      </div>
    </div>
    <div>
      <div class="home">
        <div :style="{ marginTop: 10 + 'px' }">Find tree member</div>
        <input
          type="text"
          :value="search"
          class="searchbar"
          placeholder="Search by name, surname"
          @change="(e) => (search = e.target.value)"
        />
      </div>
      <div class="tree-person-list">
        <div
          v-if="treeUsersList?.nodes !== null"
          v-for="person in treeUsersList?.nodes
            .filter((n) => n.id !== focusedPerson.id)
            .filter((p) =>
              `${p.firstName.toLowerCase()}${p.lastName.toLowerCase()}`.includes(
                search.toLowerCase()
              )
            )"
          class="user"
          @click="this.$router.push(`/users/${person.treeId}`)"
          :style="{
            border: 2 + 'px',
            borderStyle: 'solid',
            borderColor: person.gender == 'male' ? 'lightskyblue' : 'hotpink',
          }"
        >
          <div
            :style="{
              display: 'flex',
              gap: 5 + 'px',
              justifyContent: 'center',
            }"
          >
            <div :style="{ fontSize: 18 + 'px' }">{{ person.firstName }}</div>
            <div :style="{ fontSize: 18 + 'px' }">{{ person.lastName }}</div>
            <button @click="setFocus(person.id)">Focus</button>
          </div>
          <div>{{ person.birthDate }}</div>
        </div>
      </div>
    </div>
    <div class="kids-container">
      <h2>Siblings</h2>
      <div
        v-if="store.getKids(focusedPerson.id)"
        v-for="kid in store.getKids(focusedPerson.id)"
      >
        {{ kid.firstName }} {{ kid.lastName }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, watchEffect, onMounted, watch } from "vue";
import { userStore } from "../store";
import { storeToRefs } from "pinia";

const route = useRoute();
const store = userStore();

// const focusedPerson = ref(null);
const treeUsersList = ref(null);
const search = ref("");

const { focusedPerson } = storeToRefs(store);

function setFocus(personId) {
  store.setFocus(personId);
  focusedPerson.value = store.focusedPerson;
  console.log(focusedPerson.value);
}

onMounted(async () => {
  watch(focusedPerson, () =>
    console.log("CHANGED FOCUS: ", store.hasFather(focusedPerson.value.id))
  );
  await store.getTrees().then((data) => {
    treeUsersList.value = {
      nodes: data.nodes.filter((node) => node.treeId === route.params.id),
      edges: data.edges.filter((edge) => edge.treeId === route.params.id),
    };
  });
});
</script>

<style lang="scss" scoped>
.kids-search-siblings {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.tree-person-list {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 5px;
}
.user {
  height: auto;
  width: 200px;
  padding: 5px;
  border-radius: 15px;
}
.searchbar {
  padding: 5px;
  margin: 5px;
  font-size: 18px;
  transition: 0.2s all ease;
}
.searchbar:hover {
  border: 2px solid white;
}
.table-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.table-column {
  width: 300px;
  height: 500px;
  border: 1px solid white;
}
.table-row-1 {
  width: 100%;
  height: 49.8%;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-row-2 {
  width: 100%;
  height: 24.7%;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-row-3 {
  width: 100%;
  height: 12.15%;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

export default FamilyTreeTable;
