document.addEventListener("DOMContentLoaded", () => {
  // --- PHẦN LOGIC BÌNH LUẬN ---

  // Lấy các phần tử DOM cần thiết cho bình luận
  const commentForm = document.getElementById("commentForm");
  const userNameInput = document.getElementById("userName");
  const ratingStars = document.getElementById("ratingStars");
  const ratingValueInput = document.getElementById("ratingValue");
  const commentTextInput = document.getElementById("commentText");
  const commentsList = document.getElementById("commentsList");

  let selectedRating = 0; // Biến để lưu số sao được chọn cho phần bình luận

  // Hàm để tải và hiển thị bình luận từ Local Storage
  function loadComments() {
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    commentsList.innerHTML = ""; // Xóa các bình luận cũ

    if (comments.length === 0) {
      commentsList.innerHTML =
        '<p class="no-comments-yet">Chưa có bình luận nào. Hãy là người đầu tiên!</p>';
      return;
    }

    comments.forEach((comment) => {
      const commentItem = document.createElement("div");
      commentItem.classList.add("comment-item");

      const ratingHtml =
        '<div class="rating">' +
        Array(comment.rating).fill('<i class="fas fa-star"></i>').join("") +
        Array(5 - comment.rating)
          .fill('<i class="far fa-star"></i>')
          .join("") +
        "</div>";

      const displayDate = new Date(comment.timestamp).toLocaleDateString(
        "vi-VN"
      );
      const displayTime = new Date(comment.timestamp).toLocaleTimeString(
        "vi-VN"
      );

      commentItem.innerHTML = `
                <h3>${comment.userName}</h3>
                ${ratingHtml}
                <p>${comment.commentText}</p>
                <div class="date">${displayDate} ${displayTime}</div>
            `;
      commentsList.appendChild(commentItem);
    });
  }

  // Xử lý sự kiện click/hover ngôi sao cho phần bình luận
  ratingStars.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-star")) {
      const value = parseInt(e.target.dataset.value);
      selectedRating = value;
      ratingValueInput.value = value;
      updateStarDisplay(selectedRating);
    }
  });

  ratingStars.addEventListener("mouseover", (e) => {
    if (e.target.classList.contains("fa-star")) {
      const value = parseInt(e.target.dataset.value);
      updateStarDisplay(value);
    }
  });

  ratingStars.addEventListener("mouseout", () => {
    updateStarDisplay(selectedRating);
  });

  // Hàm cập nhật màu sắc các ngôi sao cho phần bình luận
  function updateStarDisplay(rating) {
    Array.from(ratingStars.children).forEach((star) => {
      const starValue = parseInt(star.dataset.value);
      if (starValue <= rating) {
        star.classList.remove("far");
        star.classList.add("fas");
      } else {
        star.classList.remove("fas");
        star.classList.add("far");
      }
    });
  }

  // Xử lý khi form bình luận được gửi
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const userName = userNameInput.value.trim();
    const commentText = commentTextInput.value.trim();
    const rating = parseInt(ratingValueInput.value);

    if (!userName || !commentText || rating === 0) {
      alert("Vui lòng nhập đầy đủ Tên, Bình luận và chọn số sao đánh giá!");
      return;
    }

    const newComment = {
      userName: userName,
      rating: rating,
      commentText: commentText,
      timestamp: new Date().toISOString(),
    };

    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.unshift(newComment); // Thêm vào đầu để hiển thị mới nhất lên trên
    localStorage.setItem("comments", JSON.stringify(comments));

    // Reset form bình luận
    userNameInput.value = "";
    commentTextInput.value = "";
    ratingValueInput.value = "0";
    selectedRating = 0;
    updateStarDisplay(0);

    loadComments(); // Tải lại bình luận để hiển thị cái mới
  });

  // Tải bình luận khi trang vừa tải
  loadComments();

  // --- KẾT THÚC PHẦN LOGIC BÌNH LUẬN ---

  // --- BẮT ĐẦU PHẦN LOGIC TRÒ CHƠI ĐOÁN SỐ ---

  // Lấy các phần tử DOM cần thiết cho trò chơi
  const guessInput = document.getElementById("guessInput");
  const checkGuessBtn = document.getElementById("checkGuessBtn");
  const guessFeedback = document.getElementById("guessFeedback");
  const guessCountSpan = document.getElementById("guessCount");
  const resetGameBtn = document.getElementById("resetGameBtn");

  let secretNumber;
  let attempts = 0;
  const maxAttempts = 10; // Giới hạn số lần đoán

  // Hàm khởi tạo trò chơi
  function initializeGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1; // Tạo số bí mật từ 1 đến 100
    attempts = 0;
    guessCountSpan.textContent = attempts;
    guessFeedback.textContent = "";
    guessFeedback.classList.remove("correct", "incorrect");
    guessInput.value = "";
    guessInput.disabled = false;
    checkGuessBtn.disabled = false;
    resetGameBtn.style.display = "none"; // Ẩn nút chơi lại khi game mới bắt đầu
    guessInput.focus(); // Đặt con trỏ vào ô nhập liệu
    console.log("Số bí mật (chỉ để kiểm tra):", secretNumber); // Bạn có thể xóa dòng này khi không cần debug
  }

  // Hàm kiểm tra đoán của người dùng
  function checkGuess() {
    const userGuess = parseInt(guessInput.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      guessFeedback.textContent = "Vui lòng nhập một số hợp lệ từ 1 đến 100.";
      guessFeedback.classList.add("incorrect");
      return;
    }

    attempts++;
    guessCountSpan.textContent = attempts;
    guessFeedback.classList.remove("correct", "incorrect"); // Xóa lớp cũ để cập nhật màu mới

    if (userGuess === secretNumber) {
      guessFeedback.textContent = `Chúc mừng! Bạn đã đoán đúng số ${secretNumber} trong ${attempts} lần đoán.`;
      guessFeedback.classList.add("correct");
      guessInput.disabled = true; // Vô hiệu hóa input
      checkGuessBtn.disabled = true; // Vô hiệu hóa nút đoán
      resetGameBtn.style.display = "block"; // Hiển thị nút chơi lại
    } else if (attempts >= maxAttempts) {
      guessFeedback.textContent = `Bạn đã hết ${maxAttempts} lần đoán! Số bí mật là ${secretNumber}.`;
      guessFeedback.classList.add("incorrect");
      guessInput.disabled = true;
      checkGuessBtn.disabled = true;
      resetGameBtn.style.display = "block";
    } else if (userGuess < secretNumber) {
      guessFeedback.textContent = "Số của bạn nhỏ quá! Hãy đoán cao hơn.";
      guessFeedback.classList.add("incorrect");
    } else {
      guessFeedback.textContent = "Số của bạn lớn quá! Hãy đoán thấp hơn.";
      guessFeedback.classList.add("incorrect");
    }
    guessInput.value = ""; // Xóa số đã đoán để người dùng dễ nhập số mới
    guessInput.focus(); // Tập trung vào input để người dùng nhập tiếp
  }

  // Lắng nghe sự kiện click cho nút "Đoán!" của trò chơi
  checkGuessBtn.addEventListener("click", checkGuess);

  // Lắng nghe sự kiện Enter trong ô input của trò chơi
  guessInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Ngăn form submit mặc định của trình duyệt
      checkGuess();
    }
  });

  // Lắng nghe sự kiện click cho nút "Chơi lại" của trò chơi
  resetGameBtn.addEventListener("click", initializeGame);

  // Khởi tạo trò chơi khi trang tải lần đầu
  initializeGame();

  // --- KẾT THÚC PHẦN LOGIC TRÒ CHƠI ĐOÁN SỐ ---
});
// --- BẮT ĐẦU PHẦN LOGIC TRÒ CHƠI ĐOÁN SỐ ---

// Lấy các phần tử DOM cần thiết cho trò chơi
const guessInput = document.getElementById("guessInput");
const checkGuessBtn = document.getElementById("checkGuessBtn");
const guessFeedback = document.getElementById("guessFeedback");
const guessCountSpan = document.getElementById("guessCount");
const resetGameBtn = document.getElementById("resetGameBtn");

let secretNumber;
let attempts = 0;
const maxAttempts = 10; // Giới hạn số lần đoán

// Hàm khởi tạo trò chơi
function initializeGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1; // Tạo số bí mật từ 1 đến 100
  attempts = 0;
  guessCountSpan.textContent = attempts;
  guessFeedback.textContent = "";
  guessFeedback.classList.remove("correct", "incorrect");
  guessInput.value = "";
  guessInput.disabled = false;
  checkGuessBtn.disabled = false;
  resetGameBtn.style.display = "none"; // Ẩn nút chơi lại khi game mới bắt đầu
  guessInput.focus(); // Đặt con trỏ vào ô nhập liệu
  console.log("Số bí mật (chỉ để kiểm tra):", secretNumber); // Bạn có thể xóa dòng này khi không cần debug
}

// Hàm kiểm tra đoán của người dùng
function checkGuess() {
  const userGuess = parseInt(guessInput.value);

  if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
    guessFeedback.textContent = "Vui lòng nhập một số hợp lệ từ 1 đến 100.";
    guessFeedback.classList.add("incorrect");
    return;
  }

  attempts++;
  guessCountSpan.textContent = attempts;
  guessFeedback.classList.remove("correct", "incorrect"); // Xóa lớp cũ để cập nhật màu mới

  if (userGuess === secretNumber) {
    guessFeedback.textContent = `Chúc mừng! Bạn đã đoán đúng số ${secretNumber} trong ${attempts} lần đoán.`;
    guessFeedback.classList.add("correct");
    guessInput.disabled = true; // Vô hiệu hóa input
    checkGuessBtn.disabled = true; // Vô hiệu hóa nút đoán
    resetGameBtn.style.display = "block"; // Hiển thị nút chơi lại
  } else if (attempts >= maxAttempts) {
    guessFeedback.textContent = `Bạn đã hết ${maxAttempts} lần đoán! Số bí mật là ${secretNumber}.`;
    guessFeedback.classList.add("incorrect");
    guessInput.disabled = true;
    checkGuessBtn.disabled = true;
    resetGameBtn.style.display = "block";
  } else if (userGuess < secretNumber) {
    guessFeedback.textContent = "Số của bạn nhỏ quá! Hãy đoán cao hơn.";
    guessFeedback.classList.add("incorrect");
  } else {
    guessFeedback.textContent = "Số của bạn lớn quá! Hãy đoán thấp hơn.";
    guessFeedback.classList.add("incorrect");
  }
  guessInput.value = ""; // Xóa số đã đoán để người dùng dễ nhập số mới
  guessInput.focus(); // Tập trung vào input để người dùng nhập tiếp
}

// Lắng nghe sự kiện click cho nút "Đoán!" của trò chơi
checkGuessBtn.addEventListener("click", checkGuess);

// Lắng nghe sự kiện Enter trong ô input của trò chơi
guessInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Ngăn form submit mặc định của trình duyệt
    checkGuess();
  }
});

// Lắng nghe sự kiện click cho nút "Chơi lại" của trò chơi
resetGameBtn.addEventListener("click", initializeGame);

// Khởi tạo trò chơi khi trang tải lần đầu
initializeGame();

// --- KẾT THÚC PHẦN LOGIC TRÒ CHƠI ĐOÁN SỐ ---
