<template>
  <div class="tarif__item" :class="clazz">
    <div class="tarif__name">{{name}}</div>
    <div class="tarif-list">
      <div class="tarif-list__item"
           v-for="item in list"
           :key="item.text"
           :class="{'tarif-list__item_success': item.success, 'tarif-list__item_error': item.error}">
        <span class="tarif-list__text">{{item.text}}</span>
        <button class="tarif-list__button" v-if="item.custom"></button>
      </div>
    </div>
    <div class="tarif-price">{{price}} ₽</div>
    <Btn label="Купить"/>
  </div>
</template>

<script>
  import Btn from "../shared-components/Btn";

  export default {
    name: "Tariff",
    components: {Btn},
    props: {
      clazz: {
        type: String,
        default: '',
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true
      },
      list: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";

  .tarif__item {
    flex-basis: calc((100% - (4.28rem * 2)) / 3);
    background: white;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    padding: 1.78rem 2.14rem 2.14rem;

    &:not(:first-child) {
      margin-left: 2rem;
    }

    &.tarif__item_fourth {
      flex-basis: calc((100% - (2.21rem * 3)) / 4);
    }
  }

  .tarif__name {
    text-transform: uppercase;
    text-align: center;
    font-size: 1.71rem;
    letter-spacing: .3px;
    font-weight: bold;
    color: black;
  }

  .tarif-list {
    margin-top: 1.28rem;
  }

  .tarif-list__item {
    border-top: 1px solid $drayDevider;
    padding: .64rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 3.57rem;

    &:last-child {
      border-bottom: 1px solid $drayDevider;
    }

    &.tarif-list__item_success {
      background: url("../assets/img/ikons/success.svg") no-repeat 100% center;
      padding-right: 2.14rem;
    }

    &.tarif-list__item_error {
      background: url("../assets/img/ikons/error.svg") no-repeat 100% center;
      padding-right: 2.14rem;
    }
  }

  .tarif-list__text {
    font-weight: 500;
    letter-spacing: .3px;
    color: black;
  }

  .tarif-list__button {
    width: 1.42rem;
    height: 1.42rem;
    background: url("../assets/img/ikons/plus.svg") no-repeat;
  }

  .tarif-price {
    text-align: center;
    color: $blue;
    margin: 1.21rem 0;
    font-size: 1.71rem;
    font-weight: bold;
    letter-spacing: .3px;
  }
</style>