//function cũng là object nhưng đặc biệt và là
//cũng có thể chấm được như mọi object khác chấm tới thuộc tính được gán = 1 hàm đó mà 1 hàm đó cũng là 1 đối tượng !!!
//mọi thứ đều quy về OOP

//Mong muốn sau này cái này sẽ thành constructor
//Đối tượng Validator
//function cũng là object nhưng đặc biệt và là
//cũng có thể chấm được như mọi object khác chấm tới thuộc tính được gán = 1 hàm đó mà 1 hàm đó cũng là 1 đối tượng !!!
//mọi thứ đều quy về OOP

//viết trong Validator tư duy giống Class
function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement; //VIP
      // ko có VIP này thì treo tab trình duyệt do lặp vô tận
      // quy trình tự như sau đầu tiên ví dụ inputElement vào
      // gán cho nó là = div (thẻ cha)
      // nếu chưa khớp với selector lại gán tiếp div = thẻ cha tiếp theo của nó
      // tới khi nào khớp thì thôi
      // khớp rồi tự động return thẻ cha chứa selector giống parameter
    }
  }

  let selectorRules = {};

  //hàm thực hiện validate
  function validate(inputElement, rule) {
    let errorMessage;
    //let errorElement = getParent(inputElement, '.form-group');
    let errorElement = getParent(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.formMessage);

    //lấy ra các rules của  selector
    let rules = selectorRules[rule.selector]; //đây là 1 mảng
    //lặp qua từng rules và kiểm tra
    //nếu có lỗi thì dừng việc kiểm tra
    for (let i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case "checkbox":
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ":checked")
          ); //trong trường hợp này nó ếu có value thì sao ? thì làm sao để mình có thấy được hành động checked của thẻ đó
          break;
        case "radio":
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ":checked")
          ); //trong trường hợp này nó ếu có value thì sao ? thì làm sao để mình có thấy được hành động checked của thẻ đó
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }
      //rules lúc này là 1 mảng chứa hàm
      if (errorMessage) break;
    } // như vậy nếu có lỗi thì dừng và tiếp tục kiểm tra theo logic cũ

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        "invalid"
      );
    } else {
      errorElement.innerText = "";
      getParent(inputElement, options.formGroupSelector).classList.remove(
        "invalid"
      );
    }

    return !errorMessage;
  }
  //lấy element của form cần validate
  let formElement = document.querySelector(options.form);
  //options.rules là array

  if (formElement) {
    formElement.onsubmit = function (e) {
      e.preventDefault(); //bỏ đi hành vi mặc định của form khi submit
      //lặp qua từng rule và validate luôn

      let isFormValid = true;

      options.rules.forEach((rule) => {
        let inputElement = formElement.querySelector(rule.selector);
        validate(inputElement, rule);
        let isValid = validate(inputElement, rule);

        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        if (typeof options.onSubmit === "function") {
          let enableInputs = formElement.querySelectorAll(
            "[name]:not([disabled])"
          );
          //console.log(enableInputs); //NodeList

          let formValues = Array.from(enableInputs).reduce((values, input) => {
            //console.log(input); //input là từng element trong DOM
            //input.name -> nghĩa là lấy cái attribute của input element đó
            //gán vô values mảng dưới dạng là key values["key"] gán = input.value ->
            //hiểu values đây là giá trị tích lũy tức là nếu lúc lần lặp đầu nó = với {} (cái này là giá trị khởi tạo của hàm reduce)
            //và values sẽ trở thành 1 object rỗng, lặp qua mỗi vòng nó thêm thuộc tính dưới dạng key là input.name là các thuộc tính name của thẻ input
            //sau đó value nó đc gán sẽ là input.value
            //input.value tức là lấy giá trị từ người dùng nhập vào qua thẻ input đó!

            switch (input.type) {
              case "radio":
                values[input.name] = formElement.querySelector(
                  'input[name="' + input.name + '"]:checked'
                ).value;
                break;
              case "checkbox":
                if (!input.matches(":checked")) return (values = "");
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                values[input.name].push(input.value);
                break;
              case "file":
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
            }

            return values; //chú ý là nếu rỗng thì gặp falsy return luôn chuỗi rỗng
          }, {});

          options.onSubmit(formValues);
        }
        //Trường hợp submit với hành vi mặc định
        else {
          formElement.submit();
        }
      }
    };
    //Lặp qua mỗi rule và xử lí (lắng nghe sự kiện blur, input, ...)

    options.rules.forEach((rule) => {
      //giải thích rule: là từng phần tử trong mảng rules mà từng phần tử nó có các hàm các method xử lí required các kiểu
      //kèm theo đó là trong hàm nó trả về object literals (kèm thuộc tính là selector và hàm test()) do đó rule.selector là gọi thuộc tính nó trả về qua object literals
      //tất nhiên mỗi rules có phần tử là hàm Validator mà trong này là object đặc biệt nên có luôn thuộc tính khi ta chấm và gán nó = 1 function ta tự định nghĩa
      // do đó các thuộc tính được xem dưới dạng hàm sẽ làm việc nhận tham số là tham số khi ta dùng bên index.html dưới dạng
      //Validator.(thuộc tính là hàm (truyền vào đây là tham số là selector))
      //mục đích của việc lấy từ formElement là phòng trường hợp
      //nhiều form mà lấy từ document thì nó hiểu thế mẹ nào được
      //nếu các selector nó trùng tên nhau ?
      //như vậy việc lấy từ formElement mà formElement lấy được từ thuộc tính ta gán trong đầu vào parameter là "#form-1" sẽ chỉ đích tới chính form đó ko gây ra nhầm lẫn gì cả

      let inputElements = formElement.querySelectorAll(rule.selector);

      Array.from(inputElements).forEach(function (inputElement) {
        //xử lí trường hợp blur ra ngoài khỏi input
        inputElement.onblur = function () {
          //lấy đc value qua inputElement.value
          //test func qua rule.test
          //quan sát tiếp form mỗi form-group đều có 1 nơi
          //để truyền message vào có thể là thành công
          // có thể là ko hợp lệ
          validate(inputElement, rule);
        };
        //Xử lí mỗi khi user nhập vào input
        inputElement.oninput = function () {
          let errorElement = getParent(
            inputElement,
            options.formGroupSelector
          ).querySelector(options.formMessage);
          errorElement.innerText = "";
          getParent(inputElement, options.formGroupSelector).classList.remove(
            "invalid"
          );
        };
      });
      //lưu lại các rules cho mỗi input
      // dùng ngoặc vuông là key của object
      //tại sao ? vì có trường hợp bắt rule phải nhập trước khi là nhập đúng
      //mà nguyên tắc 1 biến là gì ? tại 1 thời điểm biến chỉ lưu 1 value
      //do đó nó lưu thằng cuối cùng và mất đi rule yêu cầu phải nhập

      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        // nếu ko phải mảng thì gán cho object vs key là 1 mảng có phần tử đầu tiên là rule
        //gán cho cái chuỗi selector đang là key là 1 mảng chứa function test
        // nếu có sẵn mảng rồi tức là sau khi lưu thằng đầu tiên
        // thì ném lên if (push function test từ thg key đó vào)
        selectorRules[rule.selector] = [rule.test];
      }
      //console.log(selectorRules[rule.selector]);
    });
  }
}

//Định nghĩa các rules
//nghĩa là những thứ này làm 1 lần xài nhiều nơi
// Nguyên tắc của các rules
// - 1. Khi có lỗi thì trả về message lỗi
// - 2. Khi hợp lệ thì ko trả về gì (undefined)
//
Validator.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      //thằng này kiểm tra xem user nhập gì chưa
      return value ? undefined : "Please input this field";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || "This field must be an email";
      //thằng này kiểm tra xem có phải email hong ?
    },
  };
};

Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `Please input at least ${min} characters`;
      // này mới validate check độ dài
      // còn kiểu bảo mật cao hơn thì chưa biết
      //thằng này kiểm tra xem có tối thiểu kí tự nọ không hong ?
    },
  };
};

Validator.isConfirmed = function (selector, getConfirmedValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmedValue()
        ? undefined
        : message || "The confirmation does not match with the password!";
    },
  };
};

//quy tắc viết trang này là phải không được hardcode không gì là chứa đặc điểm riêng của 1 form cả
//ví dụ như "mật khẩu không chính xác " thì có thể form khác ko cần mật khẩu thì sao
// thì ta phải custom bên trang form.index và truyền message mục tiêu là ta truyền message đó dưới dạng
//đối số vô các hàm trong này
// và xử lí bằng cách dùng toán tử || để nếu đúng thì lấy bên đối số truyền vào
// sai thì sử dụng cái mặc định OOP
// điều này sẽ giúp cho việc 1 file áp dụng cho mọi trang
// muốn nâng cao tư duy này chỉ có làm nhiều project
//message parameter tự custom đó !!
