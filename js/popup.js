
var modal = document.getElementById('modal');
var modalOverlay = document.getElementById('modal-overlay');
var openButton = document.getElementById('open-button');

modalOverlay.addEventListener('click', () => {
	modal.classList.toggle('closed');
  modalOverlay.classList.toggle('closed');
});

openButton.addEventListener('click', function () {
  modal.classList.toggle('closed');
  modalOverlay.classList.toggle('closed');
});
