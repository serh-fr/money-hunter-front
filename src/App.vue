<template>
  <div id="app" class="root">
    <template v-if="isLoggedIn">
      <Sidebar/>
      <main>
        <Header :header="getTitle()"/>
        <router-view/>
      </main>
      <component v-bind:is="component" v-if="isShow" v-bind="nested"/>
    </template>

    <!--    login/register and other similar windows-->
    <router-view v-else/>
  </div>
</template>

<script>
  import Sidebar from "@/components/Sidebar";
  import Header from "@/components/Header";
  import {GET_PROFILE_ACTION, GET_SUBSCRIPTION_ACTION} from "@/store/modules/user/constants";
  import {mapActions, mapState} from "vuex";
  import {TokenService} from "@/services/token_service";
  import {LOAD_GROUPS_ACTION} from "@/store/modules/tracking/constants";
  import {TrackingService} from "@/services/tracking_service";

  export default {
    components: {Sidebar, Header},
    data() {
      return {}
    },
    computed: {
      ...mapState('auth', ['isLoggedIn']),
      ...mapState('modal', ['isShow', 'component', 'nested']),
    },
    created() {
      const tokenService = new TokenService();
      const trackingService = new TrackingService();
      if (tokenService.isLoggedIn()) {
        this[GET_PROFILE_ACTION]();
        this[GET_SUBSCRIPTION_ACTION]();
        this[LOAD_GROUPS_ACTION]();

        trackingService.getBrands();
      }
    },
    methods: {
      getTitle() {
        // Находим ближайший роут, у которого есть title в meta
        return ([...this.$route.matched]
          .reverse()
          .find(route => route.meta && route.meta.title) || {meta: {title: 'MoneyHunter'}})
          .meta
          .title;
      },
      ...mapActions('user', [GET_PROFILE_ACTION, GET_SUBSCRIPTION_ACTION]),
      ...mapActions('tracking', [LOAD_GROUPS_ACTION]),
    },
    watch: {
      isLoggedIn: function (newState) {
        if (newState) {
          this[GET_PROFILE_ACTION]();
          this[GET_SUBSCRIPTION_ACTION]();
          this[LOAD_GROUPS_ACTION]();
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "assets/scss/variables";
  @import "assets/scss/media";

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    outline: none;
    border: none;
    box-shadow: none;
    text-decoration: none;
    color: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  html,
  body {
    height: 100%;
    font-family: $mainFont;
    color: $black;
    font-size: $defaultFontSize;
    line-height: 1.43;
    background-color: $white;
  }

  .root {
    height: 100%;
  }

  main {
    padding-left: 5.71rem;
    padding-bottom: 3.57rem;
  }

  h1 {
    font-size: $defaultH1Size;
    line-height: 1.16;
    font-weight: bold;
  }

  input, textarea, button {
    font-family: $mainFont;
  }

  ul {
    list-style: none;
  }

  .block_container {
    padding: 0 2.28rem;
  }

  .vision-password {
    width: 1.14rem;
    height: 1.14rem;
    background: url("assets/img/ikons/visible.svg") no-repeat;
    position: absolute;
    right: .64rem;
    bottom: .78rem;

    &.vision-password_error {
      background: url("assets/img/ikons/visible_error.svg") no-repeat;
    }

    &.vision-password_visible {
      background: url("assets/img/ikons/no_visible.svg") no-repeat;
    }
  }

  .product-item {
    display: flex;
  }

  .product-info {
    margin-left: .92rem;
  }

  .product.name {
    letter-spacing: .2px;
  }

  .product-code {
    margin-top: 3px;
    color: $titleColor;
    letter-spacing: .2px;
  }

  .radio-item {
    display: flex;
    align-items: center;
    margin-bottom: .92rem;
    padding-right: 2.71rem;

    &:last-child {
      margin-bottom: 0;
    }

    label {
      margin-left: .78rem;
    }

    .input-field__input {
      flex: 0 0 100%;
      margin-left: .78rem;
    }
  }
</style>
