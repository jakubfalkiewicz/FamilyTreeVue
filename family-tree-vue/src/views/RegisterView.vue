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

    <label for="firstName">First name:</label>
    <br />
    <input
      type="text"
      id="firstName"
      name="firstName"
      v-model="values.firstName"
    />
    <p>
      <span v-if="errors?.firstName" class="errors">
        {{ errors?.firstName }}
      </span>
    </p>

    <label for="lastName">Last name:</label>
    <br />
    <input
      type="text"
      id="lastName"
      name="lastName"
      v-model="values.lastName"
    />
    <p>
      <span v-if="errors?.lastName" class="errors">
        {{ errors?.lastName }}
      </span>
    </p>

    <label for="birthDate">Birth date:</label>
    <br />
    <input
      type="date"
      id="birthDate"
      name="birthDate"
      min="1800-01-01"
      max="2023-12-31"
      v-model="values.birthDate"
    />
    <p>
      <span v-if="errors?.birthDate" class="errors">
        {{ errors?.birthDate }}
      </span>
    </p>

    <label for="gender">Gender:</label>
    <br />
    <select id="gender" name="gender" v-model="values.gender">
      <option disabled selected value>----- select gender -----</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>
    <p>
      <span v-if="errors?.birthDate" class="errors">
        {{ errors?.birthDate }}
      </span>
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
    <div>
      Already have an account?
      <div class="link" @click="this.$router.push(`/login`)">Login</div>
    </div>
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
        firstName: yup.string().required().min(3).max(25),
        lastName: yup.string().required().min(3).max(25),
        birthDate: yup.date().required(),
        gender: yup.string().oneOf(["female", "male"]).required(),
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
        firstName: "",
        lastName: "",
        birthDate: "",
        password: "",
        confirm_password: "",
        gender: "",
      },
    };
  },
  methods: {
    submit(values) {},
  },
};
</script>
<style lang="scss">
.link {
  text-decoration: underline;
  color: #646cff;
}
.link:hover {
  cursor: pointer;
}
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
