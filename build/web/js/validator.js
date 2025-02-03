//function cũng là object nhưng đặc biệt và là
//cũng có thể chấm được như mọi object khác chấm tới thuộc tính được gán = 1 hàm đó mà 1 hàm đó cũng là 1 đối tượng !!!
//mọi thứ đều quy về OOP

function Validator(options) {
  console.log(options.form);
}

Validator.isRequired = function () {};

Validator.isPassword = function () {};
