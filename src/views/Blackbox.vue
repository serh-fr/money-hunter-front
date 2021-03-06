<template>
  <Fragment>
    <FilterBlock :searchHandler="searchHandler"/>

    <div class="blackbox">
      <TrackingTable :headers="tableHeaders"
                     :items="tablePositions"
                     :order="orderType"
                     :order-handler="$orderHandler"/>
    </div>

    <div class="block_container">
      <TrackingPagination :total-count="paginationData.totalCount"
                          :page="paginationData.page"
                          :per-page="paginationData.perPage"
                          :per-page-handler="perPageHandler"
                          :prev-handler="$paginationPrevHandler"
                          :next-handler="$paginationNextHandler"/>
    </div>
  </Fragment>
</template>

<script>
  import FilterBlock from "@/components/FilterBlock";
  import {Fragment} from 'vue-fragment';
  import TrackingTable from "@/shared-components/TrackingTable";
  import ProductContent from "@/components/tracking-table/ProductContent";
  import ProductRating from "@/components/tracking-table/ProductRating";
  import {tableMixins} from "@/extenders/mixins/table_mixins";
  import {BlackboxService} from "@/services/blackbox_service";
  import TrackingPagination from "@/shared-components/TrackingPagination";
  import {paginationMixin} from "@/extenders/mixins/pagination_mixin";
  import {debounce} from 'lodash'
  import ProductBlackboxNested from "@/components/tracking-table/ProductBlackboxNested";
  import Btn from "@/shared-components/Btn";
  import {SHOW_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import AddToGroup from "@/components/blackbox/AddToGroup";

  const DEFAULT_ORDER_TYPE = 'articul';

  export default {
    name: "Blackbox",
    components: {TrackingPagination, TrackingTable, FilterBlock, Fragment},
    mixins: [tableMixins, paginationMixin],
    data() {
      return {
        list: [],

        tableHeaders: [
          {name: 'goods', label: 'Товар', clazz: 'width30', sortable: false},
          {name: 'articul', label: 'Артикул', clazz: 'width9', isOnlyAscSorting: true},
          {name: 'currentPrice', label: 'Цена', clazz: 'width9'},
          {name: 'currentQty', label: 'Остаток', clazz: 'width9'},
          {name: 'avOrdersSpeed', label: 'Заказов в день', clazz: 'width9'},
          {name: 'avRevenue', label: 'Доход в день', clazz: 'width9'},
          {name: 'currentRating', label: 'Рейтинг', clazz: 'tracking-table__header-item_align-center width9'},
          {name: 'currentFeedBackCount', label: 'Кол-во отзывов', clazz: 'width5'},
          {name: 'add', label: 'Добавить в мои товары', sortable: false, clazz: 'width9'},
        ],
        orderType: DEFAULT_ORDER_TYPE,

        debounceLoadGoods: debounce(this.loadGoods, 200),
      }
    },
    computed: {
      tablePositions() {
        return this.list.map(item => ({
          ...this.$mapItemListToTableItem(item),
          nested: {content: ProductBlackboxNested, articul: item.articul, clazz: 'tracking-table-dropdown__item-chart'}
        }));
      },
      searchID() {
        return this.$store.state.blackbox.searchID;
      }
    },
    methods: {
      async searchHandler() {
        this.paginationData.page = 1;
        this.orderType = DEFAULT_ORDER_TYPE;

        this.debounceLoadGoods();
      },
      perPageHandler(value) {
        this.paginationData.page = 1;
        this.paginationData.perPage = value;

        this.loadGoods();
      },
      prevHandler() {
        this.paginationData.page -= 1;

        this.loadGoods();
      },
      nextHandler() {
        this.paginationData.page += 1;

        this.loadGoods();
      },

      async loadGoods() {
        if (this.$store.state.blackbox.searchID) {
          const service = new BlackboxService();

          const result = await service.getGoodsBySearchID(
            this.searchID,
            this.orderType,
            this.paginationData.page,
            this.paginationData.perPage
          );

          this.paginationData.totalCount = result.countAll;
          this.list = [];
          this.$nextTick(() => {
            this.list = result.products;
          })
        }
      },
      map_goods(item) {
        return {
          content: ProductContent,
          clazz: 'width30',
          component_data: {goodsName: item.name, articul: item.articul, brand: item.brand, link: item.link}
        };
      },
      map_currentPrice(item) {
        return {content: `${item.currentPrice} ₽`, clazz: 'width9'};
      },
      map_currentRating(item) {
        return {content: ProductRating, component_data: {rating: item.currentRating}, clazz: 'width9'};
      },
      map_add(item) {
        return {
          content: Btn, component_data: {
            label: 'add',
            'click-handler': this.addGoodsPositionHandler.bind(this, item)
          }, clazz: 'width9'
        }
      },
      addGoodsPositionHandler(item) {
        this.$store.commit(`modal/${SHOW_MODAL_MUTATION}`, {component: AddToGroup, data: {articul: item.articul}})
      }
    },
    async mounted() {
      this.$initPaginationHandlers(this.prevHandler, this.nextHandler);
    },
    watch: {
      orderType: function () {
        this.debounceLoadGoods();
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";

  .blackbox {
    margin: 1.42rem 2.28rem 0;
    background: white;
    border: 1px solid $drayDevider;
  }

</style>