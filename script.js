var _process_file = function (_input, _callback) {
    _loading_enable();
    var _panel = $(".file-process-framework");
    //var _input = _panel.find("#input_mode_textarea").val().trim();
    console.log(_input);
    _input = Papa.parse(_input);
    _input = _input.data;
    
    var _output = _csv_to_create_table_sql(_input);
    //------------------
    
    
    _loading_disable();
    _panel.find("#preview").val(_output);
    // --------------------
};

var _csv_to_create_table_sql = function (_input) {
    _table_name = _postgresql_name_filter(_table_name, "csv_table_");
    
    var _field_name_list = _input[0];
    
    
    var _field_name_types = {};
    
    // 判斷每個欄位的屬性
    for (var _f = 0; _f < _field_name_list.length; _f++) {
        //先把每個檔案名稱處理一下吧...
        var _name = _field_name_list[_f];
        _field_name_list[_f] = _postgresql_name_filter(_name, "field_");
        
        var _type = "int";  // text float
        for (var _l = 1; _l < _input.length; _l++) {
            var _cell = _input[_l][_f];
            if (_cell === "") {
                continue;
            }
            //console.log([_cell, _type, isNaN(_cell), isFloat(_cell)]);
            if (_type === "int" && isNaN(_cell) === true) {
                // 表示不是整數
                if (isFloat(_cell) === false) {
                    _type = "text";
                }
                else {
                    _type = "float";
                }
            }
            else {
                if (isFloat(_cell) === true) {
                    _type = "float";
                } 
            }
            //else if (_type !== "float") {
            //    _type = "int";
            //}
        }
        _field_name_types[_field_name_list[_f]] = _type;
    }
    
    //console.log(JSON.stringify(_field_name_types));
    
    // ------------------
    
    var _create_table_sql = "drop table if exists " + _table_name + ";\n"
        + "CREATE TABLE " + _table_name + " (\n\t";
    var _field_sql = [];
    for (var _f = 0; _f < _field_name_list.length; _f++) {
        var _name = _field_name_list[_f];
        _field_sql.push(_name + " " + _field_name_types[_name]);
    }
    _create_table_sql = _create_table_sql + _field_sql.join(",\n\t") + "\n);";
    
    //console.log(_create_table_sql);
    
    // ------------------------------------
    
    var _insert_sql = [];
    // INSERT INTO films VALUES
   //  ('UA502', 'Bananas', 105, '1971-07-13', 'Comedy', '82 minutes');
    for (var _l = 1; _l < _input.length; _l++) {
        var _sql = "INSERT INTO " + _table_name + " VALUES (";
        var _values = [];
        for (var _f = 0; _f < _field_name_list.length; _f++) {
            var _cell = _input[_l][_f];
            var _field_name = _field_name_list[_f];
            if (_cell === "") {
                _cell = "NULL";
            }
            else if (_field_name_types[_field_name] !== "text") {
                try {
                    eval("_cell = " + _cell);
                } catch (e) {}
            }
            else {
                _cell = "'" + _cell + "'";
            }
            _values.push(_cell);
        }
        _sql = _sql + _values.join(",") + ");";
        _insert_sql.push(_sql);
    }
    
    return _create_table_sql + "\n\n" + _insert_sql.join("\n");
};

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    try {
        eval("n = " + n);
        return Number(n) === n && n % 1 !== 0;
    }
    catch (e) {
        return false;
    }
}

var _field_counter = 1;
var _postgresql_name_filter = function (_name, _prefix) {
    _name = _name.trim();
    _name = _name.replace(/[^A-Z|^a-z|^0-9]+/g, "_");
    _name = _name.toLowerCase();
    if (isNaN(_name.substr(0, 1)) === false) {
        _name = _prefix.substr(0,1) + _name;
    }
    if (_name.split("_").join("") === "") {
        _name = _prefix + _field_counter;
        _field_counter++;
    }
    return _name;
};

// ---------------------

var _loading_enable = function () {
    $("#preloader").show().fadeIn();
};

var _loading_disable = function () {
    $("#preloader").fadeOut().hide();
};

// ---------------------

var arrayMin = function (arr) {
    return arr.reduce(function (p, v) {
        return (p < v ? p : v);
    });
};

var arrayMax = function (arr) {
    return arr.reduce(function (p, v) {
        return (p > v ? p : v);
    });
};

var _float_to_fixed = function (_float, _fixed) {
    var _place = 1;
    for (var _i = 0; _i < _fixed; _i++) {
        _place = _place * 10;
    }
    return Math.round(_float * _place) / _place;
};

var _stat_avg = function (_ary) {
    var sum = _ary.reduce(function (a, b) {
        return a + b;
    });
    var avg = sum / _ary.length;
    return avg;
};

var _stat_stddev = function (_ary) {
    var i, j, total = 0, mean = 0, diffSqredArr = [];
    for (i = 0; i < _ary.length; i += 1) {
        total += _ary[i];
    }
    mean = total / _ary.length;
    for (j = 0; j < _ary.length; j += 1) {
        diffSqredArr.push(Math.pow((_ary[j] - mean), 2));
    }
    return (Math.sqrt(diffSqredArr.reduce(function (firstEl, nextEl) {
        return firstEl + nextEl;
    }) / _ary.length));
};

// -------------------------------------

var _change_to_fixed = function () {
    var _to_fixed = $("#decimal_places").val();
    _to_fixed = parseInt(_to_fixed, 10);

    var _tds = $(".stat-result td[data-ori-value]");
    for (var _i = 0; _i < _tds.length; _i++) {
        var _td = _tds.eq(_i);
        var _value = _td.data("ori-value");
        _value = parseFloat(_value, 10);
        _value = _float_to_fixed(_value, _to_fixed);
        _td.text(_value);
    }
};

// -------------------------------------

var _output_filename_surffix = "";
var _output_filename_ext = ".sql";
var _table_name = "csv_table";

// -------------------------------------

var _load_file = function (evt) {
    //console.log(1);
    if (!window.FileReader)
        return; // Browser is not compatible

    var _panel = $(".file-process-framework");

    _panel.find(".loading").removeClass("hide");

    var reader = new FileReader();
    var _result;

    var _original_file_name = evt.target.files[0].name;
    var _pos = _original_file_name.indexOf(".");
    var _file_name = "create_table-" + _original_file_name.substr(0, _pos)
            //+ _output_filename_surffix
            //+ _original_file_name.substring(_pos, _original_file_name.length);
    _file_name = _file_name + _output_filename_ext;
    _table_name = _original_file_name.substr(0, _pos);
    
    var _file_type = _original_file_name.substring(_original_file_name.lastIndexOf(".")+1, _original_file_name.length).toLowerCase();
    //console.log(_file_type);

    _panel.find(".filename").val(_file_name);
    
    reader.onload = function (evt) {
        if (evt.target.readyState !== 2)
            return;
        if (evt.target.error) {
            alert('Error while reading file');
            return;
        }

        //filecontent = evt.target.result;

        //document.forms['myform'].elements['text'].value = evt.target.result;
        _result = evt.target.result;
        
        if (_file_type !== "csv") {
            var workbook = XLSX.read(_result, {type: 'binary'});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            var _worksheet_json = XLSX.utils.sheet_to_json(worksheet);
            //console.log(_worksheet_json);
            
            var _csv = [];
            
            var _attr_list = [];
            for (var _col in _worksheet_json) {
                for (var _row in _worksheet_json[_col]) {
                    _attr_list.push(_row);
                }
                break;
            }
            _csv.push(_attr_list.join(","));
            
            for (var _col in _worksheet_json) {
                var _line = [];
                for (var _row in _worksheet_json[_col]) {
                    var _cell = _worksheet_json[_col][_row];
                    _cell = _cell.replace(",", " ");
                    if (_cell.indexOf(",") > -1) {
                        console.log(_cell);
                    }
                    _cell = _cell.replace("\n", " ");
                    _line.push(_cell);
                }
                _csv.push(_line.join(","));
            }
            
            
            _csv = _csv.join("\n");
            //var _csv = XLSX.utils.sheet_to_csv(worksheet);
            //console.log(_csv);
            _result = _csv;
        }
        _result = _result.trim();
        
        _process_file(_result, function (_result) {
            _panel.find(".preview").val(_result);

            $(".file-process-framework .myfile").val("");
            $(".file-process-framework .loading").addClass("hide");
            _panel.find(".display-result").show();
            _panel.find(".display-result .encoding").show();

            var _auto_download = (_panel.find('[name="autodownload"]:checked').length === 1);
            if (_auto_download === true) {
                _panel.find(".download-file").click();
            }

            //_download_file(_result, _file_name, "txt");
        });
    };


    //console.log(_file_name);

    if (_file_type !== "csv") {
        reader.readAsBinaryString(evt.target.files[0]);
    }
    else {
        reader.readAsText(evt.target.files[0]);
    }
};

var _load_textarea = function (evt) {
    var _panel = $(".file-process-framework");

    // --------------------------

    var _result = _panel.find(".input-mode.textarea").val();
    if (_result.trim() === "") {
        return;
    }

    // ---------------------------

    _panel.find(".loading").removeClass("hide");

    // ---------------------------
    var d = new Date();
    var utc = d.getTime() - (d.getTimezoneOffset() * 60000);

    var local = new Date(utc);
    //var _file_date = local.toJSON().slice(0, 19).replace(/:/g, "-");
    var time = new Date();
    var _file_date = ("0" + time.getHours()).slice(-2)
            + ("0" + time.getMinutes()).slice(-2);
    var _file_name = "create_table-" + _file_date + _output_filename_ext;
    _panel.find(".filename").val(_file_name);
    _table_name = "cvs_table_" + _file_date;

    // ---------------------------

    _result = _result.trim();
    
    _process_file(_result, function (_result) {
        _panel.find(".preview").val(_result);

        _panel.find(".loading").addClass("hide");
        _panel.find(".display-result").show();
        _panel.find(".display-result .encoding").hide();

        var _auto_download = (_panel.find('[name="autodownload"]:checked').length === 1);
        if (_auto_download === true) {
            _panel.find(".download-file").click();
        }
    });
};

var _download_file_button = function () {
    var _panel = $(".file-process-framework");

    var _file_name = _panel.find(".filename").val();
    var _data = _panel.find(".preview").val();

    _download_file(_data, _file_name, "arff");
};

var _download_test_file_button = function () {
    var _panel = $(".file-process-framework");

    var _file_name = _panel.find(".test_filename").val();
    var _data = _panel.find(".test_preview").val();

    _download_file(_data, _file_name, "arff");
};

var _download_periodics_file_button = function () {
    var _panel = $(".file-process-framework");

    var _file_name = _panel.find(".periodics_filename").val();
    var _data = _panel.find(".periodics_preview").val();

    _download_file(_data, _file_name, "periodics");
};

var _download_skiplist_file_button = function () {
    var _panel = $(".file-process-framework");

    var _file_name = _panel.find(".skiplist_filename").val();
    var _data = _panel.find(".skiplist_preview").val();

    _download_file(_data, _file_name, "text");
};

var _download_file = function (data, filename, type) {
    var a = document.createElement("a"),
            file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

}

// ------------------------
// ----------------------------

var _copy_table = function () {
    var _button = $(this);

    var _table = $($(this).data("copy-table"));
    var _tr_coll = _table.find("tr");

    var _text = "";
    for (var _r = 0; _r < _tr_coll.length; _r++) {
        if (_r > 0) {
            _text = _text + "\n";
        }

        var _tr = _tr_coll.eq(_r);
        var _td_coll = _tr.find("td");
        if (_td_coll.length === 0) {
            _td_coll = _tr.find("th");
        }
        for (var _c = 0; _c < _td_coll.length; _c++) {
            var _td = _td_coll.eq(_c);
            var _value = _td.text();

            if (_c > 0) {
                _text = _text + "\t";
            }
            _text = _text + _value.trim();
        }
    }

    _copy_to_clipboard(_text);
};

var _copy_csv_table = function () {
    var _button = $(this);

    var _text = $("#preview").val().replace(/,/g, "\t");

    _copy_to_clipboard(_text);
};

var _copy_to_clipboard = function (_content) {
    //console.log(_content);
    var _button = $('<button type="button" id="clipboard_button"></button>')
            .attr("data-clipboard-text", _content)
            .hide()
            .appendTo("body");

    var clipboard = new Clipboard('#clipboard_button');

    _button.click();
    _button.remove();
};

// -----------------------

var _change_show_fulldata = function () {

    var _show = ($("#show_fulldata:checked").length === 1);
    //console.log([$("#show_fulldata").attr("checked"), _show]);

    var _cells = $(".stat-result .fulldata");
    if (_show) {
        _cells.show();
    }
    else {
        _cells.hide();
    }
};

var _change_show_std = function () {
    var _show = ($("#show_std:checked").length === 1);

    var _cells = $(".stat-result tr.std-tr");
    if (_show) {
        _cells.show();
    }
    else {
        _cells.hide();
    }
};

var _load_default_data = function (_filename) {
    $.get(_filename, function(_result) {
        var _panel = $(".file-process-framework");
        _panel.find(".input-mode.textarea").val(_result).change();
    });
};

// -----------------------

$(function () {
    var _panel = $(".file-process-framework");
    _panel.find(".input-mode.textarea").change(_load_textarea);
    _panel.find(".myfile").change(_load_file);
    _panel.find(".download-file").click(_download_file_button);

    $('.menu .item').tab();
    $("button.copy-table").click(_copy_table);
    $("button.copy-csv").click(_copy_csv_table);


    // 20171103 測試用
    _load_default_data("data.csv");
});