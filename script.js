document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     HAMBURGER + MOBILE MENU – NOW WORKING
  ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    });
  }

  /* ============================================================
     HERO CAROUSEL (kept for other pages)
  ============================================================ */
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length > 0) {
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentSlide = 0;
    let autoSlide;

    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateSlide() {
      slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlide();
    }

    function goToSlide(i) {
      currentSlide = i;
      updateSlide();
      resetAuto();
    }

    prevBtn?.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateSlide();
      resetAuto();
    });

    nextBtn?.addEventListener('click', () => {
      nextSlide();
      resetAuto();
    });

    function startAuto() {
      autoSlide = setInterval(nextSlide, 5000);
    }
    function resetAuto() {
      clearInterval(autoSlide);
      startAuto();
    }

    startAuto();
    updateSlide();
  }

  /* ============================================================
     SEARCH BAR
  ============================================================ */
  document.querySelector('.search-bar button')?.addEventListener('click', () => {
    const query = document.querySelector('.search-bar input').value.trim();
    if (query) alert(`Searching for: "${query}"`);
  });

  /* ============================================================
     TICKET MODAL – 100% WORKING
  ============================================================ */
  const modal = document.getElementById('ticket-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const payNowBtn = document.getElementById('pay-now-btn');

  if (modal) {
    let selectedPrice = 0;
    let selectedQty = 1;
    const startingSeat = 68;

    const bnbNotice = document.createElement('p');
    bnbNotice.style.color = '#FFD700';
    bnbNotice.style.fontWeight = '600';
    bnbNotice.style.marginBottom = '0.8rem';
    bnbNotice.textContent = 'Owner of these tickets only allows BNB crypto payments. Click Pay Now to purchase.';

    const bnbEstimate = document.createElement('p');
    bnbEstimate.style.marginTop = '0.8rem';
    bnbEstimate.style.fontWeight = '500';
    bnbEstimate.style.color = '#fff';

    const seatInfo = document.createElement('p');
    seatInfo.style.marginTop = '0.8rem';
    seatInfo.style.fontWeight = '500';
    seatInfo.style.color = '#fff';

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.id = 'ticket-email';
    emailInput.placeholder = 'Receiver email address';
    emailInput.required = true;
    emailInput.style.display = 'block';
    emailInput.style.margin = '1rem auto 0';
    emailInput.style.padding = '0.8rem';
    emailInput.style.borderRadius = '12px';
    emailInput.style.border = '1px solid #444';
    emailInput.style.width = '90%';
    emailInput.style.maxWidth = '320px';
    emailInput.style.background = '#222';
    emailInput.style.color = '#fff';

    /* ============================================================
       MESSAGE SELLER BUTTON + VERIFIED BADGE
    ============================================================ */
    const msgSellerBtn = document.createElement('button');
    msgSellerBtn.innerHTML = 'Message Seller <span id="verify-badge">VERIFIED</span>';
    msgSellerBtn.id = 'msg-seller-btn';
    msgSellerBtn.style.display = 'block';
    msgSellerBtn.style.margin = '0 auto 1rem';
    msgSellerBtn.style.padding = '0.7rem 1.4rem';
    msgSellerBtn.style.border = 'none';
    msgSellerBtn.style.borderRadius = '12px';
    msgSellerBtn.style.fontWeight = '600';
    msgSellerBtn.style.cursor = 'pointer';
    msgSellerBtn.style.background = '#0600FF';
    msgSellerBtn.style.color = '#fff';
    msgSellerBtn.style.transition = '0.3s';

    const verifyBadge = msgSellerBtn.querySelector('#verify-badge');
    verifyBadge.style.background = '#FF00AD';
    verifyBadge.style.color = '#fff';
    verifyBadge.style.padding = '0.2rem 0.5rem';
    verifyBadge.style.borderRadius = '6px';
    verifyBadge.style.fontSize = '0.8rem';
    verifyBadge.style.marginLeft = '8px';
    verifyBadge.style.fontWeight = '700';

    msgSellerBtn.addEventListener('mouseenter', () => {
      msgSellerBtn.style.transform = 'scale(1.06)';
    });
    msgSellerBtn.addEventListener('mouseleave', () => {
      msgSellerBtn.style.transform = 'scale(1)';
    });
    msgSellerBtn.addEventListener('click', () => {
  window.open('https://twitter.com/YourProfileHandle', '_blank');
});

    /* ============================================================
       BLUE BORDER BOX FOR PRICE + QTY + TOTAL
    ============================================================ */
    const priceBox = document.createElement('div');
    priceBox.style.border = '2px solid #007bff';
    priceBox.style.padding = '1rem';
    priceBox.style.borderRadius = '12px';
    priceBox.style.marginBottom = '1rem';
    priceBox.style.color = '#fff';
    priceBox.style.textAlign = 'center';
    priceBox.style.display = 'flex';
    priceBox.style.flexDirection = 'column';
    priceBox.style.gap = '1rem';

    const priceLine = document.createElement('p');
    priceLine.id = 'price-per-ticket';
    priceLine.innerHTML = `Price per ticket: <strong>$0.00</strong>`;

    const qtyBox = document.createElement('div');
    qtyBox.style.display = 'flex';
    qtyBox.style.justifyContent = 'center';
    qtyBox.style.alignItems = 'center';
    qtyBox.style.gap = '12px';

    const qtyMinus = document.getElementById('qty-minus');
    const qtyInput = document.getElementById('qty-input');
    const qtyPlus = document.getElementById('qty-plus');

    qtyBox.appendChild(qtyMinus);
    qtyBox.appendChild(qtyInput);
    qtyBox.appendChild(qtyPlus);

    const totalLine = document.createElement('p');
    totalLine.innerHTML = `Total: <strong id="total-amount">0.00</strong>`;

    priceBox.appendChild(priceLine);
    priceBox.appendChild(qtyBox);
    priceBox.appendChild(totalLine);

    /* INSERT ITEMS IN CORRECT ORDER */
    payNowBtn.parentNode.insertBefore(bnbNotice, payNowBtn);
    payNowBtn.parentNode.insertBefore(msgSellerBtn, payNowBtn);
    payNowBtn.parentNode.insertBefore(priceBox, payNowBtn);
    payNowBtn.parentNode.insertBefore(emailInput, payNowBtn);
    payNowBtn.parentNode.insertBefore(seatInfo, payNowBtn);
    payNowBtn.parentNode.insertBefore(bnbEstimate, payNowBtn.nextSibling);

    /* ============================================================
       QUANTITY BUTTONS
    ============================================================ */
    qtyMinus?.addEventListener('click', () => {
      if (selectedQty > 1) {
        selectedQty--;
        qtyInput.value = selectedQty;
        updateTotal();
      }
    });

    qtyPlus?.addEventListener('click', () => {
      if (selectedQty < 8) {
        selectedQty++;
        qtyInput.value = selectedQty;
        updateTotal();
      }
    });

    function updateTotal() {
      priceLine.innerHTML = `Price per ticket: <strong>$${selectedPrice.toFixed(2)}</strong>`;
      const totalUSD = selectedPrice * selectedQty;
      totalLine.innerHTML = `Total: <strong>$${totalUSD.toFixed(2)}</strong>`;
      const bnbRate = 906.27;
      const totalBNB = (totalUSD / bnbRate).toFixed(6);
      bnbEstimate.textContent = `Estimated: ${totalBNB} BNB`;

      if (selectedQty === 1) {
        seatInfo.textContent = `Row: A | Seat: ${startingSeat}`;
      } else {
        const seats = [];
        for (let i = 0; i < selectedQty; i++) seats.push(startingSeat + i);
        seatInfo.textContent = `Seats together | ROW A | Seat ${seats.join(', ')}`;
      }
    }

    /* ============================================================
       BUY NOW BUTTON
    ============================================================ */
    document.querySelectorAll('.btn-buy-now').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const card = btn.closest('.hero-card');
        if (!card) return;

        const title = card.querySelector('.event-title')?.textContent.trim() || 'Event Ticket';
        const price = card.closest('.hero-card-event')?.dataset.price 
                     ? parseFloat(card.closest('.hero-card-event').dataset.price) 
                     : 50;

        selectedPrice = price;
        selectedQty = 1;
        emailInput.value = '';

        const loader = document.createElement('div');
        loader.id = 'ticket-loader';
        loader.style.cssText = `
          position:fixed;top:0;left:0;width:100vw;height:100vh;
          background:rgba(0,0,0,0.9);display:flex;justify-content:center;
          align-items:center;z-index:9999;
        `;

        const ticketImg = document.createElement('img');
        ticketImg.src = 'ticket.png';
        ticketImg.style.cssText = `
          width:160px;height:160px;animation:spin 3s linear infinite;
          filter:invert(77%) sepia(100%) saturate(7500%) hue-rotate(5deg) brightness(1.1);
        `;
        loader.appendChild(ticketImg);
        document.body.appendChild(loader);

        setTimeout(() => {
          document.body.removeChild(loader);
          document.getElementById('modal-event-name').textContent = title;
          document.getElementById('modal-price').textContent = price.toFixed(2);
          qtyInput.value = 1;
          updateTotal();
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }, 3000);
      });
    });

    closeModalBtn?.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    payNowBtn?.addEventListener('click', async () => {
      if (!emailInput.value.includes('@')) {
        alert('Please enter a valid email address');
        emailInput.focus();
        return;
      }

      const title = document.getElementById('modal-event-name').textContent.trim();
      const amountUSD = (selectedPrice * selectedQty).toFixed(2);

      const orderId = `tm_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;

      payNowBtn.disabled = true;
      const originalText = payNowBtn.textContent;
      payNowBtn.textContent = 'Redirecting...';

      try {
        const res = await fetch('/api/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: orderId,
            price_amount: amountUSD,
            price_currency: 'usd',
            metadata: { title }
          })
        });

        if (!res.ok) throw new Error(await res.text() || 'Payment failed');
        const data = await res.json();
        const invoice = data.invoice_url || data.payment_url;
        if (!invoice) throw new Error('No payment link');

        window.location.href = invoice;
      } catch (err) {
        console.error(err);
        alert('Payment error: ' + (err.message || 'Try again'));
        payNowBtn.disabled = false;
        payNowBtn.textContent = originalText;
      }
    });
  }

  /* ============================================================
     INJECTED STYLES
  ============================================================ */
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    #ticket-modal {
      display: none;
      position: fixed;
      inset: 0;
      margin-top: 65px;
      background: rgba(0,0,0,0.7);
      z-index: 999;
      align-items: flex-start;
      justify-content: center;
      padding-top: 30px;
      overflow-y: auto;
    }

    #ticket-modal.active {
      display: flex;
    }

    #ticket-modal .modal-content {
      background: #1c1c1c;
      border-radius: 15px;
      padding: 2rem;
      max-width: 450px;
      width: 90%;
      margin: 0 auto;
      box-shadow: 0 8px 25px rgba(0,0,0,0.6);
      color: #fff;
      position: relative;
      text-align: center;
      max-height: 90vh;
      overflow-y: auto;
    }

    #close-modal {
      position: absolute; top: 15px; right: 15px; background: red;
      border: none; border-radius: 50%; width: 30px; height: 30px;
      font-weight: bold; cursor: pointer; transition: transform 0.2s;
    }
    #close-modal:hover { transform: scale(1.1); }

    #pay-now-btn {
      background: linear-gradient(90deg, #FFD700, #FFA500);
      color: #1c1c1c; border: none; padding: 0.8rem 1.5rem;
      border-radius: 10px; font-weight: 600; cursor: pointer;
      transition: all 0.3s ease;
    }
    #pay-now-btn:hover { transform: scale(1.05); box-shadow: 0 4px 15px rgba(255,215,0,0.5); }

    #qty-minus, #qty-plus {
      background: #333; color: #fff; border: none; padding: 0.4rem 0.8rem;
      border-radius: 8px; cursor: pointer;
    }
    #qty-minus:hover, #qty-plus:hover { background: #444; }
    #ticket-email { font-size: 1rem; }
  `;
  document.head.appendChild(style);

});