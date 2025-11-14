<template>
    <div class="custom-fields-editor">
        <div class="mb-3">
            <label class="form-label">{{ $t("Custom Fields") }}</label>
            <p class="form-text">
                {{ $t("Add custom key-value fields to organize and filter your monitors") }}
            </p>
        </div>

        <div v-for="(field, index) in fields" :key="index" class="custom-field-row mb-2">
            <div class="row g-2">
                <div class="col-5">
                    <input
                        v-model="field.key"
                        type="text"
                        class="form-control"
                        :placeholder="$t('Field Name')"
                        @input="updateFields"
                    />
                </div>
                <div class="col-6">
                    <input
                        v-model="field.value"
                        type="text"
                        class="form-control"
                        :placeholder="$t('Field Value')"
                        @input="updateFields"
                    />
                </div>
                <div class="col-1">
                    <button
                        type="button"
                        class="btn btn-outline-danger"
                        @click="removeField(index)"
                    >
                        <font-awesome-icon icon="times" />
                    </button>
                </div>
            </div>
        </div>

        <button
            type="button"
            class="btn btn-outline-primary btn-sm mt-2"
            @click="addField"
        >
            <font-awesome-icon icon="plus" /> {{ $t("Add Field") }}
        </button>
    </div>
</template>

<script>
export default {
    name: "CustomFieldsEditor",
    
    props: {
        /**
         * Custom fields object (key-value pairs)
         */
        modelValue: {
            type: Object,
            default: () => ({})
        }
    },

    emits: ["update:modelValue"],

    data() {
        return {
            fields: []
        };
    },

    watch: {
        modelValue: {
            handler(newVal) {
                this.loadFields(newVal);
            },
            deep: true,
            immediate: true
        }
    },

    methods: {
        /**
         * Load fields from the model value
         * @param {Object} fieldsObj - The custom fields object
         * @returns {void}
         */
        loadFields(fieldsObj) {
            if (!fieldsObj || typeof fieldsObj !== "object") {
                this.fields = [];
                return;
            }

            this.fields = Object.entries(fieldsObj).map(([key, value]) => ({
                key,
                value: String(value)
            }));
        },

        /**
         * Add a new empty field
         * @returns {void}
         */
        addField() {
            this.fields.push({ key: "", value: "" });
        },

        /**
         * Remove a field by index
         * @param {number} index - The index of the field to remove
         * @returns {void}
         */
        removeField(index) {
            this.fields.splice(index, 1);
            this.updateFields();
        },

        /**
         * Update the model value from fields array
         * @returns {void}
         */
        updateFields() {
            const fieldsObj = {};
            
            for (const field of this.fields) {
                // Only include fields with non-empty keys
                if (field.key && field.key.trim() !== "") {
                    fieldsObj[field.key.trim()] = field.value;
                }
            }

            this.$emit("update:modelValue", fieldsObj);
        }
    }
};
</script>

<style lang="scss" scoped>
.custom-fields-editor {
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 0.5rem;

    .dark & {
        background-color: rgba(255, 255, 255, 0.05);
    }
}

.custom-field-row {
    .btn {
        width: 100%;
        height: 100%;
    }
}
</style>
