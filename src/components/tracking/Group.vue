<template>
  <div class="tracking-body">
    <div class="tracking-info">
      <div class="tracking-add-product">
        <Btn clazz="button_add" label="Добавить товары"/>
      </div>
      <div class="tracking-actions">
        <RowWithIcon :list="trackingActionList"/>
      </div>
    </div>

    <TrackingTable :headers="tableHeaders" :items="tableData"/>
  </div>
</template>

<script>
  import Btn from "@/shared-components/Btn";
  import RowWithIcon from "@/shared-components/RowWithIcon";
  import TrackingTable from "@/shared-components/TrackingTable";

  import AlertImg from "@/assets/img/ikons/alert.svg";
  import AutosortImg from "@/assets/img/ikons/autosort.svg";
  import DownloadImg from "@/assets/img/ikons/download.svg";
  import ProductContent from "@/components/tracking-table/ProductContent";
  import ProductPrice from "@/components/tracking-table/ProductPrice";
  import ProductRating from "@/components/tracking-table/ProductRating";
  import ProductAction from "@/components/tracking-table/ProductAction";
  import ProductNestedSizesTable from "@/components/tracking-table/ProductNestedSizesTable";

  export default {
    name: "Group",
    components: {Btn, RowWithIcon, TrackingTable},
    data() {
      return {
        tableHeaders: [
          {name: 'goods', label: 'Товар', clazz: 'width30', sortable: false},
          {name: 'price', label: 'Цена', clazz: 'tracking-table__header-item_align-center width10'},
          {name: 'rating', label: 'Рейтинг', clazz: 'tracking-table__header-item_align-center'},
          {name: 'available_count', label: 'Доступно к заказу'},
          {name: 'ordered_today_count', label: 'Заказы Сегодня'},
          {name: 'ordered_yesterday_count', label: 'Заказы Вчера'},
          {name: 'ordered_week_count', label: 'Заказы Неделя'},
          {name: 'ordered_month_count', label: 'Заказы Месяц'},
          {name: 'actions', label: 'Действия', sortable: false},
        ],
        tableData: [
          {
            goods: {content: ProductContent, clazz: 'width30'},
            price: {content: ProductPrice, clazz: 'width10'},
            rating: {content: ProductRating},
            available_count: {content: 1},
            ordered_today_count: {content: 1},
            ordered_yesterday_count: {content: 0},
            ordered_week_count: {content: 0},
            ordered_month_count: {content: 3},
            actions: {content: ProductAction},
            nested: ProductNestedSizesTable
          }
        ],
        trackingActionList: [
          {label: "Добавить оповещения для групп", img: AlertImg},
          {label: "Автоподсорт", img: AutosortImg},
          {label: "Скачать", img: DownloadImg},
        ]
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/scss/variables";

  .tracking-body {
    background: white;
    border: 1px solid $drayDevider;
  }

  .tracking-info {
    padding: 1.14rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $drayDevider;
  }

  .tracking-add-product {
    width: 11.85rem;
  }

  .tracking-actions {
    flex: 1 0 auto;
    margin-left: 2.14em;
    display: flex;
    align-items: center;
  }
</style>