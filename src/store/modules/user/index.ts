import actions from "@/store/modules/user/actions";
import mutations from "@/store/modules/user/mutations";

export interface VuexUserStateDataInterface {
  email: string;
  userName: string;
  companyName: string;
  phoneNumber: string;
}

export interface VuexUserStateSubscriptionInterface {
  blackBoxSearches: number;
  expDate: string;
  maxTrackingProducts: number;
  subscriptionType: string;
}

export interface VuexUserStateInterface {
  data: VuexUserStateDataInterface | null;
  subscription: VuexUserStateSubscriptionInterface | null
}

export default {
  namespaced: true,
  state: (): VuexUserStateInterface => ({
    data: null,
    subscription: null
  }),
  mutations: mutations,
  actions: actions
}