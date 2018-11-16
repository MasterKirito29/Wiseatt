<template>
    <section class="container">
        <section class="main">
            <h2 class="subtitle">New Account</h2>
            <div class="subtitle-right">
                <p>Username : <input type="text" name="username" v-model="input.username" placeholder="Username"/><br>
                </p>
                <p>Password : <input type="password" name="password" v-model="input.password"
                                     placeholder="Password"/><br></p>
                <button type="button" v-on:click="signin()">Create</button>
                <button @click="back">Back</button>
            </div>
        </section>
        <section class="error">
            <div v-if="signinerror === true">
                <p> Username already use </p>
            </div>
        </section>
    </section>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                input: {
                    username: "",
                    password: "",
                },
                signinerror: false
            }
        },

        methods: {
            async signin() {
                const obj = {
                    username: this.input.username,
                    password: this.input.password,
                };
                axios({
                    method: 'POST',
                    url: 'http://localhost:4242/Signin',
                    data: obj,
                })
                    .then(() => {
                        this.signinerror = false;
                        this.$router.push({path: "/"});
                    })
                    .catch(err => {
                        this.signinerror = true;
                    });
            },
            async back() {
                this.$router.push({path: "/"});
            },
        }
    }
</script>
<style>
    @import '../../assets/css/signin_index.css';
</style>
