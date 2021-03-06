<template>
  <Modal title="Добавить товар" closable>
    <template v-slot:default>

      <div class="modal-tabs">
        <div class="modal-tabs__item" v-for="(item, idx) in addTypes"
             :key="idx"
             @click="_=>{selectedType=item; firstDone=false}"
             style="display: block; cursor:pointer;">
          <strong v-if="selectedType===item">
            <span v-html="translatedType(item)"/>
          </strong>
          <span v-else v-html="translatedType(item)"/>
        </div>
      </div>

      <div class="modal-form-steps">
        <div class="modal-form-steps__line"/>
        <div class="modal-form-steps__item"
             :class="{'modal-form-steps__item_success': firstDone, 'modal-form-steps__item_active': !firstDone}">
          <div class="step-circle">1</div>
          <div class="step-name" v-text="firstStepName"/>
        </div>
        <div class="modal-form-steps__item" :class="{'modal-form-steps__item_active': firstDone}">
          <div class="step-circle">2</div>
          <div class="step-name">Выберите группу</div>
        </div>
      </div>

      <form action="" class="modal-form">
        <template v-if="!firstDone">
          <ValidationProvider v-slot="{errors, valid, validate}"
                              v-if="selectedType==='byGoods'"
                              :rules="{required: true}"
                              :key="selectedType">
            <FindProductModal v-model="foundedProduct"
                              :validation-error="$getValidationError(errors) || typeof foundedProduct==='string' ? 'Не найдено':null"/>

            <div class="modal-form__submit-item">
              <Btn label="Далее"
                   type="button"
                   @click="()=>{if(valid&& typeof foundedProduct==='object') {firstDone=true}else validate()}"/>
            </div>
          </ValidationProvider>

          <ValidationProvider v-else v-slot="{errors, valid, validate}" :rules="{required: true}" :key="selectedType">
            <TreeSelect
              :error="$getValidationError(errors)"
              v-model="selectedBrands"
              ref="brandsSelector"
              label="Выберите бренд"
              :multiple="true"
              :load-options="loadBrands"
              :options="brandOptions"
              :normalizer="brandsNormalizer"
              :dont-use-local-search="true"
              @open="handleMenuOpen"
              @close="handleMenuClose"
              @search-change="handleSearchChange"
            />

            <div class="modal-form__submit-item">
              <Btn label="Далее"
                   type="button"
                   @click="()=>{if(valid) {firstDone=true}else validate()}"/>
            </div>
          </ValidationProvider>


        </template>
        <template v-if="firstDone">
          <ValidationProvider v-slot="{errors, valid, validate}" :rules="{required: true}">
            <SelectGroupModal v-model="selectedGroup" :error="$getValidationError(errors)"/>

            <div class="modal-form__double-submit modal-form__double-submit_save-project">
              <div class="modal-form__double-submit-item">
                <Btn label="Назад" clazz="button_gray" @click="firstDone=false"/>
              </div>
              <div class="modal-form__double-submit-item">
                <Btn label="Сохранить" @click="()=> valid ? handleSaveBtn() : validate()"/>
              </div>
            </div>
          </ValidationProvider>
        </template>
      </form>

    </template>
  </Modal>
</template>

<script>
  import Modal from "@/components/Modal";
  import Btn from "@/shared-components/Btn";
  import TreeSelect from "@/shared-components/TreeSelect";
  import {TrackingService} from "@/services/tracking_service";
  import {HIDE_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import {LOAD_GROUPS_ACTION} from "@/store/modules/tracking/constants";
  import {ValidationProvider} from 'vee-validate';
  import SelectGroupModal from "@/shared-components/SelectGroupModal";
  import FindProductModal from "@/shared-components/FindProductModal";

  const ADD_BY_GOODS = 'byGoods';
  const ADD_BY_BRAND = 'byBrand';

  export default {
    name: "AddGoodsPosition",
    components: {FindProductModal, SelectGroupModal, TreeSelect, Modal, Btn, ValidationProvider},
    data() {
      return {
        firstDone: false,
        addTypes: [ADD_BY_GOODS, ADD_BY_BRAND],
        selectedType: ADD_BY_GOODS,

        loadedBrands: null,
        foundedProduct: null,

        brandOptions: null,

        brandsPortionPage: 1,
        brandsPortionSize: 30,
        brandsSearchQuery: '',

        selectedBrands: [],
        selectedGroup: '',

      }
    },
    computed: {
      firstStepName() {
        return this.selectedType === ADD_BY_GOODS
          ? 'Добавить товар'
          : 'Добавить бренд';
      },
    },
    methods: {
      translatedType(type) {
        return type === ADD_BY_GOODS ? 'По одному' : 'Бренд';
      },
      async loadBrands() {
        const service = new TrackingService();
        this.loadedBrands = await service.getBrands();
        this.brandOptions = this.loadedBrands.slice(0, this.brandsPortionSize);
      },
      brandsNormalizer: node => ({id: node.brand, label: node.brand}),
      handleMenuOpen() {
        this.$nextTick(() => {
          const menu = this.$refs.brandsSelector.getMenu();

          menu.addEventListener('scroll', () => {
            const hasReachedEnd = menu.scrollHeight - menu.scrollTop <= menu.clientHeight * 1.25;

            if (hasReachedEnd) {
              this.brandsPortionPage += 1;

              const fromIndex = (this.brandsPortionPage - 1) * this.brandsPortionSize + 1;
              const toIndex = this.brandsPortionPage * this.brandsPortionSize;

              if (this.brandsSearchQuery) {
                this.brandOptions.push(...this.handleBrandsSearch(fromIndex))
              } else {
                this.brandOptions.push(
                  ...this
                    .loadedBrands
                    .slice(fromIndex, toIndex)
                );
              }
            }
          });
        })
      },
      handleMenuClose() {
        this.$nextTick(() => {
          this.brandOptions = this.loadedBrands.slice(0, this.brandsPortionSize);
          this.brandsPortionPage = 1;
        })
      },
      handleBrandsSearch(fromIndex = 0) {
        const results = [];
        const searchQuery = this.brandsSearchQuery;

        for (let i = fromIndex; i < this.loadedBrands.length && results.length < this.brandsPortionSize; i++) {
          const loadedName = this.loadedBrands[i].brand.toLowerCase();
          const _searchQuery = searchQuery.toLowerCase();
          if (loadedName.indexOf(_searchQuery) > -1 && !this.brandOptions.find(e => e.brand.toLowerCase() === loadedName)) {
            results.push(this.loadedBrands[i]);
          }

          if (results.length === this.brandsPortionPage) {
            this.brandsPortionPage = parseInt(String(i / this.brandsPortionSize));
          }
        }

        return results;
      },
      handleSearchChange(searchQuery) {
        this.brandsSearchQuery = searchQuery;
        this.brandOptions = [];
        this.$nextTick(() => {
          this.brandOptions = this.handleBrandsSearch();
        });
      },

      async handleSaveBtn() {
        const service = new TrackingService();
        const result = await service.createUpdateGroup(
          this.selectedGroup,
          this.selectedType === ADD_BY_GOODS ? [this.foundedProduct.articul] : this.selectedBrands,
          this.selectedType === ADD_BY_BRAND
        );

        if (result) {
          await this.$store.dispatch(`tracking/${LOAD_GROUPS_ACTION}`);
          await this.$store.commit(`modal/${HIDE_MODAL_MUTATION}`);
          if (this.$route.fullPath !== this.$router.resolve({
            name: 'tracking.group',
            params: {name: this.selectedGroup.toUpperCase()}
          }).route.fullPath) {
            await this.$router.push({name: 'tracking.group', params: {name: this.selectedGroup.toUpperCase()}});
          } else {
            this.$eventBus.$emit('tracking.group.loadGoods');
          }
        } else {
          alert('Произошла ошибка');
        }
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "../../assets/scss/variables.scss";

  .input-field__label {
    letter-spacing: .2px;
    color: $titleColor;
    font-weight: bold;
    display: block;
  }
</style>