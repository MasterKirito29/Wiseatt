const cookieparser = require('cookieparser');

export const state = () => ({
    token: null,
    data: null,
    count: null,
    page: null,
    data: null,
    sort: null,
    order: null,
    search: null,
    params: null,
    username: null,
    profil: null,
});

export const mutations = {
    SET_TOKEN: function (state, token) {
        state.token = token
    },
    SET_DATA: function (state, data) {
        state.data = data
    },
    SET_COUNT: function (state, count) {
        state.count = count
    },
    SET_PAGE: function (state, page) {
        state.page = page
    },
    SET_PROFIL: function (state, profil) {
        state.profil = profil
    },
    SET_DATA: function (state, data) {
        state.data = data
    },
    SET_SORT: function (state, sort) {
        state.sort = sort
    },
    SET_ORDER: function (state, order) {
        state.order = order
    },
    SET_SEARCH: function (state, search) {
        state.search = search;
    },
    SET_PARAMS: function (state, params) {
        state.params = params;
    },
    SET_USERNAME: function (state, username) {
        state.username = username;
    },
};

export const actions = {
    nuxtServerInit({commit}, {req}) {
        if (req.headers.cookie) {
            commit('SET_TOKEN', cookieparser.parse(req.headers.cookie).token);
            commit('SET_PAGE', cookieparser.parse(req.headers.cookie).page);
            commit('SET_SORT', cookieparser.parse(req.headers.cookie).sort);
            commit('SET_ORDER', cookieparser.parse(req.headers.cookie).order);
            commit('SET_SEARCH', cookieparser.parse(req.headers.cookie).search);
            commit('SET_PARAMS', cookieparser.parse(req.headers.cookie).params);
            commit('SET_USERNAME', cookieparser.parse(req.headers.cookie).username);
            commit('SET_PROFIL', cookieparser.parse(req.headers.cookie).profil);
        }
    },
};
