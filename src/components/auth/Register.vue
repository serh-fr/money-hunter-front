<template>
  <Fragment>
    <ValidationObserver v-slot="{handleSubmit}">
      <form action="" class="modal-form" @submit.prevent="handleSubmit(register)">
        <template v-if="!confirmMessage">
          <div class="modal-form__input-item">
            <ValidationProvider v-slot="{errors}" name="E-mail" :rules="{required: true, email: true}">
              <InputField label="E-mail"
                          clazz="input-field__input_mail"
                          v-model="login"
                          :error="loginError || $getValidationError(errors)"/>
            </ValidationProvider>
          </div>
          <div class="modal-form__input-item">
            <ValidationProvider :rules="{required: true, min: 6}" v-slot="{errors}" name="Пароль">
              <InputField label="Пароль"
                          clazz="input-field__input_password"
                          v-model="password"
                          type="password"
                          :error="$getValidationError(errors)"/>
            </ValidationProvider>
          </div>
          <div class="modal-form__promocod-item">
            <div class="modal-form__promocod-link"
                 @click="showPromotionField=!showPromotionField"
                 v-if="!showPromotionField">
              У меня есть промокод
            </div>
            <template v-if="showPromotionField">
              <InputField type="text" clazz="input-field__input" placeholder="Введите промокод" v-model="code"/>
              <button class="modal-form__promocod-done" type="button"/>
            </template>
          </div>
          <div class="modal-form__submit-item">
            <Btn label="Зарегистрироваться" type="submit"/>
          </div>
          <div class="modal-form__links">
            <router-link :to="{name: 'auth.login'}">Уже есть учетная запись? Войти</router-link>
          </div>
        </template>
        <template v-else>
          <div class="modal-form__success-reset-password">Мы отправили сообщение на адрес {{login}}.
            Пожалуйста, проверьте свой почтовый ящик и следуйте инструкциям.
          </div>
          <div class="modal-form__submit-item">
            <Btn label="Хорошо" @click="$router.push({name: 'root'})"/>
          </div>
        </template>
      </form>
    </ValidationObserver>
  </Fragment>
</template>

<script>
  import InputField from "@/shared-components/InputField";
  import Btn from "@/shared-components/Btn";
  import {Fragment} from 'vue-fragment';
  import {AuthService} from "@/services/auth_service";
  import {ValidationObserver, ValidationProvider} from 'vee-validate';

  export default {
    name: "Register",
    components: {Fragment, InputField, Btn, ValidationProvider, ValidationObserver},
    data() {
      return {
        confirmMessage: false,

        showPromotionField: false,

        loginError: null,

        login: '',
        password: '',
        code: ''
      }
    },
    methods: {
      async register() {
        const service = AuthService.getInstance();
        const status = await service.register(this.login, this.password);

        if (typeof status === 'boolean' && status) {
          this.confirmMessage = true;
        } else {
          this.loginError = status;
        }
      }
    }
  }
</script>

<style scoped>

</style>