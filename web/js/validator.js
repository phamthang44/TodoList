function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement; //VIP
    }
  }

  let selectorRules = {};

  //hàm thực hiện validate
  function validate(inputElement, rule) {
    let errorMessage;

    let errorElement = getParent(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.formMessage);

    //lấy ra các rules của  selector
    let rules = selectorRules[rule.selector];
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
      let inputElements = formElement.querySelectorAll(rule.selector);

      Array.from(inputElements).forEach(function (inputElement) {
        //xử lí trường hợp blur ra ngoài khỏi input
        inputElement.onblur = function () {
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

      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
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

Validator.isRequiredDate = function (selector) {
  return {
    selector: selector,
    test: function () {},
  };
};

Validator.hasNoWhiteSpace = function (selector) {
  return {
    selector: selector,
    test: function (s) {
      return !/\s/g.test(s) ? undefined : "Please do not use white space";
    },
  };
};
