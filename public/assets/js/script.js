$(document).ready(function() {
  passwordReveal();
  passwordHide();
});

function passwordReveal() {
  $(document).on('click', 'span.glyphicon-eye-open', function() {
    $(this).parent().parent().children('input.password-input').attr('type', 'text');
    $(this).replaceWith("<span class='glyphicon glyphicon-eye-close'></span>");
  });
};

function passwordHide() {
  $(document).on('click', 'span.glyphicon-eye-close', function() {
    $(this).parent().parent().children('input.password-input').attr('type', 'password');
    $(this).replaceWith("<span class='glyphicon glyphicon-eye-open'></span>");
  });
};
