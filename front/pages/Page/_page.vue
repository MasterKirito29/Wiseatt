<template>
    <section class="container">
        <section class="main">
            <h2 class="subtitle">Data</h2>
            <button @click="logout">Logout</button>
            <button @click="reset">Reset</button>
            <button @click="profil">Profil</button>
            <label><select v-model="input.sort">
            <option disabled value="">Sort</option>
            <option>_id</option>
            <option>id</option>
            <option>first_name</option>
            <option>last_name</option>
            <option>email</option>
            <option>gender</option>
            <option>ip_address</option>
        </select></label>
        <label><select v-model="input.order">
            <option disabled value="">Ordre</option>
            <option>Croissant</option>
            <option>Décroissant</option>
        </select></label>
        <button type="button" v-on:click="sort()">Sort</button>
            <button @click="prev($store.state.page)" v-if="Number(this.$store.state.page) !== 0">Prev</button>
            <button @click="next($store.state.page)"
                v-if="Number(this.$store.state.page) !== this.$store.state.count">Next
            </button>
            <button @click="python">Python</button>
            <p>Page {{this.$store.state.page}} sur {{this.$store.state.count}}</p>
            <div>
                <table style="overflow-x: auto">
                    <tr>
                        <th>_id</th>
                        <th>id</th>
                        <th>first_name</th>
                        <th>last_name</th>
                        <th>email</th>
                        <th>gender</th>
                        <th>ip_address</th>
                    </tr>
                    <tr v-for="user in $store.state.data" :key="user.id">
                        <td>{{user._id}}</td>
                        <td>{{user.id}}</td>
                        <td>{{user.first_name}}</td>
                        <td>{{user.last_name}}</td>
                        <td>{{user.email}}</td>
                        <td>{{user.gender}}</td>
                        <td>{{user.ip_address}}</td>
                    </tr>
                </table>
            </div>
            <label><select v-model="input.option">
                <option disabled value="">Liste des options</option>
                    <option>_id</option>
                    <option>id</option>
                    <option>first_name</option>
                    <option>last_name</option>
                    <option>email</option>
                    <option>gender</option>
                    <option>ip_address</option>
            </select></label>
            <input type="text" name="search" v-model="input.search" placeholder="Search"/>
            <button type="button" v-on:click="search()">Search</button>
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
                    option: "",
                    search: "",
                    order: "",
                    sort: ""
                }
            }
        },

        async fetch({store, params, redirect}) {
            let maxPage = 0;
            if (Number(params.page) < 0) {
                redirect(`/Page/0`);
            } 
            const obj = {
                params: store.state.params,
                search: store.state.search,
                order: store.state.order,
                sort: store.state.sort
            };
            const { data } = await axios({
                method: 'POST',
                url: 'http://localhost:4242/data/' + params.page,
                headers: { 'Authorization': store.state.token },
                data: obj,
            });
            const count = await axios({
                method: 'POST',
                url: 'http://localhost:4242/Count',
                headers: { 'Authorization': store.state.token },
                data: obj,
            });
            if (!data.success) {
                store.commit('SET_TOKEN', null)
                Cookie.remove('token');
                Cookie.remove('username')
                redirect(`/`)
            }
            store.commit('SET_PAGE', params.page);
            store.commit('SET_DATA', data.data);
            maxPage = Math.floor(count.data.count / 10);
            if (Math.floor(count.data.count % 10) != 0 || maxPage === 0)
                store.commit('SET_COUNT', maxPage);
            else {
                maxPage--;
                store.commit('SET_COUNT', maxPage);
            }
            Cookie.set('page', params.page)
            if (Number(params.page) > maxPage) {
                redirect(`/Page/0`);
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
            async profil() {
                this.$router.push({path: `/Profil`});
            },
            async prev(page) {
                this.$router.push({path: `/Page/${--page}`});
            },
            async next(page) {
                this.$router.push({path: `/Page/${++page}`});
            },
            async sort() {
                let order = null;
                if (this.input.order === "Croissant")
                    order = 1;
                if (this.input.order === "Décroissant")
                    order = -1;
                const sort = {
                    sort: this.input.sort,
                    order: order
                };
                this.$store.commit('SET_SORT', sort.sort);
                this.$store.commit('SET_ORDER', sort.order);
                Cookie.set('sort', sort.sort);
                Cookie.set('order', sort.order);
                window.location.reload(true);
            },
            async search() {
                const search = {
                    params: this.input.option,
                    search: this.input.search
                };
                this.$store.commit('SET_PARAMS', search.params);
                this.$store.commit('SET_SEARCH', search.search);
                Cookie.set('params', search.params);
                Cookie.set('search', search.search);
                window.location.reload(true);
            },
            async reset() {
                this.$store.commit('SET_PARAMS', null);
                this.$store.commit('SET_SEARCH', null);
                this.$store.commit('SET_SORT', null);
                this.$store.commit('SET_ORDER', null);
                Cookie.remove('params');
                Cookie.remove('search');
                Cookie.remove('sort');
                Cookie.remove('order');
                window.location.reload(true);
            },
            async python() {
                const { data } = await axios({
                    method: 'GET',
                    url: 'http://localhost:4242/pyt',
                    headers: { 'Authorization': this.$store.state.token },
                });
                alert(data.python)
            }
        }
    }
</script>
<style>
    @import '../../assets/css/users_pages.css';
</style>
