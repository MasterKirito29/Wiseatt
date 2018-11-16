<template>
    <section class="container">
        <section class="main">
            <h2 class="subtitle">Login</h2>
            <div class="subtitle-left">
                <p>Username : <input type="text" name="username" v-model="input.username" placeholder="Username"/><br>
                </p>
                <p>Password : <input type="password" name="password" v-model="input.password"
                                     placeholder="Password"/><br></p>
            </div>
            <div class="subtitle-right">
                <button type="submit" v-on:click="login()">Login</button>
                <button @click="back">Back</button>
            </div>
        </section>
        <section class="error">
            <div v-if="loginerror === true">
                <p> Username or password incorrect </p>
            </div>
        </section>
    </section>
</template>

<script>
    import axios from 'axios';
    import Cookie from 'js-cookie';

    export default {
        middleware: 'authenticated',
        data() {
            return {
                input: {
                    username: "",
                    password: ""
                },
                loginerror: false
            }
        },
        methods: {
            async login() {
                const obj = {
                    username: this.input.username,
                    password: this.input.password
                };
                axios({
                    method: 'POST',
                    url: 'http://localhost:4242/Login',
                    data: obj,
                })
                    .then(res => {
                        const token = res.data.token;
                        const username = res.data.username;
                        this.loginerror = false;
                        this.$store.commit('SET_TOKEN', token);
                        this.$store.commit('SET_USERNAME', username);
                        Cookie.set('username', username);
                        Cookie.set('token', token);
                    })
                    .then(() => {
                        this.$router.push({path: "/Page/0"});
                    })
                    .catch(err => {
                        this.loginerror = true;
                    });
            },
            async back() {
                this.$router.push({path: "/"});
            },
        }
    }
</script>
<style>
    @import '../../assets/css/login_index.css';
</style>
