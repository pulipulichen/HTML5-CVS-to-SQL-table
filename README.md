# HTML5-CVS-to-SQL-table
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