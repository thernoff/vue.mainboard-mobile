<template>
  <div class="mainboard-input-dialog-window">
    <slot/>
    <v-dialog
      v-model="modal"
      width="400px">
      <v-card light>
        <v-container>
          <v-layout row>
            <v-flex xs12>
              <v-card-title>
                <h1 class="text--primary">{{ options.title }}</h1>
              </v-card-title>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <v-card-text>
                <v-text-field
                  :label="options.label"
                  v-model="inputValue"
                  name="title"
                  type="text"
                />
              </v-card-text>
            </v-flex>
          </v-layout>
          <v-layout
            row
            align-center>
            <v-flex
              xs12
              text-xs-center>
              <v-btn
                class="info"
                @click="onSave">{{ $t('save') }}
              </v-btn>
              <v-btn
                class="error"
                @click="onCancel">{{ $t('cancel') }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modal: false,
      inputValue: this.value || ""
    };
  },
  watch: {
    visible(value) {
      this.modal = value;
    }
  },
  methods: {
    onCancel() {
      this.$emit("hideInputDialogWindow");
      //this.modal = false;
    },
    onSave() {
      console.log("this.inputValue", this.inputValue);
      if (this.inputValue !== "") {
        this.$emit("input", this.inputValue);
        this.$emit("hideInputDialogWindow");
        //this.modal = false;
      }
    }
  }
};
</script>

<style scoped>
</style>
