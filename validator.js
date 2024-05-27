function Validate(formSelector) {

  // khởi tạo một đối tượng chứa selector - rules validate tương ứng
  var formRules = {
    // truyền vào name và value ở bên dưới
  };

  // khởi một đối tượng chứa các hàm Rules
  /* quy tắc : nếu lỗi thì return errolMessage
               nếu không có lỗi thì return undefined 
  */
  var validatorRules = {
    required: function (value) {
      return value ? undefined : 'Vui lòng nhập trường này';
    },
    email: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : 'Vui lòng nhập đúng email';
    },
    min: function (min) {
      return function (value) {
        return value.length >= min ? undefined : `Yêu cầu tối thiểu ${min} kí tự`;
      }
    },
    max: function (max) {
      return function (value) {
        return value.length <= max ? undefined : `Yêu cầu tối đa ${max} kí tự`;
      }
    },
    confirm: function (value, pass) {
      return value == pass ? undefined : 'Mật khẩu không trùng khớp';
    }
  };

  var formElement = document.querySelector(formSelector);

  // hàm xử lí validatorRules gắn với event trong form
  function handleValidate(event) {
    // rules là tổng hợp rule của input.name đang tồn tại, là một mảng
    var rules = formRules[event.target.name];
    // errolMsg là undefined hoặc chuỗi 
    var errorMessage;

    for (var rule of rules) {
      // nếu input name là passconfirm và rule = confirm thì truyền hàm confirm
      if (event.target.name == 'password_confirmation' && rule === validatorRules.confirm ) {
        errorMessage = rule(event.target.value, passwordElement.value);
      }
      // còn không phải thì truyền hàm bình thường 
      else {
        errorMessage = rule(event.target.value);
        if (errorMessage) break;
      }
    }


    // tìm thằng cha gần nhất
    var formGroup = event.target.closest('.form-group');
    // tìm thằng .formMessage add class invalid
    var formMessage = formGroup.querySelector('.form-message');
    // nếu errolMessage được gắn chuỗi thì add chuỗi vào thằng .formGroup
    if (errorMessage) {
      formMessage.innerText = errorMessage;
      formGroup.classList.add('invalid');
    } else {
      // nếu undefined thì xóa invalid
      formMessage.innerText = '';
      formGroup.classList.remove('invalid');
    }
  };

  // tồn tại formElement trong DOM thì mới sử lí tiếp
  if (formElement) {

    // quét tất cả thẻ input có attribute là rule và name
    var inputs = formElement.querySelectorAll('[name][rules]');

    // quét từng input trong NodeList inputs
    for (var input of inputs) {

      // tạo pass Element để tí check với thằng confirm element
      var passwordElement;
      if (input.name == 'password') {
        passwordElement = input;
      }

      // tạo một mảng rules bằng cách tìm attribute có |
      var rules = input.getAttribute('rules').split('|');

      // quét rule để check có phải của thằng password hay không bằng kí tự :
      for (var rule of rules) {

        // ruleFunc để lưu lại function của rule
        var ruleFunction = validatorRules[rule];
        // ruleInfo để lưu thằng pass element 
        var ruleInfo;
        // check pass element
        var isRuleHasValue = rule.includes(':');

        // nếu là passElement thì tách lấy thằng min hoặc max pass
        if (isRuleHasValue) {
          ruleInfo = rule.split(':');
          rule = ruleInfo[0];
          ruleFunction = validatorRules[rule](ruleInfo[1]);
        };



        // check cặp key - value trong formRules có phải mảng không ?
        // đầu tiên sẽ không nên nhảy vào else
        // ta sẽ cho thằng formRules với key = input.name là thằng hàm rule tương ứng
        // sau đó formRule đã có mảng rồi nên push nó với key tương ứng
        if (Array.isArray(formRules[input.name])) {
          formRules[input.name].push(ruleFunction);
        } else {
          formRules[input.name] = [ruleFunction];
        }

        input.onblur = handleValidate;
        input.oninput = handleValidate;


      }
    }
    console.log(formRules);
  };
}