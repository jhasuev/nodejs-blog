$(function () {
  $('.js-select2').select2({
    placeholder: "Выбрать категорию",
    allowClear: true,
  })
  $(".js-select2").each(function(i, sel) {
    const $sel = $(sel)
    if ($sel.attr("value")) {
      $sel.val($sel.attr("value")).trigger("change")
    }
  })
});