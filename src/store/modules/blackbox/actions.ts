import {
  CHECK_SEARCH_ID_ACTION,
  FIND_SEARCH_ID_BY_NAME_ACTION,
  GET_NEW_SEARCH_ID_ACTION, SET_FILTERS_MUTATION,
  SET_SEARCH_ID_MUTATION
} from "@/store/modules/blackbox/constants";
import {ActionContext} from "vuex";
import {VuexBlackBoxStateInterface} from "@/store/modules/blackbox/index";
import {BlackboxService} from "@/services/blackbox_service";
import {GetSearchIDDataInterface} from "@/repositories/blackbox_repository";
import {GET_SUBSCRIPTION_ACTION} from "@/store/modules/user/constants";
import {isEqual} from 'lodash';

const isFiltersEquals = (a: any, b: any) => isEqual(a, b);

export default {
  async [CHECK_SEARCH_ID_ACTION](context: ActionContext<VuexBlackBoxStateInterface, any>, filters: Record<string, any>) {
    if (!context.state.searchID || !isFiltersEquals(context.state.filters, filters)) {
      // searchID нету или фильтры изменились, просто получаем новый
      await context.dispatch(GET_NEW_SEARCH_ID_ACTION, filters);
      context.commit(SET_FILTERS_MUTATION, filters);
    }
  },
  async [GET_NEW_SEARCH_ID_ACTION](context: ActionContext<VuexBlackBoxStateInterface, any>, payload: Record<string, any>) {
    const service = new BlackboxService();
    const response = await service.getNewSearchID(payload as GetSearchIDDataInterface);

    if (response) {
      await context.dispatch(`user/${GET_SUBSCRIPTION_ACTION}`, undefined, {root: true});
      context.commit(SET_SEARCH_ID_MUTATION, {searchID: response.searchKey});
    }
  },
  async [FIND_SEARCH_ID_BY_NAME_ACTION](context: ActionContext<VuexBlackBoxStateInterface, any>, name: string) {
    const service = new BlackboxService();
    const response = await service.findSearchIDByName(name);

    if (response) {
      context.dispatch(`user/${GET_SUBSCRIPTION_ACTION}`, undefined, {root: true});
      context.commit(SET_SEARCH_ID_MUTATION, {searchID: response.searchID});

      return response;
    }

    return false;
  }
}