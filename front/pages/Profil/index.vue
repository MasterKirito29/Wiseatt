<template>
    <section class="container">
        <section class="main">
            <h2 class="subtitle">Profil</h2>
            <button @click="back">Back</button>
            <button @click="update">Update</button>
            <button @click="remove">Delete</button>
            <div>
                <table style="overflow-x: auto">
                    <tr>
                        <th>username</th>
                        <th>first_name</th>
                        <th>last_name</th>
                        <th>email</th>
                    </tr>
                    <tr>
                        <td>{{$store.state.profil.username}}</td>
                        <td>{{$store.state.profil.first_name}}</td>
                        <td>{{$store.state.profil.last_name}}</td>
                        <td>{{$store.state.profil.email}}</td>
                    </tr>
                </table>
            </div>
        </section>
    </section>
</template>

<script>
    import axios from 'axios'
    import Cookie from 'js-cookie'


    export default {
        middleware: 'notauthenticated',


        async fetch({store, params, redirect}) {
          const obj = {
            username : store.state.username
          }
          const { data } = await axios({
              method: 'POST',
              url: 'http://localhost:4242/profil',
              headers: { 'Authorization': store.state.token },
              data: obj,
          });
          store.commit('SET_PROFIL', data.profil);
        },

        methods: {
            async back() {
              this.$router.push({path: "/Page/0"});
            },
            async update() {
              this.$router.push({path: "/Update"});
            },
            async remove() {
              const obj = {
                username: this.$store.state.username
              }
              axios({
                  method: 'DELETE',
                  url: 'http://localhost:4242/Delete/',
                  data: obj,
              })
              .then(() => {
                this.$store.commit('SET_TOKEN', null);
                this.$store.commit('SET_USERNAME', null);
                Cookie.remove('token');
                Cookie.remove('username')
                this.$router.push({path: "/"});
              })
            }
        }
    }
</script>
<style>
    @import '../../assets/css/users_pages.css';
</style>