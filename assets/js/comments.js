document.addEventListener('DOMContentLoaded', function() {
  const commentSlider = document.querySelector('.comment-slider');
  const prevBtn = document.querySelector('.comments .nav-btn.prev');
  const nextBtn = document.querySelector('.comments .nav-btn.next');
  let currentIndex = 0;
  let intervalId;

  const comments = [
    {
      title: "Great Platform!",
      text: "Using Lendingaicryp has completely transformed how we approach crypto lending. The AI-driven analysis not only simplifies the process but also ensures we’re making smart, data-backed decisions. With support across multiple chains like Ethereum, Polygon, and Optimism, we’ve noticed a significant boost in user experience and security. Lendingaicryp advanced risk management makes us feel confident, knowing we’re protected while expanding our portfolios. It’s a game-changer for anyone looking to borrow or lend in the crypto space!",
      author: "Yi Liu",
      role: "Chief Marketing Officer",
      image: "./assets/images/user1.jpg"
    },
    {
      title: "Impressive AI Technology",
      text: "Integrating Lendingaicryp into my crypto lending strategy has been an absolute game-changer. Their AI-driven credit analysis provides unmatched accuracy, and the flexibility in loan options gives users real confidence. It’s not just about borrowing—it’s about doing it safely and efficiently. The seamless process and security measures they’ve put in place make it feel like the future of DeFi lending. If you’re serious about growing your crypto, this platform is a must!",
      author: "Olivia Thomas",
      role: "Software engineer",
      image: "./assets/images/user2.jpg"
    },
    {
      title: "Seamless Credit Process",
      text: "Lendingaicryp real-time credit analysis, powered by advanced AI, has given me the confidence to navigate the crypto lending space with ease. Their system not only streamlines borrowing but also ensures my transactions are secure at every step. It feels like they’re paving the way for a safer, smarter DeFi future. Whether you’re new or experienced, this platform makes lending and borrowing in crypto a breeze!",
      author: "Kumar Singh",
      role: "Staff Software Engineer",
      image: "./assets/images/user3.jpg"
    },
    {
      title: "Game-Changing Platform",
      text: "Since I started using Lendingaicryp, I’ve been really impressed by how easy and secure the process is for getting crypto loans. The platform’s AI-driven system doesn’t just make credit approvals fast, but it also adds extra layers of security that give me complete peace of mind. Knowing that every transaction is backed by cutting-edge technology makes me feel totally safe. If you're looking for a trustworthy and secure option to manage your crypto, I’d highly recommend Lendingaicryp. Complete confidence in their security!",
      author: "Wang Hao",
      role: "Marketing Manager",
      image: "./assets/images/user4.jpg"
    },
    {
      title: "Secure and Reliable",
      text: "When I hit a rough patch financially, Lendingaicryp came through for me in a big way. I needed funds quickly, and their platform made the whole process super easy and stress-free. I was able to get approved for a loan in USDT, and the best part is how flexible the repayment options are. This service really helped me when I needed it most, and I can't thank them enough for making crypto lending so accessible. If you're in a pinch and need quick, reliable financial support, Lendingaicryp is the way to go.",
      author: "David Johnson",
      role: "New Crypto Investor",
      image: "./assets/images/user5.jpg"
    },
    {
      title: "Excellent Customer Support",
      text: "I was blown away by how simple Lendingaicryp made the DeFi process! Their platform is not only user-friendly, but the AI-powered tools really help to optimize my returns. From lending to borrowing, everything is streamlined, and their innovative features make it easy to maximize my profits without constantly monitoring the markets. It's amazing to see how fast I can grow my portfolio with minimal effort. Lendingaicryp has taken the complexity out of DeFi and made it accessible for everyone.",
      author: "Dam Thompson",
      role: "Data Scientist",
      image: "./assets/images/user6.jpg"
    },
    {
      title: "Innovative Lending Solutions",
      text: "I've always been cautious about lending my crypto, but Lendingaicryp changed that. Their P2P lending system is built with such strong security features that I feel confident every time I extend a loan. With their cutting-edge AI monitoring everything and their protection in place, I know my funds are safe. Plus, it's a great feeling knowing that I'm helping others in need while my assets keep growing. Lendingaicryp makes it easy to lend, earn, and feel secure at every step.",
      author: "Jason guerrero",
      role: "Blockchain Developer",
      image: "./assets/images/user7.jpg"
    }
  ];

  function createCommentCard(comment) {
    return `
      <div class="comment-card">
        <h3 class="comment-title">${comment.title}</h3>
        <p class="comment-text">${comment.text}</p>
        <div class="comment-author">
          <img src="${comment.image}" alt="${comment.author}" class="author-img">
          <div class="author-info">
            <h4 class="author-name">${comment.author}</h4>
            <p class="author-role">${comment.role}</p>
          </div>
        </div>
      </div>
    `;
  }

  function renderComments() {
    commentSlider.innerHTML = comments.map(createCommentCard).join('');
    showComment(currentIndex);
  }

  function showComment(index) {
    const commentCards = document.querySelectorAll('.comment-card');
    commentCards.forEach(card => card.classList.remove('active'));
    commentCards[index].classList.add('active');
  }

  function showNextComment() {
    currentIndex = (currentIndex + 1) % comments.length;
    showComment(currentIndex);
  }

  function showPrevComment() {
    currentIndex = (currentIndex - 1 + comments.length) % comments.length;
    showComment(currentIndex);
  }

  function startAutoChange() {
    intervalId = setInterval(showNextComment, 3000);
  }

  function stopAutoChange() {
    clearInterval(intervalId);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      showNextComment();
      stopAutoChange();
      startAutoChange();
    });

    prevBtn.addEventListener('click', () => {
      showPrevComment();
      stopAutoChange();
      startAutoChange();
    });

    renderComments();
    startAutoChange();

    // Pause auto-changing when hovering over the comment slider
    commentSlider.addEventListener('mouseenter', stopAutoChange);
    commentSlider.addEventListener('mouseleave', startAutoChange);
  } else {
    console.error('Navigation buttons not found');
  }
});