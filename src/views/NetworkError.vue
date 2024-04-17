<template>
    <div class="network-error">
        <h1>Network Error</h1>
        <p>Sorry, there was an error while communicating with the server.</p>
        <router-link :to="redirectRoute" class="home-button">Home</router-link>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'NetworkError',
    data() {
        return {
            redirectRoute: '/' // Offer the option to go to the home page
        };
    },
    created() {
        this.checkUserRequest();
    },
    methods: {
        checkUserRequest() {
            axios.get('/api/user')
                .then(response => {
                    // Handle successful response
                    console.log(response);
                    const responseData = response.data;
                })
                .catch(error => {
                    if (error.response && error.response.status >= 500) {
                        console.error('Server Error:', error); // Log the error for debugging
                        this.$router.push('/network-error'); // Redirect to network error page if there is a server error
                    }
                });
        }
    }
};
</script>

<style scoped>
.network-error {
    text-align: center;
    margin-top: 50px;
}

.home-button {
    display: inline-block;
    padding: 10px 20px;
    font-size: 16px;
    background-color: transparent;
    border: 1px solid #80162B;
    color: black;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    border-radius: 5px;
}

.home-button:hover {
    background-color: #d7d7d7;
}
</style>