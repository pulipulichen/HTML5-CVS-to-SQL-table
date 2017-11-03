# HTML5-CVS-to-PostgreSQL-table
An HTML5 widget for converting a CSV file to a PostgreSQL table

https://github.com/pulipulichen/HTML5-CVS-to-PostgreSQL-table
https://github.com/pulipulichen/HTML5-CVS-to-PostgreSQL-table.git
https://pulipulichen.github.io/HTML5-CVS-to-PostgreSQL-table/

Based on 
Table Data Transposer (rotate data from rows to columns or vice versa) - file process framework 20161217
https://codepen.io/pulipuli/pen/eBbMNx


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