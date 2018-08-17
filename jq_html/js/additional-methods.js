/*身份证认证(注：一代身份证15位数还在使用中)
* 公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。
* 排列顺序从左至右依次为：
* 六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码(可能为X即10)
* */
jQuery.validator.addMethod("isIdCardNo", function (value, element) {
    var tel=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0-2]\d)|3[0-1])\d{3}$/.test(value) || /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0-2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;
    return this.optional(element) || tel.test(value);
}, "请正确输入您的身份证号码");

/*手机号认证*/
jQuery.validator.addMethod("isMobile", function(value, element) {
    var tel = /^(13|14|15|17|18)\d{9}$/;
    return this.optional(element) || (tel.test(value));
}, "请正确填写手机号");


/*电话号码认证*/
jQuery.validator.addMethod("isPhone", function(value, element) {
    var tel = /^(\d{3,4})?(-)?\d{7,8}$/;
    return this.optional(element) || (tel.test(value));
}, "请正确填写电话号码");

/*邮政编码认证(四级六位数编码结构)*/
jQuery.validator.addMethod("isPostCode", function(value, element) {
    var tel = /^[1-9]\d{5}$/;
    return this.optional(element) || (tel.test(value));
}, "请正确填写邮政编码");

