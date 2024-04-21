<template>
    <div class="toast-container">
        <div v-if="toast.visible" class="toast" :class="toast.type">
            {{ toast.message }}
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    data() {
        return {
            toast: {
                visible: false,
                message: '',
                type: '' // success, error, warning, info
            }
        };
    },
    methods: {
        showToast({ message, type = 'success' }) {
            this.toast.visible = true;
            this.toast.message = message;
            this.toast.type = type;

            setTimeout(() => {
                this.hideToast();
            }, 2000); // Hide after 2 seconds
        },
        hideToast() {
            this.toast.visible = false;
        }
    }
    /*
        To call showToast, pass an object with message and type: 
            this.$refs.toast.showToast({ message: 'Success message', type: 'success' });
        Be sure to change the message and type to match the situation
    */
};
</script>

<style>
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
}

.toast {
    padding: 10px 20px;
    border-radius: 5px;
    color: #fff;
    font-weight: bold;
}

.success {
    background-color: #28a745;
}

.error {
    background-color: #dc3545;
}

.warning {
    background-color: #ffc107;
}

.info {
    background-color: #17a2b8;
}
</style>
