<template>
  <form @submit.prevent="submit">
    <slot :errors="errors"></slot>
  </form>
</template>

<script>
import { isEqual } from "lodash";
import axios from "axios";
import { userStore } from "../store";

const store = userStore();

export default {
  data() {
    return {
      errors: {},
      oldValues: { ...this.values },
    };
  },
  name: "vue-yup-validation",
  props: {
    schema: {
      required: true,
      type: Object,
    },
    values: {
      required: true,
      type: Object,
    },
    validFieldOnChange: {
      required: false,
      type: Boolean,
      default: true,
    },
  },
  methods: {
    validate(field) {
      return this.schema
        .validateAt(field, this.values)
        .then(() => {
          this.errors[field] = "";
        })
        .catch((err) => {
          this.errors[field] = err.message;
        });
    },
    validateForm() {
      this.errors = {};
      return this.schema
        .validate(this.values, { abortEarly: false })
        .then(() => {
          return true;
        })
        .catch((err) => {
          err.inner.forEach((error) => {
            this.errors[error.path] = error.message;
          });
          return false;
        });
    },
    async submit(call) {
      const url = `http://127.0.0.1:5173/`;
      if (await this.validateForm()) {
        if (call.target.action == `${url}register`) {
          store.registerUser(this.values).then((res) => {
            res == "Success"
              ? this.$router.push("../")
              : alert("Something went wrong...");
          });
        }
        if (call.target.action == `${url}login`) {
          store.loginUser(this.values).then((res) => {
            res == "Success"
              ? this.$router.push("../")
              : alert("Wrong username or password!");
          });
        }
      }
    },
  },
  watch: {
    values: {
      handler() {
        if (!this.validFieldOnChange) {
          return;
        }
        for (const propriety of Object.keys(this.values)) {
          if (!isEqual(this.oldValues[propriety], this.values[propriety])) {
            this.validate(propriety);
          }
        }
        this.oldValues = { ...this.values };
      },
      deep: true,
    },
  },
};
</script>
