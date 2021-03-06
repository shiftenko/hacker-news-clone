<!-- eslint-disable prettier/prettier -->
<template>
  <!--
    using fragment here because if menu is child of header, it will not overlap
    his parent, but if ve extract menu from header we will need to use event bus
    to toggle menu from button in header, so it's most simple solution
  -->
  <fragment>
    <header class="header">
      <div class="header__inner">
        <VLogo class="header__logo" />
        <button
          class="header__toggle-menu-button"
          @click="toggleMenu(false)"
        >
          <VIcon :href="'menu'" />
        </button>
      </div>
    </header>
    <TheMenu
      v-on-clickaway="() => toggleMenu(true)"
      :class="{ opened: isMenuOpened }"
    />
    <!--
      cannot have nested <fragment> and cannot place popup inside menu
      component because it's have 'transition' css prop other than 'none'
      and popup have 'position: fixed', which breaks layout

      https://stackoverflow.com/a/37953806
    -->
    <TheAuthPopup
      :isExist="
        currPopupData.name === 'TheAuthPopup' && currPopupData.isExist === true
      "
    />
    <TheAboutPopup
      :isExist="
        currPopupData.name === 'TheAboutPopup' && currPopupData.isExist === true
      "
    />
  </fragment>
</template>
<!-- eslint-enable -->

<script lang="ts">
  import Vue from 'vue';
  import { mixin as clickaway } from 'vue-clickaway2';
  import TheMenu from '@/components/TheMenu';
  import TheAuthPopup from './TheAuthPopup';
  import TheAboutPopup from './TheAboutPopup';

  interface Data {
    currPopupData: {
      name: string;
      isExist: boolean;
    };
    isMenuOpened: boolean;
  }

  const data: Data = {
    currPopupData: {
      name: '',
      isExist: false,
    },
    isMenuOpened: false,
  };

  export default Vue.extend({
    components: {
      TheMenu,
      TheAuthPopup,
      TheAboutPopup,
    },
    mixins: [clickaway],
    data() {
      return data;
    },
    watch: {
      $route: {
        immediate: true,
        handler() {
          if (this.isMenuOpened && !this.currPopupData.isExist) {
            this.toggleMenu(false);
          }
        },
      },
    },
    mounted() {
      this.$evBus.$on('close-menu', () => {
        this.toggleMenu(false);
      });
      this.$evBus.$on('toggle-popup', (fullPopupCompNameCamelCase: string) => {
        this.currPopupData = {
          name: fullPopupCompNameCamelCase,
          isExist: !this.currPopupData.isExist,
        };
      });
    },
    methods: {
      toggleMenu(isClickaway: boolean) {
        const isMenuOpened = this.isMenuOpened;
        /*
          clickaway is triggered when you click outside of menu, and toggle
          menu button is outside of it too, so we need to handle that.
          Remaining ability to click toggle menu button when menu opened
          for browser feedback with blue highlight after click
        */
        if (isClickaway) {
          if (isMenuOpened && !this.currPopupData.isExist) {
            this.isMenuOpened = false;
          }
        } else {
          this.isMenuOpened = !isMenuOpened;
        }
      },
    },
  });
</script>

<style lang="scss">
  .header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    width: 100%;
    height: 50px;
    background-color: $bg-orange;
    box-shadow: rgba($shadow, 0.22) 0 3px 3px;

    &__inner {
      @include page-width-media;
      display: flex;
      justify-content: space-between;
      height: 100%;

      @media (min-width: $break-tablet) {
        padding: 0 15px;
      }
    }

    &__logo {
      @media (min-width: $break-tablet) {
        margin-left: -10px;
      }
    }

    &__toggle-menu-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 100%;

      @media (min-width: $break-tablet) {
        margin-right: -14px;
      }

      > svg {
        width: 17.72px;
        height: 17.72px;
        fill: $text-white;
      }
    }
  }
</style>
