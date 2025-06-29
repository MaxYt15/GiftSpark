// Animación de regalo/caja para ver carta
window.addEventListener('DOMContentLoaded', () => {
  const giftBox = document.getElementById('gift-box');
  const giftAnimContainer = document.getElementById('gift-animation-container');
  const cardContainer = document.getElementById('card-viewer-container');

  if (!giftBox || !giftAnimContainer || !cardContainer) return;

  let opened = false;

  giftBox.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    giftBox.classList.add('open');
    setTimeout(() => {
      giftAnimContainer.classList.add('fade-out');
      setTimeout(() => {
        giftAnimContainer.style.display = 'none';
        cardContainer.style.display = 'flex';
      }, 700);
    }, 900); // tiempo de animación de la tapa
  });

  // Modal de imagen
  const imageModal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const closeModalBtn = document.querySelector('.close-modal');

  // Delegación para imágenes de la carta
  document.body.addEventListener('click', function(e) {
    if (e.target && e.target.tagName === 'IMG' && e.target.closest('.card-images')) {
      modalImg.src = e.target.src;
      imageModal.classList.add('active');
    }
  });

  // Cerrar modal
  closeModalBtn.addEventListener('click', () => {
    imageModal.classList.remove('active');
    modalImg.src = '';
  });
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
      imageModal.classList.remove('active');
      modalImg.src = '';
    }
  });
}); 