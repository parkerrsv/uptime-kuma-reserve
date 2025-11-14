<template>
    <Teleport to="body">
        <Transition name="slide-fade" appear>
            <div v-if="show" class="modal-mask" @click.self="close">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ $t("Quick Reserve") }}</h5>
                            <button type="button" class="btn-close" @click="close"></button>
                        </div>
                        <div class="modal-body">
                            <p>{{ $t("Find and reserve the first available monitor of a specific device type") }}</p>
                            
                            <!-- Device Type Selection -->
                            <div class="mb-3">
                                <label for="quick-device-type" class="form-label">{{ $t("Device Type") }}</label>
                                <VueMultiselect
                                    id="quick-device-type"
                                    v-model="deviceType"
                                    :options="deviceTypeOptions"
                                    :multiple="false"
                                    :taggable="true"
                                    :placeholder="$t('Select or type a device type...')"
                                    :show-labels="false"
                                    @tag="addDeviceType"
                                ></VueMultiselect>
                            </div>

                            <!-- Your Name -->
                            <div class="mb-3">
                                <label for="quick-name" class="form-label">{{ $t("yourName") }}</label>
                                <input
                                    id="quick-name"
                                    v-model="name"
                                    type="text"
                                    class="form-control"
                                    :placeholder="$t('enterYourName')"
                                    @keyup.enter="reserve"
                                />
                            </div>

                            <!-- Time Selection -->
                            <div class="mb-3">
                                <label class="form-label">{{ $t("Reservation Duration") }}</label>
                                <div class="btn-group d-flex mb-2" role="group">
                                    <button type="button" class="btn btn-outline-primary" @click="setQuickTime(1)">1 {{ $t("hour") }}</button>
                                    <button type="button" class="btn btn-outline-primary" @click="setQuickTime(2)">2 {{ $t("hours") }}</button>
                                    <button type="button" class="btn btn-outline-primary" @click="setQuickTime(4)">4 {{ $t("hours") }}</button>
                                    <button type="button" class="btn btn-outline-primary" @click="setQuickTime(24)">1 {{ $t("day") }}</button>
                                </div>
                                
                                <div class="form-check mb-2">
                                    <input
                                        id="quick-eternal"
                                        v-model="eternal"
                                        class="form-check-input"
                                        type="checkbox"
                                        @change="handleEternalChange"
                                    />
                                    <label class="form-check-label" for="quick-eternal">
                                        {{ $t("eternalReservation") }}
                                    </label>
                                </div>

                                <input
                                    v-if="!eternal"
                                    v-model="reservedUntil"
                                    type="datetime-local"
                                    class="form-control"
                                />
                            </div>

                            <div v-if="errorMessage" class="alert alert-danger">
                                {{ errorMessage }}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="close">{{ $t("cancel") }}</button>
                            <button type="button" class="btn btn-primary" :disabled="!canReserve" @click="reserve">{{ $t("Quick Reserve") }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script>
import VueMultiselect from "vue-multiselect";
import dayjs from "dayjs";

export default {
    name: "QuickReserveDialog",
    components: {
        VueMultiselect,
    },
    data() {
        return {
            show: false,
            deviceType: null,
            name: "",
            reservedUntil: "",
            eternal: false,
            errorMessage: "",
            deviceTypeOptions: [],
        };
    },
    computed: {
        canReserve() {
            return this.deviceType && this.name && (this.eternal || this.reservedUntil);
        },
    },
    methods: {
        /**
         * Show the quick reserve dialog
         * @returns {void}
         */
        showDialog() {
            this.show = true;
            this.deviceType = null;
            this.name = "";
            this.reservedUntil = "";
            this.eternal = false;
            this.errorMessage = "";
            
            // Load device types from existing monitors
            this.loadDeviceTypes();
            
            // Set default time to 2 hours from now
            this.setQuickTime(2);
        },

        /**
         * Close the dialog
         * @returns {void}
         */
        close() {
            this.show = false;
            this.errorMessage = "";
        },

        /**
         * Set a quick time duration
         * @param {number} hours - Number of hours from now
         * @returns {void}
         */
        setQuickTime(hours) {
            this.eternal = false;
            const futureTime = dayjs().add(hours, "hour");
            this.reservedUntil = futureTime.format("YYYY-MM-DDTHH:mm");
        },

        /**
         * Handle eternal checkbox change
         * @returns {void}
         */
        handleEternalChange() {
            if (this.eternal) {
                this.reservedUntil = "";
            } else if (!this.reservedUntil) {
                this.setQuickTime(2);
            }
        },

        /**
         * Add a custom device type
         * @param {string} newDeviceType - The new device type
         * @returns {void}
         */
        addDeviceType(newDeviceType) {
            if (!this.deviceTypeOptions.includes(newDeviceType)) {
                this.deviceTypeOptions.push(newDeviceType);
            }
            this.deviceType = newDeviceType;
        },

        /**
         * Find and reserve the first available monitor
         * @returns {void}
         */
        reserve() {
            if (!this.canReserve) {
                return;
            }

            this.errorMessage = "";

            // Emit event to parent to handle the reservation
            this.$emit("quickReserve", {
                deviceType: this.deviceType,
                name: this.name,
                reservedUntil: this.eternal ? null : this.reservedUntil,
            });
        },

        /**
         * Show error message
         * @param {string} message - Error message to display
         * @returns {void}
         */
        showError(message) {
            this.errorMessage = message;
        },

        /**
         * Load device types from existing monitors
         * @returns {void}
         */
        loadDeviceTypes() {
            const deviceTypes = new Set();
            
            // Collect all unique device types from existing monitors
            // Access through $root since QuickReserveDialog is not in MonitorList
            if (this.$root && this.$root.monitorList) {
                Object.values(this.$root.monitorList).forEach(monitor => {
                    if (monitor.device_type && monitor.device_type.trim() !== "") {
                        deviceTypes.add(monitor.device_type);
                    }
                });
            }
            
            // Convert to array and sort alphabetically
            this.deviceTypeOptions = Array.from(deviceTypes).sort();
        },
    },
};
</script>

<style lang="scss" scoped>
.modal-mask {
    position: fixed;
    z-index: 100001;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.slide-fade-enter-active {
    transition: all 0.3s ease;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}
</style>
