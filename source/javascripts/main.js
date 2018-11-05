$(function(){
  // $('#submit').on('click', function(e){
  $('#queryForm').submit(querySubmit);
  function querySubmit(){
    var parameters = $(this).serialize();

    $.post( '/searching', parameters, function(data) {
      $('#results').append(data);
      // alert(data);
    });
    return false;
  }
});
// var socket = io.connect("http://localhost");
// socket.on('sales', function (data) {
//   //Update your dashboard gauge
//   salesGauge.setValue(data.value);
//
//   socket.emit('profit', { my: 'data' });
// });
