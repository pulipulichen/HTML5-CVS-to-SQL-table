# CSV to SQL Table：將CSV試算表加入到關聯式資料庫 / Import CSV File into a Database Table
HTML5-CVS-to-SQL-table

[[[IMG

這是一個將[CSV格式資料](http://blog.pulipuli.info/2017/09/data-source-and-format.html)轉換成[關聯式資料庫](https://www.wikiwand.com/zh/%E5%85%B3%E7%B3%BB%E6%95%B0%E6%8D%AE%E5%BA%93)插入表格與資料SQL語法的網頁工具。可適用於[SQLite](https://www.wikiwand.com/zh/SQLite)、[PostgreSQL](https://www.wikiwand.com/zh/PostgreSQL)與[MySQL](https://www.wikiwand.com/zh/MySQL)等關聯式資料庫。傳統做研究時比較常用Excel、SPSS等試算表資料，但其實加入到資料庫之後，就能更容易跟其他資料交互比對、分析，也能用資料庫內建的聚合函數(aggregate functions)計算平均數、標準差等統計常用的[資料中心與離度](http://blog.pulipuli.info/2017/09/measures-of-center-and-spread.html)。

----

# CSV to SQL Table 線上展示 / Online Demo

[[[[[[IFRAME

- [開新視窗](https://pulipulichen.github.io/HTML5-CVS-to-SQL-table/)

## 匯入：CSV資料 / Import: CSV data

[[[IMG

如果要使用CSV to SQL Table，CSV的第一列必須是表格欄位的名稱，僅能使用英文數字、而且第一個字不能是數字。而後面資料的類型沒有特別的限制，程式會一一檢查每一筆資料的內容，自動決定合適的資料類型：

- 如果只有數字，則會視為「整數」(integer, int)
- 如果數字有小數點，則會視為「浮點數」(float)
- 如果有非數字的資料，則會視為「文字」(text)

目前就僅使用這三種資料格式。

資料庫的表格名稱會使用CSV的檔案名稱建立。同樣的，表格名稱也只能使用英文數字、而且第一個字不能是數字。

## SQL：插入表格並建立資料 / Create Table and Insert Data 

轉換後的SQL語法如下：

    drop table if exists data;
    CREATE TABLE data (
    	sale_s_by_region text,
    	f1qtr_1 float,
    	qtr_2 float,
    	qtr_3 float,
    	qtr_4 int
    );
    
    INSERT INTO data VALUES ('Europe',21704.714,17987034,19485029,22567894);
    INSERT INTO data VALUES ('As\nia',8774099,NULL,14356.879,NULL);
    INSERT INTO data VALUES ('Nor,th America',12094215,10873.099,15689543,17456723);

前半部是插入表格的語法，可以看到CSV第一列的欄位名稱已經被放上去，並且附有自動判斷的資料類型。後半部則是插入資料的語法。

## 成果：資料庫表格 / Result: Database Table  

    [[[IMG

上圖是將CSV轉換成SQL語法並插入到PostgreSQL的表格。

    [[[IMG

上圖是該表格的資料內容。就像是CSV資料的內容一樣，已經成功轉換成關聯式資料庫的表格資料了。這下子就能在資料庫內用select語法快速做多種查詢囉。

# 程式碼保存庫 / Repository

[[[IMG

CSV to SQL Table程式碼保存在GitHub中，以MIT條款授權，可任意使用。

- [GitHub保存庫：HTML5-CVS-to-SQL-table](https://github.com/pulipulichen/HTML5-CVS-to-SQL-table)
- [程式碼下載](https://github.com/pulipulichen/HTML5-CVS-to-SQL-table/archive/master.zip)

----

# 結語 / In closing

以前我寫過一篇「[如何解決 CSV匯入PostgreSQL發生的錯誤？](http://blog.pulipuli.info/2016/11/csvpostgresql-how-to-resolve-problems.html)」的文章，內容是在講怎麼使用COPY指令或pgAdmin來完成。但是這樣處理起來很容易發生各種問題，多到我還用了[一篇文章](http://blog.pulipuli.info/2016/11/csvpostgresql-how-to-resolve-problems.html)來彙整解決方法。

這次我又要將CSV匯入到資料庫中的時候，我就想放棄原本的方式，看能不能將CSV轉換成SQL語法，這樣會比較簡單。但搜尋了一下，卻發現網路上並沒有這樣的線上工具。雖然也有匯入CSV資料的工具，不過卻多是付費軟體。

想來想去，剖析CSV跟產生SQL語法也不難，為何不要自己做就好了呢？所以就用一個下午完成了[CSV to SQL Table](https://pulipulichen.github.io/HTML5-CVS-to-SQL-table/)。希望對大家有幫助！

----

An HTML5 widget for converting a CSV file to a SQL table

- https://github.com/pulipulichen/HTML5-CVS-to-SQL-table
- https://github.com/pulipulichen/HTML5-CVS-to-SQL-table.git
- https://pulipulichen.github.io/HTML5-CVS-to-SQL-table/

Based on 
Table Data Transposer (rotate data from rows to columns or vice versa) - file process framework 20161217
https://codepen.io/pulipuli/pen/eBbMNx

````
drop table if exists ur_table;
    CREATE TABLE ur_table
    (
        id serial NOT NULL,
        log_id numeric, 
        proc_code numeric,
        date timestamp,
        qty int,
        name varchar,
        price money
    );
    COPY 
        ur_table(id, log_id, proc_code, date, qty, name, price)
    FROM '\path\xxx.csv' DELIMITER ',' CSV HEADER;


INSERT INTO films VALUES
    ('UA502', 'Bananas', 105, '1971-07-13', 'Comedy', '82 minutes');
````