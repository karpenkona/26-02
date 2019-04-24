$(function () {
  var socket = io();
  const uid= $('#ya').html();
  socket.on('connect', () => {
    socket.emit('join', {uid: uid});
  });
  $('form').submit(function(e){
    e.preventDefault(); 
    let radioValue = $("input[name='frend']:checked").val();
    $(`#${radioValue} ul`).append($('<li>').html('<strong>Я: </strong>'+$('#m').val()));
    
    socket.emit('chat message', {user: uid, to: radioValue,text: $('#m').val()});
    $('#m').val('');
    $(`input[value='${radioValue}']`).parent('label').removeClass ("red");
    return false;
  });

  socket.on('chat message', function(msg){
    $(`#${msg.user} ul`).append($('<li>').html(`от <strong>${msg.user}</strong>: ${msg.text}`));
    let cheknew=`${msg.user}`;
    $(`input[value='${cheknew}']`).parent('label').addClass ("red");
  });
  
  $('input:radio').on( "change", function() {
    let input =$($(this))
    let onlychat = '#'+input.val();
    if(input.is(':checked')) {
      $('.cm').removeClass("pe").addClass ("npe");
      $(onlychat).removeClass("npe").addClass ("pe");
    }
  });
});