/**
 * @author Yan Dong (2017/05/15)
 * @requires  jQuery v1.8.3 or later
 * Can re-write below two function:
 *  - recaptchaFrontEndVali
 *  - recaptchaBeforeSubmit
 */

RecaptchaCustomize = {};

/**
 * Invisible reCAPTCHA api onload callback, render the widget explicitly.
 */
var onRecaptchaApiReady = function () {
  jQuery('form').each(function() {
    if (jQuery(this).find('.g-recaptcha[data-size="invisible"]').length > 0) {
      var widgetId = grecaptcha.render(jQuery(this).find('.g-recaptcha')[0], {}, true);
      jQuery(this).data('recaptcha-id', widgetId);
    }
  });
};

/**
 * Google reCAPTCHA callback, when the user submits a successful CAPTCHA response.
 */
var recaptchaValiCallback = function() {
  RecaptchaCustomize.submitForm();
};

/**
 * Re-write this function if have front end validation.
 * @param  {Obj}     $form The form element will execute invisible reCAPTCHA.
 * @return {Boolean}       If front end validation pass will return true, otherwise return false.
 */
var recaptchaFrontEndVali = function($form) {
  return true;
}

/**
 * Re-write this function if need do something before submit form after execute invisible reCAPTCHA successfully.
 * @param  {[type]} $from The form element will execute invisible reCAPTCHA.
 */
var recaptchaBeforeSubmit = function($from) {};

(function($) {

  // Add reCAPTCHA API.
  (function (d, s, id) {
    var js,
        fjs = d.getElementsByTagName(s)[0],
        lang = $('html').attr('xml:lang');
        lang = lang ? lang : $('html').prop('lang');
      // drupal_add_js('https://apis.google.com/js/api:client.js', array('type' => 'external', 'weight' => 60));
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.async = true;
    js.defer = true;
    js.src = '//www.google.com/recaptcha/api.js?hl=' + lang + '&onload=onRecaptchaApiReady&render=explicit';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'recaptcha-api'));

  /**
   * Please put here the function before form submit.
   */
  RecaptchaCustomize.submitForm = function() {
    var $thisForm = $('.clicked-submit');
    recaptchaBeforeSubmit($thisForm);
    $thisForm.submit();
  };

  /**
   * Execute reCAPTCHA.
   */
  RecaptchaCustomize.exeCaptcha = function() {
    $('form').on('click', '.form-submit', function(e) {
      var $thisForm = $(this).parents('form');
      if ($thisForm.find('.g-recaptcha[data-size="invisible"]').length > 0) {
        e.preventDefault();
        $('form').removeClass('clicked-submit');
        $thisForm.addClass('clicked-submit');
        var widgetId = $thisForm.data('recaptcha-id');
        if (recaptchaFrontEndVali($thisForm)) {
          if (grecaptcha.getResponse(widgetId)) {
            RecaptchaCustomize.submitForm();
          } else {
            grecaptcha.execute(widgetId);
          }
        }
      }
    });
  };

  /**
   * Add invisible reCAPTCHA class in body to define captcha layout.
   */
  RecaptchaCustomize.addInvisibleRecClass = function() {
    if ($('.g-recaptcha[data-size="invisible"]').length > 0) {
      $('body').addClass('use-invisible-recaptcha');
    }
  }

  // Document ready.
  $(function() {
    RecaptchaCustomize.addInvisibleRecClass();
    RecaptchaCustomize.exeCaptcha();
  })

}(jQuery));