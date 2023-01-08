<template>
  <VueYupValidation
    :schema="schema"
    @submit="submit"
    :values="values"
    :validFieldOnChange="true"
    v-slot="{ errors }"
  >
    <h2>Register Form</h2>
    <label for="username">Username:</label>
    <br />
    <input
      type="text"
      id="username"
      name="username"
      v-model="values.username"
    />
    <p>
      <span v-if="errors?.username" class="errors">
        {{ errors?.username }}
      </span>
    </p>
    <label for="email">Email:</label>
    <br />
    <input type="text" id="email" name="email" v-model="values.email" />
    <p>
      <span v-if="errors?.email" class="errors"> {{ errors?.email }} </span>
    </p>
    <label for="password">Password:</label>
    <br />
    <input
      type="password"
      id="password"
      name="password"
      v-model="values.password"
    />
    <p>
      <span v-if="errors?.password" class="errors">
        {{ errors?.password }}
      </span>
    </p>
    <label for="confirm_password">Repeat password:</label>
    <br />
    <input
      type="password"
      id="confirm_password"
      name="confirm_password"
      v-model="values.confirm_password"
    />
    <p>
      <span v-if="errors?.confirm_password" class="errors">
        {{ errors?.confirm_password }}
      </span>
    </p>
    <input type="submit" value="Submit" />
  </VueYupValidation>
</template>
<script>
import * as yup from "yup";
import VueYupValidation from "../components/VueYupValidation.vue";
import { onMounted } from "vue";
import { userStore } from "../store";

const store = userStore();

onMounted(() => {
  store.getUsers().then((data) => {
    store.setStore(data);
  });
});
export default {
  name: "RegisterView",
  components: {
    VueYupValidation,
  },
  data() {
    return {
      schema: yup.object().shape({
        username: yup.string().required().min(3).max(25),
        email: yup.string().email().required(),
        password: yup
          .string()
          .required("Please enter a password")
          .min(8, "Password too short")
          .matches(
            /^(?=.*[a-z])/,
            "Must contain at least one lowercase character"
          )
          .matches(
            /^(?=.*[A-Z])/,
            "Must contain at least one uppercase character"
          )
          .matches(/^(?=.*[0-9])/, "Must contain at least one number")
          .matches(
            /^(?=.*[!@#%&])/,
            "Must contain at least one special character"
          ),
        confirm_password: yup
          .string()
          .oneOf([yup.ref("password"), null], "Passwords must match"),
      }),
      values: {
        username: "",
        email: "",
        password: "",
        confirm_password: "",
      },
    };
  },
  methods: {
    submit(values) {},
  },
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  color: white;
  .header-register-login {
    display: flex;
    gap: 50px;
  }
}
.errors {
  color: red;
}
</style>
