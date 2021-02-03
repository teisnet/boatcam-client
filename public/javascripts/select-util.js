var Select = function(selector) {
	if (!(this instanceof Select)) {
		return new Select(selector);
	}
	this.element = $(selector);
}

Select.prototype.setData = function(data, valueField, textField, disabledField) {
	var selectElement = $("select.berths-select")
	$.each(data, function() {
		var option = $("<option />").val(this[valueField]).text(this[textField]);
		if (this[disabledField] && this[disabledField] === true) {
			option.attr('disabled','disabled');
		}
		this.element.append(option);
	});
};