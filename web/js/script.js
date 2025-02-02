$(".menu > ul > li").click(function (e) {
  //remove active class from already active
  $(this).siblings().removeClass("active");
  //add active to clicked
  $(this).toggleClass("active");
  //if has sub menu open it
  $(this).find("ul").slideToggle();
  //close other sub menu if any open
  $(this).siblings().find("ul").slideUp();
  //remove active class of sub menu items
  $(this).siblings().find("ul").find("li").removeClass("active");
});

$(".menu-btn").click(function () {
  $(".sidebar").toggleClass("active");
});

const taskCards = document.querySelectorAll(".task-card"); // Chọn tất cả các .task-card

taskCards.forEach((taskCard) => {
  taskCard.onclick = function (e) {
    const menu = $(this).find(".options-menu");

    // Nếu nhấn vào nút ba chấm
    if (e.target.closest(".task-options-btn")) {
      // Đóng tất cả các menu khác
      $(".task-card .options-menu").not(menu).removeClass("active");

      // Toggle (mở/đóng) menu của task hiện tại
      menu.toggleClass("active");
    } else {
      // Nếu nhấn vào vùng ngoài nút ba chấm, ẩn menu
      menu.removeClass("active");
    }
  };
});
