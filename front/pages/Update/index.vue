<template>
    <section class="container">
        <section class="main">
            <h2 class="subtitle">Update Profil</h2>
            <div class="top">
                <button type="button" v-on:click="update()">Update</button>
                <button @click="back">Back</button>
            </div>
            <div class="global">
                    <p>first_name : <input type="text" name="first_name" v-model="input.first_name" placeholder="first_name"/></p>
                    <p>last_name : <input type="text" name="last_name" v-model="input.last_name" placeholder="last_name"/>
                    </p>
                    <p>email : <input type="text" name="email" v-model="input.email" placeholder="email"/>
                    </p>
                   <button type="button" v-on:click="update()">Update</button>
            </div>
        </section>
    </section>
</template>

<script>
    import axios from 'axios'
    import Cookie from 'js-cookie'

    export default {
        middleware: 'notauthenticated',

        data() {
            return {
                input: {
                  first_name: null,
                  last_name: null,
                  email: null,
                }
            }
        },

        methods: {
            async logout() {
                this.$store.commit('SET_TOKEN', null);
                this.$store.commit('SET_USERNAME', null);
                Cookie.remove('token');
                Cookie.remove('username')
                this.$router.push({path: "/"});
            },
            async back() {
                this.$router.push({path: `/Profil`});
            },
            async update() {
              const obj = {
                username: this.$store.state.username,
                first_name: this.input.first_name,
                last_name: this.input.last_name,
                email: this.input.email,
              };
              axios({
                  method: 'PUT',
                  url: 'http://localhost:4242/Update/',
                  data: obj,
              })
              .then(() => {
                this.$router.push({path: `/Profil`});
              })
            },
        }
    }
</script>
<style>
    @import '../../assets/css/update.css';
</style>
